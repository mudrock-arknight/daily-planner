#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function parseCSV(content) {
  const lines = content.trim().split('\n')
  const schedule = {}
  
  lines.forEach((line, index) => {
    if (index === 0) return
    
    const parts = line.split(',')
    if (parts.length >= 4) {
      const day = parts[0].trim()
      const time = parts[1].trim()
      const course = parts[2].trim()
      const location = parts[3]?.trim() || ''
      
      if (!schedule[day]) {
        schedule[day] = []
      }
      schedule[day].push({ time, course, location })
    }
  })
  
  return schedule
}

const longTermGoals = [
  { id: 'lt1', text: '英语 - 刷高分、考六级、准备雅思', category: 'language', progress: 10, type: 'study', priority: 'high' },
  { id: 'lt2', text: '人工智能学习', category: 'tech', progress: 5, type: 'study', priority: 'high' },
  { id: 'lt3', text: '投资知识 - 股票、量化投资、基金', category: 'finance', progress: 0, type: 'study', priority: 'medium' },
  { id: 'lt4', text: '编程能力提升', category: 'tech', progress: 20, type: 'study', priority: 'high' },
  { id: 'lt5', text: '单片机技能', category: 'tech', progress: 15, type: 'study', priority: 'medium' },
  { id: 'lt6', text: '打字速度提升', category: 'skill', progress: 30, type: 'study', priority: 'low' },
  { id: 'lt7', text: '练字（考研需要）', category: 'skill', progress: 0, type: 'study', priority: 'medium' },
  { id: 'lt8', text: '艺术爱好 - 乐器/唱歌', category: 'hobby', progress: 0, type: 'hobby', priority: 'low' },
  { id: 'lt9', text: '普通话 - 从三甲提升到二乙', category: 'skill', progress: 0, type: 'study', priority: 'low' }
]

function generateDaySchedule(dayName, dateStr, dayCourses, index) {
  const timeBlocks = []
  let currentTime = '07:00'
  
  timeBlocks.push({ time: `${currentTime}-07:30`, content: '起床洗漱', type: 'break' })
  currentTime = '07:30'
  timeBlocks.push({ time: `${currentTime}-07:50`, content: '早饭', type: 'break' })
  currentTime = '07:50'
  
  const morningCourses = dayCourses.filter(c => {
    const [startTime] = c.time.split('-')
    const [startHour] = startTime.split(':').map(Number)
    return startHour < 12
  })
  
  const afternoonCourses = dayCourses.filter(c => {
    const [startTime] = c.time.split('-')
    const [startHour] = startTime.split(':').map(Number)
    return startHour >= 12
  })
  
  if (morningCourses.length > 0) {
    morningCourses.forEach(course => {
      timeBlocks.push({
        time: course.time,
        content: course.course,
        location: course.location,
        type: 'class'
      })
    })
  } else {
    timeBlocks.push({ time: `${currentTime}-09:00`, content: '英语学习', detail: '背单词+听力训练', type: 'study' })
    currentTime = '09:00'
    timeBlocks.push({ time: `${currentTime}-10:30`, content: 'AI/编程学习', detail: '人工智能或编程实践', type: 'study' })
    currentTime = '10:30'
    timeBlocks.push({ time: `${currentTime}-11:30`, content: '自由学习', detail: '单片机/投资知识/练字等', type: 'study' })
    currentTime = '11:30'
  }
  
  timeBlocks.push({ time: '12:00-12:30', content: '午饭', type: 'break' })
  timeBlocks.push({ time: '12:30-13:00', content: '午休', type: 'break' })
  currentTime = '13:00'
  
  if (afternoonCourses.length > 0) {
    afternoonCourses.forEach(course => {
      timeBlocks.push({
        time: course.time,
        content: course.course,
        location: course.location,
        type: 'class'
      })
    })
  } else {
    timeBlocks.push({ time: `${currentTime}-14:30`, content: '英语学习', detail: '阅读+写作', type: 'study' })
    currentTime = '14:30'
    timeBlocks.push({ time: `${currentTime}-16:00`, content: '编程实践', detail: '项目开发或算法练习', type: 'study' })
    currentTime = '16:00'
    timeBlocks.push({ time: `${currentTime}-17:30`, content: '技能提升', detail: '打字速度/乐器练习', type: 'study' })
    currentTime = '17:30'
  }
  
  timeBlocks.push({ time: '18:00-18:30', content: '晚饭', type: 'break' })
  timeBlocks.push({ time: '18:30-19:00', content: '休息放松', type: 'break' })
  timeBlocks.push({ time: '19:00-21:00', content: '英语学习', detail: '综合英语能力提升', type: 'study' })
  timeBlocks.push({ time: '21:00-22:00', content: '复盘总结', detail: '今日总结+明日计划', type: 'study' })
  timeBlocks.push({ time: '22:00-22:30', content: '洗漱准备睡觉', type: 'break' })
  timeBlocks.push({ time: '22:30-07:00', content: '睡觉', type: 'break' })

  let englishHours = 2.5
  let theme = '学习日'
  let themeColor = 'blue'
  let focusGoal = '英语学习'

  if (index === 4) {
    theme = '复习日'
    themeColor = 'orange'
    englishHours = 3
    focusGoal = '全面复习'
  } else if (index === 5) {
    theme = '休息日'
    themeColor = 'teal'
    englishHours = 1.5
    focusGoal = '适当放松'
  } else if (index === 6) {
    theme = '自由安排'
    themeColor = 'purple'
    englishHours = 1
    focusGoal = '查漏补缺'
  }

  return {
    date: dateStr,
    dayOfWeek: dayName,
    theme: theme,
    themeColor: themeColor,
    timeBlocks: timeBlocks,
    focusGoal: focusGoal,
    englishTarget: englishHours
  }
}

