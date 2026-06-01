#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

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

function parseTimetable(content) {
  const lines = content.trim().split('\n')
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dayCourses = {}
  
  days.forEach(day => dayCourses[day] = [])
  
  const coursePatterns = [
    /^概率论与数理统计/,
    /^工程力学/,
    /^智能汽车环境感知技术/,
    /^智能汽车平台技术/,
    /^大学体育/
  ]
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex === 0) return
    
    const parts = line.split(',')
    if (parts.length < 3) return
    
    const timeSlot = parts[1]?.trim() || ''
    if (!timeSlot) return
    
    days.forEach((day, dayIndex) => {
      if (parts.length <= dayIndex + 2) return
      
      let courseInfo = parts[dayIndex + 2]?.trim() || ''
      if (courseInfo && courseInfo.length > 1) {
        courseInfo = courseInfo.replace(/@/g, '')
        
        let courseName = courseInfo
        for (const pattern of coursePatterns) {
          const match = courseInfo.match(pattern)
          if (match) {
            courseName = match[0]
            break
          }
        }
        
        let location = ''
        const locationPatterns = [
          /(日新楼[南北]?\s*\d+)/,
          /(格物园[ABC]?\s*座?\s*\d+)/,
          /(官龙山[^\s，]+)/,
          /(B\d+\s+[^\s]+场)/,
          /([A-Z]\d+\s*[^\s]+场)/
        ]
        
        for (const pattern of locationPatterns) {
          const match = courseInfo.match(pattern)
          if (match) {
            location = match[0].trim()
            break
          }
        }
        
        dayCourses[day].push({
          time: timeSlot,
          course: courseName,
          location: location
        })
      }
    })
  })
  
  return dayCourses
}

