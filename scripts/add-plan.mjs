import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addPlan() {
  console.log('🔄 正在添加计划和待办事项...\n')
  
  try {
    // 添加待办事项
    console.log('📋 添加待办事项...')
    const newTodos = [
      { title: '明天10点拿快递', priority: 'high', completed: false },
      { title: '完成概率论作业', priority: 'medium', completed: false },
      { title: '背50个单词', priority: 'medium', completed: false },
      { title: '去图书馆还书', priority: 'high', completed: false },
    ]
    
    const { data: insertedTodos, error: insertError } = await supabase
      .from('todo_items')
      .insert(newTodos)
      .select()
    
    if (insertError) throw insertError
    console.log('✅ 已添加', insertedTodos.length, '个待办事项')
    insertedTodos.forEach(todo => {
      console.log(`  ✓ ${todo.title} (${todo.priority})`)
    })
    
    // 添加周计划
    console.log('\n📅 添加本周计划...')
    const weeklyPlan = {
      week: '第14周',
      startDate: '2026-06-02',
      endDate: '2026-06-08',
      goals: [
        { id: '1', text: '完成概率论第三周作业', progress: 0 },
        { id: '2', text: '背完100个英语单词', progress: 0 },
        { id: '3', text: '每天运动30分钟', progress: 0 },
        { id: '4', text: '复习工程力学第一章', progress: 0 }
      ],
      dailySchedule: {
        '周一': '概率论课前预习',
        '周二': '完成概率论作业',
        '周三': '英语听力练习',
        '周四': '复习工程力学',
        '周五': '整理笔记',
        '周末': '总结复习'
      },
      timeBlocks: {
        morning: { start: '08:00', end: '12:00' },
        afternoon: { start: '14:00', end: '18:00' },
        evening: { start: '19:00', end: '22:00' }
      }
    }
    
    const { data: insertedPlan, error: planError } = await supabase
      .from('weekly_plans')
      .insert(weeklyPlan)
      .select()
    
    if (planError) throw planError
    console.log('✅ 已添加周计划：', insertedPlan[0].week)
    
    console.log('\n' + '='.repeat(50))
    console.log('🎉 完成！')
    console.log('='.repeat(50))
    console.log('\n🌐 请刷新网站查看：')
    console.log('   https://mudrock-arknight.github.io/daily-planner/')
    console.log('\n你会看到：')
    console.log('  📋 待办事项：4项新任务')
    console.log('  📅 周计划：第14周学习计划')
    
  } catch (error) {
    console.error('❌ 操作失败：', error)
    console.error('错误详情：', error.message)
  }
}

addPlan()
