# 英语六级冲刺备考计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 制定从6月5日到6月13日的英语六级冲刺备考计划，每天安排至少2小时英语学习

**Architecture:** 根据六级考试题型（听力、阅读、翻译、写作）进行针对性训练，结合真题模拟和错题复盘

**Tech Stack:** React + Supabase + TypeScript

---

## 备考时间线

| 日期 | 星期 | 距离考试 | 重点任务 |
|------|------|----------|----------|
| 6月5日 | 周五 | 8天 | 听力专项训练 |
| 6月6日 | 周六 | 7天 | 阅读专项训练 |
| 6月7日 | 周日 | 6天 | 翻译专项训练 |
| 6月8日 | 周一 | 5天 | 写作专项训练 |
| 6月9日 | 周二 | 4天 | 真题模拟一 |
| 6月10日 | 周三 | 3天 | 真题模拟二 + 错题复盘 |
| 6月11日 | 周四 | 2天 | 真题模拟三 |
| 6月12日 | 周五 | 1天 | 查漏补缺 + 作文模板记忆 |
| 6月13日 | 周六 | 0天 | 考试日 |

---

### Task 1: 更新周五（6月5日）计划 - 听力专项日

**Files:**
- Modify: 更新weekly_plans表中第13周周五的dailySchedule

**Step 1: 更新周五计划数据**

