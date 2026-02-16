import { useEffect, useMemo, useState } from 'react'
import { fetchDailySummary } from '../services'
import { getStoreId } from '../lib/supabase'

export function useDailySummary() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const storeId = getStoreId()
    if (!storeId) return

    const today = new Date().toISOString().slice(0, 10)
    setLoading(true)
    fetchDailySummary(storeId, today)
      .then((data) => {
        setSummary({
          income: data?.income ?? null,
          expense: data?.expense ?? null,
        })
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const summaryCards = useMemo(() => {
    if (!summary) return null

    const incomeTotal =
      (summary.income as Record<string, number | string>)?.total_amount ?? null
    const expenseTotal =
      (summary.expense as Record<string, number | string>)?.total_amount ?? null

    const incomeValue = incomeTotal ? `฿${Number(incomeTotal).toLocaleString()}` : '—'
    const expenseValue = expenseTotal ? `฿${Number(expenseTotal).toLocaleString()}` : '—'
    const grossProfit =
      incomeTotal && expenseTotal
        ? `฿${(Number(incomeTotal) - Number(expenseTotal)).toLocaleString()}`
        : '—'

    return [
      { label: 'ລາຍຮັບປະຈໍາວັນ', value: incomeValue, delta: 'ສົດ' },
      { label: 'ຄ່າໃຊ້ຈ່າຍປະຈໍາວັນ', value: expenseValue, delta: 'ສົດ' },
      { label: 'ກໍາໄລຂັ້ນຕົ້ນ', value: grossProfit, delta: 'ສົດ' },
    ]
  }, [summary])

  return {
    loading,
    error,
    summary,
    summaryCards,
  }
}
