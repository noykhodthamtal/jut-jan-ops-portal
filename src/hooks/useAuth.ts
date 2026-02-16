import { useState } from 'react'
import { loginWithPassword, signOut } from '../services'
import { syncAccessToken } from '../lib/supabase'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const session = await loginWithPassword(email, password)
      syncAccessToken(session.access_token)
      globalThis.dispatchEvent(new Event('jutjanops-auth'))
      setError(null)
      return session
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut()
      syncAccessToken('')
      globalThis.dispatchEvent(new Event('jutjanops-auth'))
      setError(null)
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    logout,
    loading,
    error,
  }
}
