'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { headers } from 'next/headers'
import { randomUUID } from 'crypto'

type SubmissionType = 'contact' | 'referral'

type CommonFields = {
  name: string
  email: string
  phone?: string
  message: string
}

type ContactPayload = CommonFields & {
  type: 'contact'
  projectType?: string
}

type ReferralPayload = CommonFields & {
  type: 'referral'
  prospectName: string
  prospectContact: string
}

export type SubmissionPayload = ContactPayload | ReferralPayload

export type SubmissionResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

/**
 * Handle a form submission.
 *
 * Delivery model (as of July 2026): email is the PRIMARY channel. Every
 * submission is emailed to NOTIFICATION_EMAIL via Resend. Persisting to
 * Supabase is OPTIONAL — it only runs if a real Supabase project is wired up
 * in the environment. This keeps the contact/referral forms working on a
 * bootstrap setup (just a Resend key, no database) while leaving the /admin
 * inbox ready to light up the day a Supabase project is connected: add the
 * SUPABASE env vars and rows start persisting again with zero code changes.
 *
 * The submission succeeds if it reaches Al by AT LEAST ONE channel (email or
 * DB). That resilience is deliberate — a paused/misconfigured database can no
 * longer silently swallow a lead, because the email still goes out.
 */
export async function createSubmission(
  payload: SubmissionPayload
): Promise<SubmissionResult> {
  // Basic validation
  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { ok: false, error: 'Missing required fields.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  // Capture request metadata for spam triage (added to the email footer + DB row)
  const h = await headers()
  const metadata = {
    user_agent: h.get('user-agent') ?? null,
    referer: h.get('referer') ?? null,
    // Vercel sets x-forwarded-for; we keep only the first hop for privacy
    ip_hint: (h.get('x-forwarded-for') ?? '').split(',')[0] || null,
  }

  // ── 1) Optional persistence ────────────────────────────────────────────
  // Only attempt a DB write if a real Supabase project is configured. If the
  // env still holds the .env.example placeholders (or is absent), skip silently
  // — email below is the channel that actually has to succeed.
  let dbId: string | null = null
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient()
      const insertRow = {
        type: payload.type,
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? null,
        project_type: payload.type === 'contact' ? (payload.projectType ?? null) : null,
        prospect_name: payload.type === 'referral' ? payload.prospectName : null,
        prospect_contact: payload.type === 'referral' ? payload.prospectContact : null,
        message: payload.message,
        metadata,
      }
      const { data, error } = await supabase
        .from('submissions')
        .insert(insertRow)
        .select('id')
        .single()
      if (error || !data) {
        console.error('[submissions] DB insert failed (continuing to email):', error)
      } else {
        dbId = data.id
      }
    } catch (e) {
      console.error('[submissions] DB insert threw (continuing to email):', e)
    }
  }

  // ── 2) Primary delivery: notification email via Resend ──────────────────
  let emailSent = false
  if (isResendConfigured()) {
    try {
      await sendNotification(payload, dbId, metadata)
      emailSent = true
    } catch (e) {
      console.error('[submissions] Resend send failed:', e)
    }
  } else {
    console.error(
      '[submissions] RESEND_API_KEY is missing or still the placeholder. ' +
        'Add a real key from resend.com → API Keys to your Vercel env vars — ' +
        'without it the forms have no way to deliver a lead.'
    )
  }

  // ── 3) Result ───────────────────────────────────────────────────────────
  // Success if the lead reached Al by at least one channel.
  if (emailSent || dbId) {
    return { ok: true, id: dbId ?? randomUUID() }
  }

  return {
    ok: false,
    error: isResendConfigured()
      ? 'We could not send your message right now. Please email alain@vencer.dev directly.'
      : 'The form is not fully configured yet. Please email alain@vencer.dev directly.',
  }
}

/** True only when a real Supabase project is wired up (not the placeholders). */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return Boolean(
    url &&
      !url.includes('your-project-ref') &&
      key &&
      !key.includes('your-service-role-key')
  )
}

/** True only when a real Resend key is present (not the placeholder). */
function isResendConfigured(): boolean {
  const k = process.env.RESEND_API_KEY
  return Boolean(k && k !== 're_your_api_key_here')
}

/**
 * Send the notification email. Throws on a Resend rejection so the caller can
 * treat email as a real delivery channel (and log the actual reason — invalid
 * key, unverified domain, etc. — into the Vercel function logs).
 */
async function sendNotification(
  payload: SubmissionPayload,
  id: string | null,
  metadata: { user_agent: string | null; referer: string | null; ip_hint: string | null }
) {
  const apiKey = process.env.RESEND_API_KEY as string
  const to = process.env.NOTIFICATION_EMAIL ?? 'alain@vencer.dev'
  // Until vencer.dev is verified in Resend, send from Resend's onboarding
  // sender (works immediately, no DNS). Once verified, set
  // EMAIL_FROM=Vencer Inbox <inbox@vencer.dev> in the env to switch.
  const from = process.env.EMAIL_FROM ?? 'Vencer Inbox <onboarding@resend.dev>'

  const resend = new Resend(apiKey)
  const subject =
    payload.type === 'contact'
      ? `New contact: ${payload.name}`
      : `New referral: ${payload.name} → ${payload.prospectName}`

  const lines: string[] = []
  lines.push(`From: ${payload.name} <${payload.email}>`)
  if (payload.phone) lines.push(`Phone: ${payload.phone}`)
  if (payload.type === 'contact' && payload.projectType) {
    lines.push(`Project type: ${payload.projectType}`)
  }
  if (payload.type === 'referral') {
    lines.push(`Prospect: ${payload.prospectName}`)
    lines.push(`Prospect contact: ${payload.prospectContact}`)
  }
  lines.push('')
  lines.push(payload.message)
  lines.push('')
  lines.push('---')
  if (id) lines.push(`View in inbox: https://vencer.dev/admin/inbox/${id}`)
  if (metadata.ip_hint) lines.push(`IP hint: ${metadata.ip_hint}`)
  if (metadata.referer) lines.push(`Referrer: ${metadata.referer}`)

  const { error } = await resend.emails.send({
    from,
    to,
    reply_to: payload.email,
    subject,
    text: lines.join('\n'),
  })

  if (error) {
    // Surface Resend's actual rejection into the Vercel logs instead of a
    // silent failure.
    console.error('[submissions] Resend rejected the send:', error)
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}
