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

async function generateWeeklyPlan() {
  console.log('📖 读取日记...\n')
  
  const diaryPath = 'diary/26.5.31.txt'
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
  
  try {
    scheduleContent = fs.readFileSync(schedulePath, 'utf-8')
    console.log('✅ 课表已读取')
  } catch (err) {
    console.log('⚠️ 课表文件不存在，使用默认数据')
  }
  
  const courses = scheduleContent ? parseCSV(scheduleContent) : {}
  const diary = parseDiary(diaryContent)
  
  console.log('\n📝 生成周计划...\n')
  
  const weeklyPlan = {
    week: '第15周',
    data: {
      startDate: '2026-06-09',
      endDate: '2026-06-15',
      goals: [
        { id: '1', text: '英语六级考试', progress: 0, deadline: '2026-06-13', type: 'exam' },
        { id: '2', text: '每日单词背诵', progress: 50, totalHours: 100, deadline: '2026-06-13', type: 'study' },
        { id: '3', text: '模拟题练习', progress: 30, totalHours: 100, deadline: '2026-06-13', type: 'study' }
      ],
      dailySchedule: {
        '周一': {
          date: '6月9日',
          dayOfWeek: '周一',
          theme: '冲刺日',
          themeColor: 'blue',
          timeBlocks: [
            { time: '08:30-10:05', content: '概率论', location: '日新楼南408', type: 'class' },
            { time: '10:25-12:00', content: '工程力学', location: '日新楼南401', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-17:20', content: '环境感知技术', location: '格物园E座908', type: 'class' },
            { time: '17:20-18:30', content: '晚饭休息', type: 'break' },
            { time: '18:30-21:00', content: '英语学习', detail: '背单词+阅读', type: 'study' },
            { time: '21:00-22:00', content: '英语听力', type: 'study' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '英语冲刺',
          englishTarget: 4.0
        },
        '周二': {
          date: '6月10日',
          dayOfWeek: '周二',
          theme: '强化日',
          themeColor: 'red',
          timeBlocks: [
            { time: '08:00-10:00', content: '英语单词', type: 'study' },
            { time: '10:00-12:00', content: '工程力学', location: '日新楼南401', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-16:00', content: '英语阅读', type: 'study' },
            { time: '16:00-18:00', content: '英语写作', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-22:00', content: '英语综合练习', type: 'study' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '英语强化',
          englishTarget: 5.0
        },
        '周三': {
          date: '6月11日',
          dayOfWeek: '周三',
          theme: '模拟日',
          themeColor: 'green',
          timeBlocks: [
            { time: '08:00-10:00', content: '英语真题', type: 'exam' },
            { time: '10:25-12:00', content: '平台技术', location: '格物园B座104', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-15:35', content: '体育课', location: '官龙山排球场', type: 'class' },
            { time: '15:35-18:00', content: '批改卷子', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-22:00', content: '弱项突破', type: 'study' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '真题模拟',
          englishTarget: 5.5
        },
        '周四': {
          date: '6月12日',
          dayOfWeek: '周四',
          theme: '冲刺日',
          themeColor: 'orange',
          timeBlocks: [
            { time: '08:00-10:00', content: '英语单词复习', type: 'study' },
            { time: '10:25-12:00', content: '概率论', location: '日新楼南402', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-18:00', content: '英语全面复习', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-22:00', content: '作文模板背诵', type: 'study' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '最后冲刺',
          englishTarget: 6.0
        },
        '周五': {
          date: '6月13日',
          dayOfWeek: '周五',
          theme: '考试日',
          themeColor: 'purple',
          timeBlocks: [
            { time: '08:00-12:00', content: '英语六级考试', type: 'exam' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-16:00', content: '英语学习', location: '日新楼南401', type: 'class' },
            { time: '16:00-18:00', content: '放松休息', type: 'break' },
            { time: '18:00-19:00', content: '晚饭', type: 'break' },
            { time: '19:00-22:00', content: '自由安排', type: 'task' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '六级考试',
          englishTarget: 0
        },
        '周六': {
          date: '6月14日',
          dayOfWeek: '周六',
          theme: '休息日',
          themeColor: 'teal',
          timeBlocks: [
            { time: '08:00-10:00', content: '睡懒觉', type: 'break' },
            { time: '10:00-12:00', content: '休息娱乐', type: 'break' },
            { time: '12:00-14:00', content: '午饭', type: 'break' },
            { time: '14:00-18:00', content: '自由活动', type: 'task' },
            { time: '18:00-19:00', content: '晚饭', type: 'break' },
            { time: '19:00-22:00', content: '放松休息', type: 'break' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '考后放松',
          englishTarget: 0
        },
        '周日': {
          date: '6月15日',
          dayOfWeek: '周日',
          theme: '准备日',
          themeColor: 'pink',
          timeBlocks: [
            { time: '08:00-10:00', content: '起床准备', type: 'break' },
            { time: '10:00-12:00', content: '下周计划', type: 'task' },
            { time: '12:00-14:00', content: '午饭', type: 'break' },
            { time: '14:00-18:00', content: '学习/活动', type: 'study' },
            { time: '18:00-19:00', content: '晚饭', type: 'break' },
            { time: '19:00-22:00', content: '整理准备', type: 'task' },
            { time: '22:00-23:00', content: '洗漱休息', type: 'break' }
          ],
          focusGoal: '准备下周',
          englishTarget: 0
        }
      },
      notes: [
        '六级考试倒计时：4天',
        '每天坚持背单词',
        '注意休息，保持状态'
      ],
      weeklyReview: {
        lastWeekSummary: diary.reflection || '上周继续六级冲刺学习',
        thisWeekFocus: diary.goals.join(', ') || '英语六级考试准备',
        nextWeekGoals: diary.plans.join(', ') || '考试后休整',
        totalEnglishHours: 20,
        targetHours: 100
      }
    }
  }
  
  console.log('📊 生成的计划摘要:')
  console.log('  周次:', weeklyPlan.week)
  console.log('  日期:', weeklyPlan.data.startDate, '-', weeklyPlan.data.endDate)
  console.log('  目标数量:', weeklyPlan.data.goals.length)
  console.log('  每日安排: 完整7天')
  
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
  console.log('  - 7天详细时间安排')
  console.log('  - 每日学习目标')
  console.log('  - 英语学习时间追踪')
  console.log('  - 重要提醒')
}

updateWeeklyPlan()
