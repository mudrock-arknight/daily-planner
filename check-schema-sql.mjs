import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkSchema() {
  try {
    console.log('🔍 检查 weekly_plans 表结构...')
    
    const { data, error } = await supabase.rpc('query_schema', { 
      query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'weekly_plans' ORDER BY ordinal_position;" 
    })
    
    if (error) {
      console.log('❌ RPC 查询失败:', error.message)
      
      console.log('\n尝试使用另一种方式...')
      const response = await fetch(`${SUPABASE_URL}/rest/v1/weekly_plans?select=*&limit=1`, {
        headers: { 
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      })
      
      console.log('HTTP 状态码:', response.status)
      const text = await response.text()
      console.log('响应内容:', text.substring(0, 500))
      
    } else {
      console.log('✅ weekly_plans 表的列结构:')
      data.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`)
      })
    }
    
  } catch (error) {
    console.error('检查失败:', error.message)
  }
}

checkSchema()
