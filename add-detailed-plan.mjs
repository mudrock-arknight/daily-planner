import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addDetailedPlan() {
  console.log('📅 添加第13周详细计划...\n')
  
  try {
    const weeklyPlan = {
      week: '第13周',
      data: {
        startDate: '2026-06-01',
        endDate: '2026-06-07',
        goals: [
          { id: '1', text: '完成工程力学阶段考准备', type: 'exam', progress: 0, deadline: '2026-06-02' },
          { id: '2', text: '完成毛概期末考准备', type: 'exam', progress: 0, deadline: '2026-06-04' },
          { id: '3', text: '每日2小时英语，累计到100小时（六级备考）', type: 'study', progress: 3, deadline: '2026-06-13' },
          { id: '4', text: '学习AI基础与机器学习概念', type: 'study', progress: 0 },
          { id: '5', text: '完成东方财富投资基础课程', type: 'study', progress: 0 },
          { id: '6', text: '每天10分钟打字练习', type: 'task', progress: 0 },
          { id: '7', text: '每天15分钟练字', type: 'task', progress: 0 },
          { id: '8', text: '单片机开发入门学习', type: 'study', progress: 0 }
        ],
        weeklyReview: {
          totalEnglishHours: 3,
          targetHours: 100,
          lastWeekSummary: '刚考完科目三，准备6月考试',
          thisWeekFocus: '工程力学和毛概考试准备 + 六级备考',
          nextWeekGoals: '继续推进长期目标学习'
        },
        notes: [
          '6月2日（周一）工程力学阶段考',
          '6月4日（周三）毛概期末考试',
          '6月13日（周六）英语六级考试',
          '每天2小时英语学习，确保进度'
        ],
        longTermGoals: [
          { id: '1', text: '雅思高分通过', category: 'language', progress: 5 },
          { id: '2', text: 'AI技术与机器学习学习', category: 'tech', progress: 10 },
          { id: '3', text: '投资知识学习与基金证', category: 'finance', progress: 8 },
          { id: '4', text: '编程能力提升（Python/C++）', category: 'tech', progress: 15 },
          { id: '5', text: '单片机开发入门', category: 'tech', progress: 0 },
          { id: '6', text: '打字速度提升（每分钟80字）', category: 'skill', progress: 20 },
          { id: '7', text: '书法练习（工整字体）', category: 'skill', progress: 5 },
          { id: '8', text: '普通话提升（二乙水平）', category: 'skill', progress: 30 },
          { id: '9', text: '音乐爱好（钢琴/吉他）', category: 'hobby', progress: 0 }
        ],
        dailySchedule: {
          '周一': {
            date: '2026-06-02',
            theme: '工程力学阶段考备考日',
            themeColor: 'blue',
            englishTarget: 2,
            focusGoal: '工程力学考试准备',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task', detail: '23:00前上床睡觉' },
              { time: '07:00-07:40', content: '早餐 + 晨背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-08:30', content: '去教室 + 课前准备', type: 'task', location: '日新楼' },
              { time: '08:30-10:05', content: '概率论与数理统计', type: 'class', location: '日新楼南 408', detail: '李博文老师，第1-2节合并' },
              { time: '10:05-10:25', content: '课间休息 + 准备下一科', type: 'break', location: '教学楼' },
              { time: '10:25-12:00', content: '工程力学一（阶段考复习重点）', type: 'class', location: '日新楼南 401', detail: '赵升升老师，第3-4节合并' },
              { time: '12:00-13:00', content: '午餐 + 休息放松', type: 'break', location: '食堂' },
              { time: '13:00-13:45', content: '午休 + 复习工程力学', type: 'study', detail: '考前最后复习' },
              { time: '13:45-14:00', content: '去教学楼', type: 'task', location: '格物园' },
              { time: '14:00-17:20', content: '智能汽车环境感知技术', type: 'class', location: '908（格物园E座）', detail: '林艳艳老师，第5-8节合并' },
              { time: '17:20-18:00', content: '车队工作', type: 'task', location: '车队' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语听力 + 阅读训练', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语写作 + 背单词', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: 'AI基础概念学习', type: 'study', detail: '机器学习入门' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task', detail: '22:45前上床' }
            ]
          },
          '周二': {
            date: '2026-06-03',
            theme: '概率论学习 + 六级备考',
            themeColor: 'green',
            englishTarget: 2,
            focusGoal: '概率论复习 + 英语真题',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task' },
              { time: '07:00-07:40', content: '早餐 + 背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-10:25', content: '上午空课 - 六级英语阅读训练', type: 'study', detail: '英语1.5小时' },
              { time: '10:25-12:00', content: '概率论与数理统计', type: 'class', location: '日新楼南 408', detail: '李博文老师，第3-4节合并' },
              { time: '12:00-13:00', content: '午餐', type: 'break', location: '食堂' },
              { time: '13:00-13:45', content: '午休', type: 'break' },
              { time: '13:45-14:00', content: '去教室', type: 'task' },
              { time: '14:00-15:35', content: '工程力学一', type: 'class', location: '日新楼南 401', detail: '赵升升老师，第5-6节合并' },
              { time: '15:35-18:00', content: '车队工作', type: 'task', location: '车队' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语真题训练', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语写作 + 背单词', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: '投资基础课程学习', type: 'study', detail: '东方财富课程' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task' }
            ]
          },
          '周三': {
            date: '2026-06-04',
            theme: '毛概期末考试日',
            themeColor: 'orange',
            englishTarget: 2,
            focusGoal: '毛概考试准备',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task' },
              { time: '07:00-07:40', content: '早餐 + 晨背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-08:30', content: '毛概考前最后复习', type: 'study', detail: '重点背诵' },
              { time: '08:30-10:05', content: '智能汽车平台技术', type: 'class', location: '格物园B座104', detail: '曾子铭老师，第1-2节合并' },
              { time: '10:05-10:25', content: '课间休息', type: 'break' },
              { time: '10:25-12:00', content: '智能汽车平台技术', type: 'class', location: '格物园B座104', detail: '曾子铭老师，第3-4节合并' },
              { time: '12:00-13:00', content: '午餐', type: 'break', location: '食堂' },
              { time: '13:00-13:45', content: '午休', type: 'break' },
              { time: '13:45-14:00', content: '去排球场', type: 'task' },
              { time: '14:00-15:35', content: '大学体育（4）- 排球', type: 'class', location: 'B2官龙山排球场1', detail: '郑军老师，第5-6节合并' },
              { time: '15:35-18:00', content: '车队工作 + 游泳', type: 'task', location: '车队、游泳馆' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语听力 + 阅读', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语写作训练', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: '编程练习', type: 'study', detail: 'Python基础' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task' }
            ]
          },
          '周四': {
            date: '2026-06-05',
            theme: '六级备考 + 课程学习',
            themeColor: 'blue',
            englishTarget: 2,
            focusGoal: '英语真题训练',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task' },
              { time: '07:00-07:40', content: '早餐 + 背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-10:25', content: '空课 - 英语阅读 + 听力训练', type: 'study', detail: '英语1.5小时' },
              { time: '10:25-12:00', content: '概率论与数理统计', type: 'class', location: '日新楼南 402', detail: '李博文老师，第3-4节合并' },
              { time: '12:00-13:00', content: '午餐', type: 'break', location: '食堂' },
              { time: '13:00-13:45', content: '午休', type: 'break' },
              { time: '13:45-18:00', content: '车队工作', type: 'task', location: '车队' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语真题训练', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语写作 + 背单词', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: '单片机入门学习', type: 'study', detail: '基础概念' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task' }
            ]
          },
          '周五': {
            date: '2026-06-06',
            theme: '周五学习日',
            themeColor: 'purple',
            englishTarget: 2,
            focusGoal: '课程 + 六级备考',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task' },
              { time: '07:00-07:40', content: '早餐 + 背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-10:25', content: '空课 - 英语阅读训练', type: 'study', detail: '英语1小时' },
              { time: '10:25-12:00', content: '工程力学一', type: 'class', location: '日新楼南 401', detail: '赵升升老师，第3-4节合并' },
              { time: '12:00-13:00', content: '午餐', type: 'break', location: '食堂' },
              { time: '13:00-13:45', content: '午休', type: 'break' },
              { time: '13:45-18:00', content: '车队工作', type: 'task', location: '车队' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语听力 + 阅读', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语真题训练', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: 'AI机器学习学习', type: 'study', detail: '基础概念' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task' }
            ]
          },
          '周六': {
            date: '2026-06-07',
            theme: '周末自主学习日',
            themeColor: 'teal',
            englishTarget: 2,
            focusGoal: '长期目标推进',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task' },
              { time: '07:00-07:40', content: '早餐 + 背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-09:00', content: '英语听力 + 阅读', type: 'study', detail: '英语1.5小时' },
              { time: '09:00-10:00', content: 'AI机器学习学习', type: 'study', detail: '算法基础' },
              { time: '10:00-10:15', content: '休息', type: 'break' },
              { time: '10:15-11:15', content: '投资基础课程学习', type: 'study', detail: '东方财富课程' },
              { time: '11:15-12:00', content: '编程练习', type: 'study', detail: 'Python' },
              { time: '12:00-13:00', content: '午餐', type: 'break', location: '食堂' },
              { time: '13:00-14:00', content: '午休', type: 'break' },
              { time: '14:00-15:30', content: '车队工作', type: 'task', location: '车队' },
              { time: '15:30-17:30', content: '运动锻炼', type: 'task', location: '游泳馆/操场', detail: '游泳或跑步' },
              { time: '17:30-18:00', content: '回宿舍休息', type: 'break' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语真题训练', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语写作 + 背单词', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: '放松看电影/听音乐', type: 'break', detail: '娱乐休息' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task' }
            ]
          },
          '周日': {
            date: '2026-06-08',
            theme: '周末调整与长期目标',
            themeColor: 'pink',
            englishTarget: 2,
            focusGoal: '长期目标集中学习',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱、整理', type: 'task' },
              { time: '07:00-07:40', content: '早餐 + 背单词', type: 'study', detail: '英语高频词50个' },
              { time: '07:40-09:00', content: '英语阅读 + 听力训练', type: 'study', detail: '英语1.5小时' },
              { time: '09:00-10:00', content: '单片机入门学习', type: 'study', detail: '开发板基础' },
              { time: '10:00-10:15', content: '休息', type: 'break' },
              { time: '10:15-11:15', content: '普通话练习', type: 'study', detail: '朗读训练' },
              { time: '11:15-12:00', content: '音乐爱好（钢琴/吉他）', type: 'task', detail: '入门练习' },
              { time: '12:00-13:00', content: '午餐', type: 'break', location: '食堂' },
              { time: '13:00-14:00', content: '午休', type: 'break' },
              { time: '14:00-16:00', content: '车队工作', type: 'task', location: '车队' },
              { time: '16:00-17:30', content: '运动锻炼', type: 'task', location: '操场', detail: '跑步' },
              { time: '17:30-18:00', content: '回宿舍休息', type: 'break' },
              { time: '18:00-18:30', content: '晚餐', type: 'break', location: '食堂' },
              { time: '18:30-19:30', content: '英语写作训练', type: 'study', detail: '英语1小时' },
              { time: '19:30-20:30', content: '英语真题 + 背单词', type: 'study', detail: '英语1小时' },
              { time: '20:30-21:00', content: '打字练习', type: 'task', detail: '10分钟' },
              { time: '21:00-21:15', content: '书法练字', type: 'task', detail: '15分钟' },
              { time: '21:15-22:00', content: '周总结回顾', type: 'task', detail: '回顾本周，规划下周' },
              { time: '22:00-22:45', content: '洗漱、放松、准备睡觉', type: 'task' }
            ]
          }
        }
      }
    }

    console.log('📝 周计划数据已准备完成...')
    
    // 先删除可能存在的第13周旧数据
    const { error: deleteError } = await supabase
      .from('weekly_plans')
      .delete()
      .eq('week', '第13周')
    
    if (deleteError) {
      console.log('⚠️ 删除旧数据时出错，但继续插入新数据')
    }

    // 插入新数据
    const { data: insertedPlan, error } = await supabase
      .from('weekly_plans')
      .insert(weeklyPlan)
      .select()

    if (error) throw error

    console.log('✅ 第13周详细计划已添加！\n')
    
    console.log('📋 本周目标列表：')
    insertedPlan[0].data.goals.forEach((goal, idx) => {
      console.log(`  ${idx + 1}. ${goal.text}${goal.deadline ? ` (截止: ${goal.deadline})` : ''}`)
    })

    console.log('\n📅 每日计划概览：')
    const days = Object.keys(insertedPlan[0].data.dailySchedule)
    days.forEach(day => {
      const schedule = insertedPlan[0].data.dailySchedule[day]
      console.log(`  ${day} (${schedule.date}): ${schedule.theme}, ${schedule.timeBlocks.length}个时间块`)
    })

    console.log('\n🚀 已完成！现在请刷新应用查看完整计划')
    console.log('🌐 https://mudrock-arknight.github.io/daily-planner/')
    console.log('\n💡 功能提示：')
    console.log('  - 点击"计划"查看每日详细安排')
    console.log('  - 点击圆圈标记时间块完成状态')
    console.log('  - 在"周计划"页面查看完整周目标和长期目标')
    console.log('  - 在"统计"页面查看英语学习进度')
    console.log('\n✨ 第13周详细计划添加完成！祝你学习顺利！')

  } catch (error) {
    console.error('❌ 操作失败：', error)
    if (error.message) console.error('错误详情：', error.message)
  }
}

addDetailedPlan()
