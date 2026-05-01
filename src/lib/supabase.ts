import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const isConfigured =
  url && key &&
  url.startsWith('https://') &&
  key.startsWith('eyJ')

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(url!, key!)
  : null

if (!isConfigured) {
  console.warn('[Supabase] Not configured — using static data')
}
