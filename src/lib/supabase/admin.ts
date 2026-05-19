// Admin (service-role) Supabase client for Server Actions that need to bypass RLS.
// Used by form-submission handlers to write rows without requiring a user session.
// NEVER import this into a client component.

import { createClient as createBaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createBaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
