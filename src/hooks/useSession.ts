import { useEffect, useState } from 'react'
import { supabaseClient } from '../lib/supabaseClient'
import { getAccessToken, syncAccessToken } from '../lib/supabase'

export function useSession() {
  const [accessToken, setAccessToken] = useState(() => getAccessToken())
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const setFromSession = async () => {
      const { data } = await supabaseClient.auth.getSession()
      const token = data.session?.access_token ?? ''
      setAccessToken(token || getAccessToken())
      setUserId(data.session?.user?.id ?? '')
      setUserEmail(data.session?.user?.email ?? '')
      syncAccessToken(token)
      setReady(true)
    }

    const syncFromLocal = () => {
      setAccessToken(getAccessToken())
    }

    setFromSession()
    const { data: listener } = supabaseClient.auth.onAuthStateChange(() => {
      setFromSession()
    })
    globalThis.addEventListener('jutjanops-auth', syncFromLocal)

    return () => {
      listener.subscription.unsubscribe()
      globalThis.removeEventListener('jutjanops-auth', syncFromLocal)
    }
  }, [])

  return { accessToken, userId, userEmail, ready }
}