async function generateWeeklyPlan() {
  console.log('📖 读取文件...\n')

  const schedulePath = 'diary/大二下13周课表.csv'
  let courses = {}
  try {
    const scheduleContent = fs.readFileSync(schedulePath, 'utf-8')
    courses = parseCSV(scheduleContent)
    console.log('✅ 课表已读取')
  } catch (err) {
    console.log('⚠️ 课表不存在，使用默认计划')
  }

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dailySchedule = {}
  
  weekDays.forEach((day, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const dateStr = date.toISOString().split('T')[0]
    const dayCourses = courses[day] || []
    
    dailySchedule[day] = generateDaySchedule(day, dateStr, dayCourses, index)
  })

  const weeklyPlan = {
    week: `第${Math.ceil((today.getTime() - new Date('2026-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))}周`,
    data: {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: [
        { id: 'g1', text: '英语六级考试冲刺', progress: 10, deadline: '2026-06-13', type: 'exam' },
        { id: 'g2', text: '每天英语学习2.5小时', progress: 0, type: 'study' }
      ],
      longTermGoals: longTermGoals,
      dailySchedule: dailySchedule,
      notes: [
        '英语学习每天约2.5小时，合理安排',
        '保证充足睡眠，22:30前睡觉',
        '每天吃早饭，保持健康',
        '课余时间充分利用，提升技能'
      ],
      weeklyReview: {
        lastWeekSummary: '继续六级冲刺和日常学习',
        thisWeekFocus: '英语学习 + 技能提升',
        nextWeekGoals: '持续学习',
        totalEnglishHours: 17.5,
        targetHours: 100
      }
    }
  }

  console.log('\n📊 生成的计划摘要:')
  console.log('  周次:', weeklyPlan.week)
  console.log('  日期:', weeklyPlan.data.startDate, '-', weeklyPlan.data.endDate)
  console.log('  长期目标数量:', longTermGoals.length)

  weekDays.forEach(day => {
    const blocks = dailySchedule[day].timeBlocks
    console.log(`\n  ${day} (${dailySchedule[day].date}):`)
    blocks.forEach(block => {
      console.log(`    ${block.time} - ${block.content}`)
    })
  })

  return weeklyPlan
}

async function updateWeeklyPlan() {
  console.log('\n🚀 开始更新周计划到数据库...\n')

  const plan = await generateWeeklyPlan()

  await supabase.from('weekly_plans').delete().gte('created_at', '2000-01-01')

  const { error } = await supabase.from('weekly_plans').insert(plan)
  if (error) {
    console.error('❌ 插入失败:', error.message)
    process.exit(1)
  }

  console.log('\n✅ 周计划已成功更新到数据库!')
}

updateWeeklyPlan()
