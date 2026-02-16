export type StoreMember = {
  id: string
  store_id: string
  user_id: string
  role: string
  status: string
  created_at?: string
}

export type UpdateStoreMemberRequest = Partial<StoreMember>
