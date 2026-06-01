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

function parseDiary(content) {
  const diary = {
    date: '',
    reflection: '',
    plans: [],
    goals: []
  }
  
  const lines = content.split('\n')
  let currentSection = ''
  
  lines.forEach(line => {
    line = line.trim()
    if (!line) return
    
    if (line.match(/^\d{1,2}[./]\d{1,2}/)) {
      diary.date = line
    } else if (line.includes('反思') || line.includes('感想')) {
      currentSection = 'reflection'
    } else if (line.includes('计划') || line.includes('TODO')) {
      currentSection = 'plans'
    } else if (line.includes('目标')) {
      currentSection = 'goals'
    } else if (currentSection === 'reflection') {
      diary.reflection += line + ' '
    } else if (currentSection === 'plans') {
      diary.plans.push(line)
    } else if (currentSection === 'goals') {
      diary.goals.push(line)
    }
  })
  
  return diary
}

const dailyRoutine = {
  breakfast: { time: '07:30-08:00', content: '早饭', type: 'break' },
  morningWash: { time: '07:00-07:30', content: '起床洗漱', type: 'break' },
  lunch: { time: '12:00-13:00', content: '午饭', type: 'break' },
  afternoonRest: { time: '13:00-14:00', content: '午休', type: 'break' },
  dinner: { time: '18:00-19:00', content: '晚饭', type: 'break' },
  eveningWash: { time: '22:30-23:00', content: '洗漱准备睡觉', type: 'break' },
  sleep: { time: '23:00-07:00', content: '睡觉', type: 'break' }
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

function generateDailySchedule(dayName, dateStr, courses, englishHours = 2) {
  const timeBlocks = []
  
  timeBlocks.push({ ...dailyRoutine.morningWash })
  
  timeBlocks.push({ ...dailyRoutine.breakfast })
  
  if (courses && courses.length > 0) {
    courses.forEach(course => {
      const [startTime] = course.time.split('-')
      const [hours] = startTime.split(':').map(Number)
      
      if (hours < 12) {
        timeBlocks.push({
          time: course.time,
          content: course.course,
          location: course.location,
          type: 'class'
        })
      }
    })
  }
  
  timeBlocks.push({ ...dailyRoutine.lunch })
  timeBlocks.push({ ...dailyRoutine.afternoonRest })
  
  if (courses && courses.length > 0) {
    courses.forEach(course => {
      const [startTime] = course.time.split('-')
      const [hours] = startTime.split(':').map(Number)
      
      if (hours >= 12) {
        timeBlocks.push({
          time: course.time,
          content: course.course,
          location: course.location,
          type: 'class'
        })
      }
    })
  }
  
  if (englishHours > 0) {
    timeBlocks.push({
      time: '19:00-21:00',
      content: '英语学习',
      detail: '单词+阅读+听力轮换',
      type: 'study'
    })
  }
  
  timeBlocks.push({ ...dailyRoutine.dinner })
  timeBlocks.push({ ...dailyRoutine.eveningWash })
  timeBlocks.push({ ...dailyRoutine.sleep })
  
  return timeBlocks
}

async function generateWeeklyPlan() {
  console.log('📖 读取日记...\n')
  
  const diaryPath = 'diary/26.6.1.txt'
  let diaryContent = ''
  
  try {
    diaryContent = fs.readFileSync(diaryPath, 'utf-8')
    console.log('✅ 日记已读取')
  } catch (err) {
    console.log('⚠️ 日记文件不存在，使用默认数据')
    diaryContent = ''
  }
  
  console.log('\n📚 读取课表...\n')
  
  const schedulePath = 'diary/大二下13周课表.csv'
  let scheduleContent = ''
  let courses = {}
  
  try {
    scheduleContent = fs.readFileSync(schedulePath, 'utf-8')
    courses = parseCSV(scheduleContent)
    console.log('✅ 课表已读取')
  } catch (err) {
    console.log('⚠️ 课表文件不存在，使用默认数据')
  }
  
  const diary = parseDiary(diaryContent)
  
  console.log('\n📝 生成周计划...\n')
  
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)
  
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dailySchedule = {}
  
  weekDays.forEach((day, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`
    
    const dayCourses = courses[day] || []
    
    let englishHours = 2
    let theme = '学习日'
    let themeColor = 'blue'
    
    if (index === 4) {
      theme = '复习日'
      themeColor = 'orange'
      englishHours = 3
    } else if (index === 5) {
      theme = '休息日'
      themeColor = 'teal'
      englishHours = 0
    } else if (index === 6) {
      theme = '自由安排'
      themeColor = 'purple'
      englishHours = 1
    }
    
    dailySchedule[day] = {
      date: dateStr,
      dayOfWeek: day,
      theme: theme,
      themeColor: themeColor,
      timeBlocks: generateDailySchedule(day, dateStr, dayCourses, englishHours),
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
        { id: 'g1', text: '英语六级考试冲刺', progress: 0, deadline: '2025-06-14', type: 'exam' },
        { id: 'g2', text: '每天英语学习2小时', progress: 0, type: 'study' },
        ...longTermGoals.slice(0, 5).map((g, i) => ({ ...g, id: `g${i + 3}` }))
      ],
      longTermGoals: longTermGoals,
      dailySchedule: dailySchedule,
      notes: [
        '英语学习每天约2小时，合理安排',
        '保证充足睡眠，23点前睡觉',
        '每天吃早饭，保持健康',
        '课余时间可安排长期目标学习'
      ],
      weeklyReview: {
        lastWeekSummary: diary.reflection || '继续六级冲刺和日常学习',
        thisWeekFocus: '英语学习、长期目标培养',
        nextWeekGoals: diary.plans.join(', ') || '持续学习',
        totalEnglishHours: 10,
        targetHours: 100
      }
    }
  }
  
  console.log('📊 生成的计划摘要:')
  console.log('  周次:', weeklyPlan.week)
  console.log('  日期:', weeklyPlan.data.startDate, '-', weeklyPlan.data.endDate)
  console.log('  短期目标数量:', weeklyPlan.data.goals.length)
  console.log('  长期目标数量:', longTermGoals.length)
  console.log('  每日安排: 完整7天，包含日常活动')
  console.log('\n📋 每日作息安排:')
  console.log('  07:00-07:30 起床洗漱')
  console.log('  07:30-08:00 早饭')
  console.log('  08:00-12:00 上午课程/学习')
  console.log('  12:00-13:00 午饭')
  console.log('  13:00-14:00 午休')
  console.log('  14:00-18:00 下午课程/学习')
  console.log('  18:00-19:00 晚饭')
  console.log('  19:00-21:00 英语学习（约2小时）')
  console.log('  22:30-23:00 洗漱准备睡觉')
  console.log('  23:00-07:00 睡觉')
  
  return weeklyPlan
}

async function updateWeeklyPlan() {
  console.log('\n🚀 开始更新周计划到数据库...\n')
  
  const plan = await generateWeeklyPlan()
  
  const { error } = await supabase
    .from('weekly_plans')
    .update(plan)
    .eq('week', plan.week)
  
  if (error) {
    console.log('⚠️ 更新现有记录失败，尝试插入新记录...')
    
    const { error: insertError } = await supabase
      .from('weekly_plans')
      .insert(plan)
    
    if (insertError) {
      console.error('❌ 插入失败:', insertError.message)
      process.exit(1)
    }
  }
  
  console.log('\n✅ 周计划已成功更新到数据库!')
  console.log('\n📋 计划包含:')
  console.log('  - 7天详细时间安排（含日常活动）')
  console.log('  - 每日学习目标')
  console.log('  - 短期+长期目标管理')
  console.log('  - 英语学习时间（约2小时/天）')
  console.log('  - 合理作息安排')
}

updateWeeklyPlan()
