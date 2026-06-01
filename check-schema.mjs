import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkSchema() {
  console.log('🔍 查看数据库表结构...\n')
  
  try {
    // 获取 todo_items 表结构
    console.log('📋 todo_items 表：')
    const { data: todos, error } = await supabase
      .from('todo_items')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('字段：', Object.keys(todos[0] || {}).join(', '))
      console.log('示例数据：', JSON.stringify(todos[0], null, 2))
    }
    
    // 获取 weekly_plans 表结构
    console.log('\n📅 weekly_plans 表：')
    const { data: plans } = await supabase
      .from('weekly_plans')
      .select('*')
      .limit(1)
    
    if (plans && plans.length > 0) {
      console.log('字段：', Object.keys(plans[0]).join(', '))
      console.log('示例数据：', JSON.stringify(plans[0], null, 2))
    } else {
      console.log('暂无数据')
    }
    
    // 获取 daily_checkins 表结构
    console.log('\n✅ daily_checkins 表：')
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .limit(1)
    
    if (checkins && checkins.length > 0) {
      console.log('字段：', Object.keys(checkins[0]).join(', '))
      console.log('示例数据：', JSON.stringify(checkins[0], null, 2))
    } else {
      console.log('暂无数据')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkSchema()
