import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addColumns() {
  try {
    const sql = `
      ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS week text;
      ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS startDate text;
      ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS endDate text;
      ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS goals jsonb;
      ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS dailySchedule jsonb;
      ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS timeBlocks jsonb;
    `

    console.log('🔧 正在添加列...')
    
    const { data, error } = await supabase.rpc('pg_catalog.pg_stat_user_tables')
    
    if (error) {
      console.log('RPC测试失败:', error.message)
    } else {
      console.log('RPC连接正常')
    }
    
  } catch (error) {
    console.error('执行失败:', error.message)
  }
}

addColumns()
