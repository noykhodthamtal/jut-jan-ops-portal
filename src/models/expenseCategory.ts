export type ExpenseCategory = {
  id: string
  store_id: string
  name: string
  is_fixed: boolean
  is_active: boolean
}

export type CreateExpenseCategoryRequest = Omit<ExpenseCategory, 'id'>
export type UpdateExpenseCategoryRequest = Partial<ExpenseCategory>
