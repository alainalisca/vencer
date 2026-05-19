'use client'

import { useState } from 'react'
import Reveal from './Reveal'

const STEPS = [
  {
    num: '01',
    title: 'Make the intro',
    body: "Drop a name and a one-line context — what they're building, what they need. I'll take it from there. Pitch, scope, contract, work.",
  },
  {
    num: '02',
    title: 'I sign & build',
    body: 'If they sign, I build. You stay out of the back-and-forth unless you want in. No noise, no chasing, no awkward middleman position.',
  },
  {
    num: '03',
    title: 'You get paid',
    body: '30–40% commission on project revenue depending on size. 15% recurring on retainer revenue for 12 months. Paid within 14 days of client payment.',
  },
]

const TIERS = [
  { size: 'Under $2,500', rate: '40%', recurring: '15% on any retainer for 12 mo' },
  { size: '$2,500 – $7,500', rate: '35%', recurring: '15% on any retainer for 12 mo' },
  { size: 'Over $7,500', rate: '30%', recurring: '15% on any retainer for 12 mo' },
]

export default function Referrals() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      const { createSubmission } = await import('@/lib/actions/submissions')
      const result = await createSubmission({
        type: 'referral',
        name: String(fd.get('referrerName') ?? ''),
        email: String(fd.get('referrerEmail') ?? ''),
        prospectName: String(fd.get('prospectName') ?? ''),
        prospectContact: String(fd.get('prospectContact') ?? ''),
        message: String(fd.get('context') ?? ''),
      })
      if (result.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="referral-section section-vc">
        <div className="container-vc">
          <Reveal className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Three steps. Zero friction.</h2>
          </Reveal>

          <Reveal stagger as="div" className="referral-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="ref-step">
                <span className="step-num">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="commission-table" style={{ marginTop: 70 }}>
            <div className="commission-row head">
              <div>Project Size</div>
              <div>Commission Rate</div>
              <div>Recurring Add-On</div>
            </div>
            {TIERS.map((t, i) => (
              <div key={i} className="commission-row">
                <div className="commission-cell" data-label="Project Size">{t.size}</div>
                <div className="commission-cell" data-label="Commission Rate"><span className="num">{t.rate}</span></div>
                <div className="commission-cell" data-label="Recurring Add-On">{t.recurring}</div>
              </div>
            ))}
          </Reveal>

          <Reveal stagger as="div" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginTop: 70 }}>
            <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 4, padding: '36px 32px' }}>
              <span className="eyebrow">Track 01</span>
              <h3 style={{ marginTop: 14, marginBottom: 12 }}>Casual Referrals</h3>
              <p className="muted">For people who happen to know someone who needs a website. Zero paperwork. Just send the intro and we&apos;ll figure out the rest by email.</p>
              <ul className="svc-includes" style={{ marginTop: 18 }}>
                <li>No agreement to sign</li>
                <li>One-off referrals</li>
                <li>Same commission structure</li>
                <li>Best fit: friends, network connections</li>
              </ul>
            </div>
            <div style={{ background: 'var(--charcoal)', color: 'var(--warm-white)', borderRadius: 4, padding: '36px 32px' }}>
              <span className="eyebrow" style={{ color: 'var(--teal-light)' }}>Track 02</span>
              <h3 style={{ marginTop: 14, marginBottom: 12, color: 'var(--warm-white)' }}>Sales Partner Program</h3>
              <p style={{ color: 'rgba(250,248,243,0.78)' }}>For people actively sourcing clients in their networks — agencies, consultants, marketers. Formal independent contractor agreement; recurring pipeline; first-look on inbound work in your category.</p>
              <ul className="svc-includes" style={{ marginTop: 18 }}>
                <li style={{ color: 'rgba(250,248,243,0.78)' }}>Signed independent contractor agreement</li>
                <li style={{ color: 'rgba(250,248,243,0.78)' }}>Same commission structure, formal accounting</li>
                <li style={{ color: 'rgba(250,248,243,0.78)' }}>Sales collateral, branded URLs, and pitch decks</li>
                <li style={{ color: 'rgba(250,248,243,0.78)' }}>Best fit: agencies, marketers, sales reps</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Refer-a-project form */}
      <section className="contact-section-vc">
        <div className="container-vc">
          <div className="contact-grid">
            <Reveal className="contact-info">
              <span className="eyebrow">Make the intro</span>
              <h2 style={{ marginTop: 14 }}>Refer a project.</h2>
              <p style={{ marginTop: 22 }}>
                Drop the prospect&apos;s name, what they need, and how to reach them. I&apos;ll take the conversation from there and keep you posted.
              </p>
              <ul>
                <li><span className="key">Email</span><span className="val">alain@vencer.dev</span></li>
                <li><span className="key">Phone</span><span className="val">(347) 213-2947</span></li>
                <li><span className="key">Payout</span><span className="val">14 days post-client-payment</span></li>
                <li><span className="key">Tracking</span><span className="val">Email confirmation + status updates</span></li>
              </ul>
            </Reveal>

            <Reveal>
              <form onSubmit={handleSubmit} className="contact-form">
                <input type="hidden" name="form" value="referral" />
                <div className="field">
                  <label htmlFor="r-name">Your Name</label>
                  <input id="r-name" name="referrerName" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="r-email">Your Email</label>
                  <input id="r-email" name="referrerEmail" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="r-prospect-name">Prospect&apos;s Name</label>
                  <input id="r-prospect-name" name="prospectName" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="r-prospect-contact">Prospect&apos;s Email or Phone</label>
                  <input id="r-prospect-contact" name="prospectContact" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="r-context">What do they need?</label>
                  <textarea id="r-context" name="context" required placeholder="One or two sentences is plenty." />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-vc btn-vc-teal"
                  style={{ opacity: status === 'loading' ? 0.5 : 1 }}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Referral'} <span className="arrow">→</span>
                </button>
                {status === 'success' && (
                  <p style={{ color: 'var(--teal-light)', textAlign: 'center', marginTop: 18 }}>
                    Referral sent. I&apos;ll be in touch within one business day.
                  </p>
                )}
                {status === 'error' && (
                  <p style={{ color: '#fda4af', textAlign: 'center', marginTop: 18 }}>
                    Something went wrong. Please try again or email alain@vencer.dev directly.
                  </p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