function generateDaySchedule(dayName, dateStr, dayCourses, index) {
  const timeBlocks = []
  let studyHours = 0
  
  const sortedCourses = [...dayCourses].sort((a, b) => {
    const [aStart] = a.time.split('-')
    const [bStart] = b.time.split('-')
    return aStart.localeCompare(bStart)
  })
  
  timeBlocks.push({ time: '07:00-07:30', content: '起床洗漱', type: 'break', countable: false })
  timeBlocks.push({ time: '07:30-07:50', content: '早饭', type: 'break', countable: false })
  
  let lastEndTime = '07:50'
  let morningProcessed = sortedCourses.some(c => getMinutes(c.time.split('-')[0]) < 12 * 60)
  let afternoonProcessed = sortedCourses.some(c => getMinutes(c.time.split('-')[0]) >= 14 * 60)
  const hasNoCourses = sortedCourses.length === 0
  
  sortedCourses.forEach(course => {
    const [courseStart, courseEnd] = course.time.split('-')
    const startMinutes = getMinutes(courseStart)
    const isMorning = startMinutes < 12 * 60
    const isAfternoon = startMinutes >= 14 * 60
    
    if (courseStart > lastEndTime) {
      const gapMinutes = getMinutes(courseStart) - getMinutes(lastEndTime)
      if (gapMinutes >= 30) {
        const studyBlock = generateStudyBlock(lastEndTime, courseStart)
        studyBlock.forEach(block => {
          timeBlocks.push({ ...block, countable: true })
          studyHours += getBlockHours(block.time)
        })
      }
    }
    
    timeBlocks.push({
      time: course.time,
      content: course.course,
      location: course.location,
      type: 'class',
      countable: false
    })
    
    lastEndTime = courseEnd
    
    if (isMorning) {
      morningProcessed = true
    }
    if (isAfternoon) {
      afternoonProcessed = true
    }
  })
  
  if (morningProcessed && lastEndTime < '12:00') {
    const studyBlock = generateStudyBlock(lastEndTime, '12:00')
    studyBlock.forEach(block => {
      timeBlocks.push({ ...block, countable: true })
      studyHours += getBlockHours(block.time)
    })
    lastEndTime = '12:00'
  } else if (hasNoCourses || (!morningProcessed && lastEndTime === '07:50')) {
    const studyBlock = generateStudyBlock(lastEndTime, '12:00')
    studyBlock.forEach(block => {
      timeBlocks.push({ ...block, countable: true })
      studyHours += getBlockHours(block.time)
    })
    lastEndTime = '12:00'
  }
  
  timeBlocks.push({ time: '12:00-12:30', content: '午饭', type: 'break', countable: false })
  timeBlocks.push({ time: '12:30-13:00', content: '午休', type: 'break', countable: false })
  
  if (afternoonProcessed) {
    if (lastEndTime < '14:00') {
      const studyBlock = generateStudyBlock(lastEndTime, '14:00')
      studyBlock.forEach(block => {
        timeBlocks.push({ ...block, countable: true })
        studyHours += getBlockHours(block.time)
      })
      lastEndTime = '14:00'
    }
  } else {
    lastEndTime = '14:00'
  }
  
  if (!afternoonProcessed) {
    const studyBlock = generateStudyBlock(lastEndTime, '18:00')
    studyBlock.forEach(block => {
      timeBlocks.push({ ...block, countable: true })
      studyHours += getBlockHours(block.time)
    })
    lastEndTime = '18:00'
  } else if (lastEndTime < '18:00') {
    const studyBlock = generateStudyBlock(lastEndTime, '18:00')
    studyBlock.forEach(block => {
      timeBlocks.push({ ...block, countable: true })
      studyHours += getBlockHours(block.time)
    })
    lastEndTime = '18:00'
  }
  
  timeBlocks.push({ time: '18:00-18:30', content: '晚饭', type: 'break', countable: false })
  
  const eveningStudyBlocks = generateEveningStudyBlocks(lastEndTime)
  eveningStudyBlocks.forEach(block => {
    if (block.countable !== false) {
      timeBlocks.push({ ...block, countable: true })
      studyHours += getBlockHours(block.time)
    } else {
      timeBlocks.push(block)
    }
  })
  
  timeBlocks.push({ time: '22:00-22:30', content: '洗漱准备睡觉', type: 'break', countable: false })
  timeBlocks.push({ time: '22:30-07:00', content: '睡觉', type: 'break', countable: false })

  let englishHours = 0
  let theme = '学习日'
  let themeColor = 'blue'
  let focusGoal = '课余时间自主学习'

  const hasMorningClass = dayCourses.some(c => {
    const [start] = c.time.split('-')
    return start < '12:00'
  })
  const hasAfternoonClass = dayCourses.some(c => {
    const [start] = c.time.split('-')
    return start >= '14:00'
  })

  if (dayCourses.length === 0) {
    theme = '自由安排'
    themeColor = 'purple'
    englishHours = 3
    focusGoal = '全面自主学习'
  } else if (!hasMorningClass && !hasAfternoonClass) {
    theme = '半天课程'
    themeColor = 'teal'
    englishHours = 2.5
    focusGoal = '课余学习'
  } else if (!hasMorningClass || !hasAfternoonClass) {
    theme = '一天课程'
    themeColor = 'orange'
    englishHours = 2
    focusGoal = '抓紧学习'
  } else {
    theme = '满课日'
    themeColor = 'blue'
    englishHours = 1.5
    focusGoal = '高效学习'
  }

  return {
    date: dateStr,
    dayOfWeek: dayName,
    theme: theme,
    themeColor: themeColor,
    timeBlocks: timeBlocks,
    focusGoal: focusGoal,
    englishTarget: englishHours,
    studyHours: studyHours
  }
}

function getMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

function getBlockHours(timeStr) {
  const [start, end] = timeStr.split('-')
  return (getMinutes(end) - getMinutes(start)) / 60
}

function generateStudyBlock(start, end) {
  const blocks = []
  const startMinutes = getMinutes(start)
  const endMinutes = getMinutes(end)
  const duration = endMinutes - startMinutes
  
  if (duration <= 0) return blocks
  
  if (duration >= 90) {
    blocks.push({ time: `${formatTime(startMinutes)}-${formatTime(startMinutes + 90)}`, content: '英语学习', detail: '背单词+听力/阅读', type: 'study' })
    const remaining = duration - 90
    if (remaining >= 60) {
      blocks.push({ time: `${formatTime(startMinutes + 90)}-${formatTime(startMinutes + 150)}`, content: 'AI/编程学习', detail: '人工智能或编程实践', type: 'study' })
    }
  } else if (duration >= 60) {
    blocks.push({ time: `${formatTime(startMinutes)}-${formatTime(startMinutes + 60)}`, content: '英语学习', detail: '综合英语训练', type: 'study' })
  } else {
    blocks.push({ time: `${start}-${end}`, content: '自由学习', detail: '单片机/投资/练字等', type: 'study' })
  }
  
  return blocks
}

