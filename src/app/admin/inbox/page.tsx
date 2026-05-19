import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Submission = {
  id: string
  type: 'contact' | 'referral'
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  prospect_name: string | null
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const sp = await searchParams
  const filter = sp.filter ?? 'open'

  const supabase = await createClient()
  let query = supabase
    .from('submissions')
    .select('id, type, name, email, message, status, created_at, prospect_name')
    .order('created_at', { ascending: false })

  if (filter === 'open') query = query.in('status', ['new', 'read'])
  else if (filter === 'replied') query = query.eq('status', 'replied')
  else if (filter === 'archived') query = query.eq('status', 'archived')
  // 'all' = no filter

  const { data, error } = await query
  const items = (data as Submission[] | null) ?? []

  return (
    <main style={{ padding: '32px 0 80px' }}>
      <h1
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 500,
          fontSize: 36,
          letterSpacing: '-0.02em',
          marginBottom: 18,
          color: 'var(--charcoal)',
        }}
      >
        Inbox
      </h1>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 24,
          flexWrap: 'wrap',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        <FilterTab href="/admin/inbox?filter=open" label="Open" active={filter === 'open'} />
        <FilterTab
          href="/admin/inbox?filter=replied"
          label="Replied"
          active={filter === 'replied'}
        />
        <FilterTab
          href="/admin/inbox?filter=archived"
          label="Archived"
          active={filter === 'archived'}
        />
        <FilterTab href="/admin/inbox?filter=all" label="All" active={filter === 'all'} />
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(252,165,165,0.1)',
            border: '1px solid rgba(252,165,165,0.3)',
            color: '#dc2626',
            padding: '12px 14px',
            borderRadius: 4,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          Could not load: {error.message}
        </div>
      )}

      {!error && items.length === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 14,
          }}
        >
          Nothing here yet. New submissions will appear at the top.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <SubmissionRow key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}

function FilterTab({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        padding: '7px 12px',
        textDecoration: 'none',
        color: active ? 'var(--warm-white)' : 'var(--text-secondary)',
        background: active ? 'var(--charcoal)' : 'transparent',
        border: `1px solid ${active ? 'var(--charcoal)' : 'var(--border)'}`,
        borderRadius: 999,
      }}
    >
      {label}
    </Link>
  )
}

function SubmissionRow({ item }: { item: Submission }) {
  const isUnread = item.status === 'new'
  const tagLabel = item.type === 'referral' ? 'Referral' : 'Contact'
  const preview =
    item.message.length > 110 ? item.message.slice(0, 107) + '…' : item.message

  return (
    <Link
      href={`/admin/inbox/${item.id}`}
      style={{
        display: 'block',
        padding: '16px 18px',
        background: 'var(--warm-white)',
        border: `1px solid ${isUnread ? 'var(--teal)' : 'var(--border)'}`,
        borderLeftWidth: isUnread ? 3 : 1,
        borderRadius: 4,
        textDecoration: 'none',
        color: 'var(--charcoal)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: item.type === 'referral' ? 'var(--teal)' : 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            {tagLabel}
          </span>
          <span style={{ fontWeight: isUnread ? 600 : 500, fontSize: 15 }}>
            {item.name}
          </span>
          {item.type === 'referral' && item.prospect_name && (
            <span
              style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
            >
              → {item.prospect_name}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'IBM Plex Mono, monospace',
            flexShrink: 0,
          }}
        >
          {formatTime(item.created_at)}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {preview}
      </div>
    </Link>
  )
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
