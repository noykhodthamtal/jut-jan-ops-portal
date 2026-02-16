import { supabaseGet } from '../lib/supabase'
import type { DailyStockCount, DocumentListItem, PurchaseOrder, StockReceipt } from '../models'

type DocumentFilters = {
  storeId: string
  fromDate?: string
  toDate?: string
  group?: string
  status?: string
}

export async function fetchDocuments(filters: DocumentFilters) {
  const { storeId, fromDate, toDate, group, status } = filters

  const buildParams = (dateField: string) => {
    const params: Record<string, string> = {
      store_id: `eq.${storeId}`,
      order: `${dateField}.desc`,
    }
    if (fromDate) params[dateField] = `gte.${fromDate}`
    if (toDate) params[dateField] = `lte.${toDate}`
    if (group) params.group = `eq.${group}`
    if (status) params.status = `eq.${status}`
    return params
  }

  const [receipts, counts, pos] = await Promise.all([
    supabaseGet<StockReceipt[]>('/stock_receipts', buildParams('doc_date')),
    supabaseGet<DailyStockCount[]>('/daily_stock_counts', buildParams('doc_date')),
    supabaseGet<PurchaseOrder[]>('/purchase_orders', buildParams('order_date')),
  ])

  const merged: DocumentListItem[] = [
    ...receipts.map((doc) => ({
      id: doc.id,
      type: 'STOCK_RECEIPT' as const,
      doc_date: doc.doc_date,
      group: doc.group,
      status: doc.status,
      owner: null,
    })),
    ...counts.map((doc) => ({
      id: doc.id,
      type: 'DAILY_STOCK_COUNT' as const,
      doc_date: doc.doc_date,
      group: doc.group,
      status: doc.status,
      owner: null,
    })),
    ...pos.map((doc) => ({
      id: doc.id,
      type: 'PURCHASE_ORDER' as const,
      doc_date: doc.order_date,
      group: doc.group,
      status: doc.status,
      owner: null,
    })),
  ]

  return merged.sort((a, b) => (a.doc_date > b.doc_date ? -1 : 1))
}
