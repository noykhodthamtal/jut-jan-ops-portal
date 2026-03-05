import { supabaseGet } from '../lib/supabase'

export async function fetchMerchantIdForUser(userId: string) {
  const rows = await supabaseGet<{ merchant_id: string }[]>('/memberships', {
    user_id: `eq.${userId}`,
    status: 'eq.ACTIVE',
    deleted_at: 'is.null',
    select: 'merchant_id',
    order: 'created_at.desc',
    limit: '1',
  })
  return rows[0]?.merchant_id ?? ''
}
