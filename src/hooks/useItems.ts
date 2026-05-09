import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import { createItem, fetchItemGroups, fetchItems, softDeleteItem, updateItem } from '../services'
import type { Item, UpdateItemRequest } from '../models'
import { useCurrentStoreId } from './useCurrentStoreId'

type ItemFormState = {
  name: string
  unit: string
  group_id: string
  is_active: boolean
}

export function useItems() {
  const storeId = useCurrentStoreId()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [formState, setFormState] = useState<ItemFormState>({
    name: '',
    unit: '',
    group_id: '',
    is_active: true,
  })

  const itemsQuery = useQuery({
    queryKey: queryKeys.items(storeId),
    queryFn: () => fetchItems(storeId),
    enabled: Boolean(storeId),
  })

  const groupsQuery = useQuery({
    queryKey: queryKeys.itemGroups(storeId),
    queryFn: () => fetchItemGroups(storeId),
    enabled: Boolean(storeId),
  })

  const createMutation = useMutation({
    mutationFn: createItem,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateItemRequest }) =>
      updateItem(id, payload),
  })

  const deleteMutation = useMutation({
    mutationFn: softDeleteItem,
  })

  const items = useMemo(() => itemsQuery.data ?? [], [itemsQuery.data])
  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])

  const rows = useMemo(() => {
    if (!query.trim()) return items
    const needle = query.trim().toLowerCase()
    return items.filter((item) =>
      [item.name, item.unit, item.group_id].some((value) =>
        value.toLowerCase().includes(needle)
      )
    )
  }, [items, query])

  const refreshItems = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.items(storeId) })
  }

  const handleCreate = async () => {
    if (!storeId) {
      setLocalError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }
    if (!formState.group_id) {
      setLocalError('ກະລຸນາເລືອກກຸ່ມ')
      return
    }

    try {
      await createMutation.mutateAsync({ ...formState, store_id: storeId })
      await refreshItems()
      setShowForm(false)
      setFormState({ name: '', unit: '', group_id: '', is_active: true })
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleUpdate = async (itemId: string, payload: UpdateItemRequest) => {
    try {
      await updateMutation.mutateAsync({ id: itemId, payload })
      await refreshItems()
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleSoftDelete = async (item: Item) => {
    try {
      await deleteMutation.mutateAsync(item.id)
      await refreshItems()
      setLocalError(null)
      setSuccess(true)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  return {
    rows,
    groups,
    loading:
      itemsQuery.isLoading ||
      itemsQuery.isFetching ||
      groupsQuery.isLoading ||
      groupsQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      localError ??
      getErrorMessage(
        itemsQuery.error ??
          groupsQuery.error ??
          createMutation.error ??
          updateMutation.error ??
          deleteMutation.error
      ),
    success,
    setSuccess,
    showForm,
    query,
    formState,
    setQuery,
    setFormState,
    setShowForm,
    handleCreate,
    handleUpdate,
    handleSoftDelete,
  }
}
