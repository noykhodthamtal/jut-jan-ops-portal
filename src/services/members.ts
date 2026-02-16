import { supabaseGet, supabasePatch, supabasePost } from '../lib/supabase'
import type { StoreMember, UpdateStoreMemberRequest } from '../models'

export async function fetchStoreMembers(storeId: string) {
  return supabaseGet<StoreMember[]>('/store_memberships', {
    store_id: `eq.${storeId}`,
    order: 'created_at.desc',
  })
}

export async function createStoreMember(payload: Omit<StoreMember, 'id'>) {
  return supabasePost<StoreMember[]>('/store_memberships', payload)
}

export async function updateStoreMember(id: string, payload: UpdateStoreMemberRequest) {
  return supabasePatch<StoreMember[]>(`/store_memberships?id=eq.${id}`, payload)
}
