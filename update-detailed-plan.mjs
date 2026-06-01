import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updatePlan() {
  console.log('📅 更新详细周计划...\n')
  
  const weeklyPlan = {
    week: '第14周',
    data: {
      startDate: '2026-06-02',
      endDate: '2026-06-08',
      goals: [
        { id: '1', text: '工程力学阶段考', progress: 0, deadline: '2026-06-03', type: 'exam' },
        { id: '2', text: '毛概期末考试', progress: 0, deadline: '2026-06-05', type: 'exam' },
        { id: '3', text: '车队汇报准备', progress: 0, deadline: '2026-06-06', type: 'task' },
        { id: '4', text: '英语六级冲刺', progress: 3, totalHours: 100, deadline: '2026-06-13', type: 'study' },
        { id: '5', text: '科目四报名', progress: 0, deadline: '2026-06-08', type: 'task' }
      ],
      dailySchedule: {
        '周一': {
          date: '6月2日',
          dayOfWeek: '周一',
          theme: '课程日',
          themeColor: 'blue',
          timeBlocks: [
            { time: '08:30-10:05', content: '概率论', location: '日新楼南408', type: 'class' },
            { time: '10:25-12:00', content: '工程力学', location: '日新楼南401', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-17:20', content: '环境感知技术', location: '格物园E座908', type: 'class' },
            { time: '17:20-18:30', content: '晚饭休息', type: 'break' },
            { time: '18:30-20:30', content: '英语学习', detail: '背单词1h + 听力真题1套', type: 'study' },
            { time: '20:30-21:00', content: '休息', type: 'break' },
            { time: '21:00-22:30', content: '英语阅读', detail: '2篇仔细阅读+分析', type: 'study' },
            { time: '22:30-23:00', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '工程力学复习',
          englishTarget: 3.5
        },
        '周二': {
          date: '6月3日',
          dayOfWeek: '周二',
          theme: '考试日',
          themeColor: 'red',
          timeBlocks: [
            { time: '08:30-10:00', content: '英语学习', detail: '写作文+背模板', type: 'study' },
            { time: '10:00-12:00', content: '工程力学复习', type: 'study' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-15:35', content: '工程力学考试', location: '日新楼南401', type: 'exam' },
            { time: '15:35-17:00', content: '英语翻译', type: 'study' },
            { time: '17:00-18:30', content: '晚饭休息', type: 'break' },
            { time: '18:30-21:00', content: '英语强化', detail: '听力精听+阅读', type: 'study' },
            { time: '21:00-22:30', content: '毛概复习', type: 'study' },
            { time: '22:30-23:00', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '工程力学考试',
          englishTarget: 5.5
        },
        '周三': {
          date: '6月4日',
          dayOfWeek: '周三',
          theme: '黄金日',
          themeColor: 'green',
          timeBlocks: [
            { time: '08:00-10:00', content: '英语真题', detail: '4篇阅读+分析', type: 'study' },
            { time: '10:00-10:25', content: '休息', type: 'break' },
            { time: '10:25-12:00', content: '平台技术', location: '格物园B座104', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-15:35', content: '体育课', location: '官龙山排球场', type: 'class' },
            { time: '15:35-18:00', content: '英语学习', detail: '听力+翻译', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-22:00', content: '弱项突破', type: 'study' },
            { time: '22:00-22:30', content: '整理错题', type: 'study' },
            { time: '22:30-23:00', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '英语专项突破',
          englishTarget: 7.5
        },
        '周四': {
          date: '6月5日',
          dayOfWeek: '周四',
          theme: '冲刺日',
          themeColor: 'orange',
          timeBlocks: [
            { time: '08:00-10:00', content: '英语学习', detail: '背单词+阅读', type: 'study' },
            { time: '10:00-10:25', content: '休息', type: 'break' },
            { time: '10:25-12:00', content: '概率论', location: '日新楼南402', type: 'class' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-18:00', content: '英语冲刺', detail: '听力+选词填空+阅读', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-21:00', content: '英语写作', detail: '作文+翻译', type: 'study' },
            { time: '21:00-22:00', content: '毛概复习', type: 'study' },
            { time: '22:00-22:30', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '英语全天冲刺',
          englishTarget: 8.0
        },
        '周五': {
          date: '6月6日',
          dayOfWeek: '周五',
          theme: '汇报日',
          themeColor: 'purple',
          timeBlocks: [
            { time: '08:00-09:00', content: '毛概复习', type: 'study' },
            { time: '09:00-10:00', content: '英语单词', type: 'study' },
            { time: '10:00-10:25', content: '休息', type: 'break' },
            { time: '10:25-12:00', content: '毛概考试', type: 'exam' },
            { time: '12:00-14:00', content: '午饭休息', type: 'break' },
            { time: '14:00-16:00', content: '车队汇报准备', type: 'task' },
            { time: '16:00-18:00', content: '英语模拟考', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-22:00', content: '英语专项', detail: '弱项补漏', type: 'study' },
            { time: '22:00-22:30', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '毛概考试+车队汇报',
          englishTarget: 6.5
        },
        '周六': {
          date: '6月7日',
          dayOfWeek: '周六',
          theme: '模拟日',
          themeColor: 'teal',
          timeBlocks: [
            { time: '08:00-08:30', content: '起床早饭', type: 'break' },
            { time: '08:30-11:30', content: '英语模拟考', detail: '全套限时', type: 'exam' },
            { time: '11:30-12:00', content: '休息', type: 'break' },
            { time: '12:00-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-15:00', content: '批改卷子', type: 'study' },
            { time: '15:00-18:00', content: '专项强化', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-21:00', content: '整理错题', type: 'study' },
            { time: '21:00-22:00', content: '自由安排', type: 'break' },
            { time: '22:00-22:30', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '英语模拟考',
          englishTarget: 9.0
        },
        '周日': {
          date: '6月8日',
          dayOfWeek: '周日',
          theme: '复习日',
          themeColor: 'pink',
          timeBlocks: [
            { time: '08:00-10:00', content: '英语复习', detail: '高频词+错题', type: 'study' },
            { time: '10:00-10:30', content: '休息', type: 'break' },
            { time: '10:30-12:30', content: '听力练习', detail: '精听+跟读', type: 'study' },
            { time: '12:30-14:00', content: '午饭+午休', type: 'break' },
            { time: '14:00-18:00', content: '阅读+写译', type: 'study' },
            { time: '18:00-19:00', content: '晚饭休息', type: 'break' },
            { time: '19:00-21:00', content: '考前总复习', type: 'study' },
            { time: '21:00-22:00', content: '准备下周', type: 'task' },
            { time: '22:00-22:30', content: '洗漱睡觉', type: 'break' }
          ],
          focusGoal: '考前冲刺复习',
          englishTarget: 8.0
        }
      },
      notes: [
        '每天23:00前上床，不带手机',
        '到车队/图书馆先打开英语资料',
        '抖音/小游戏考前禁止',
        '状态再差也要学够1小时',
        '朋友约玩 → 六级后再约'
      ],
      weeklyReview: {
        lastWeekSummary: '科目三已过！但英语学习断断续续，时间管理需要改进，作息不规律',
        thisWeekFocus: '工程力学阶段考、毛概期末考、六级冲刺、车队汇报',
        nextWeekGoals: '六级最后冲刺、科目四考试',
        totalEnglishHours: 51,
        targetHours: 100
      }
    }
  }

  try {
    await supabase
      .from('weekly_plans')
      .update(weeklyPlan)
      .eq('week', '第14周')
    
    console.log('✅ 详细周计划已更新！')
    console.log('\n📋 本周主题：')
    Object.keys(weeklyPlan.data.dailySchedule).forEach(day => {
      const plan = weeklyPlan.data.dailySchedule[day]
      console.log(`  ${day} (${plan.themeColor}) → ${plan.theme}`)
    })
  } catch (error) {
    console.error('❌ 更新失败:', error.message)
  }
}

updatePlan()
