'use client'

import { useState } from 'react'
import Reveal from './Reveal'

type Variant = 'home-teaser' | 'full'

type Props = {
  variant?: Variant
}

export default function Contact({ variant = 'home-teaser' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      const { createSubmission } = await import('@/lib/actions/submissions')
      const result = await createSubmission({
        type: 'contact',
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: fd.get('phone') ? String(fd.get('phone')) : undefined,
        projectType: fd.get('projectType') ? String(fd.get('projectType')) : undefined,
        message: String(fd.get('message') ?? ''),
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
    <section className="contact-section-vc">
      <div className="container-vc">
        <div className="contact-grid">
          <Reveal className="contact-info">
            <span className="eyebrow">{variant === 'full' ? 'Direct contact' : "Let's build"}</span>
            <h2 style={{ marginTop: 14 }}>
              {variant === 'full' ? 'Or skip the form.' : "Tell me what you're working on."}
            </h2>
            <p style={{ marginTop: 22 }}>
              {variant === 'full'
                ? 'Email or phone work just as well. Most projects start with a 30-minute conversation.'
                : "Whether it's a one-page launch, a full web application, or a redesign you've been putting off — start with a few sentences. I respond within one business day."}
            </p>

            <ul>
              <li><span className="key">Email</span><span className="val">alain@vencer.dev</span></li>
              <li><span className="key">Phone</span><span className="val">(347) 213-2947</span></li>
              <li><span className="key">Hours</span><span className="val">Mon–Fri, business hours</span></li>
              <li><span className="key">Locale</span><span className="val">EN&nbsp;/&nbsp;ES</span></li>
              {variant === 'full' && (
                <>
                  <li><span className="key">Response</span><span className="val">Within 1 business day</span></li>
                  <li><span className="key">Free Call</span><span className="val">First 30 min, no obligation</span></li>
                </>
              )}
            </ul>
          </Reveal>

          <Reveal>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="field">
                <label htmlFor="c-name">Your Name</label>
                <input id="c-name" name="name" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="c-email">Your Email</label>
                <input id="c-email" name="email" type="email" required />
              </div>
              {variant === 'full' && (
                <>
                  <div className="field">
                    <label htmlFor="c-phone">Your Phone (optional)</label>
                    <input id="c-phone" name="phone" type="tel" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-tier">What kind of project?</label>
                    <select id="c-tier" name="projectType" defaultValue="not-sure">
                      <option value="ai-automation">AI Automation ($75/hr · scoped)</option>
                      <option value="business-website">Business Website ($500–$1,500)</option>
                      <option value="web-app">Web Application ($2,500–$10,000+)</option>
                      <option value="pwa">Progressive Web App</option>
                      <option value="integration">Integration or Automation</option>
                      <option value="bilingual">Bilingual Site (EN/ES)</option>
                      <option value="retainer">Maintenance Retainer</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                  </div>
                </>
              )}
              <div className="field">
                <label htmlFor="c-project">{variant === 'full' ? 'Tell me about it' : 'What are you building?'}</label>
                <textarea
                  id="c-project"
                  name="message"
                  required
                  placeholder={
                    variant === 'full'
                      ? 'A few sentences about what you\'re building, who it\'s for, and what success looks like.'
                      : 'A few sentences is plenty.'
                  }
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-vc btn-vc-teal"
                style={{ opacity: status === 'loading' ? 0.5 : 1 }}
              >
                {status === 'loading' ? 'Sending…' : 'Send'} <span className="arrow">→</span>
              </button>
              {status === 'success' && (
                <p style={{ color: 'var(--teal-light)', textAlign: 'center', marginTop: 18 }}>
                  Message sent. I&apos;ll get back to you within one business day.
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
  )
}
