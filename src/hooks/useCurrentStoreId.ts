import { useSyncExternalStore } from 'react'
import { getStoreId } from '../lib/supabase'

function subscribe(callback: () => void) {
  globalThis.addEventListener('jutjanops-store', callback)
  return () => globalThis.removeEventListener('jutjanops-store', callback)
}

export function useCurrentStoreId() {
  return useSyncExternalStore(subscribe, getStoreId, getStoreId)
}
