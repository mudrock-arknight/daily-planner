
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vyb2xlIiwiaWF0IjoxNzgwMjI2MzUzLCJleHAiOjIwOTU4MDIzNTN9.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// 辅助函数：计算时间差（小时）
function calculateTimeDifference(start, end) {
  const [startHour, startMin] = start.split(':').map(Number)
  const [endHour, endMin] = end.split(':').map(Number)
  return (endHour - startHour) + (endMin - startMin) / 60
}

// 辅助函数：解析时间块
function parseTimeBlock(timeStr) {
  const [start, end] = timeStr.split('-')
  return { start, end }
}

// 主验证函数
async function verifyWeek13Plan() {
  console.log('======================================================================')
  console.log('  第13周计划数据完整性验证')
  console.log('======================================================================')
  console.log()

  try {
    // 1. 查询最新的第13周记录
    console.log('1. 查询第13周计划数据...')
    const { data: weeklyPlans, error } = await supabase
      .from('weekly_plans')
      .select('*')
      .eq('week', '第13周')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('  查询失败：', error.message)
      return
    }

    if (!weeklyPlans || weeklyPlans.length === 0) {
      console.error('  未找到第13周计划数据')
      return
    }

    const plan = weeklyPlans[0]
    console.log(`  找到第13周计划 (创建时间: ${plan.created_at})`)
    console.log()

    const issues = []
    const warnings = []

    // 2. 检查是否包含完整的7天计划
    console.log('2. 检查每日计划完整性...')
    const dailySchedule = plan.data?.dailySchedule
    if (!dailySchedule) {
      issues.push('  缺少 dailySchedule 数据')
    } else {
      const days = Object.keys(dailySchedule)
      const expectedDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      
      console.log(`   找到 ${days.length} 天计划：${days.join(', ')}`)
      
      expectedDays.forEach(day => {
        if (!days.includes(day)) {
          issues.push(`  缺少 ${day} 的计划`)
        }
      })

      if (days.length === 7) {
        console.log('   7天计划完整')
      }
    }
    console.log()

    // 3. 检查每天的时间块覆盖
    console.log('3. 检查时间块覆盖 (06:45-22:45)...')
    if (dailySchedule) {
      Object.entries(dailySchedule).forEach(([day, schedule]) => {
        const timeBlocks = schedule.timeBlocks
        if (!timeBlocks || timeBlocks.length === 0) {
          issues.push(`  ${day} 没有时间块`)
          return
        }

        // 检查第一个和最后一个时间块
        const firstBlock = parseTimeBlock(timeBlocks[0].time)
        const lastBlock = parseTimeBlock(timeBlocks[timeBlocks.length - 1].time)

        if (firstBlock.start !== '06:45') {
          warnings.push(`  ${day} 第一个时间块开始于 ${firstBlock.start}（期望 06:45）`)
        }

        if (lastBlock.end !== '22:45') {
          warnings.push(`  ${day} 最后一个时间块结束于 ${lastBlock.end}（期望 22:45）`)
        }

        // 检查时间块连续性
        let prevEnd = null
        let gaps = []
        timeBlocks.forEach((block, idx) => {
          const { start, end } = parseTimeBlock(block.time)
          if (prevEnd && prevEnd !== start) {
            gaps.push(`${prevEnd}-${start}`)
          }
          prevEnd = end
        })

        if (gaps.length > 0) {
          warnings.push(`  ${day} 存在时间间隙：${gaps.join(', ')}`)
        }

        console.log(`   ${day}: ${timeBlocks.length} 个时间块 (${firstBlock.start}-${lastBlock.end})`)
      })
    }
    console.log()

    // 4. 检查英语学习时间
    console.log('4. 检查英语学习时间（每天至少2小时）...')
    if (dailySchedule) {
      Object.entries(dailySchedule).forEach(([day, schedule]) => {
        const timeBlocks = schedule.timeBlocks || []
        let englishHours = 0

        timeBlocks.forEach(block => {
          // 检查是否是英语学习相关
          const isEnglish = 
            block.type === 'study' && (
              block.content.toLowerCase().includes('英语') ||
              block.content.toLowerCase().includes('english') ||
              (block.detail && block.detail.toLowerCase().includes('英语'))
            )
          
          if (isEnglish || block.countable) {
            const { start, end } = parseTimeBlock(block.time)
            englishHours += calculateTimeDifference(start, end)
          }
        })

        // 同时检查 englishTarget
        const targetHours = schedule.englishTarget || 2
        if (englishHours < targetHours) {
          warnings.push(`  ${day} 英语学习时间: ${englishHours.toFixed(1)}h（目标 ${targetHours}h）`)
        } else {
          console.log(`   ${day}: ${englishHours.toFixed(1)}h 英语学习`)
        }
      })
    }
    console.log()

    // 5. 检查课程是否已合并
    console.log('5. 检查课程合并情况...')
    if (dailySchedule) {
      Object.entries(dailySchedule).forEach(([day, schedule]) => {
        const timeBlocks = schedule.timeBlocks || []
        let mergedCourses = []

        timeBlocks.forEach(block => {
          if (block.type === 'class' && block.detail) {
            if (block.detail.includes('合并')) {
              mergedCourses.push(block.content)
            }
          }
        })

        if (mergedCourses.length > 0) {
          console.log(`   ${day}: ${mergedCourses.length} 门课程已合并`)
        } else {
          console.log(`   ${day}: 无合并课程`)
        }
      })
    }
    console.log()

    // 6. 输出验证结果
    console.log('======================================================================')
    console.log('  验证结果汇总')
    console.log('======================================================================')

    if (issues.length > 0) {
      console.log()
      console.log('  发现的问题：')
      issues.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. ${issue}`)
      })
    }

    if (warnings.length > 0) {
      console.log()
      console.log('  警告信息：')
      warnings.forEach((warning, idx) => {
        console.log(`   ${idx + 1}. ${warning}`)
      })
    }

    if (issues.length === 0 && warnings.length === 0) {
      console.log()
      console.log('  验证通过！第13周计划数据完整！')
    } else if (issues.length === 0) {
      console.log()
      console.log('  基本验证通过，但有一些警告需要注意')
    } else {
      console.log()
      console.log('  验证失败，存在需要修复的问题')
    }

    console.log()
    console.log('======================================================================')

  } catch (error) {
    console.error('  验证过程出错：', error)
  }
}

verifyWeek13Plan()

