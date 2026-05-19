// LinkedIn banner — 1584 × 396 PNG.
// Editorial restraint: wordmark is the entire visual. Brand palette only.
// Visit https://vencer.dev/linkedin-banner in a browser → right-click → Save Image As.

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const SIZE = { width: 1584, height: 396 }

async function loadCormorant() {
  try {
    return await fetch(
      new URL('../fonts/CormorantGaramond-Medium.ttf', import.meta.url)
    ).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export async function GET() {
  const cormorant = await loadCormorant()
  const fontFamily = cormorant ? 'Cormorant' : 'serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0f13',
          // Subtle radial bloom in the upper-right — adds depth without noise.
          // The bottom-left stays cleanly charcoal so the LinkedIn profile
          // photo (which sits there) reads with maximum contrast against it.
          backgroundImage:
            'radial-gradient(1200px 800px at 100% 0%, rgba(13,148,136,0.32) 0%, rgba(13,148,136,0.06) 35%, rgba(12,15,19,0) 65%), radial-gradient(900px 600px at 0% 100%, rgba(45,212,191,0.05) 0%, rgba(12,15,19,0) 60%)',
          position: 'relative',
          padding: '0 96px 0 320px',
        }}
      >
        {/* The wordmark — single hero element */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 240,
              color: '#faf8f3',
              fontWeight: 500,
              letterSpacing: -8,
              lineHeight: 0.9,
              fontFamily,
            }}
          >
            <span>VENCE</span>
            <span style={{ color: '#2dd4bf' }}>R</span>
          </div>

          {/* Single hairline accent — gradient teal rule under the wordmark */}
          <div
            style={{
              width: 200,
              height: 1.5,
              background:
                'linear-gradient(90deg, #2dd4bf 0%, rgba(45,212,191,0) 100%)',
              marginTop: 26,
            }}
          />
        </div>

        {/* Right-edge vertical accent — a single thin teal line that bleeds
            off the top and bottom. Subtle architectural marker, asymmetric. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 3,
            background:
              'linear-gradient(180deg, rgba(45,212,191,0) 0%, rgba(45,212,191,0.6) 50%, rgba(45,212,191,0) 100%)',
          }}
        />
      </div>
    ),
    {
      ...SIZE,
      fonts: cormorant
        ? [{ name: 'Cormorant', data: cormorant, style: 'normal', weight: 500 }]
        : undefined,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Disposition': 'inline; filename="vencer-linkedin-banner.png"',
      },
    }
  )
}
