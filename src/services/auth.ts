import { supabaseClient } from '../lib/supabaseClient'

export async function loginWithPassword(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session) {
    throw new Error(error?.message || 'Login failed')
  }

  return data.session
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}
