import { supabaseGet, supabasePatch, supabasePost } from '../lib/supabase'
import type { CreateExpenseCategoryRequest, ExpenseCategory, UpdateExpenseCategoryRequest } from '../models'

export async function fetchExpenseCategories(storeId: string) {
  return supabaseGet<ExpenseCategory[]>('/expense_categories', {
    store_id: `eq.${storeId}`,
    order: 'name.asc',
  })
}

export async function createExpenseCategory(payload: CreateExpenseCategoryRequest) {
  return supabasePost<ExpenseCategory[]>('/expense_categories', payload)
}

export async function updateExpenseCategory(id: string, payload: UpdateExpenseCategoryRequest) {
  return supabasePatch<ExpenseCategory[]>(`/expense_categories?id=eq.${id}`, payload)
}
