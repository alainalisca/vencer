import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const supabase = await createClient()

  // Counts by status (cheap aggregation — fine at small scale)
  const { data: rows, error } = await supabase
    .from('submissions')
    .select('status, type, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <Section title="Inbox">
        <p style={{ color: '#fca5a5' }}>
          Could not load submissions: {error.message}. Check that the Supabase
          project is set up and the migration has been run.
        </p>
      </Section>
    )
  }

  const all = rows ?? []
  const newCount = all.filter((r) => r.status === 'new').length
  const totalContact = all.filter((r) => r.type === 'contact').length
  const totalReferral = all.filter((r) => r.type === 'referral').length

  // Submissions in the last 7 days for the "this week" stat
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const lastWeek = all.filter((r) => new Date(r.created_at).getTime() > weekAgo).length

  return (
    <main style={{ padding: '32px 0 80px' }}>
      <h1
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 500,
          fontSize: 36,
          letterSpacing: '-0.02em',
          marginBottom: 8,
          color: 'var(--charcoal)',
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32 }}>
        Quick view of your inbox. Tap Inbox in the nav for the full list.
      </p>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <Stat label="Unread" value={newCount} accent />
        <Stat label="This week" value={lastWeek} />
        <Stat label="Contact" value={totalContact} />
        <Stat label="Referrals" value={totalReferral} />
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link
          href="/admin/inbox"
          style={{
            display: 'block',
            padding: '18px 20px',
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'var(--charcoal)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Inbox</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            All contact + referral submissions
          </div>
        </Link>
        <a
          href="https://app.posthog.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '18px 20px',
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'var(--charcoal)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Analytics{' '}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
              ↗ PostHog
            </span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Page views, sessions, replays. Opens in PostHog.
          </div>
        </a>
      </div>
    </main>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div
      style={{
        padding: '18px 20px',
        background: accent ? 'var(--charcoal)' : 'var(--warm-white)',
        border: `1px solid ${accent ? 'var(--charcoal)' : 'var(--border)'}`,
        borderRadius: 4,
        color: accent ? 'var(--warm-white)' : 'var(--charcoal)',
      }}
    >
      <div
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent ? 'var(--teal-light)' : 'var(--text-muted)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main style={{ padding: '32px 0' }}>
      <h1>{title}</h1>
      {children}
    </main>
  )
}
