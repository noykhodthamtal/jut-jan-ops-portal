import { useEffect, useMemo, useState } from 'react'
import {
  createPurchaseOrderRule,
  fetchItemGroups,
  fetchPurchaseOrderRules,
  softDeletePurchaseOrderRule,
  updatePurchaseOrderRule,
} from '../services'
import { getStoreId } from '../lib/supabase'
import type { ItemGroup, PurchaseOrderRule, UpdatePurchaseOrderRuleRequest } from '../models'

type RuleFormState = {
  group_id: string
  threshold_percent: number
}

export function usePurchaseOrderRules() {
  const [rules, setRules] = useState<PurchaseOrderRule[]>([])
  const [groups, setGroups] = useState<ItemGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState<RuleFormState>({
    group_id: '',
    threshold_percent: 10,
  })

  const loadData = () => {
    const storeId = getStoreId()
    if (!storeId) return
    setLoading(true)
    Promise.all([fetchPurchaseOrderRules(storeId), fetchItemGroups(storeId)])
      .then(([rulesData, groupsData]) => {
        setRules(rulesData)
        setGroups(groupsData)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const groupMap = useMemo(
    () => new Map(groups.map((group) => [group.id, group])),
    [groups]
  )

  const handleCreate = async () => {
    const storeId = getStoreId()
    if (!storeId) {
      setError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }
    if (!formState.group_id) {
      setError('ກະລຸນາເລືອກກຸ່ມວັດຖຸດິບ')
      return
    }
    setLoading(true)
    try {
      const created = await createPurchaseOrderRule({
        store_id: storeId,
        group_id: formState.group_id,
        threshold_percent: formState.threshold_percent,
      })
      setRules((prev) => [...created, ...prev])
      setShowForm(false)
      setFormState({ group_id: '', threshold_percent: 10 })
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (ruleId: string, payload: UpdatePurchaseOrderRuleRequest) => {
    setLoading(true)
    try {
      await updatePurchaseOrderRule(ruleId, payload)
      setRules((prev) =>
        prev.map((row) => (row.id === ruleId ? { ...row, ...payload } : row))
      )
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSoftDelete = async (rule: PurchaseOrderRule) => {
    const deletedAt = new Date().toISOString()
    setLoading(true)
    try {
      await softDeletePurchaseOrderRule(rule.id, deletedAt)
      setRules((prev) => prev.filter((row) => row.id !== rule.id))
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    rules,
    groups,
    groupMap,
    loading,
    error,
    showForm,
    formState,
    setShowForm,
    setFormState,
    handleCreate,
    handleUpdate,
    handleSoftDelete,
  }
}
