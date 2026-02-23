import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
}

export { supabase }

export type User = {
  id: string
  email: string
  name: string
  createdAt: string
}

export type Resume = {
  id: string
  user_id: string
  title: string
  content: string
  template: string
  created_at: string
  updated_at: string
}

export type SharedResume = {
  id: string
  share_code: string
  user_id: string
  title: string
  content: string
  template: string
  view_count: number
  created_at: string
  expires_at: string | null
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
