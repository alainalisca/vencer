import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import Portfolio from '@/components/Portfolio'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected case studies from Vencer: Tribe (mobile app), Alisca Law (virtual firm), La Profe Vero (bilingual booking), Blue Chip Staffing (nationwide staffing).',
}

export default function WorkPage() {
  return (
    <main>
      <Navbar />

      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&q=70&auto=format&fit=crop"
        eyebrow="Selected Work"
        title={<>Four projects.<br />Four different problems.<br /><em>One standard.</em></>}
        lead={<>A peer-to-peer fitness app. A virtual law firm. A bilingual tutor&apos;s booking site. A nationwide staffing build. Every brief is different — the standard isn&apos;t.</>}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Work' }]}
      />

      <Portfolio variant="index" />

      <section className="contact-section-vc">
        <div className="container-vc">
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
              <span className="eyebrow">Yours next?</span>
              <h2 style={{ marginTop: 14 }}>Tell me about your project.</h2>
              <p style={{ marginTop: 22, color: 'rgba(250,248,243,0.78)' }}>
                A few sentences is enough to start. I&apos;ll respond with a candid take on scope, timeline, and price.
              </p>
              <Link href="/contact" className="btn-vc btn-vc-teal" style={{ marginTop: 30 }}>
                Start a Project <span className="arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
