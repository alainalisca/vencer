'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { headers } from 'next/headers'

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
 * Persist a form submission to Supabase and email a notification.
 *
 * Called from the contact and referral forms via Server Actions. Uses the
 * service-role Supabase client to bypass RLS on insert (the form is public
 * and unauthenticated). Resend sends a notification to NOTIFICATION_EMAIL.
 */
export async function createSubmission(
  payload: SubmissionPayload
): Promise<SubmissionResult> {
  // Basic validation
  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { ok: false, error: 'Missing required fields.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: 'Invalid email address.' }
  }

  // Capture request metadata for posthog stitching + spam triage
  const h = await headers()
  const metadata = {
    user_agent: h.get('user-agent') ?? null,
    referer: h.get('referer') ?? null,
    // Vercel sets x-forwarded-for; we redact down to the first hop for privacy
    ip_hint: (h.get('x-forwarded-for') ?? '').split(',')[0] || null,
  }

  // Catch the most common misconfig early: .env.local still holds the placeholder
  // values from .env.example. Without this check the failure is silent + confusing.
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!supaUrl || supaUrl.includes('your-project-ref') || !supaKey || supaKey.includes('your-service-role-key')) {
    console.error(
      '[submissions] Supabase env vars are missing or still placeholders. ' +
        'Update NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in ' +
        '.env.local (and Vercel) with real values from supabase.com → Settings → API.'
    )
    return { ok: false, error: 'Submissions are temporarily unavailable. Please email alain@vencer.dev directly.' }
  }

  // Insert into Supabase — single flat row shape with type-conditional optional fields.
  // The DB columns project_type / prospect_name / prospect_contact are nullable so
  // either type can use this same row shape.
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
    console.error('[submissions] insert failed', error)
    return { ok: false, error: 'Could not save your message. Try again or email alain@vencer.dev.' }
  }

  // Send notification email (non-blocking on failure — submission already saved)
  try {
    await sendNotification(payload, data.id)
  } catch (e) {
    console.error('[submissions] notification email failed', e)
    // Continue — the submission is in the DB; the notification is a nice-to-have.
  }

  return { ok: true, id: data.id }
}

async function sendNotification(payload: SubmissionPayload, id: string) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFICATION_EMAIL ?? 'alain@vencer.dev'
  // Default sender uses Resend's no-setup-required onboarding domain so emails
  // arrive even before vencer.dev is verified in Resend. Once the domain is
  // verified, set EMAIL_FROM=Vencer Inbox <inbox@vencer.dev> in env to switch.
  const from = process.env.EMAIL_FROM ?? 'Vencer Inbox <onboarding@resend.dev>'

  if (!apiKey || apiKey === 're_your_api_key_here') {
    console.error(
      '[submissions] RESEND_API_KEY is missing or still the placeholder ' +
        '("re_your_api_key_here"). Submission was saved, but no email was sent. ' +
        'Add a real key from resend.com → API Keys to .env.local (and to Vercel ' +
        'env vars for the deployed site).'
    )
    return
  }

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
  lines.push(`View in inbox: https://vencer.dev/admin/inbox/${id}`)

  const { error } = await resend.emails.send({
    from,
    to,
    reply_to: payload.email,
    subject,
    text: lines.join('\n'),
  })

  if (error) {
    // Surface Resend's actual rejection (domain not verified, invalid key, etc.)
    // so misconfig shows up in the Vercel function logs instead of failing silent.
    console.error('[submissions] Resend rejected the send:', error)
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}
