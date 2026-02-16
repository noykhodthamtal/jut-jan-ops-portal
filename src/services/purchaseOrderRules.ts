import { supabaseGet, supabasePatch, supabasePost } from '../lib/supabase'
import type {
  CreatePurchaseOrderRuleRequest,
  PurchaseOrderRule,
  UpdatePurchaseOrderRuleRequest,
} from '../models'

export async function fetchPurchaseOrderRules(storeId: string) {
  return supabaseGet<PurchaseOrderRule[]>('/purchase_order_rules', {
    store_id: `eq.${storeId}`,
    deleted_at: 'is.null',
  })
}

export async function createPurchaseOrderRule(payload: CreatePurchaseOrderRuleRequest) {
  return supabasePost<PurchaseOrderRule[]>('/purchase_order_rules', payload)
}

export async function updatePurchaseOrderRule(
  id: string,
  payload: UpdatePurchaseOrderRuleRequest
) {
  return supabasePatch<PurchaseOrderRule[]>(`/purchase_order_rules?id=eq.${id}`, payload)
}

export async function softDeletePurchaseOrderRule(id: string, deletedAt: string) {
  return supabasePatch<PurchaseOrderRule[]>(`/purchase_order_rules?id=eq.${id}`, {
    deleted_at: deletedAt,
  })
}
