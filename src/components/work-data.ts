export type CaseStudy = {
  slug: string
  title: string
  tag: string
  blurb: string
  blurbLong: string
  image: string
  liveUrl?: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'tribe',
    title: 'Tribe',
    tag: 'Mobile App · App Stores',
    blurb: 'Peer-to-peer fitness app connecting athletes for training sessions. Now live on the app stores — real-time matching, in-app chat, payment processing.',
    blurbLong: 'A peer-to-peer fitness app — now live on the app stores — connecting athletes for training sessions, with real-time matching, in-app chat, and payment processing.',
    image: '/images/tribe.v3.jpg',
    liveUrl: 'https://tribe-v3.vercel.app',
  },
  {
    slug: 'alisca-law',
    title: 'Alisca Law',
    tag: 'Law Firm',
    blurb: 'An operating virtual law firm for contract and transactional legal work. Authoritative design, intake flows that respect the client.',
    blurbLong: 'An operating virtual law firm for contract and transactional legal work. Authoritative design, intake flows that respect the client, and bilingual capability built in.',
    image: '/images/aliscalaw.jpg',
    liveUrl: 'https://aliscalaw.com',
  },
  {
    slug: 'la-profe-vero',
    title: 'La Profe Vero',
    tag: 'Bilingual',
    blurb: 'Spanish-tutoring business with booking integration, pricing tiers, and warm Colombian branding tailored to her audience.',
    blurbLong: 'Spanish-tutoring business with booking integration, pricing tiers, and warm Colombian branding tailored to her audience.',
    image: '/images/laprofevero.jpg',
    liveUrl: 'https://laprofevero.com',
  },
  {
    slug: 'blue-chip-staffing',
    title: 'Blue Chip Staffing',
    tag: 'B2B Staffing',
    blurb: 'Premier nationwide staffing firm — contract, contract-to-hire, payrolling, direct hire, and executive search. Multi-page site with deep service-line architecture.',
    blurbLong: 'A premier nationwide staffing firm offering contract, contract-to-hire, payrolling, direct hire, and executive search. Multi-page build with deep service-line architecture, refined typography, and a confident B2B-services aesthetic that prequalifies inbound before the sales call.',
    image: 'https://bluechipstaff.com/images/og/og-default.jpg',
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
