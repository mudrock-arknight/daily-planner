import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function queryColumns() {
  try {
    console.log('🔍 尝试查询表结构...')
    
    const { data, error } = await supabase.rpc('pg_stat_user_tables')
    
    if (error) {
      console.log('RPC错误:', error.message)
    }
    
    const url = `${SUPABASE_URL}/rest/v1/rpc/execute_sql`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ 
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'weekly_plans' ORDER BY ordinal_position;" 
      })
    })
    
    const result = await response.json()
    console.log('HTTP状态:', response.status)
    console.log('查询结果:', result)
    
  } catch (error) {
    console.error('查询失败:', error.message)
  }
}

queryColumns()
