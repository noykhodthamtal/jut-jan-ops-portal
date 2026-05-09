import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import { createExpenseCategory, fetchExpenseCategories, updateExpenseCategory } from '../services'
import type { ExpenseCategory } from '../models'
import { useCurrentStoreId } from './useCurrentStoreId'

const fallbackCategories: ExpenseCategory[] = [
  { id: '1', store_id: '', name: 'ຄ່າເຊົ່າ', is_fixed: true, is_active: true },
  { id: '2', store_id: '', name: 'ຄ່າທໍາຄວາມສະອາດ', is_fixed: false, is_active: true },
  { id: '3', store_id: '', name: 'ອື່ນໆ', is_fixed: false, is_active: false },
]

export function useExpenseCategories() {
  const storeId = useCurrentStoreId()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    name: '',
    is_fixed: true,
    is_active: true,
  })

  const categoriesQuery = useQuery({
    queryKey: queryKeys.expenseCategories(storeId),
    queryFn: () => fetchExpenseCategories(storeId),
    enabled: Boolean(storeId),
  })

  const createMutation = useMutation({
    mutationFn: createExpenseCategory,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ExpenseCategory> }) =>
      updateExpenseCategory(id, payload),
  })

  const rows = useMemo(() => {
    const categories = categoriesQuery.data ?? []
    return categories.length ? categories : fallbackCategories
  }, [categoriesQuery.data])

  const handleCreate = async () => {
    if (!storeId) {
      setLocalError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }

    try {
      await createMutation.mutateAsync({
        store_id: storeId,
        name: formState.name,
        is_fixed: formState.is_fixed,
        is_active: formState.is_active,
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.expenseCategories(storeId) })
      setShowForm(false)
      setFormState({ name: '', is_fixed: true, is_active: true })
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleToggleActive = async (category: ExpenseCategory) => {
    try {
      await updateMutation.mutateAsync({
        id: category.id,
        payload: { is_active: !category.is_active },
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.expenseCategories(storeId) })
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  return {
    rows,
    loading:
      categoriesQuery.isLoading ||
      categoriesQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending,
    error:
      localError ??
      getErrorMessage(categoriesQuery.error ?? createMutation.error ?? updateMutation.error),
    showForm,
    setShowForm,
    formState,
    setFormState,
    handleCreate,
    handleToggleActive,
  }
}
