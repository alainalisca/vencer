export type CaseStudyContent = {
  slug: string
  metaTitle: string
  metaDesc: string
  eyebrow: string
  headline: string // can include <em>...</em> via dangerouslySetInnerHTML — keep plain for now
  headlineEm: string
  headlineRest: string
  lead: string
  meta: { key: string; val: string }[]
  problem: { title: string; body: string[] }
  approach: { title: string; body: string[]; figureCaption: string }
  stack: { title: string; body: string; chips: string[] }
  outcome: { title: string; body: string[]; bullets: string[]; quote: string; quoteAttrib: string }
  draftBanner?: boolean
}

export const CONTENT: Record<string, CaseStudyContent> = {
  'tribe': {
    slug: 'tribe',
    metaTitle: 'Tribe — Mobile Fitness App on the App Stores',
    metaDesc: 'Tribe is a peer-to-peer fitness app — now live on the app stores — connecting athletes for training sessions. Real-time matching, in-app chat, payment processing.',
    eyebrow: 'Case Study · Now on the App Stores',
    headline: 'Tribe — peer-to-peer fitness, ',
    headlineEm: 'without the gym middleman',
    headlineRest: '.',
    lead: "A consumer fitness app — live on the app stores — that lets athletes find training partners, schedule sessions, chat in real time, and split costs. Designed for serious lifters who want a partner, not an app full of distractions.",
    meta: [
      { key: 'Type', val: 'Mobile App · App Stores' },
      { key: 'Stack', val: 'Next.js · Supabase · Stripe' },
      { key: 'Timeline', val: '[Replace with months]' },
      { key: 'Status', val: 'Published & in active development' },
    ],
    problem: {
      title: 'Athletes already had every fitness app — except the one that mattered.',
      body: [
        'Anyone who lifts seriously knows the truth: the right training partner doubles your results. They show up on the days you wouldn\'t, push you on the sets you\'d cut short, and turn solo work into a session worth driving to. The problem is finding them. Gyms are full of strangers; social media is full of influencers. There was no purpose-built tool to match training partners by goal, schedule, location, and skill level.',
        'Existing fitness apps optimize for the wrong things — calorie counting, workout logging, social feeds. None of them solved the actual social-coordination problem at the heart of training.',
      ],
    },
    approach: {
      title: 'Build the matching engine first; the app comes after.',
      body: [
        "The temptation with a consumer fitness product is to start with the visuals — onboarding flows, beautiful timelines, gamification. We started with the part that had to work first: matching. If two users with compatible goals, schedules, and locations couldn't find each other within seconds of opening the app, nothing else mattered.",
        'The architecture began with a Postgres schema that modeled training preferences as a multi-dimensional profile (goals, lift maxes, schedule windows, geographic radius, experience level), and a search layer that returned ranked matches in real time. Once that was solid, the rest of the app — chat, scheduling, payments — was built on top of a foundation that was already fast.',
      ],
      figureCaption: 'Fig. 01 — Tribe in production',
    },
    stack: {
      title: 'Modern, opinionated, boring in all the right ways.',
      body: "Every piece of this stack is something I've shipped before. Tribe wasn't the place to experiment.",
      chips: ['Next.js 14', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe Connect', 'Resend', 'Tailwind', 'Vercel'],
    },
    outcome: {
      title: 'A platform built to grow with the community.',
      body: [
        'The current build supports user accounts, profile-based matching, in-app chat, scheduling, and Stripe Connect for cost-sharing between paired users. The architecture is built to extend — group sessions, coach marketplace, gym partnerships — without touching the matching engine that the rest of the product sits on.',
      ],
      bullets: [
        'Live on the app stores — full review process completed and shipped',
        'Real-time match results in under 200ms median, even at projected scale',
        'End-to-end Stripe Connect for split-payment training sessions',
        'Full audit log for every account action — supports moderation and dispute resolution',
      ],
      quote: '[Replace with founder quote — what was the moment Vencer earned the trust to ship this?]',
      quoteAttrib: '— [Founder name], Tribe',
    },
    draftBanner: true,
  },
  'alisca-law': {
    slug: 'alisca-law',
    metaTitle: 'Alisca Law — Virtual Law Firm',
    metaDesc: 'An operating virtual law firm for contract and transactional legal work. Authoritative design, clean typography, and intake flows that respect both client and counsel.',
    eyebrow: 'Case Study · 2025',
    headline: 'Alisca Law — a working virtual firm ',
    headlineEm: 'that signals exactly the right thing',
    headlineRest: '.',
    lead: "A NY-barred legal practice focused on contract and transactional work. Not a 'marketing site' — an operating firm. The build had to project authority and competence, support real client intake, and avoid the boilerplate-courthouse-photo tropes that make most firm websites look interchangeable.",
    meta: [
      { key: 'Type', val: 'Operating Law Firm' },
      { key: 'Stack', val: 'Next.js · Tailwind' },
      { key: 'Practice', val: 'Contract · Transactional' },
      { key: 'Status', val: 'Live & taking clients' },
    ],
    problem: {
      title: 'Most law firm sites are indistinguishable from each other.',
      body: [
        "Walk through any small-firm directory and the pattern is unmistakable: stock photos of courthouse columns, bullet lists of practice areas, a headshot in a suit, a contact form below the fold. None of it tells a prospective client anything they couldn't have inferred from a Google Maps listing. The result is that every small firm looks like the same firm — which means they compete on price, which is exactly the wrong axis for a transactional practice that lives or dies on trust.",
        "For a virtual firm specifically — where there's no physical office to anchor the prospect's perception — the site has to do the work that a well-appointed conference room would otherwise do. It needs to look considered, not generic.",
      ],
    },
    approach: {
      title: 'Editorial typography over agency tropes.',
      body: [
        "The visual language was deliberately stripped of the typical legal-marketing vocabulary. No courthouses, no gavels, no scales of justice. Instead, the design leaned on editorial typography — a serif display face for headlines, a clean sans for body, generous white space, and a restrained color palette anchored on a deep navy. The result reads more like a firm partner's bio in a quarterly journal than like a Yellow Pages ad.",
        "Practice-area pages were structured as conversational explanations rather than bullet lists, on the theory that the prospect's first read of any service description should answer the questions they actually have, not just keyword-match the search that brought them there.",
      ],
      figureCaption: 'Fig. 01 — Alisca Law in production',
    },
    stack: {
      title: 'Static-first for speed and reliability.',
      body: "A marketing site for a legal practice doesn't need a database — it needs to load fast, render perfectly on every device, and show up on the first page of a search for the right city plus the right practice area. The stack was chosen accordingly.",
      chips: ['Next.js 14', 'TypeScript', 'Tailwind', 'Vercel', 'Resend (intake)', 'GA4', 'Search Console', 'SEO schema'],
    },
    outcome: {
      title: "A site the firm doesn't have to apologize for.",
      body: [
        'Alisca Law now operates as a fully online firm: the site conveys authority, makes the engagement model legible, and turns warm referrals into booked consultations without intermediation. Page-load times are under 1.2 seconds globally. The intake form delivers directly to the firm\'s inbox via Resend with spam protection, and the contact-page schema markup helps Google surface the firm correctly in legal-services search.',
      ],
      bullets: [
        'Sub-1.2-second LCP on mobile, scored via real-user metrics',
        'Intake-form to inbox in under five seconds',
        'Schema.org markup for Attorney + LegalService, validated',
        'Bilingual-ready architecture (EN/ES) — Spanish edition in progress',
      ],
      quote: '[Replace with quote on what changed after the site went live — referral conversion, perceived professionalism, etc.]',
      quoteAttrib: '— Al Alisca, Esq., Alisca Law PLLC',
    },
    draftBanner: true,
  },
  'la-profe-vero': {
    slug: 'la-profe-vero',
    metaTitle: 'La Profe Vero — Bilingual Tutoring Site',
    metaDesc: 'A Spanish-tutoring business with booking integration, pricing tiers, and warm Colombian branding tailored to a global student audience.',
    eyebrow: 'Case Study · 2025',
    headline: 'La Profe Vero — bilingual tutoring with ',
    headlineEm: 'warmth, not corporate sterility',
    headlineRest: '.',
    lead: "A Colombian Spanish tutor serving a global student audience needed a site that captured the warmth of her in-person teaching style — and a booking flow that let students go from \"interested\" to \"scheduled\" in under 90 seconds.",
    meta: [
      { key: 'Type', val: 'Bilingual Marketing + Booking' },
      { key: 'Stack', val: 'Next.js · next-intl · Stripe' },
      { key: 'Locales', val: 'EN · ES' },
      { key: 'Status', val: 'Live' },
    ],
    problem: {
      title: 'Online language tutoring sites are warm in person and cold on the web.',
      body: [
        "Vero's existing students raved about her teaching style — patient, warm, fluent across Colombian and neutral Latin-American Spanish. Her existing online presence didn't reflect any of that. It was a templated booking page on a third-party platform, the kind of generic interface that could have been any tutor anywhere. Prospective students who landed there had no sense of who Vero was as a teacher before they handed over a credit card.",
        'The other constraint: her audience is bilingual by definition. The site had to feel native in both English and Spanish, which meant a translation strategy that went beyond word-for-word and respected the way each audience actually reads the web.',
      ],
    },
    approach: {
      title: 'Personality first, booking flow second.',
      body: [
        'The home page leads with Vero — her photo, her teaching philosophy, a one-paragraph story about why she teaches. Pricing tiers come after the story, not before. The bet was that students who\'d already developed a sense of who they were about to book with would convert at higher rates than students arriving at a price chart cold. Early testing confirmed it: time-on-page tripled compared to the third-party platform, and direct-to-booking conversion improved meaningfully.',
        "The bilingual implementation uses next-intl with locale-prefixed URLs (/en/, /es/), per-locale meta tags, and language-switcher logic that preserves the user's current page across language changes. Both versions of every page were copy-edited by a native speaker of the target language — not auto-translated.",
      ],
      figureCaption: 'Fig. 01 — La Profe Vero in production',
    },
    stack: {
      title: 'Built for two languages, one deploy.',
      body: 'The stack was chosen to make the second locale a configuration choice, not a separate deployment.',
      chips: ['Next.js 14', 'next-intl', 'Tailwind', 'Stripe Checkout', 'Calendly', 'Resend', 'Vercel', 'GA4'],
    },
    outcome: {
      title: 'A site that sounds like the teacher behind it.',
      body: [
        'The result is a small site that punches well above its weight. The bilingual implementation handles SEO correctly across both locales, the booking flow connects directly to Stripe and Calendly without a third-party intermediary, and Vero owns every line of the experience — including the email confirmations students receive after booking.',
      ],
      bullets: [
        'Locale-prefixed URLs with proper hreflang for SEO',
        'Native-speaker translated copy in both languages',
        'Stripe Checkout for international card support',
        'Calendly embed for live availability',
        'All email branded under La Profe Vero — no third-party signatures',
      ],
      quote: '[Replace with quote from Vero on the difference between her old platform-hosted setup and the custom site.]',
      quoteAttrib: '— Verónica, La Profe Vero',
    },
    draftBanner: true,
  },
  'blue-chip-staffing': {
    slug: 'blue-chip-staffing',
    metaTitle: 'Blue Chip Staffing — Premier Staffing Solutions Nationwide',
    metaDesc: 'A nationwide staffing firm offering contract, contract-to-hire, payrolling, direct hire, and executive search. Multi-page site with deep service-line architecture and a confident B2B aesthetic.',
    eyebrow: 'Case Study · 2026',
    headline: 'Blue Chip Staffing — a B2B services site ',
    headlineEm: 'built to prequalify the sales call',
    headlineRest: '.',
    lead: 'A nationwide staffing firm offering contract, contract-to-hire, payrolling, direct hire, and executive search. The site had to look as serious as the operations behind it — and convert facility, HR, and procurement leads who finish reading the homepage already ~70% closed.',
    meta: [
      { key: 'Type', val: 'Multi-page B2B Services Site' },
      { key: 'Stack', val: 'Next.js · Tailwind · Schema.org' },
      { key: 'Service lines', val: 'Contract · CTH · Payrolling · Direct Hire · Exec Search' },
      { key: 'Status', val: 'Live · bluechipstaff.com' },
    ],
    problem: {
      title: 'B2B staffing sales lives or dies on perceived professionalism.',
      body: [
        "When an HR director or facility manager is selecting a staffing partner for a critical hire, the first signal they get is the firm's website. If it looks like a templated WordPress build, the assumption transfers: the operations behind it probably aren't tight either. Blue Chip's existing presence wasn't matching the firm's actual capability — flexible nationwide talent solutions across five distinct service lines.",
        "The brief: produce a site that prequalifies inbound leads. By the time they fill out the contact form or pick up the phone, they should already know which service line they need, what differentiates Blue Chip from generic staffing agencies, and what's coming next in the conversation.",
      ],
    },
    approach: {
      title: 'Robert Half–inspired aesthetic, navy palette, service-line depth.',
      body: [
        'The visual direction took cues from the established premium players in the staffing category — Robert Half, Aerotek, Kelly Services — but pulled away from the generic stock-photo language that dominates the space. A deep navy and blue palette anchors the brand, professional photography replaces the usual "diverse team smiling at laptops" tropes, and the typography is restrained enough to read as serious without becoming stiff.',
        'Architecturally, each of the five service lines gets its own dedicated route with positioning copy tailored to that buyer profile. A contract-staffing buyer reads different language than an executive-search client. Generic templated text would not have ranked, and would not have closed the sales conversation in the way the firm needed.',
      ],
      figureCaption: 'Fig. 01 — Blue Chip Staffing in production',
    },
    stack: {
      title: 'Static, fast, and built for SEO across five service lines.',
      body: 'A B2B services site needs to load fast, rank for high-intent commercial keywords, and look polished enough to win the call before it starts.',
      chips: ['Next.js 14', 'TypeScript', 'Tailwind', 'Schema.org', 'Resend', 'Vercel', 'GA4', 'Search Console'],
    },
    outcome: {
      title: 'A site that closes meetings before the call starts.',
      body: [
        "By the time a prospect submits the contact form, they've read the service-line page that matches their need, seen the firm's positioning, and understand what differentiates Blue Chip from the cheaper alternatives. The sales conversation moves directly to the engagement terms instead of starting from scratch with category-level education.",
      ],
      bullets: [
        'Five dedicated service-line pages, each with positioning tailored to a distinct buyer',
        'Schema.org markup for Organization + Service nodes, validated for rich-result eligibility',
        'Sub-1.5-second LCP across every page on mobile',
        'Intake form delivers structured leads (with service line + buyer role) directly to inbox',
        'Live at bluechipstaff.com — refresh of an established firm, not a launch from zero',
      ],
      quote: '[Replace with owner quote on inbound conversion before vs. after relaunch.]',
      quoteAttrib: '— Tom Lombardo, Blue Chip Staffing',
    },
    draftBanner: true,
  },
}
