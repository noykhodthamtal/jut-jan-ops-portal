import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/reactQuery'
import { setStoreId } from '../lib/supabase'
import { fetchStoreIdForUser } from '../services/storeContext'
import { useCurrentStoreId } from './useCurrentStoreId'
import { useSession } from './useSession'

export function useStoreContext() {
  const { userId } = useSession()
  const storeId = useCurrentStoreId()

  const storeContextQuery = useQuery({
    queryKey: queryKeys.storeIdForUser(userId),
    queryFn: () => fetchStoreIdForUser(userId),
    enabled: Boolean(userId) && !storeId,
  })

  useEffect(() => {
    if (storeId || !storeContextQuery.data) return
    setStoreId(storeContextQuery.data)
  }, [storeContextQuery.data, storeId])
}
