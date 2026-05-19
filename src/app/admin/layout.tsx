import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--warm-white)',
        fontFamily: 'IBM Plex Sans, sans-serif',
      }}
    >
      {/* Top bar — only shown when logged in. Login screen renders without nav. */}
      {user && (
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(250,248,243,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid var(--border)',
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Link
              href="/admin"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--charcoal)',
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
              }}
            >
              VENCE<span style={{ color: 'var(--teal)' }}>R</span>
              <span
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginLeft: 6,
                }}
              >
                · Admin
              </span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Link
                href="/admin/inbox"
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                Inbox
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </header>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 18px' }}>{children}</div>
    </div>
  )
}