```javascript
{
  "周五": {
    "date": "2026-06-05",
    "theme": "六级听力专项训练",
    "themeColor": "blue",
    "englishTarget": 2,
    "focusGoal": "精听训练 + 真题听力",
    "timeBlocks": [
      { "time": "06:45-07:00", "content": "起床、洗漱", "type": "task" },
      { "time": "07:00-07:40", "content": "早餐 + 背单词", "type": "study", "detail": "高频词50个" },
      { "time": "07:40-08:40", "content": "六级听力精听", "type": "study", "detail": "真题section A精听" },
      { "time": "08:40-10:15", "content": "六级听力真题", "type": "study", "detail": "完整听力模拟" },
      { "time": "10:15-10:30", "content": "休息", "type": "break" },
      { "time": "10:30-11:30", "content": "听力错题分析", "type": "study", "detail": "整理错题本" },
      { "time": "11:30-12:00", "content": "词汇复习", "type": "study", "detail": "听力高频词汇" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:45", "content": "午休", "type": "break" },
      { "time": "13:45-14:00", "content": "准备学习", "type": "task" },
      { "time": "14:00-15:00", "content": "听力真题二", "type": "study", "detail": "Section B/C" },
      { "time": "15:00-16:00", "content": "听力技巧总结", "type": "study", "detail": "同义替换、语气词" },
      { "time": "16:00-17:00", "content": "六级阅读", "type": "study", "detail": "快速阅读1篇" },
      { "time": "17:00-18:00", "content": "车队收尾工作", "type": "task" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-19:30", "content": "听力精听复盘", "type": "study", "detail": "跟读模仿" },
      { "time": "19:30-20:30", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "20:30-21:00", "content": "休息", "type": "break" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第13周计划数据

---

### Task 2: 更新周六（6月6日）计划 - 阅读专项日

**Files:**
- Modify: 更新weekly_plans表中第13周周六的dailySchedule

**Step 1: 更新周六计划数据**

```javascript
{
  "周六": {
    "date": "2026-06-06",
    "theme": "六级阅读专项训练",
    "themeColor": "green",
    "englishTarget": 2,
    "focusGoal": "仔细阅读 + 长篇阅读",
    "timeBlocks": [
      { "time": "07:00-07:30", "content": "起床、洗漱", "type": "task" },
      { "time": "07:30-08:00", "content": "早餐", "type": "break", "location": "食堂" },
      { "time": "08:00-09:00", "content": "背单词", "type": "study", "detail": "高频词50个" },
      { "time": "09:00-10:30", "content": "六级仔细阅读", "type": "study", "detail": "2篇真题" },
      { "time": "10:30-10:45", "content": "休息", "type": "break" },
      { "time": "10:45-12:00", "content": "六级长篇阅读", "type": "study", "detail": "2篇真题" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:30", "content": "午休", "type": "break" },
      { "time": "13:30-15:00", "content": "阅读错题分析", "type": "study", "detail": "定位技巧、同义替换" },
      { "time": "15:00-16:30", "content": "快速阅读训练", "type": "study", "detail": "真题训练" },
      { "time": "16:30-17:30", "content": "阅读技巧总结", "type": "study", "detail": "笔记整理" },
      { "time": "17:30-18:30", "content": "晚餐 + 休息", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "阅读真题复盘", "type": "study", "detail": "错题重做" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第13周计划数据

---

### Task 3: 更新周日（6月7日）计划 - 翻译专项日

**Files:**
- Modify: 更新weekly_plans表中第13周周日的dailySchedule

**Step 1: 更新周日计划数据**

```javascript
{
  "周日": {
    "date": "2026-06-07",
    "theme": "六级翻译专项训练",
    "themeColor": "purple",
    "englishTarget": 2,
    "focusGoal": "汉译英技巧 + 真题练习",
    "timeBlocks": [
      { "time": "07:00-07:30", "content": "起床、洗漱", "type": "task" },
      { "time": "07:30-08:00", "content": "早餐", "type": "break", "location": "食堂" },
      { "time": "08:00-09:00", "content": "背单词", "type": "study", "detail": "高频词50个" },
      { "time": "09:00-10:30", "content": "六级翻译真题", "type": "study", "detail": "2篇练习" },
      { "time": "10:30-10:45", "content": "休息", "type": "break" },
      { "time": "10:45-12:00", "content": "翻译技巧学习", "type": "study", "detail": "句式转换、文化词汇" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:30", "content": "午休", "type": "break" },
      { "time": "13:30-15:00", "content": "翻译真题练习", "type": "study", "detail": "历史文化类" },
      { "time": "15:00-16:30", "content": "翻译批改", "type": "study", "detail": "对照参考答案" },
      { "time": "16:30-17:30", "content": "翻译素材积累", "type": "study", "detail": "中国特色词汇" },
      { "time": "17:30-18:30", "content": "晚餐 + 休息", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "翻译错题复盘", "type": "study", "detail": "整理常用表达" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第13周计划数据

---

### Task 4: 更新周一（6月8日）计划 - 写作专项日

**Files:**
- Modify: 更新weekly_plans表中第14周周一的dailySchedule

**Step 1: 更新周一计划数据**

```javascript
{
  "周一": {
    "date": "2026-06-08",
    "theme": "六级写作专项训练",
    "themeColor": "orange",
    "englishTarget": 2,
    "focusGoal": "议论文模板 + 真题练习",
    "timeBlocks": [
      { "time": "06:45-07:00", "content": "起床、洗漱", "type": "task" },
      { "time": "07:00-07:40", "content": "早餐 + 背单词", "type": "study", "detail": "高频词50个" },
      { "time": "07:40-09:10", "content": "六级写作模板", "type": "study", "detail": "开头、正文、结尾" },
      { "time": "09:10-10:40", "content": "写作真题练习", "type": "study", "detail": "30分钟完成" },
      { "time": "10:40-10:55", "content": "休息", "type": "break" },
      { "time": "10:55-12:00", "content": "写作批改", "type": "study", "detail": "对照范文" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:45", "content": "午休", "type": "break" },
      { "time": "13:45-14:00", "content": "准备学习", "type": "task" },
      { "time": "14:00-15:30", "content": "写作真题练习二", "type": "study", "detail": "图表作文" },
      { "time": "15:30-16:30", "content": "写作素材积累", "type": "study", "detail": "万能句型" },
      { "time": "16:30-17:30", "content": "写作模板背诵", "type": "study", "detail": "经典句式" },
      { "time": "17:30-18:00", "content": "休息", "type": "break" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "写作真题复盘", "type": "study", "detail": "优化表达" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第14周计划数据

---

### Task 5: 更新周二（6月9日）计划 - 真题模拟一

**Files:**
- Modify: 更新weekly_plans表中第14周周二的dailySchedule

**Step 1: 更新周二计划数据**

```javascript
{
  "周二": {
    "date": "2026-06-09",
    "theme": "六级真题模拟一",
    "themeColor": "red",
    "englishTarget": 3,
    "focusGoal": "完整真题模拟 + 计时训练",
    "timeBlocks": [
      { "time": "06:45-07:00", "content": "起床、洗漱", "type": "task" },
      { "time": "07:00-07:40", "content": "早餐 + 背单词", "type": "study", "detail": "高频词30个" },
      { "time": "07:40-08:00", "content": "准备模拟考试", "type": "task" },
      { "time": "08:00-10:30", "content": "六级真题模拟", "type": "exam", "detail": "完整试卷，严格计时" },
      { "time": "10:30-10:45", "content": "休息", "type": "break" },
      { "time": "10:45-12:00", "content": "真题批改", "type": "study", "detail": "对照答案" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:45", "content": "午休", "type": "break" },
      { "time": "13:45-15:00", "content": "错题分析", "type": "study", "detail": "听力部分" },
      { "time": "15:00-16:30", "content": "错题分析", "type": "study", "detail": "阅读部分" },
      { "time": "16:30-17:30", "content": "错题分析", "type": "study", "detail": "翻译+写作" },
      { "time": "17:30-18:00", "content": "休息", "type": "break" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "错题总结", "type": "study", "detail": "整理错题本" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第14周计划数据

---

### Task 6: 更新周三（6月10日）计划 - 真题模拟二

**Files:**
- Modify: 更新weekly_plans表中第14周周三的dailySchedule

**Step 1: 更新周三计划数据**

```javascript
{
  "周三": {
    "date": "2026-06-10",
    "theme": "六级真题模拟二",
    "themeColor": "red",
    "englishTarget": 3,
    "focusGoal": "完整真题模拟 + 错题复盘",
    "timeBlocks": [
      { "time": "06:45-07:00", "content": "起床、洗漱", "type": "task" },
      { "time": "07:00-07:40", "content": "早餐 + 背单词", "type": "study", "detail": "高频词30个" },
      { "time": "07:40-08:00", "content": "准备模拟考试", "type": "task" },
      { "time": "08:00-10:30", "content": "六级真题模拟", "type": "exam", "detail": "完整试卷，严格计时" },
      { "time": "10:30-10:45", "content": "休息", "type": "break" },
      { "time": "10:45-12:00", "content": "真题批改", "type": "study", "detail": "对照答案" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:45", "content": "午休", "type": "break" },
      { "time": "13:45-15:00", "content": "错题分析", "type": "study", "detail": "听力部分" },
      { "time": "15:00-16:30", "content": "错题分析", "type": "study", "detail": "阅读部分" },
      { "time": "16:30-17:30", "content": "错题分析", "type": "study", "detail": "翻译+写作" },
      { "time": "17:30-18:00", "content": "休息", "type": "break" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "错题总结", "type": "study", "detail": "整理错题本" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第14周计划数据

---

### Task 7: 更新周四（6月11日）计划 - 真题模拟三

**Files:**
- Modify: 更新weekly_plans表中第14周周四的dailySchedule

**Step 1: 更新周四计划数据**

```javascript
{
  "周四": {
    "date": "2026-06-11",
    "theme": "六级真题模拟三",
    "themeColor": "red",
    "englishTarget": 3,
    "focusGoal": "完整真题模拟",
    "timeBlocks": [
      { "time": "06:45-07:00", "content": "起床、洗漱", "type": "task" },
      { "time": "07:00-07:40", "content": "早餐 + 背单词", "type": "study", "detail": "高频词30个" },
      { "time": "07:40-08:00", "content": "准备模拟考试", "type": "task" },
      { "time": "08:00-10:30", "content": "六级真题模拟", "type": "exam", "detail": "完整试卷，严格计时" },
      { "time": "10:30-10:45", "content": "休息", "type": "break" },
      { "time": "10:45-12:00", "content": "真题批改", "type": "study", "detail": "对照答案" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:45", "content": "午休", "type": "break" },
      { "time": "13:45-15:00", "content": "错题分析", "type": "study", "detail": "听力部分" },
      { "time": "15:00-16:30", "content": "错题分析", "type": "study", "detail": "阅读部分" },
      { "time": "16:30-17:30", "content": "错题分析", "type": "study", "detail": "翻译+写作" },
      { "time": "17:30-18:00", "content": "休息", "type": "break" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "错题总结", "type": "study", "detail": "整理错题本" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "今日总结", "type": "task" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:45", "content": "准备睡觉", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第14周计划数据

---

### Task 8: 更新周五（6月12日）计划 - 查漏补缺日

**Files:**
- Modify: 更新weekly_plans表中第14周周五的dailySchedule

**Step 1: 更新周五计划数据**

```javascript
{
  "周五": {
    "date": "2026-06-12",
    "theme": "六级查漏补缺日",
    "themeColor": "yellow",
    "englishTarget": 2,
    "focusGoal": "弱项强化 + 作文模板记忆",
    "timeBlocks": [
      { "time": "06:45-07:00", "content": "起床、洗漱", "type": "task" },
      { "time": "07:00-07:40", "content": "早餐 + 背单词", "type": "study", "detail": "高频词50个" },
      { "time": "07:40-09:00", "content": "弱项强化", "type": "study", "detail": "根据错题本针对性练习" },
      { "time": "09:00-10:30", "content": "作文模板背诵", "type": "study", "detail": "开头、正文、结尾" },
      { "time": "10:30-10:45", "content": "休息", "type": "break" },
      { "time": "10:45-12:00", "content": "高频词汇复习", "type": "study", "detail": "阅读听力高频词" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-13:45", "content": "午休", "type": "break" },
      { "time": "13:45-15:00", "content": "翻译模板背诵", "type": "study", "detail": "常用句式" },
      { "time": "15:00-16:30", "content": "听力高频词汇", "type": "study", "detail": "反复听" },
      { "time": "16:30-17:30", "content": "写作练习", "type": "study", "detail": "写一篇完整作文" },
      { "time": "17:30-18:00", "content": "休息", "type": "break" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "最后查漏补缺", "type": "study", "detail": "错题本最后回顾" },
      { "time": "20:00-21:00", "content": "单词复习", "type": "study", "detail": "APP打卡" },
      { "time": "21:00-21:30", "content": "准备考试用品", "type": "task", "detail": "准考证、身份证、笔" },
      { "time": "21:30-22:00", "content": "洗漱", "type": "task" },
      { "time": "22:00-22:30", "content": "早点休息", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第14周计划数据

---

### Task 9: 更新周六（6月13日）计划 - 考试日

**Files:**
- Modify: 更新weekly_plans表中第14周周六的dailySchedule

**Step 1: 更新周六计划数据**

```javascript
{
  "周六": {
    "date": "2026-06-13",
    "theme": "六级考试日",
    "themeColor": "gold",
    "englishTarget": 0,
    "focusGoal": "保持状态，轻松应考",
    "timeBlocks": [
      { "time": "07:00-07:30", "content": "起床、洗漱", "type": "task" },
      { "time": "07:30-08:00", "content": "早餐", "type": "break", "location": "食堂", "detail": "清淡为主" },
      { "time": "08:00-08:30", "content": "考前准备", "type": "task", "detail": "检查证件、文具" },
      { "time": "08:30-09:00", "content": "前往考场", "type": "task" },
      { "time": "09:00-11:25", "content": "英语六级考试", "type": "exam", "location": "考场", "detail": "仔细答题，注意时间" },
      { "time": "11:25-12:00", "content": "考试结束", "type": "break", "detail": "放松一下" },
      { "time": "12:00-13:00", "content": "午餐", "type": "break", "location": "食堂" },
      { "time": "13:00-14:00", "content": "午休", "type": "break" },
      { "time": "14:00-16:00", "content": "自由活动", "type": "task", "detail": "放松休息" },
      { "time": "16:00-18:00", "content": "自由活动", "type": "task" },
      { "time": "18:00-18:30", "content": "晚餐", "type": "break", "location": "食堂" },
      { "time": "18:30-20:00", "content": "自由活动", "type": "task" },
      { "time": "20:00-21:00", "content": "休息", "type": "break" },
      { "time": "21:00-21:30", "content": "洗漱", "type": "task" },
      { "time": "21:30-22:30", "content": "早点休息", "type": "task" }
    ]
  }
}
```

**Step 2: 执行更新**

使用Supabase客户端更新第14周计划数据

---

## 备考资源清单

| 资源类型 | 推荐材料 |
|----------|----------|
| 真题 | 近5年六级真题 |
| 词汇 | 六级高频词汇表、单词APP |
| 听力 | 真题听力音频、VOA/BBC |
| 阅读 | 真题阅读、外刊精读 |
| 翻译 | 真题翻译、中国特色词汇 |
| 写作 | 万能模板、高分范文 |

---

## 每日学习目标

- ✅ 每天背单词50个
- ✅ 每天至少2小时英语学习
- ✅ 每天整理错题本
- ✅ 保持良好作息

---

**Plan complete!** 现在可以执行更新计划到数据库。

**Execution Handoff:**
**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
**2. Inline Execution** - Execute tasks in this session, batch execution with checkpoints

**Which approach?**