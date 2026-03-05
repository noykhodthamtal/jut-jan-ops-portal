import { useEffect } from 'react'
import { fetchStoreIdForUser } from '../services/storeContext'
import { getStoreId, setStoreId } from '../lib/supabase'
import { useSession } from './useSession'

export function useStoreContext() {
  const { userId } = useSession()

  useEffect(() => {
    if (!userId) return

    const currentStoreId = getStoreId()

    // If we already have a storeId cached, dispatch the event immediately
    // so useStoreInfo can pick it up and fetch the store name
    if (currentStoreId) {
      globalThis.dispatchEvent(new Event('jutjanops-store'))
      return
    }

    // Otherwise fetch from the API
    fetchStoreIdForUser(userId)
      .then((storeId) => {
        if (storeId) setStoreId(storeId) // setStoreId already dispatches the event
      })
      .catch(() => null)
  }, [userId])
}
