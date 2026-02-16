import { supabaseGet, supabasePatch, supabasePost } from '../lib/supabase'
import type { CreateItemGroupRequest, ItemGroup, UpdateItemGroupRequest } from '../models'

type RpcStoreGroupsResponse = {
  storeId: string
  groups: Array<{
    id: string
    code: string
    name: string
    sortOrder: number
    isActive: boolean
  }>
}

export async function fetchItemGroups(storeId: string) {
  try {
    const payload = { p_store_id: storeId }
    const raw = await supabasePost<RpcStoreGroupsResponse | RpcStoreGroupsResponse[]>(
      '/rpc/rpc_store_groups',
      payload
    )
    const result = Array.isArray(raw) ? raw[0] : raw
    const groups = result?.groups ?? []
    return groups.map((group, index) => ({
      id: group.id,
      store_id: result.storeId ?? storeId,
      code: group.code,
      name: group.name,
      sort_order: group.sortOrder ?? index + 1,
      color: null,
      is_active: group.isActive,
    }))
  } catch (err) {
    return supabaseGet<ItemGroup[]>('/item_groups', {
      store_id: `eq.${storeId}`,
      deleted_at: 'is.null',
      order: 'sort_order.asc,code.asc',
    })
  }
}

export async function createItemGroup(payload: CreateItemGroupRequest) {
  return supabasePost<ItemGroup[]>('/item_groups', payload)
}

export async function updateItemGroup(id: string, payload: UpdateItemGroupRequest) {
  return supabasePatch<ItemGroup[]>(`/item_groups?id=eq.${id}`, payload)
}

export async function softDeleteItemGroup(id: string, deletedAt: string) {
  return supabasePatch<ItemGroup[]>(`/item_groups?id=eq.${id}`, {
    deleted_at: deletedAt,
  })
}
