export type PurchaseOrderRule = {
  id: string
  store_id: string
  group_id: string
  threshold_percent: number
  created_at?: string
  created_by?: string | null
  updated_at?: string
  updated_by?: string | null
  deleted_at?: string | null
  deleted_by?: string | null
}

export type CreatePurchaseOrderRuleRequest = Pick<
  PurchaseOrderRule,
  'store_id' | 'group_id' | 'threshold_percent'
>

export type UpdatePurchaseOrderRuleRequest = Partial<
  Pick<PurchaseOrderRule, 'group_id' | 'threshold_percent' | 'deleted_at' | 'deleted_by'>
>
