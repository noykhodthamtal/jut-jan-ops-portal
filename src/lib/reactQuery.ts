import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const queryKeys = {
  dailySummary: (storeId: string, date: string) => ['daily-summary', storeId, date] as const,
  documents: (
    storeId: string,
    filters: {
      fromDate?: string
      toDate?: string
      group?: string
      status?: string
    }
  ) => ['documents', storeId, filters.fromDate ?? '', filters.toDate ?? '', filters.group ?? '', filters.status ?? ''] as const,
  expenseCategories: (storeId: string) => ['expense-categories', storeId] as const,
  itemGroups: (storeId: string) => ['item-groups', storeId] as const,
  items: (storeId: string) => ['items', storeId] as const,
  merchantInfo: (userId: string) => ['merchant-info', userId] as const,
  purchaseOrderRules: (storeId: string) => ['purchase-order-rules', storeId] as const,
  storeIdForUser: (userId: string) => ['store-id-for-user', userId] as const,
  storeInfo: (storeId: string) => ['store-info', storeId] as const,
  storeMembers: (storeId: string) => ['store-members', storeId] as const,
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return error ? String(error) : null
}
