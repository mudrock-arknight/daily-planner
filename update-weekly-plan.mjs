import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updateWeeklyPlan() {
  console.log('📅 更新第14周详细计划...\n')
  
  try {
    const weeklyPlan = {
      week: '第14周',
      data: {
        startDate: '2026-06-02',
        endDate: '2026-06-08',
        goals: [
          { id: '1', text: '工程力学阶段考', progress: 0, deadline: '2026-06-03' },
          { id: '2', text: '毛概期末考试', progress: 0, deadline: '2026-06-05' },
          { id: '3', text: '车队汇报准备', progress: 0, deadline: '2026-06-06' },
          { id: '4', text: '英语六级冲刺', progress: 3, totalHours: 100, deadline: '2026-06-13' },
          { id: '5', text: '科目四报名', progress: 0, deadline: '2026-06-08' }
        ],
        dailySchedule: {
          '周一': {
            classes: ['概率论 8:30-10:05', '工程力学 10:25-12:00', '环境感知 14:00-17:20'],
            tasks: ['工程力学复习', '英语背单词1h', '听力真题1套'],
            focusTime: '18:30-22:30'
          },
          '周二': {
            classes: ['工程力学 14:00-15:35', '平台技术 14:00-15:35'],
            tasks: ['英语作文练习', '翻译练习', '工程力学复习'],
            focusTime: '08:30-10:00, 15:35-21:00'
          },
          '周三': {
            classes: ['平台技术 10:25-12:00', '体育 14:00-15:35'],
            tasks: ['英语真题阅读', '听力精听', '毛概复习'],
            focusTime: '08:00-10:00, 15:35-22:00'
          },
          '周四': {
            classes: ['概率论 10:25-12:00'],
            tasks: ['英语全天冲刺', '工程力学阶段考复习'],
            focusTime: '08:00-10:00, 14:00-21:00'
          },
          '周五': {
            classes: ['工程力学 10:25-12:00'],
            tasks: ['工程力学阶段考', '英语模拟考', '车队汇报准备'],
            focusTime: '09:00-10:00, 14:00-22:00'
          },
          '周六': {
            classes: [],
            tasks: ['英语模拟考(3h)', '错题专项强化', '科目四报名'],
            focusTime: '08:30-11:30, 14:00-21:00'
          },
          '周日': {
            classes: [],
            tasks: ['英语全面复习', '作文模板背诵', '下周计划整理'],
            focusTime: '08:00-12:30, 14:00-21:00'
          }
        },
        timeBlocks: {},
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
          nextWeekGoals: '六级最后冲刺、科目四考试'
        }
      }
    }
    
    const { data: existingPlan, error: checkError } = await supabase
      .from('weekly_plans')
      .select('id')
      .eq('week', '第14周')
    
    if (checkError) throw checkError
    
    let result
    if (existingPlan && existingPlan.length > 0) {
      console.log('🔄 更新现有周计划...')
      result = await supabase
        .from('weekly_plans')
        .update(weeklyPlan)
        .eq('week', '第14周')
        .select()
    } else {
      console.log('➕ 创建新周计划...')
      result = await supabase
        .from('weekly_plans')
        .insert(weeklyPlan)
        .select()
    }
    
    if (result.error) throw result.error
    
    console.log('✅ 周计划已更新！')
    console.log('\n📋 本周目标：')
    weeklyPlan.data.goals.forEach(goal => {
      const progress = goal.progress ? ` (${goal.progress}%)` : ''
      console.log(`  🎯 ${goal.text}${progress}`)
    })
    
    console.log('\n⏰ 本周重要时间节点：')
    console.log('  📅 周一 6/2 → 工程力学阶段考')
    console.log('  📅 周三 6/4 → 毛概期末考试')
    console.log('  📅 周五 6/6 → 车队汇报')
    console.log('  📅 周六 6/7 → 科目四报名（待定）')
    console.log('  ⏳ 六级倒计时：11天')
    
    console.log('\n' + '='.repeat(50))
    console.log('🌐 刷新网站查看完整计划：')
    console.log('   https://mudrock-arknight.github.io/daily-planner/')
    
  } catch (error) {
    console.error('❌ 更新失败：', error.message)
  }
}

updateWeeklyPlan()
