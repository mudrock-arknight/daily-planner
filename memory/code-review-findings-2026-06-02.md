---
name: code-review-findings-2026-06-02
description: 2026年6月2日对项目进行全面代码审查的发现和建议
metadata:
  type: project
---

对 daily-planner 项目进行全面审查，发现以下问题和改进建议。

**Why:** 用户要求审查代码问题、改进思路。
**How to apply:** 按优先级处理，安全相关优先修复，架构改进可作为长期重构目标。

## 🔴 严重问题

### 1. 密钥硬编码在 24+ 个文件中（安全）
- `src/lib/supabase.ts`、`src/lib/supabase-admin.ts`、`cli.js`、`add-plan.mjs` 等
- SUPABASE_URL、ANON_KEY、SERVICE_KEY 全部硬编码
- SERVICE_KEY 被提交到 git 仓库，任何有权限的人都能获得完整数据库管理员权限
- 建议：立即在 Supabase 后台轮换 JWT 密钥，改用 `.env` + 环境变量，用 `git filter-branch` 清理历史

### 2. RLS 完全开放 + anon 拥有全部权限
- 所有表 `Public Access USING (true)`，`anon` 角色被授予 ALL PRIVILEGES
- 任何人只要知道你的 Supabase URL 就能读写删除所有数据
- 建议：至少限制 anon 只读，或接入 Supabase Auth 做用户认证

### 3. HomePage 的 toggleCompletion 会覆盖打卡数据（Bug）
- 文件：`src/pages/HomePage.tsx` 第 219-229 行
- 更新 `daily_checkins` 时只传 `{ data: { completions: ... } }`，会**覆盖掉** CheckinPage 保存的入睡时间、心情评分、学习时长等数据
- 对比 WeeklyPlanPage 第 192-196 行，它正确地用了 `{ ...checkinData[0].data, completions: ... }` 保留原有数据
- 修复：HomePage 的 update 也要扩展原有 data

### 4. CheckinPage 保存逻辑有误
- 文件：`src/pages/CheckinPage.tsx` 第 50 行
- update 时 `{ data: checkin }` 把 id、date 等元数据也存入了 data JSONB 中
- 修复：只传打卡相关字段 `{ sleepTime, wakeTime, moodScore, studyHours, exercised, waterEnough }`

### 5. CheckinPage 的 stale state 问题
- 文件：`src/pages/CheckinPage.tsx` 第 40 行
- `setCheckin({ ...checkin, ...data.data, id: data.id })` 读取的是闭包中的旧值
- 如果用户在数据加载完成前修改了表单，修改会被覆盖
- 修复：使用函数式更新 `setCheckin(prev => ({ ...prev, ...data.data, id: data.id }))`

## 🟡 中等问题

### 6. 大量重复代码（约 200+ 行）
- `themeColors`、`typeLabels`、`parseChineseDate()`、`getTodayInfo()`、`isTimeBlockPast()`、`handleToggleCompletion()` 等在 HomePage 和 WeeklyPlanPage 中完全重复
- 日期计算逻辑在 HomePage 中重复了 3 次
- 建议：提取到 `src/utils/` 和自定义 hooks 中

### 7. 六级倒计时已过期
- 文件：`src/pages/StatsPage.tsx` 第 278 行
- 硬编码 `new Date('2025-06-14')`，已经过了快一年

### 8. 大量 `any` 类型
- 多处 `useState<any>()`、`(checkin: any)` 等
- `types/index.ts` 中定义的接口没有被使用
- 建议：使用已有接口，给 Supabase 查询加上泛型

### 9. Zustand Store 几乎没用
- 只有 TodoPage 用了 `todos` 状态
- `dailyCheckins` 和 `weeklyPlans` 从未在 store 中被读取
- 其他页面各自用本地 useState 加载数据
- 建议：要么删除 store 全部用本地状态，要么把数据加载逻辑统一到 store

### 10. 缺少错误处理
- 大部分错误只 `console.error`，用户看不到
- CheckinPage 用 `alert()` 做反馈
- 建议：统一使用 Toast 组件

### 11. 根目录 28 个脚本文件杂乱
- 很多是一次性调试脚本（check-columns.mjs、check-schema.mjs、test-insert.mjs 等）
- 建议：移到 `scripts/` 目录，删除不需要的

## 🟢 改进建议

### 12. 提取自定义 Hooks
- `useWeeklyPlan()`、`useCompletions()`、`useDailyCheckin()` 消除重复

### 13. SchedulePage 是静态硬编码数据
- 数据库有 `schedule` 表但页面没用到
- 课表数据是写死的第 13 周

### 14. 性能优化
- 多个页面重复拉取相同数据
- 建议用 React Query 做缓存和去重
- 删除未使用的 `pg` 依赖

### 15. 缺少 React Error Boundary
- 任何组件报错会导致整个页面白屏