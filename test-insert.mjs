import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testInsert() {
  try {
    console.log('测试插入简单数据...')
    
    const testData = {
      week: '第14周',
      startDate: '2026-06-02',
      endDate: '2026-06-08'
    }
    
    const { data, error } = await supabase
      .from('weekly_plans')
      .insert(testData)
      .select()
    
    if (error) {
      console.log('❌ 插入失败:', error.message)
    } else {
      console.log('✅ 插入成功:', data)
    }
    
  } catch (error) {
    console.error('执行失败:', error.message)
  }
}

testInsert()
