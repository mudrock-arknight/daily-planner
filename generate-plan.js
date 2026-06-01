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

async function generateWeeklyPlan() {
  console.log('📖 读取文件...\n')

  const schedulePath = 'diary/大二下13周课表.csv'
  let courses = {}
  try {
    const scheduleContent = fs.readFileSync(schedulePath, 'utf-8')
    courses = parseCSV(scheduleContent)
    console.log('✅ 课表已读取')
  } catch (err) {
    console.log('⚠️ 课表不存在，继续')
  }

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // 周一

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dailySchedule = {}
  
  weekDays.forEach((day, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const dateStr = date.toISOString().split('T')[0] // 'YYYY-MM-DD'格式
    const dayCourses = courses[day] || []

    let englishHours = 2
    let theme = '学习日'
    let themeColor = 'blue'

    if (index === 4) { // 周五
      theme = '复习日'
      themeColor = 'orange'
      englishHours = 3
    } else if (index === 5) { // 周六
      theme = '休息日'
      themeColor = 'teal'
      englishHours = 0
    } else if (index === 6) { // 周日
      theme = '自由安排'
      themeColor = 'purple'
      englishHours = 1
    }

    const timeBlocks = []

    // 基础作息
    timeBlocks.push({ time: '07:00-07:30', content: '起床洗漱', type: 'break' })
    timeBlocks.push({ time: '07:30-08:00', content: '早饭', type: 'break' })

    // 添加上午课程
    if (dayCourses.length > 0) {
      dayCourses.forEach(course => {
        const [startTime] = course.time.split('-')
        const [startHour] = startTime.split(':').map(Number)
        if (startHour < 12) {
          timeBlocks.push({
            time: course.time,
            content: course.course,
            location: course.location,
            type: 'class'
          })
        }
      })
    }

    timeBlocks.push({ time: '12:00-13:00', content: '午饭', type: 'break' })
    timeBlocks.push({ time: '13:00-14:00', content: '午休', type: 'break' })

    // 添加下午课程
    if (dayCourses.length > 0) {
      dayCourses.forEach(course => {
        const [startTime] = course.time.split('-')
        const [startHour] = startTime.split(':').map(Number)
        if (startHour >= 12 && startHour < 18) {
          timeBlocks.push({
            time: course.time,
            content: course.course,
            location: course.location,
            type: 'class'
          })
        }
      })
    }

    timeBlocks.push({ time: '18:00-19:00', content: '晚饭', type: 'break' })

    if (englishHours > 0) {
      timeBlocks.push({ time: '19:00-21:00', content: '英语学习', detail: '背单词+阅读+听力', type: 'study' })
    } else {
      timeBlocks.push({ time: '19:00-21:00', content: '自由安排', type: 'break' })
    }

    timeBlocks.push({ time: '22:30-23:00', content: '洗漱准备睡觉', type: 'break' })
    timeBlocks.push({ time: '23:00-07:00', content: '睡觉', type: 'break' })

    dailySchedule[day] = {
      date: dateStr,
      dayOfWeek: day,
      theme: theme,
      themeColor: themeColor,
      timeBlocks: timeBlocks,
      focusGoal: index < 5 ? '英语学习' : (index === 5 ? '休息放松' : '自由安排'),
      englishTarget: englishHours
    }
  })

  const weeklyPlan = {
    week: `第${Math.ceil((today.getTime() - new Date('2026-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))}周`,
    data: {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: [
        { id: 'g1', text: '英语六级考试冲刺', progress: 10, deadline: '2026-06-13', type: 'exam' },
        { id: 'g2', text: '每天英语学习2小时', progress: 0, type: 'study' }
      ],
      longTermGoals: longTermGoals,
      dailySchedule: dailySchedule,
      notes: [
        '英语学习每天约2小时，合理安排',
        '保证充足睡眠，23:00前睡觉',
        '每天吃早饭，保持健康'
      ],
      weeklyReview: {
        lastWeekSummary: '继续六级冲刺和日常学习',
        thisWeekFocus: '英语学习',
        nextWeekGoals: '持续学习',
        totalEnglishHours: 10,
        targetHours: 100
      }
    }
  }

  console.log('\n📊 生成的计划摘要:')
  console.log('  周次:', weeklyPlan.week)
  console.log('  日期:', weeklyPlan.data.startDate, '-', weeklyPlan.data.endDate)
  console.log('  长期目标数量:', longTermGoals.length)

  return weeklyPlan
}

async function updateWeeklyPlan() {
  console.log('\n🚀 开始更新周计划到数据库...\n')

  const plan = await generateWeeklyPlan()

  // 先删除旧记录
  await supabase.from('weekly_plans').delete().neq('id', 0)

  const { error } = await supabase.from('weekly_plans').insert(plan)
  if (error) {
    console.error('❌ 插入失败:', error.message)
    process.exit(1)
  }

  console.log('\n✅ 周计划已成功更新到数据库!')
}

updateWeeklyPlan()
