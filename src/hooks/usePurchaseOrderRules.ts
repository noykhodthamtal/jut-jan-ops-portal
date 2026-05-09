import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import {
  createPurchaseOrderRule,
  fetchItemGroups,
  fetchPurchaseOrderRules,
  softDeletePurchaseOrderRule,
  updatePurchaseOrderRule,
} from '../services'
import type { PurchaseOrderRule, UpdatePurchaseOrderRuleRequest } from '../models'
import { useCurrentStoreId } from './useCurrentStoreId'

type RuleFormState = {
  group_id: string
  threshold_percent: number
}

export function usePurchaseOrderRules() {
  const storeId = useCurrentStoreId()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [formState, setFormState] = useState<RuleFormState>({
    group_id: '',
    threshold_percent: 10,
  })

  const rulesQuery = useQuery({
    queryKey: queryKeys.purchaseOrderRules(storeId),
    queryFn: () => fetchPurchaseOrderRules(storeId),
    enabled: Boolean(storeId),
  })

  const groupsQuery = useQuery({
    queryKey: queryKeys.itemGroups(storeId),
    queryFn: () => fetchItemGroups(storeId),
    enabled: Boolean(storeId),
  })

  const createMutation = useMutation({
    mutationFn: createPurchaseOrderRule,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePurchaseOrderRuleRequest }) =>
      updatePurchaseOrderRule(id, payload),
  })

  const deleteMutation = useMutation({
    mutationFn: softDeletePurchaseOrderRule,
  })

  const rules = useMemo(() => rulesQuery.data ?? [], [rulesQuery.data])
  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])

  const groupMap = useMemo(
    () => new Map(groups.map((group) => [group.id, group])),
    [groups]
  )

  const refreshRules = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderRules(storeId) })
  }

  const handleCreate = async () => {
    if (!storeId) {
      setLocalError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }
    if (!formState.group_id) {
      setLocalError('ກະລຸນາເລືອກກຸ່ມວັດຖຸດິບ')
      return
    }

    try {
      await createMutation.mutateAsync({
        store_id: storeId,
        group_id: formState.group_id,
        threshold_percent: formState.threshold_percent,
      })
      await refreshRules()
      setShowForm(false)
      setFormState({ group_id: '', threshold_percent: 10 })
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleUpdate = async (ruleId: string, payload: UpdatePurchaseOrderRuleRequest) => {
    try {
      await updateMutation.mutateAsync({ id: ruleId, payload })
      await refreshRules()
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleSoftDelete = async (rule: PurchaseOrderRule) => {
    try {
      await deleteMutation.mutateAsync(rule.id)
      await refreshRules()
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  return {
    rules,
    groups,
    groupMap,
    loading:
      rulesQuery.isLoading ||
      rulesQuery.isFetching ||
      groupsQuery.isLoading ||
      groupsQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      localError ??
      getErrorMessage(
        rulesQuery.error ??
          groupsQuery.error ??
          createMutation.error ??
          updateMutation.error ??
          deleteMutation.error
      ),
    showForm,
    formState,
    setShowForm,
    setFormState,
    handleCreate,
    handleUpdate,
    handleSoftDelete,
  }
}
