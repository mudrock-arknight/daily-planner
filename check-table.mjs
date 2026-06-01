import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkTable() {
  try {
    const { data, error } = await supabase
      .from('weekly_plans')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ 错误:', error.message)
    } else {
      console.log('✅ 表结构正常，数据可以查询')
      if (data && data.length > 0) {
        console.log('当前表数据:', Object.keys(data[0]))
      }
    }
  } catch (error) {
    console.error('查询失败:', error.message)
  }
}

checkTable()
