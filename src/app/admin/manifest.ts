import type { MetadataRoute } from 'next'

// PWA manifest for the /admin app — installs to phone home screen.
// Scope is /admin so the rest of the marketing site doesn't act like an installed app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vencer Admin',
    short_name: 'Vencer',
    description: 'Vencer admin — inbox, content controls, analytics',
    start_url: '/admin',
    scope: '/admin',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0c0f13',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/logos/vencer-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/logos/vencer-favicon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
