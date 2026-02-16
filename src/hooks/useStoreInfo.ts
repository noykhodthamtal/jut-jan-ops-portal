import { useEffect, useState } from 'react'
import { supabaseGet } from '../lib/supabase'
import { getStoreId } from '../lib/supabase'

export function useStoreInfo() {
  const [storeId, setStoreId] = useState<string>(() => getStoreId())
  const [storeName, setStoreName] = useState<string>('')

  useEffect(() => {
    const onStoreChange = () => {
      setStoreId(getStoreId())
    }
    globalThis.addEventListener('jutjanops-store', onStoreChange as EventListener)
    return () =>
      globalThis.removeEventListener('jutjanops-store', onStoreChange as EventListener)
  }, [])

  useEffect(() => {
    if (!storeId) {
      setStoreName('')
      return
    }
    supabaseGet<{ name: string }[]>('/stores', {
      id: `eq.${storeId}`,
      select: 'name',
      limit: '1',
    })
      .then((rows) => {
        setStoreName(rows[0]?.name ?? '')
      })
      .catch(() => setStoreName(''))
  }, [storeId])

  return { storeId, storeName }
}
