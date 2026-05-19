// Magic-link callback: exchanges the code for a session, then redirects to /admin.

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') ?? '/admin'

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchange failed', error.message)
    return NextResponse.redirect(`${origin}/admin/login?error=auth`)
  }

  return NextResponse.redirect(`${origin}${redirect}`)
}
