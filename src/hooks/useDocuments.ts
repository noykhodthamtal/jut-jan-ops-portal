import { useEffect, useMemo, useState } from 'react'
import { fetchDocuments } from '../services'
import { getStoreId } from '../lib/supabase'
import type { DocumentListItem } from '../models'

const fallbackDocuments: DocumentListItem[] = [
  {
    id: 'RC-1021',
    type: 'STOCK_RECEIPT',
    doc_date: '2025-01-10',
    group: 'A',
    status: 'ຮ່າງ',
    owner: 'Somchai',
  },
  {
    id: 'SC-2044',
    type: 'DAILY_STOCK_COUNT',
    doc_date: '2025-01-10',
    group: 'B',
    status: 'ລັອກ',
    owner: 'Nita',
  },
  {
    id: 'PO-3309',
    type: 'PURCHASE_ORDER',
    doc_date: '2025-01-09',
    group: 'C',
    status: 'ສົ່ງແລ້ວ',
    owner: 'ຜູ້ຈັດການ',
  },
]

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

  const rows = useMemo(() => (documents.length ? documents : fallbackDocuments), [documents])

  return {
    rows,
    loading,
    error,
  }
}
