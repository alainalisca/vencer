'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm({ redirect }: { redirect: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg(null)
    try {
      const supabase = createClient()
      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://vencer.dev'
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/admin/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      })
      if (error) {
        setStatus('error')
        setErrorMsg(error.message)
      } else {
        setStatus('sent')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        style={{
          padding: '24px 22px',
          background: 'rgba(20,184,166,0.1)',
          border: '1px solid rgba(20,184,166,0.4)',
          borderRadius: 4,
          color: 'var(--teal-light)',
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--warm-white)' }}>
          Check your inbox.
        </div>
        We sent a magic link to <strong style={{ color: 'var(--warm-white)' }}>{email}</strong>.
        Click the link to log in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="email"
        style={{
          display: 'block',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(250,248,243,0.6)',
          marginBottom: 8,
        }}
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="alain@vencer.dev"
        autoComplete="email"
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'rgba(250,248,243,0.04)',
          border: '1px solid rgba(250,248,243,0.12)',
          borderRadius: 2,
          color: 'var(--warm-white)',
          fontSize: 15,
          marginBottom: 18,
        }}
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-vc btn-vc-teal"
        style={{
          width: '100%',
          justifyContent: 'center',
          opacity: status === 'loading' ? 0.6 : 1,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'loading' ? 'Sending…' : 'Send magic link'}{' '}
        <span className="arrow">→</span>
      </button>

      {errorMsg && (
        <p
          style={{
            color: '#fca5a5',
            fontSize: 13,
            marginTop: 14,
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          {errorMsg}
        </p>
      )}
    </form>
  )
}
