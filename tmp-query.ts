import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf-8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=')
  if (key && val) env[key.trim()] = val.trim()
})

const supabaseUrl = env.VITE_SUPABASE_URL!
const supabaseKey = env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// In a real browser, the anon key uses the JWT of the logged-in user.
// However, the "anon" role might not be able to soft-delete if it's missing the user JWT.
// Since we don't have a user JWT here, we can't easily reproduce it with RLS (as anon will just fail).
// But we can check if there's any policy we can inspect via postgres functions if we had service_role keys.
console.log('Test script ready');
