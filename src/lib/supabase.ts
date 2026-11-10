import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The app NEVER hardcodes credentials. The Supabase project URL and
// publishable (anon) key come from the environment:
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
// Set them in `.env.local` for local dev or in the Vercel project
// settings for the deployed app. If they are missing, the app shows
// a setup screen instead of pretending to be connected.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null

/** Returns the client, or throws a clear error when Supabase is not configured. */
export function requireClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabase
}
