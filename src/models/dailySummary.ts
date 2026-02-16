export type DailySummaryRow = {
  store_id: string | null
  doc_date: string | null
  groups: Record<string, unknown> | null
  income: Record<string, unknown> | null
  expense: Record<string, unknown> | null
}
