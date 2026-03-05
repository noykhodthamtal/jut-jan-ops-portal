import { supabaseGet } from '../lib/supabase'

export async function fetchStoreIdForUser(userId: string) {
  const rows = await supabaseGet<{ store_id: string }[]>('/store_memberships', {
    user_id: `eq.${userId}`,
    status: 'eq.ACTIVE',
    deleted_at: 'is.null',
    select: 'store_id',
    order: 'created_at.desc',
    limit: '1',
  })
  return rows[0]?.store_id ?? ''
}
