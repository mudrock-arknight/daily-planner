#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function addTodo() {
  console.log('\n📝 添加待办事项\n')
  
  const title = await prompt('请输入待办内容: ')
  
  if (!title.trim()) {
    console.log('❌ 待办内容不能为空')
    return
  }

  const { data, error } = await supabase
    .from('todo_items')
    .insert({ title, completed: false, priority: 'medium' })
    .select()
    .single()

  if (error) {
    console.log('❌ 添加失败:', error.message)
  } else {
    console.log('✅ 添加成功!')
    console.log('   ID:', data.id)
    console.log('   内容:', data.title)
  }
}

async function listTodos() {
  console.log('\n📋 待办事项列表\n')
  
  const { data, error } = await supabase
    .from('todo_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.log('❌ 查询失败:', error.message)
    return
  }

  if (data.length === 0) {
    console.log('暂无待办事项')
    return
  }

  data.forEach((todo, i) => {
    const status = todo.completed ? '✅' : '⬜'
    console.log(`${status} ${i + 1}. ${todo.title}`)
    console.log(`   创建于: ${new Date(todo.created_at).toLocaleString('zh-CN')}`)
  })
}

async function completeTodo() {
  console.log('\n✅ 完成待办事项\n')
  
  const id = await prompt('请输入待办ID: ')
  
  if (!id.trim()) {
    console.log('❌ ID不能为空')
    return
  }

  const { data, error } = await supabase
    .from('todo_items')
    .update({ completed: true })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.log('❌ 更新失败:', error.message)
  } else {
    console.log('✅ 已标记为完成!')
    console.log('   内容:', data.title)
  }
}

async function deleteTodo() {
  console.log('\n🗑️ 删除待办事项\n')
  
  const id = await prompt('请输入待办ID: ')
  
  if (!id.trim()) {
    console.log('❌ ID不能为空')
    return
  }

  const { error } = await supabase
    .from('todo_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.log('❌ 删除失败:', error.message)
  } else {
    console.log('✅ 删除成功!')
  }
}

async function showWeeklyPlan() {
  console.log('\n📅 查看周计划\n')
  
  const { data, error } = await supabase
    .from('weekly_plans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.log('❌ 查询失败:', error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log('暂无周计划')
    return
  }

  const plan = data[0]
  console.log('周次:', plan.week)
  console.log('开始日期:', plan.data?.startDate)
  console.log('结束日期:', plan.data?.endDate)
  console.log('\n本周目标:')
  if (plan.data?.goals) {
    plan.data.goals.forEach((goal, i) => {
      console.log(`  ${i + 1}. ${goal.text} ${goal.deadline ? `(截止: ${goal.deadline})` : ''}`)
    })
  }
  console.log('\n每日安排:')
  if (plan.data?.dailySchedule) {
    Object.keys(plan.data.dailySchedule).forEach(day => {
      const schedule = plan.data.dailySchedule[day]
      console.log(`\n  ${day} (${schedule.date}) - ${schedule.theme}`)
      if (schedule.timeBlocks) {
        schedule.timeBlocks.slice(0, 3).forEach(block => {
          console.log(`    ${block.time} - ${block.content}`)
        })
        if (schedule.timeBlocks.length > 3) {
          console.log(`    ... 共${schedule.timeBlocks.length}个时间段`)
        }
      }
    })
  }
}

async function addQuickTodo() {
  const args = process.argv.slice(3)
  if (args.length === 0) {
    console.log('用法: node cli.js add "待办内容"')
    return
  }
  
  const title = args.join(' ')
  
  const { data, error } = await supabase
    .from('todo_items')
    .insert({ title, completed: false, priority: 'medium' })
    .select()
    .single()

  if (error) {
    console.log('❌ 添加失败:', error.message)
    process.exit(1)
  } else {
    console.log('✅ 已添加待办:', title)
    process.exit(0)
  }
}

async function main() {
  const command = process.argv[2]

  if (command === 'add' && process.argv[3]) {
    await addQuickTodo()
    rl.close()
    return
  }

  console.log('\n🛠️ 个人规划助手 - 命令行工具\n')
  console.log('可用命令:')
  console.log('  1. 添加待办')
  console.log('  2. 查看待办列表')
  console.log('  3. 完成待办')
  console.log('  4. 删除待办')
  console.log('  5. 查看周计划')
  console.log('  0. 退出\n')

  const choice = await prompt('请选择命令 (0-5): ')

  switch (choice) {
    case '1':
      await addTodo()
      break
    case '2':
      await listTodos()
      break
    case '3':
      await completeTodo()
      break
    case '4':
      await deleteTodo()
      break
    case '5':
      await showWeeklyPlan()
      break
    case '0':
      console.log('👋 再见!')
      rl.close()
      process.exit(0)
    default:
      console.log('❌ 无效选择')
  }

  rl.close()
}

main()
