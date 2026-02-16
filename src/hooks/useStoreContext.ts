import { useEffect } from 'react'
import { fetchStoreIdForUser } from '../services/storeContext'
import { getStoreId, setStoreId } from '../lib/supabase'
import { useSession } from './useSession'

export function useStoreContext() {
  const { userId } = useSession()

  useEffect(() => {
    const currentStoreId = getStoreId()
    if (!userId || currentStoreId) return

    fetchStoreIdForUser(userId)
      .then((storeId) => {
        if (storeId) setStoreId(storeId)
      })
      .catch(() => null)
  }, [userId])
}
