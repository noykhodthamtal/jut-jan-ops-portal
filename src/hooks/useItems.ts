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

  const fallbackItems = useMemo(
    () => [
      {
        id: 'mock-1',
        name: 'Chicken Breast',
        unit: 'kg',
        group_id: '',
        is_active: true,
        store_id: '',
      },
      { id: 'mock-2', name: 'Palm Oil', unit: 'ltr', group_id: '', is_active: true, store_id: '' },
      {
        id: 'mock-3',
        name: 'Paper Cup',
        unit: 'pcs',
        group_id: '',
        is_active: false,
        store_id: '',
      },
    ],
    []
  )

  const rows = useMemo(() => {
    const source = items.length ? items : fallbackItems
    if (!query.trim()) return source
    const needle = query.trim().toLowerCase()
    return source.filter((item) =>
      [item.name, item.unit, item.group_id].some((value) =>
        value.toLowerCase().includes(needle)
      )
    )
  }, [items, fallbackItems, query])

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
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSoftDelete = async (itemId: string) => {
    const deletedAt = new Date().toISOString()
    setLoading(true)
    try {
      await softDeleteItem(itemId, deletedAt)
      setItems((prev) => prev.filter((row) => row.id !== itemId))
      setError(null)
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
