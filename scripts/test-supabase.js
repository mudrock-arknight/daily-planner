const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // 查询待办事项
    const { data: todos, error: todosError } = await supabase
      .from('todos')
      .select('*')
    
    if (todosError) {
      console.error('Todos query error:', todosError)
    } else {
      console.log('\n=== 待办事项 ===')
      console.log(JSON.stringify(todos, null, 2))
    }
    
    // 查询周计划
    const { data: weeklyPlans, error: weeklyError } = await supabase
      .from('weekly_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (weeklyError) {
      console.error('Weekly plans query error:', weeklyError)
    } else {
      console.log('\n=== 周计划 ===')
      console.log(JSON.stringify(weeklyPlans, null, 2))
    }
    
    console.log('\n✅ Connection successful!')
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}

testConnection()
