import { supabaseGet, supabasePatch, supabasePost, supabaseRpc } from '../lib/supabase'
import type { CreateItemGroupRequest, ItemGroup, UpdateItemGroupRequest } from '../models'


export async function fetchItemGroups(storeId: string) {
  return supabaseGet<ItemGroup[]>('/item_groups', {
    store_id: `eq.${storeId}`,
    deleted_at: 'is.null',
    order: 'sort_order.asc,code.asc',
  })
}

export async function createItemGroup(payload: CreateItemGroupRequest) {
  return supabasePost<ItemGroup[]>('/item_groups', payload)
}

export async function updateItemGroup(id: string, payload: UpdateItemGroupRequest) {
  return supabasePatch<ItemGroup[]>(`/item_groups?id=eq.${id}`, payload)
}

export async function softDeleteItemGroup(id: string) {
  return supabaseRpc<void>('soft_delete', { p_table: 'item_groups', p_id: id })
}
