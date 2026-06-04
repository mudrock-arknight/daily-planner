import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function fetchSchema() {
  try {
    console.log('📋 获取表结构信息...')
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1`, {
      headers: { 
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    })
    
    const schema = await response.json()
    
    const weeklyPlansTable = schema.definitions?.weekly_plans?.properties
    if (weeklyPlansTable) {
      console.log('✅ weekly_plans 表的列:')
      Object.keys(weeklyPlansTable).forEach(col => {
        console.log(`  - ${col}`)
      })
    } else {
      console.log('❌ 未找到 weekly_plans 表的定义')
      console.log('完整 schema:', JSON.stringify(schema, null, 2))
    }
    
  } catch (error) {
    console.error('获取 schema 失败:', error.message)
  }
}

fetchSchema()
