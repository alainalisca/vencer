export type CaseStudy = {
  slug: string
  title: string
  tag: string
  meta: string
  blurb: string
  blurbLong: string
  image: string
  liveUrl?: string
  featured?: boolean
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'tribe',
    title: 'Tribe',
    tag: 'Mobile App · App Stores',
    meta: 'Mobile app · Supabase · Stripe · Live on the app stores',
    blurb: 'A peer-to-peer fitness app that matches athletes for training in real time — now live on the app stores, with in-app chat and split payments built in.',
    blurbLong: 'A peer-to-peer fitness app that matches athletes for real-time training sessions — now live on the app stores. Real-time matching, in-app chat, and split payments, built on Next.js, Supabase, and Stripe.',
    image: '/images/tribe.v4.jpg',
    liveUrl: 'https://tribe-v3.vercel.app',
    featured: true,
  },
  {
    slug: 'alisca-law',
    title: 'Alisca Law',
    tag: 'Law Firm',
    meta: 'Virtual firm · Next.js · Bilingual intake',
    blurb: 'An operating virtual law firm for contract and transactional work — authoritative design and intake flows that respect the client, bilingual from day one.',
    blurbLong: 'An operating virtual law firm for contract and transactional legal work. Authoritative design, intake flows that respect the client, and bilingual capability built in from day one.',
    image: '/images/aliscalaw.v2.jpg',
    liveUrl: 'https://aliscalaw.com',
  },
  {
    slug: 'la-profe-vero',
    title: 'La Profe Vero',
    tag: 'Bilingual',
    meta: 'Bilingual · next-intl · 90-second booking',
    blurb: "A Spanish tutor's booking site with tiered pricing and warm Colombian branding — a complete booking flow in under ninety seconds.",
    blurbLong: 'A bilingual Spanish-tutoring business with booking integration, tiered pricing, and warm Colombian branding tailored to her audience — a complete booking flow in under ninety seconds.',
    image: '/images/laprofevero.v2.jpg',
    liveUrl: 'https://laprofevero.com',
  },
  {
    slug: 'blue-chip-staffing',
    title: 'Blue Chip Staffing',
    tag: 'B2B Staffing',
    meta: 'B2B staffing · Multi-page · 5 service lines',
    blurb: 'A nationwide staffing firm across five service lines — a multi-page build with deep service architecture that prequalifies inbound before the sales call.',
    blurbLong: 'A premier nationwide staffing firm across five service lines — contract, contract-to-hire, payrolling, direct hire, and executive search. A multi-page build with deep service-line architecture and a confident B2B aesthetic that prequalifies inbound before the sales call.',
    image: '/images/bluechipstaff.v2.jpg',
    liveUrl: 'https://www.bluechipstaff.com',
  },
]

export function getNextPrev(slug: string) {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug)
  if (i === -1) return { prev: null, next: null }
  const prev = CASE_STUDIES[(i - 1 + CASE_STUDIES.length) % CASE_STUDIES.length]
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length]
  return { prev, next }
}
