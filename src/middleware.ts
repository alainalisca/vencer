import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // If Supabase env vars aren't configured yet, skip auth entirely so the
  // marketing site keeps working. /admin pages will fail gracefully on their
  // own when they try to read submissions, but the rest of the site is untouched.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next()
  }
  return await updateSession(request)
}

export const config = {
  // Only gate /admin/* — the marketing surface doesn't need auth.
  matcher: ['/admin/:path*'],
}
