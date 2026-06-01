import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function manageData() {
  console.log('🔄 Managing your data...\n')
  
  try {
    // 1. 查看当前待办事项
    console.log('📋 查看当前待办事项...')
    const { data: todos, error: todosError } = await supabase
      .from('todo_items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (todosError) throw todosError
    console.log('当前待办：', todos.length, '项')
    console.log(JSON.stringify(todos, null, 2))
    
    // 2. 添加新的待办事项
    console.log('\n➕ 添加新的待办事项...')
    const newTodos = [
      { title: '明天10点拿快递', status: 'todo', priority: 'high', due_date: '2026-06-02T10:00:00' },
      { title: '完成概率论作业', status: 'todo', priority: 'medium', due_date: '2026-06-03' },
      { title: '背50个单词', status: 'todo', priority: 'medium', due_date: '2026-06-01' },
      { title: '去图书馆还书', status: 'todo', priority: 'high', due_date: '2026-06-02T15:00:00' },
    ]
    
    const { data: insertedTodos, error: insertError } = await supabase
      .from('todo_items')
      .insert(newTodos)
      .select()
    
    if (insertError) throw insertError
    console.log('✅ 已添加', insertedTodos.length, '个待办事项：')
    insertedTodos.forEach(todo => {
      console.log(`  - ${todo.title} (优先级: ${todo.priority})`)
    })
    
    // 3. 添加周计划
    console.log('\n📅 添加本周计划...')
    const weeklyPlan = {
      title: '第14周计划',
      start_date: '2026-06-02',
      end_date: '2026-06-08',
      content: {
        goals: [
          '完成概率论第三周作业',
          '背完100个英语单词',
          '每天运动30分钟',
          '复习工程力学第一章'
        ],
        tasks: [
          '周一：概率论课前预习',
          '周二：完成作业',
          '周三：英语听力练习',
          '周四：复习力学',
          '周五：整理笔记',
          '周末：总结复习'
        ]
      }
    }
    
    const { data: insertedPlan, error: planError } = await supabase
      .from('weekly_plans')
      .insert(weeklyPlan)
      .select()
    
    if (planError) throw planError
    console.log('✅ 已添加本周计划：', insertedPlan[0].title)
    
    // 4. 查看所有数据
    console.log('\n📊 最终数据：')
    const { data: finalTodos } = await supabase
      .from('todo_items')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('\n待办事项（共', finalTodos.length, '项）：')
    finalTodos.forEach(todo => {
      const statusIcon = todo.status === 'done' ? '✅' : '⬜'
      console.log(`  ${statusIcon} ${todo.title} (${todo.priority})`)
    })
    
    const { data: finalPlans } = await supabase
      .from('weekly_plans')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('\n周计划（共', finalPlans.length, '项）：')
    finalPlans.forEach(plan => {
      console.log(`  📅 ${plan.title} (${plan.start_date} - ${plan.end_date})`)
    })
    
    console.log('\n✅ 所有操作完成！')
    console.log('\n🌐 现在刷新你的网站：https://mudrock-arknight.github.io/daily-planner/')
    console.log('   就能看到更新后的待办事项和周计划了！')
    
  } catch (error) {
    console.error('❌ 操作失败：', error)
  }
}

manageData()
