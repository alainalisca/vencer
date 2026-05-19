import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { archiveAndReturn, markRepliedAndReturn, updateStatus } from '../actions'

export const dynamic = 'force-dynamic'

type Submission = {
  id: string
  type: 'contact' | 'referral'
  name: string
  email: string
  phone: string | null
  project_type: string | null
  prospect_name: string | null
  prospect_contact: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  metadata: Record<string, unknown> | null
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('submissions')
    .select(
      'id, type, name, email, phone, project_type, prospect_name, prospect_contact, message, status, created_at, metadata'
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return notFound()
  const item = data as Submission

  // Auto-mark "new" as "read" on view (fire-and-forget)
  if (item.status === 'new') {
    await updateStatus(item.id, 'read')
  }

  // Compose mailto reply
  const replySubject =
    item.type === 'contact'
      ? `Re: your message to Vencer`
      : `Re: your referral to Vencer`
  const replyBody = `Hi ${item.name.split(' ')[0]},\n\nThanks for reaching out — `
  const mailto = `mailto:${item.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`

  return (
    <main style={{ padding: '24px 0 80px' }}>
      <Link
        href="/admin/inbox"
        style={{
          display: 'inline-block',
          fontSize: 12,
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: 18,
          fontFamily: 'IBM Plex Mono, monospace',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        ← Inbox
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: item.type === 'referral' ? 'var(--teal)' : 'var(--text-muted)',
            }}
          >
            {item.type === 'referral' ? 'Referral' : 'Contact'}
          </span>
          <StatusBadge status={item.status} />
        </div>
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: '-0.02em',
            color: 'var(--charcoal)',
            margin: 0,
          }}
        >
          {item.name}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          {new Date(item.created_at).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>
      </div>

      {/* Field rows */}
      <div
        style={{
          background: 'var(--cream)',
          borderRadius: 4,
          padding: '14px 18px',
          marginBottom: 24,
          fontSize: 14,
          fontFamily: 'IBM Plex Mono, monospace',
        }}
      >
        <FieldRow k="Email" v={<a href={`mailto:${item.email}`}>{item.email}</a>} />
        {item.phone && <FieldRow k="Phone" v={<a href={`tel:${item.phone}`}>{item.phone}</a>} />}
        {item.project_type && <FieldRow k="Project type" v={item.project_type} />}
        {item.type === 'referral' && item.prospect_name && (
          <FieldRow k="Prospect" v={item.prospect_name} />
        )}
        {item.type === 'referral' && item.prospect_contact && (
          <FieldRow k="Prospect contact" v={item.prospect_contact} />
        )}
      </div>

      {/* Message body */}
      <div
        style={{
          fontSize: 15.5,
          lineHeight: 1.6,
          color: 'var(--charcoal)',
          whiteSpace: 'pre-wrap',
          marginBottom: 36,
        }}
      >
        {item.message}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <a
          href={mailto}
          className="btn-vc btn-vc-teal"
          style={{ justifyContent: 'center', textDecoration: 'none' }}
        >
          Reply by email <span className="arrow">→</span>
        </a>

        <form action={markRepliedAndReturn.bind(null, item.id)}>
          <button
            type="submit"
            className="btn-vc btn-vc-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Mark as replied
          </button>
        </form>

        <form action={archiveAndReturn.bind(null, item.id)}>
          <button
            type="submit"
            className="btn-vc btn-vc-ghost"
            style={{
              width: '100%',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Archive
          </button>
        </form>
      </div>
    </main>
  )
}

function FieldRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '4px 0', alignItems: 'baseline' }}>
      <span
        style={{
          color: 'var(--text-muted)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          minWidth: 110,
        }}
      >
        {k}
      </span>
      <span style={{ color: 'var(--charcoal)', wordBreak: 'break-word' }}>{v}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: Submission['status'] }) {
  const map = {
    new: { label: 'New', bg: 'var(--teal)', fg: 'var(--warm-white)' },
    read: { label: 'Read', bg: 'var(--cream-deep)', fg: 'var(--text-secondary)' },
    replied: { label: 'Replied', bg: 'var(--charcoal)', fg: 'var(--warm-white)' },
    archived: { label: 'Archived', bg: 'var(--cream)', fg: 'var(--text-muted)' },
  }
  const s = map[status]
  return (
    <span
      style={{
        fontSize: 9,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        background: s.bg,
        color: s.fg,
        padding: '4px 8px',
        borderRadius: 3,
        fontFamily: 'IBM Plex Mono, monospace',
        fontWeight: 500,
      }}
    >
      {s.label}
    </span>
  )
}
