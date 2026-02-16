export type DocumentStatus = 'DRAFT' | 'LOCKED' | 'POSTED' | 'SENT' | 'PRINTED' | 'CANCELED'

export type DocumentType = 'STOCK_RECEIPT' | 'DAILY_STOCK_COUNT' | 'PURCHASE_ORDER'

export type DocumentListItem = {
  id: string
  type: DocumentType
  doc_date: string
  group: string
  status: string
  owner: string | null
}

export type StockReceipt = {
  id: string
  store_id: string
  doc_date: string
  group: string
  status: string
  note: string | null
}

export type DailyStockCount = {
  id: string
  store_id: string
  doc_date: string
  group: string
  status: string
  note: string | null
}

export type PurchaseOrder = {
  id: string
  store_id: string
  order_date: string
  group: string
  status: string
  note: string | null
  total_amount: number | null
}
