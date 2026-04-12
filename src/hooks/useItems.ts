import { useEffect, useMemo, useState } from 'react'
import { createItem, fetchItemGroups, fetchItems, softDeleteItem, updateItem } from '../services'
import { getStoreId } from '../lib/supabase'
import type { Item, ItemGroup, UpdateItemRequest } from '../models'

type ItemFormState = {
  name: string
  unit: string
  group_id: string
  is_active: boolean
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [groups, setGroups] = useState<ItemGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [formState, setFormState] = useState<ItemFormState>({
    name: '',
    unit: '',
    group_id: '',
    is_active: true,
  })

  const loadItems = () => {
    const storeId = getStoreId()
    if (!storeId) return
    setLoading(true)
    Promise.all([fetchItems(storeId), fetchItemGroups(storeId)])
      .then(([itemsData, groupData]) => {
        setItems(itemsData)
        setGroups(groupData)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
  }, [])


  const rows = useMemo(() => {
    if (!query.trim()) return items
    const needle = query.trim().toLowerCase()
    return items.filter((item) =>
      [item.name, item.unit, item.group_id].some((value) =>
        value.toLowerCase().includes(needle)
      )
    )
  }, [items, query])

  const handleCreate = async () => {
    const storeId = getStoreId()
    if (!storeId) {
      setError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }
    if (!formState.group_id) {
      setError('ກະລຸນາເລືອກກຸ່ມ')
      return
    }
    setLoading(true)
    try {
      const payload = { ...formState, store_id: storeId }
      const created = await createItem(payload)
      setItems((prev) => [...created, ...prev])
      setShowForm(false)
      setFormState({ name: '', unit: '', group_id: '', is_active: true })
      setError(null)
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (itemId: string, payload: UpdateItemRequest) => {
    setLoading(true)
    try {
      await updateItem(itemId, payload)
      setItems((prev) => prev.map((row) => (row.id === itemId ? { ...row, ...payload } : row)))
      setError(null)
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSoftDelete = async (item: Item) => {
    const deletedAt = new Date().toISOString()
    setLoading(true)
    try {
      await softDeleteItem(item.id, deletedAt, item.store_id)
      setItems((prev) => prev.filter((row) => row.id !== item.id))
      setError(null)
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    rows,
    groups,
    loading,
    error,
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
