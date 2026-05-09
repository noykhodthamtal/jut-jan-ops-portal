import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/reactQuery'
import { supabaseGet } from '../lib/supabase'
import { useCurrentStoreId } from './useCurrentStoreId'

export function useStoreInfo() {
  const storeId = useCurrentStoreId()

  const storeInfoQuery = useQuery({
    queryKey: queryKeys.storeInfo(storeId),
    queryFn: async () => {
      const rows = await supabaseGet<{ name: string }[]>('/stores', {
        id: `eq.${storeId}`,
        select: 'name',
        limit: '1',
      })
      return rows[0]?.name ?? ''
    },
    enabled: Boolean(storeId),
  })

  return {
    storeId,
    storeName: storeInfoQuery.data ?? '',
  }
}
