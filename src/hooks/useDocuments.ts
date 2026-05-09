import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import { fetchDocuments } from '../services'
import type { DocumentListItem } from '../models'
import { useCurrentStoreId } from './useCurrentStoreId'

export type DocumentFilters = {
  fromDate?: string
  toDate?: string
  group?: string
  status?: string
}

export function useDocuments(filters?: DocumentFilters) {
  const storeId = useCurrentStoreId()
  const documentFilters = filters ?? {}

  const documentsQuery = useQuery({
    queryKey: queryKeys.documents(storeId, documentFilters),
    queryFn: () =>
      fetchDocuments({
        storeId,
        fromDate: documentFilters.fromDate,
        toDate: documentFilters.toDate,
        group: documentFilters.group,
        status: documentFilters.status,
      }),
    enabled: Boolean(storeId),
  })

  const rows = useMemo<DocumentListItem[]>(
    () => documentsQuery.data ?? [],
    [documentsQuery.data]
  )

  return {
    rows,
    loading: documentsQuery.isLoading || documentsQuery.isFetching,
    error: getErrorMessage(documentsQuery.error),
  }
}
