export type Item = {
  id: string
  store_id: string
  group_id: string
  name: string
  unit: string
  is_active: boolean
  created_at?: string
  created_by?: string | null
  updated_at?: string
  updated_by?: string | null
  deleted_at?: string | null
  deleted_by?: string | null
}

export type CreateItemRequest = Omit<Item, 'id'>
export type UpdateItemRequest = Partial<Item>
