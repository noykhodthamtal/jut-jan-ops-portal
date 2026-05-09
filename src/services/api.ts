import { supabaseGet, supabasePatch, supabasePost, supabaseRpc } from '../lib/supabase'
import type { CreateItemRequest, DailySummaryRow, Item, UpdateItemRequest } from '../models'

export async function fetchDailySummary(storeId: string, date: string) {
  const rows = await supabaseGet<DailySummaryRow[]>('/v_daily_summary', {
    store_id: `eq.${storeId}`,
    doc_date: `eq.${date}`,
  })
  return rows[0] ?? null
}

export async function fetchItems(storeId: string) {
  return supabaseGet<Item[]>('/items', {
    store_id: `eq.${storeId}`,
    deleted_at: 'is.null',
    order: 'name.asc',
  })
}

export async function createItem(payload: CreateItemRequest) {
  return supabasePost<Item[]>('/items', payload)
}

export async function updateItem(id: string, payload: UpdateItemRequest) {
  return supabasePatch<Item[]>(`/items?id=eq.${id}`, payload)
}

export async function softDeleteItem(id: string) {
  return supabaseRpc<void>('soft_delete', { p_table: 'items', p_id: id })
}
