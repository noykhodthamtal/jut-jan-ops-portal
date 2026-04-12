import { useEffect, useMemo, useState } from 'react'
import { fetchDocuments } from '../services'
import { getStoreId } from '../lib/supabase'
import type { DocumentListItem } from '../models'


export type DocumentFilters = {
  fromDate?: string
  toDate?: string
  group?: string
  status?: string
}

export function useDocuments(filters?: DocumentFilters) {
  const [documents, setDocuments] = useState<DocumentListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storeId = getStoreId()
    if (!storeId) return

    setLoading(true)
    fetchDocuments({
      storeId,
      fromDate: filters?.fromDate,
      toDate: filters?.toDate,
      group: filters?.group,
      status: filters?.status,
    })
      .then((data) => {
        setDocuments(data)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [filters?.fromDate, filters?.toDate, filters?.group, filters?.status])

  const rows = useMemo(() => documents, [documents])

  return {
    rows,
    loading,
    error,
  }
}
