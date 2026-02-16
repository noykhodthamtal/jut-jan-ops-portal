import { useEffect, useMemo, useState } from 'react'
import { createExpenseCategory, fetchExpenseCategories, updateExpenseCategory } from '../services'
import { getStoreId } from '../lib/supabase'
import type { ExpenseCategory } from '../models'

const fallbackCategories: ExpenseCategory[] = [
  { id: '1', store_id: '', name: 'ຄ່າເຊົ່າ', is_fixed: true, is_active: true },
  { id: '2', store_id: '', name: 'ຄ່າທໍາຄວາມສະອາດ', is_fixed: false, is_active: true },
  { id: '3', store_id: '', name: 'ອື່ນໆ', is_fixed: false, is_active: false },
]

export function useExpenseCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    is_fixed: true,
    is_active: true,
  })

  const loadCategories = () => {
    const storeId = getStoreId()
    if (!storeId) return

    setLoading(true)
    fetchExpenseCategories(storeId)
      .then((data) => {
        setCategories(data)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const rows = useMemo(() => (categories.length ? categories : fallbackCategories), [categories])

  const handleCreate = async () => {
    const storeId = getStoreId()
    if (!storeId) {
      setError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }

    setLoading(true)
    try {
      const created = await createExpenseCategory({
        store_id: storeId,
        name: formState.name,
        is_fixed: formState.is_fixed,
        is_active: formState.is_active,
      })
      setCategories((prev) => [...created, ...prev])
      setShowForm(false)
      setFormState({ name: '', is_fixed: true, is_active: true })
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (category: ExpenseCategory) => {
    setLoading(true)
    try {
      const updated = await updateExpenseCategory(category.id, {
        is_active: !category.is_active,
      })
      if (updated[0]) {
        setCategories((prev) => prev.map((c) => (c.id === category.id ? updated[0] : c)))
      }
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    rows,
    loading,
    error,
    showForm,
    setShowForm,
    formState,
    setFormState,
    handleCreate,
    handleToggleActive,
  }
}
