import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || ''

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
