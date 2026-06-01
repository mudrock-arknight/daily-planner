import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addWeeklyPlan() {
  console.log('📅 添加周计划...\n')
  
  try {
    const weeklyPlan = {
      week: '第14周',
      data: {
        startDate: '2026-06-02',
        endDate: '2026-06-08',
        goals: [
          { id: '1', text: '完成概率论第三周作业', progress: 0 },
          { id: '2', text: '背完100个英语单词', progress: 0 },
          { id: '3', text: '每天运动30分钟', progress: 0 },
          { id: '4', text: '复习工程力学第一章', progress: 0 }
        ],
        dailySchedule: {},
        timeBlocks: {}
      }
    }
    
    const { data: insertedPlan, error } = await supabase
      .from('weekly_plans')
      .insert(weeklyPlan)
      .select()
    
    if (error) throw error
    
    console.log('✅ 周计划已添加：', insertedPlan[0].week)
    console.log('\n📋 目标列表：')
    insertedPlan[0].data.goals.forEach(goal => {
      console.log(`  🎯 ${goal.text}`)
    })
    
    console.log('\n' + '='.repeat(50))
    console.log('🎉 所有操作完成！')
    console.log('='.repeat(50))
    console.log('\n🌐 现在刷新网站查看：')
    console.log('   https://mudrock-arknight.github.io/daily-planner/')
    console.log('\n你会看到：')
    console.log('  📋 待办事项：4项新任务')
    console.log('  📅 周计划：第14周学习计划')
    
  } catch (error) {
    console.error('❌ 操作失败：', error.message)
  }
}

addWeeklyPlan()
