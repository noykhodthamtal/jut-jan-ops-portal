import { useEffect, useState } from 'react'
import { supabaseGet } from '../lib/supabase'
import { fetchMerchantIdForUser } from '../services/merchantContext'
import { useSession } from './useSession'

export function useMerchantInfo() {
  const { userId } = useSession()
  const [merchantName, setMerchantName] = useState('')

  useEffect(() => {
    if (!userId) return

    fetchMerchantIdForUser(userId)
      .then((merchantId) => {
        if (!merchantId) return
        return supabaseGet<{ name: string }[]>('/merchants', {
          id: `eq.${merchantId}`,
          is_active: 'eq.true',
          deleted_at: 'is.null',
          select: 'name',
          limit: '1',
        })
      })
      .then((rows) => {
        if (rows) setMerchantName(rows[0]?.name ?? '')
      })
      .catch(() => setMerchantName(''))
  }, [userId])

  return { merchantName }
}
