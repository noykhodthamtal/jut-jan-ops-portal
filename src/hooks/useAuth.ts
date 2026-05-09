import { useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '../lib/reactQuery'
import { syncAccessToken } from '../lib/supabase'
import { loginWithPassword, signOut } from '../services'

export function useAuth() {
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithPassword(email, password),
    onSuccess: (session) => {
      syncAccessToken(session.access_token)
      globalThis.dispatchEvent(new Event('jutjanops-auth'))
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      syncAccessToken('')
      globalThis.dispatchEvent(new Event('jutjanops-auth'))
    },
  })

  return {
    login: async (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    logout: async () => logoutMutation.mutateAsync(),
    loading: loginMutation.isPending || logoutMutation.isPending,
    error: getErrorMessage(loginMutation.error ?? logoutMutation.error),
  }
}
