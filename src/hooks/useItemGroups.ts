import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import { createItemGroup, fetchItemGroups, softDeleteItemGroup, updateItemGroup } from '../services'
import type { ItemGroup, UpdateItemGroupRequest } from '../models'
import { useCurrentStoreId } from './useCurrentStoreId'

type ItemGroupFormState = {
  code: string
  name: string
  sort_order: number
  color: string
  is_active: boolean
}

export function useItemGroups() {
  const storeId = useCurrentStoreId()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [formState, setFormState] = useState<ItemGroupFormState>({
    code: '',
    name: '',
    sort_order: 1,
    color: '',
    is_active: true,
  })

  const groupsQuery = useQuery({
    queryKey: queryKeys.itemGroups(storeId),
    queryFn: () => fetchItemGroups(storeId),
    enabled: Boolean(storeId),
  })

  const createMutation = useMutation({
    mutationFn: createItemGroup,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateItemGroupRequest }) =>
      updateItemGroup(id, payload),
  })

  const deleteMutation = useMutation({
    mutationFn: softDeleteItemGroup,
  })

  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])

  const rows = useMemo(() => {
    if (!query.trim()) return groups
    const needle = query.trim().toLowerCase()
    return groups.filter((group) =>
      [group.code, group.name].some((value) => value.toLowerCase().includes(needle))
    )
  }, [groups, query])

  const refreshGroups = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.itemGroups(storeId) })
  }

  const handleCreate = async () => {
    if (!storeId) {
      setLocalError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }
    if (!formState.code || !formState.name) {
      setLocalError('ກະລຸນາກໍານົດລະຫັດ ແລະ ຊື່ກຸ່ມ')
      return
    }

    try {
      await createMutation.mutateAsync({
        store_id: storeId,
        code: formState.code,
        name: formState.name,
        sort_order: formState.sort_order,
        color: formState.color || null,
        is_active: formState.is_active,
      })
      await refreshGroups()
      setShowForm(false)
      setFormState({ code: '', name: '', sort_order: 1, color: '', is_active: true })
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleToggleActive = async (group: ItemGroup) => {
    try {
      await updateMutation.mutateAsync({
        id: group.id,
        payload: { is_active: !group.is_active, store_id: group.store_id },
      })
      await refreshGroups()
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleUpdate = async (groupId: string, payload: UpdateItemGroupRequest) => {
    const group = groups.find((row) => row.id === groupId)
    if (!group) return

    try {
      await updateMutation.mutateAsync({
        id: groupId,
        payload: { ...payload, store_id: group.store_id },
      })
      await refreshGroups()
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleSoftDelete = async (group: ItemGroup) => {
    try {
      await deleteMutation.mutateAsync(group.id)
      await refreshGroups()
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  return {
    groups,
    rows,
    loading:
      groupsQuery.isLoading ||
      groupsQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      localError ??
      getErrorMessage(groupsQuery.error ?? createMutation.error ?? updateMutation.error ?? deleteMutation.error),
    success,
    setSuccess,
    showForm,
    formState,
    query,
    setQuery,
    setFormState,
    setShowForm,
    handleCreate,
    handleToggleActive,
    handleUpdate,
    handleSoftDelete,
  }
}
