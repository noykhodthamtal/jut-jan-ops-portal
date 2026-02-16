export type ItemGroup = {
  id: string
  store_id: string
  code: string
  name: string
  sort_order: number
  color: string | null
  is_active: boolean
  created_at?: string
  created_by?: string | null
  updated_at?: string
  updated_by?: string | null
  deleted_at?: string | null
  deleted_by?: string | null
}

export type CreateItemGroupRequest = Pick<
  ItemGroup,
  'store_id' | 'code' | 'name' | 'sort_order' | 'color' | 'is_active'
>

export type UpdateItemGroupRequest = Partial<
  Pick<ItemGroup, 'code' | 'name' | 'sort_order' | 'color' | 'is_active' | 'deleted_at' | 'deleted_by'>
>
