import { createClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseUrl } from './env'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env')
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
