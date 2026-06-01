import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addColumns() {
  try {
    const columns = [
      'week text',
      'startDate text',
      'endDate text',
      'goals jsonb',
      'dailySchedule jsonb',
      'timeBlocks jsonb'
    ]

    for (const column of columns) {
      const sql = `ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS ${column};`
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ sql })
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log(`成功添加列: ${column}`)
      } else {
        console.log(`添加列失败 ${column}:`, result.message || result)
      }
    }

    console.log('\n所有列添加完成！')
  } catch (error) {
    console.error('执行失败:', error.message)
  }
}

addColumns()
