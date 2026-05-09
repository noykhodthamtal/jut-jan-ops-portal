import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import { fetchDailySummary } from '../services'
import { useCurrentStoreId } from './useCurrentStoreId'

export function useDailySummary() {
  const storeId = useCurrentStoreId()
  const today = new Date().toISOString().slice(0, 10)

  const summaryQuery = useQuery({
    queryKey: queryKeys.dailySummary(storeId, today),
    queryFn: () => fetchDailySummary(storeId, today),
    enabled: Boolean(storeId),
  })

  const summary = useMemo(() => {
    const data = summaryQuery.data
    return {
      income: data?.income ?? null,
      expense: data?.expense ?? null,
    }
  }, [summaryQuery.data])

  const summaryCards = useMemo(() => {
    const incomeTotal = (summary.income as Record<string, number | string> | null)?.total_amount ?? 0
    const expenseTotal = (summary.expense as Record<string, number | string> | null)?.total_amount ?? 0

    const incomeValue = incomeTotal ? `₭${Number(incomeTotal).toLocaleString()}` : '₭0'
    const expenseValue = expenseTotal ? `₭${Number(expenseTotal).toLocaleString()}` : '₭0'
    const grossProfit = `₭${(Number(incomeTotal) - Number(expenseTotal)).toLocaleString()}`

    return [
      { label: 'ລາຍຮັບປະຈໍາວັນ', value: incomeValue, delta: 'ສົດ' },
      { label: 'ຄ່າໃຊ້ຈ່າຍປະຈໍາວັນ', value: expenseValue, delta: 'ສົດ' },
      { label: 'ກໍາໄລຂັ້ນຕົ້ນ', value: grossProfit, delta: 'ສົດ' },
    ]
  }, [summary])

  return {
    loading: summaryQuery.isLoading || summaryQuery.isFetching,
    error: getErrorMessage(summaryQuery.error),
    summary,
    summaryCards,
  }
}
