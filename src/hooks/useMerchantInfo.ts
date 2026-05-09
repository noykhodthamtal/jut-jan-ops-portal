import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/reactQuery'
import { supabaseGet } from '../lib/supabase'
import { fetchMerchantIdForUser } from '../services/merchantContext'
import { useSession } from './useSession'

export function useMerchantInfo() {
  const { userId } = useSession()

  const merchantInfoQuery = useQuery({
    queryKey: queryKeys.merchantInfo(userId),
    queryFn: async () => {
      const merchantId = await fetchMerchantIdForUser(userId)
      if (!merchantId) {
        return ''
      }

      const rows = await supabaseGet<{ name: string }[]>('/merchants', {
        id: `eq.${merchantId}`,
        is_active: 'eq.true',
        deleted_at: 'is.null',
        select: 'name',
        limit: '1',
      })

      return rows[0]?.name ?? ''
    },
    enabled: Boolean(userId),
  })

  return { merchantName: merchantInfoQuery.data ?? '' }
}
