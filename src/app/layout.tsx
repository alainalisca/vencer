import type { Metadata } from 'next'
import './globals.css'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata: Metadata = {
  title: {
    default: 'Vencer — Custom Websites & Web Applications',
    template: '%s — Vencer',
  },
  description: 'Custom-coded websites and web applications by an engineer who understands both code and law. No templates. No page builders. You own everything.',
  keywords: ['web development', 'web applications', 'Next.js', 'React', 'custom websites', 'bilingual websites', 'work-for-hire'],
  authors: [{ name: 'Alain Alisca' }],
  metadataBase: new URL('https://vencer.dev'),
  openGraph: {
    title: 'Vencer — Custom Websites & Web Applications',
    description: 'Custom-coded sites and applications. No templates. No page builders. You own everything.',
    url: 'https://vencer.dev',
    siteName: 'Vencer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Vencer — Custom Websites & Web Applications',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vencer — Custom Websites & Web Applications',
    description: 'Custom-coded sites and applications. No templates. No page builders. You own everything.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/logos/vencer-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://vencer.dev" />
      </head>
      <body className="antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
