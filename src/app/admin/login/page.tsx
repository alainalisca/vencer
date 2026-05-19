import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Admin · Login',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const sp = await searchParams
  const errorKey = sp.error
  const redirect = sp.redirect ?? '/admin'

  const errorMsg =
    errorKey === 'unauthorized'
      ? 'That email is not on the admin allowlist.'
      : errorKey === 'auth'
        ? 'Login link expired or invalid. Try again.'
        : null

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--charcoal-deep)',
        color: 'var(--warm-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          VENCE<span style={{ color: 'var(--teal-light)' }}>R</span>
        </div>
        <div
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--teal-light)',
            marginBottom: 36,
          }}
        >
          Admin · Inbox &amp; Controls
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(252, 165, 165, 0.1)',
              border: '1px solid rgba(252, 165, 165, 0.3)',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: 4,
              fontSize: 13,
              marginBottom: 24,
            }}
          >
            {errorMsg}
          </div>
        )}

        <LoginForm redirect={redirect} />

        <p
          style={{
            marginTop: 28,
            fontSize: 12,
            lineHeight: 1.6,
            color: 'rgba(250,248,243,0.5)',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          You&apos;ll get a one-time login link by email. Click it, you&apos;re in.
          No password to remember. Only the allowlisted admin email can sign in.
        </p>
      </div>
    </main>
  )
}
