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
  const [success, setSuccess] = useState(false)
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


  const rows = useMemo(() => {
    if (!query.trim()) return groups
    const needle = query.trim().toLowerCase()
    return groups.filter((group) =>
      [group.code, group.name].some((value) => value.toLowerCase().includes(needle))
    )
  }, [groups, query])

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
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (group: ItemGroup) => {
    setLoading(true)
    try {
      await updateItemGroup(group.id, { is_active: !group.is_active, store_id: group.store_id })
      setGroups((prev) =>
        prev.map((row) => (row.id === group.id ? { ...row, is_active: !row.is_active } : row))
      )
      setError(null)
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (groupId: string, payload: UpdateItemGroupRequest) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return
    setLoading(true)
    try {
      await updateItemGroup(groupId, { ...payload, store_id: group.store_id })
      setGroups((prev) =>
        prev.map((row) => (row.id === groupId ? { ...row, ...payload } : row))
      )
      setError(null)
      setSuccess(true)
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
      await softDeleteItemGroup(group.id, deletedAt, group.store_id)
      setGroups((prev) => prev.filter((row) => row.id !== group.id))
      setError(null)
      setSuccess(true)
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
