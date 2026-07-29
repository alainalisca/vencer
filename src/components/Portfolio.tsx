import Link from 'next/link'
import Reveal from './Reveal'
import { CASE_STUDIES } from './work-data'

type Props = {
  variant?: 'home-preview' | 'index'
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Portfolio({ variant = 'home-preview' }: Props) {
  const featured = CASE_STUDIES.find((c) => c.featured) ?? CASE_STUDIES[0]
  const rest = CASE_STUDIES.filter((c) => c.slug !== featured.slug)

  return (
    <section className="work-section section-vc">
      <div className="container-vc">
        {variant === 'home-preview' && (
          <Reveal className="section-head">
            <span className="eyebrow">Selected Work</span>
            <h2>Four projects, four different problems.</h2>
            <p className="lead">
              A peer-to-peer fitness app. A virtual law firm. A bilingual tutor&apos;s booking site. A nationwide staffing build.{' '}
              <Link href="/work" style={{ color: 'var(--teal-light)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                See full case studies →
              </Link>
            </p>
          </Reveal>
        )}

        <Reveal className="work-featured">
          <Link className="work-card work-card--featured" href={`/work/${featured.slug}`}>
            <div className="work-img">
              <span className="work-idx">01</span>
              <span className="work-tag">{featured.tag}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.image} alt={`${featured.title} case study`} />
              <div className="work-hover"><span>View case study</span><span aria-hidden>↗</span></div>
            </div>
            <div className="work-body">
              <span className="work-flag">★ Flagship</span>
              <h3>{featured.title}</h3>
              <div className="work-meta">{featured.meta}</div>
              <p>{variant === 'index' ? featured.blurbLong : featured.blurb}</p>
              <span className="work-link">View Case Study <span className="arrow">→</span></span>
            </div>
          </Link>
        </Reveal>

        <Reveal stagger as="div" className="work-grid">
          {rest.map((c, i) => (
            <Link key={c.slug} className="work-card" href={`/work/${c.slug}`}>
              <div className="work-img">
                <span className="work-idx">{pad(i + 2)}</span>
                <span className="work-tag">{c.tag}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={`${c.title} case study`} />
                <div className="work-hover"><span>View case study</span><span aria-hidden>↗</span></div>
              </div>
              <div className="work-body">
                <h3>{c.title}</h3>
                <div className="work-meta">{c.meta}</div>
                <p>{variant === 'index' ? c.blurbLong : c.blurb}</p>
                <span className="work-link">View Case Study <span className="arrow">→</span></span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
