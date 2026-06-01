import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mi9CaezrmOShaJUtLohOTw_ClnxATeT'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
