'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived'
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('[admin/inbox] updateStatus failed', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/inbox')
  revalidatePath(`/admin/inbox/${id}`)
  return { ok: true }
}

export async function archiveAndReturn(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'archived' })
    .eq('id', id)
  if (error) console.error('[admin/inbox] archive failed', error)
  revalidatePath('/admin')
  revalidatePath('/admin/inbox')
  redirect('/admin/inbox')
}

export async function markRepliedAndReturn(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'replied' })
    .eq('id', id)
  if (error) console.error('[admin/inbox] mark replied failed', error)
  revalidatePath('/admin')
  revalidatePath('/admin/inbox')
  redirect('/admin/inbox')
}
