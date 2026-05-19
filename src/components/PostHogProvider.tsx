'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as Provider } from 'posthog-js/react'

// Initialize PostHog once on the client. Skips initialization if the env var
// isn't set (e.g. during local dev without credentials) so the app still works.
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: false, // we capture manually below for App Router
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false, // capture form text — we want to see what visitors type into the contact form
      maskInputOptions: { password: true },
    },
    autocapture: true, // clicks, form interactions, scroll
    persistence: 'localStorage+cookie',
  })
}

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    let url = window.origin + pathname
    const qs = searchParams?.toString()
    if (qs) url += `?${qs}`
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  // PostHog is a no-op without a key, so it's safe to mount unconditionally.
  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </Provider>
  )
}
