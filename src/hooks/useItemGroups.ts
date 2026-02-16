import { useEffect, useMemo, useState } from 'react'
import { createItemGroup, fetchItemGroups, softDeleteItemGroup, updateItemGroup } from '../services'
import { getStoreId } from '../lib/supabase'
import type { ItemGroup, UpdateItemGroupRequest } from '../models'

type ItemGroupFormState = {
  code: string
  name: string
  sort_order: number
  color: string
  is_active: boolean
}

export function useItemGroups() {
  const [groups, setGroups] = useState<ItemGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [formState, setFormState] = useState<ItemGroupFormState>({
    code: '',
    name: '',
    sort_order: 1,
    color: '',
    is_active: true,
  })

  const loadGroups = () => {
    const storeId = getStoreId()
    if (!storeId) return
    setLoading(true)
    fetchItemGroups(storeId)
      .then((data) => {
        setGroups(data)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const fallbackGroups = useMemo(
    () => [
      { id: 'A', store_id: '', code: 'A', name: 'ກຸ່ມ A', sort_order: 1, color: null, is_active: true },
      { id: 'B', store_id: '', code: 'B', name: 'ກຸ່ມ B', sort_order: 2, color: null, is_active: true },
      { id: 'C', store_id: '', code: 'C', name: 'ກຸ່ມ C', sort_order: 3, color: null, is_active: false },
    ],
    []
  )

  const rows = useMemo(() => {
    const source = groups.length ? groups : fallbackGroups
    if (!query.trim()) return source
    const needle = query.trim().toLowerCase()
    return source.filter((group) =>
      [group.code, group.name].some((value) => value.toLowerCase().includes(needle))
    )
  }, [groups, fallbackGroups, query])

  const handleCreate = async () => {
    const storeId = getStoreId()
    if (!storeId) {
      setError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }
    if (!formState.code || !formState.name) {
      setError('ກະລຸນາກໍານົດລະຫັດ ແລະ ຊື່ກຸ່ມ')
      return
    }
    setLoading(true)
    try {
      const payload = {
        store_id: storeId,
        code: formState.code,
        name: formState.name,
        sort_order: formState.sort_order,
        color: formState.color || null,
        is_active: formState.is_active,
      }
      const created = await createItemGroup(payload)
      setGroups((prev) => [...created, ...prev])
      setShowForm(false)
      setFormState({ code: '', name: '', sort_order: 1, color: '', is_active: true })
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (group: ItemGroup) => {
    setLoading(true)
    try {
      await updateItemGroup(group.id, { is_active: !group.is_active })
      setGroups((prev) =>
        prev.map((row) => (row.id === group.id ? { ...row, is_active: !row.is_active } : row))
      )
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (groupId: string, payload: UpdateItemGroupRequest) => {
    setLoading(true)
    try {
      await updateItemGroup(groupId, payload)
      setGroups((prev) =>
        prev.map((row) => (row.id === groupId ? { ...row, ...payload } : row))
      )
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSoftDelete = async (group: ItemGroup) => {
    const deletedAt = new Date().toISOString()
    setLoading(true)
    try {
      await softDeleteItemGroup(group.id, deletedAt)
      setGroups((prev) => prev.filter((row) => row.id !== group.id))
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    groups,
    rows,
    loading,
    error,
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