function generateEveningStudyBlocks(lastTime) {
  const blocks = []
  const lastMinutes = getMinutes(lastTime)
  const morningBreakEnd = 13 * 60
  const eveningStart = 18 * 60 + 30
  
  if (lastMinutes < morningBreakEnd && lastMinutes < eveningStart) {
    const morningStudyEnd = Math.min(morningBreakEnd, eveningStart)
    const morningStudy = generateStudyBlock(lastTime, formatTime(morningStudyEnd))
    morningStudy.forEach(block => {
      block.countable = true
      blocks.push(block)
    })
  }
  
  if (lastMinutes >= morningBreakEnd && lastMinutes < eveningStart) {
    blocks.push({ time: `${formatTime(lastMinutes)}-19:00`, content: '休息放松', type: 'break', countable: false })
  }
  
  if (lastMinutes < eveningStart) {
    blocks.push({ time: '19:00-21:00', content: '英语学习', detail: '综合英语能力提升', type: 'study', countable: true })
    blocks.push({ time: '21:00-22:00', content: '复盘总结', detail: '今日总结+明日计划', type: 'study', countable: true })
  } else if (lastMinutes < getMinutes('22:00')) {
    const eveningStudy = generateStudyBlock(formatTime(lastMinutes), '22:00')
    eveningStudy.forEach(block => {
      block.countable = true
      blocks.push(block)
    })
  }
  
  return blocks
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

async function generateWeeklyPlan() {
  console.log('📖 读取课表...\n')

  const schedulePath = 'diary/大二下13周课表.csv'
  let dayCourses = {
    '周一': [], '周二': [], '周三': [], '周四': [], '周五': [], '周六': [], '周日': []
  }
  
  try {
    const scheduleContent = fs.readFileSync(schedulePath, 'utf-8')
    dayCourses = parseTimetable(scheduleContent)
    console.log('✅ 课表已读取')
    
    Object.entries(dayCourses).forEach(([day, courses]) => {
      console.log(`\n${day} (${courses.length}节课):`)
      courses.forEach(c => {
        console.log(`  ${c.time} - ${c.course} ${c.location ? '@' + c.location : ''}`)
      })
    })
  } catch (err) {
    console.log('⚠️ 课表不存在，使用默认计划')
  }

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dailySchedule = {}
  let totalStudyHours = 0
  let totalEnglishHours = 0
  
  weekDays.forEach((day, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const dateStr = date.toISOString().split('T')[0]
    
    dailySchedule[day] = generateDaySchedule(day, dateStr, dayCourses[day], index)
    totalStudyHours += dailySchedule[day].studyHours
    totalEnglishHours += dailySchedule[day].englishTarget
  })

  const weeklyPlan = {
    week: `第${Math.ceil((today.getTime() - new Date('2026-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))}周`,
    data: {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: [
        { id: 'g1', text: '英语六级考试冲刺', progress: 10, deadline: '2026-06-13', type: 'exam' },
        { id: 'g2', text: '每天英语学习', progress: 0, type: 'study' }
      ],
      longTermGoals: longTermGoals,
      dailySchedule: dailySchedule,
      notes: [
        '课程不需要打卡，只记录自主学习时间',
        '每天英语学习目标已分配',
        '保证充足睡眠，22:30前睡觉',
        '课余时间充分利用，提升技能'
      ],
      weeklyReview: {
        lastWeekSummary: '继续六级冲刺和日常学习',
        thisWeekFocus: '英语学习 + 技能提升',
        nextWeekGoals: '持续学习',
        totalStudyHours: totalStudyHours,
        totalEnglishHours: totalEnglishHours,
        targetHours: 100
      }
    }
  }

  console.log('\n📊 生成的计划摘要:')
  console.log('  周次:', weeklyPlan.week)
  console.log('  日期:', weeklyPlan.data.startDate, '-', weeklyPlan.data.endDate)
  console.log('  本周总学习时长:', totalStudyHours.toFixed(1), '小时')
  console.log('  本周英语目标:', totalEnglishHours.toFixed(1), '小时')

  weekDays.forEach(day => {
    const schedule = dailySchedule[day]
    console.log(`\n${day} (${schedule.date}) - ${schedule.theme}:`)
    console.log(`  学习时长: ${schedule.studyHours.toFixed(1)}h, 英语目标: ${schedule.englishTarget}h`)
    schedule.timeBlocks.forEach(block => {
      const icon = block.type === 'class' ? '📚' : block.countable ? '✓' : '·'
      console.log(`  ${icon} ${block.time} - ${block.content}`)
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
