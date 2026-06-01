import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkColumns() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/weekly_plans?limit=0`, {
      headers: { 
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    })
    
    console.log('状态码:', response.status)
    
    if (response.status === 200) {
      const headers = response.headers.get('content-range')
      console.log('Content-Range:', headers)
    } else {
      const error = await response.json()
      console.log('错误:', error)
    }
    
    const { data, error } = await supabase
      .from('weekly_plans')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('查询错误:', error.message)
    } else {
      console.log('查询成功')
      if (data && data.length > 0) {
        console.log('当前列:', Object.keys(data[0]))
      } else {
        console.log('表为空')
      }
    }
    
  } catch (error) {
    console.error('查询失败:', error.message)
  }
}

checkColumns()
