import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updateWeeklyPlan() {
  console.log('📅 更新第13周详细计划...\n')
  
  try {
    const weeklyPlan = {
      week: '第13周',
      data: {
        startDate: '2026-06-01',
        endDate: '2026-06-07',
        goals: [
          { id: '1', text: '工程力学阶段考准备', progress: 0, type: 'exam', deadline: '2026-06-02' },
          { id: '2', text: '毛概期末考试准备', progress: 0, type: 'exam', deadline: '2026-06-04' },
          { id: '3', text: '英语六级每日2h', progress: 3, totalHours: 100, type: 'study', deadline: '2026-06-13' },
          { id: '4', text: '车队工作跟进', progress: 0, type: 'task', deadline: '2026-06-06' },
          { id: '5', text: '科目四报名', progress: 0, type: 'task', deadline: '2026-06-07' }
        ],
        longTermGoals: [
          '雅思备考',
          'AI技术学习',
          '投资知识',
          '编程技能提升',
          '单片机开发',
          '打字练习',
          '书法练字',
          '音乐爱好',
          '普通话练习'
        ],
        dailySchedule: {
          '周一': {
            date: '2026-06-01',
            theme: '工程力学复习日',
            themeColor: 'blue',
            englishTarget: 2,
            focusGoal: '工程力学阶段考复习',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '整理床铺，洗漱完毕' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '营养早餐' },
              { time: '07:30-08:20', content: '英语听力训练', type: 'study', location: '车队', detail: '精听30分钟，泛听20分钟', countable: true },
              { time: '08:30-10:05', content: '概率论与数理统计', type: 'class', location: '日新楼南408', detail: '第1-2节合并' },
              { time: '10:05-10:25', content: '课间休息', type: 'break', detail: '活动放松' },
              { time: '10:25-12:00', content: '工程力学一', type: 'class', location: '日新楼南401', detail: '第3-4节合并' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '规律饮食' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '休息恢复精力' },
              { time: '13:40-14:00', content: '前往教室', type: 'break', detail: '准备课程' },
              { time: '14:00-17:20', content: '智能汽车环境感知技术', type: 'class', location: '格物园E座908', detail: '第5-8节合并' },
              { time: '17:20-18:00', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:00-19:00', content: '车队工作', type: 'task', location: '车队', detail: '处理车队日常事务' },
              { time: '19:00-20:30', content: '工程力学复习', type: 'study', location: '图书馆', detail: '阶段考重点复习', countable: true },
              { time: '20:30-21:30', content: '英语阅读训练', type: 'study', location: '图书馆', detail: '仔细阅读2篇', countable: true },
              { time: '21:30-22:00', content: '练字', type: 'task', location: '宿舍', detail: '书法练习30分钟' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          },
          '周二': {
            date: '2026-06-02',
            theme: '工程力学考试日',
            themeColor: 'red',
            englishTarget: 2,
            focusGoal: '工程力学阶段考',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '早起准备考试' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '清淡饮食' },
              { time: '07:30-08:20', content: '英语单词背诵', type: 'study', location: '车队', detail: '背诵100个单词', countable: true },
              { time: '08:20-10:05', content: '工程力学考前复习', type: 'study', location: '教室', detail: '快速浏览重点', countable: true },
              { time: '10:05-10:25', content: '准备考试', type: 'break', detail: '检查考试用品' },
              { time: '10:25-12:00', content: '概率论与数理统计', type: 'class', location: '日新楼南408', detail: '第3-4节合并' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '补充能量' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '短暂休息' },
              { time: '13:40-14:00', content: '前往考场', type: 'break', detail: '提前到达考场' },
              { time: '14:00-15:35', content: '工程力学阶段考', type: 'exam', location: '日新楼南401', detail: '第5-6节考试' },
              { time: '15:35-16:00', content: '考试后放松', type: 'break', detail: '稍作休息' },
              { time: '16:00-17:30', content: '车队工作', type: 'task', location: '车队', detail: '跟进项目进度' },
              { time: '17:30-18:10', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:10-19:40', content: '英语真题训练', type: 'study', location: '图书馆', detail: '做一套真题', countable: true },
              { time: '19:40-20:40', content: '编程练习', type: 'study', location: '宿舍', detail: '算法题练习' },
              { time: '20:40-21:20', content: '打字练习', type: 'task', location: '宿舍', detail: '打字速度训练' },
              { time: '21:20-22:00', content: '音乐欣赏', type: 'break', location: '宿舍', detail: '放松心情' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          },
          '周三': {
            date: '2026-06-03',
            theme: '毛概复习日',
            themeColor: 'purple',
            englishTarget: 2,
            focusGoal: '毛概期末考试准备',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '规律作息' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '营养早餐' },
              { time: '07:30-08:20', content: '英语听力训练', type: 'study', location: '车队', detail: '精听训练', countable: true },
              { time: '08:20-10:00', content: '毛概复习', type: 'study', location: '图书馆', detail: '背诵重点内容', countable: true },
              { time: '10:00-10:25', content: '课间休息', type: 'break', detail: '活动放松' },
              { time: '10:25-12:00', content: '智能汽车平台技术', type: 'class', location: '格物园B座104', detail: '第3-4节合并' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '规律饮食' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '休息恢复' },
              { time: '13:40-14:00', content: '前往操场', type: 'break', detail: '准备体育课' },
              { time: '14:00-15:35', content: '大学体育（排球）', type: 'class', location: '官龙山排球场1', detail: '第5-6节合并' },
              { time: '15:35-16:00', content: '运动后休息', type: 'break', detail: '放松肌肉' },
              { time: '16:00-17:30', content: '车队工作', type: 'task', location: '车队', detail: '项目讨论' },
              { time: '17:30-18:10', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:10-19:40', content: '毛概复习', type: 'study', location: '图书馆', detail: '继续背诵', countable: true },
              { time: '19:40-21:00', content: '英语阅读与写作', type: 'study', location: '图书馆', detail: '阅读+写作练习', countable: true },
              { time: '21:00-21:40', content: '普通话练习', type: 'task', location: '宿舍', detail: '朗读练习' },
              { time: '21:40-22:00', content: 'AI技术学习', type: 'study', location: '宿舍', detail: '基础知识学习' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          },
          '周四': {
            date: '2026-06-04',
            theme: '毛概考试日',
            themeColor: 'red',
            englishTarget: 2,
            focusGoal: '毛概期末考试',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '早起准备考试' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '清淡饮食' },
              { time: '07:30-08:20', content: '英语单词背诵', type: 'study', location: '车队', detail: '单词记忆', countable: true },
              { time: '08:20-10:00', content: '毛概考前复习', type: 'study', location: '教室', detail: '快速回顾', countable: true },
              { time: '10:00-10:25', content: '准备考试', type: 'break', detail: '检查考试用品' },
              { time: '10:25-12:00', content: '概率论与数理统计', type: 'class', location: '日新楼南402', detail: '第3-4节合并' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '补充能量' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '短暂休息' },
              { time: '13:40-14:00', content: '前往考场', type: 'break', detail: '提前到达' },
              { time: '14:00-16:00', content: '毛概期末考试', type: 'exam', location: '待通知', detail: '期末考试' },
              { time: '16:00-16:30', content: '考试后放松', type: 'break', detail: '稍作休息' },
              { time: '16:30-18:00', content: '车队工作', type: 'task', location: '车队', detail: '汇报准备' },
              { time: '18:00-18:40', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:40-20:10', content: '英语真题训练', type: 'study', location: '图书馆', detail: '真题练习', countable: true },
              { time: '20:10-21:00', content: '投资知识学习', type: 'study', location: '宿舍', detail: '基础理财知识' },
              { time: '21:00-21:40', content: '单片机入门', type: 'study', location: '宿舍', detail: '基础学习' },
              { time: '21:40-22:00', content: '练字', type: 'task', location: '宿舍', detail: '书法练习' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          },
          '周五': {
            date: '2026-06-05',
            theme: '车队汇报日',
            themeColor: 'green',
            englishTarget: 2,
            focusGoal: '车队工作汇报',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '规律作息' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '营养早餐' },
              { time: '07:30-08:20', content: '英语听力训练', type: 'study', location: '车队', detail: '听力练习', countable: true },
              { time: '08:20-10:00', content: '车队汇报准备', type: 'task', location: '车队', detail: '准备汇报材料' },
              { time: '10:00-10:25', content: '课间休息', type: 'break', detail: '活动放松' },
              { time: '10:25-12:00', content: '工程力学一', type: 'class', location: '日新楼南401', detail: '第3-4节合并' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '规律饮食' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '休息恢复' },
              { time: '13:40-14:00', content: '前往车队', type: 'break', detail: '准备汇报' },
              { time: '14:00-16:00', content: '车队工作汇报', type: 'task', location: '车队', detail: '项目进度汇报' },
              { time: '16:00-16:30', content: '汇报后讨论', type: 'break', detail: '交流讨论' },
              { time: '16:30-17:30', content: '自由活动', type: 'break', location: '校园', detail: '放松一下' },
              { time: '17:30-18:10', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:10-19:40', content: '英语阅读训练', type: 'study', location: '图书馆', detail: '阅读练习', countable: true },
              { time: '19:40-21:00', content: '雅思听力入门', type: 'study', location: '图书馆', detail: '雅思基础训练', countable: true },
              { time: '21:00-21:40', content: '音乐练习', type: 'task', location: '宿舍', detail: '乐器练习' },
              { time: '21:40-22:00', content: '打字练习', type: 'task', location: '宿舍', detail: '速度训练' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          },
          '周六': {
            date: '2026-06-06',
            theme: '综合提升日',
            themeColor: 'orange',
            englishTarget: 2.5,
            focusGoal: '英语六级冲刺+长期目标',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '早起学习' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '营养早餐' },
              { time: '07:30-09:00', content: '英语真题训练', type: 'study', location: '图书馆', detail: '完整真题', countable: true },
              { time: '09:00-09:15', content: '休息', type: 'break', detail: '活动一下' },
              { time: '09:15-10:45', content: '英语错题分析', type: 'study', location: '图书馆', detail: '错题总结', countable: true },
              { time: '10:45-11:00', content: '休息', type: 'break', detail: '放松眼睛' },
              { time: '11:00-12:00', content: 'AI技术学习', type: 'study', location: '图书馆', detail: '机器学习基础' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '规律饮食' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '休息恢复' },
              { time: '13:40-15:10', content: '编程练习', type: 'study', location: '宿舍', detail: '项目开发' },
              { time: '15:10-15:25', content: '休息', type: 'break', detail: '活动放松' },
              { time: '15:25-16:55', content: '单片机学习', type: 'study', location: '车队', detail: '实践操作' },
              { time: '16:55-17:10', content: '休息', type: 'break', detail: '放松一下' },
              { time: '17:10-18:10', content: '运动锻炼', type: 'break', location: '操场', detail: '跑步+拉伸' },
              { time: '18:10-18:50', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:50-20:20', content: '英语写作训练', type: 'study', location: '图书馆', detail: '作文练习', countable: true },
              { time: '20:20-21:00', content: '练字', type: 'task', location: '宿舍', detail: '书法练习' },
              { time: '21:00-21:40', content: '投资知识学习', type: 'study', location: '宿舍', detail: '理财基础' },
              { time: '21:40-22:00', content: '音乐欣赏', type: 'break', location: '宿舍', detail: '放松心情' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          },
          '周日': {
            date: '2026-06-07',
            theme: '规划与调整日',
            themeColor: 'teal',
            englishTarget: 2,
            focusGoal: '本周复盘+下周规划',
            timeBlocks: [
              { time: '06:45-07:00', content: '起床、洗漱', type: 'break', detail: '规律作息' },
              { time: '07:00-07:30', content: '早餐', type: 'break', location: '食堂', detail: '营养早餐' },
              { time: '07:30-09:00', content: '英语真题训练', type: 'study', location: '图书馆', detail: '真题练习', countable: true },
              { time: '09:00-09:15', content: '休息', type: 'break', detail: '活动一下' },
              { time: '09:15-10:45', content: '科目四报名准备', type: 'task', location: '宿舍', detail: '准备报名材料' },
              { time: '10:45-11:00', content: '休息', type: 'break', detail: '放松眼睛' },
              { time: '11:00-12:00', content: '普通话练习', type: 'task', location: '宿舍', detail: '朗读训练' },
              { time: '12:00-12:40', content: '午餐', type: 'break', location: '食堂', detail: '规律饮食' },
              { time: '12:40-13:40', content: '午休', type: 'break', location: '宿舍', detail: '休息恢复' },
              { time: '13:40-15:10', content: '本周复盘', type: 'task', location: '图书馆', detail: '总结本周得失' },
              { time: '15:10-15:25', content: '休息', type: 'break', detail: '活动放松' },
              { time: '15:25-16:55', content: '下周规划', type: 'task', location: '图书馆', detail: '制定下周计划' },
              { time: '16:55-17:10', content: '休息', type: 'break', detail: '放松一下' },
              { time: '17:10-18:10', content: '运动锻炼', type: 'break', location: '操场', detail: '健身运动' },
              { time: '18:10-18:50', content: '晚餐', type: 'break', location: '食堂', detail: '晚餐时间' },
              { time: '18:50-20:20', content: '英语阅读训练', type: 'study', location: '图书馆', detail: '阅读练习', countable: true },
              { time: '20:20-21:00', content: '打字练习', type: 'task', location: '宿舍', detail: '速度训练' },
              { time: '21:00-21:40', content: '音乐练习', type: 'task', location: '宿舍', detail: '乐器练习' },
              { time: '21:40-22:00', content: '自由放松', type: 'break', location: '宿舍', detail: '调整状态' },
              { time: '22:00-22:45', content: '洗漱、准备睡觉', type: 'break', location: '宿舍', detail: '睡前放松，23:00前上床' }
            ]
          }
        },
        notes: [
          '每天23:00前上床，不带手机进卧室',
          '到车队/图书馆先打开英语学习资料',
          '抖音/小游戏考前禁止，考试后适度使用',
          '状态再差也要保证每天2h英语学习',
          '朋友约玩优先安排在周末，且不影响学习计划',
          '每天学习时间控制在4-6小时，避免过度疲劳'
        ],
        weeklyReview: {
          totalEnglishHours: 3,
          targetHours: 100,
          lastWeekSummary: '科目三已通过！但英语学习断断续续，时间管理需要改进，作息不规律，手机使用时间过长。',
          thisWeekFocus: '工程力学阶段考（6月2日）、毛概期末考试（6月4日）、英语六级每日2h、车队工作汇报、长期目标稳步推进。',
          nextWeekGoals: '英语六级最后冲刺、科目四考试、继续推进长期目标学习。'
        }
      }
    }
    
    const { data: existingPlan, error: checkError } = await supabase
      .from('weekly_plans')
      .select('id')
      .eq('week', '第13周')
    
    if (checkError) throw checkError
    
    let result
    if (existingPlan && existingPlan.length > 0) {
      console.log('🔄 更新第13周周计划...')
      result = await supabase
        .from('weekly_plans')
        .update(weeklyPlan)
        .eq('week', '第13周')
        .select()
    } else {
      console.log('➕ 创建第13周周计划...')
      result = await supabase
        .from('weekly_plans')
        .insert(weeklyPlan)
        .select()
    }
    
    if (result.error) throw result.error
    
    console.log('✅ 第13周周计划已更新！')
    console.log('\n📋 本周目标：')
    weeklyPlan.data.goals.forEach(goal => {
      const progress = goal.progress !== undefined ? ` (${goal.progress}%)` : ''
      console.log(`  🎯 ${goal.text}${progress}`)
    })
    
    console.log('\n⏰ 本周重要时间节点：')
    console.log('  📅 6月2日（周二）- 工程力学阶段考')
    console.log('  📅 6月4日（周四）- 毛概期末考试')
    console.log('  📅 6月5日（周五）- 车队工作汇报')
    console.log('  📅 6月7日（周日）- 科目四报名准备')
    console.log('  ⏳ 英语六级倒计时：6天（累计3/100h）')
    
    console.log('\n📚 长期目标安排：')
    weeklyPlan.data.longTermGoals.forEach((goal, i) => {
      console.log(`  ${i + 1}. ${goal}`)
    })
    
    console.log('\n' + '='.repeat(50))
    console.log('🌐 刷新网站查看完整计划：')
    console.log('   https://mudrock-arknight.github.io/daily-planner/')
    
  } catch (error) {
    console.error('❌ 操作失败：', error.message)
  }
}

updateWeeklyPlan()
