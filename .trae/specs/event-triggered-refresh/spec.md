# 非学习事件自动完成与事件触发刷新 Spec

## Why
当前应用存在两个关键问题：

1. **日期自动完成逻辑不工作**：周二的非学习事件没有自动勾选，而周一的可以
   - 可能原因：`currentDaySchedule.date` 为 undefined 或数据格式问题
   - 需要检查数据流和数据格式

2. **刷新机制不合理**：60秒刷新太频繁，用户打开页面看一眼就关，不需要频繁刷新
   - 更好的方案：页面打开时立即检查所有状态，或者事件开始时才刷新

## What Changes
- **FIX**: 修复周二的非学习事件自动完成问题
- **MODIFY**: 改变刷新机制为事件触发刷新（更合理的用户体验）

## Impact
- Affected specs: correct-day-display, timeblock-completion
- Affected code: HomePage.tsx, WeeklyPlanPage.tsx

## ADDED Requirements

### Requirement: 周二非学习事件自动完成
系统 SHALL 正确处理周二的非学习事件自动完成

#### Scenario: 周二下午查看周二计划
- **GIVEN**: 今天是周二18:30，周二有14:00-15:00的课程
- **WHEN**: 用户打开首页查看周二
- **THEN**: 周二的14:00-15:00课程自动显示为完成状态

#### Scenario: 周二非学习事件类型
- **GIVEN**: 周二有课程(class)、任务(task)、休息(break)类型的事件
- **WHEN**: 这些事件的时间已过
- **THEN**: 自动显示为完成状态（绿色背景+删除线+勾选）

### Requirement: 事件触发刷新机制
系统 SHALL 实现更合理的刷新机制

#### Scenario: 页面打开时立即检查
- **GIVEN**: 用户打开应用页面
- **WHEN**: 页面加载完成
- **THEN**: 立即检查所有事件状态，用户看到的就是最新状态

#### Scenario: 事件开始时刷新
- **GIVEN**: 用户正在使用应用
- **WHEN**: 一个新事件开始（比如从08:00到09:00）
- **THEN**: UI 自动刷新，用户可以看到新的当前任务

#### Scenario: 切换日期时刷新
- **GIVEN**: 用户点击星期选择器切换日期
- **WHEN**: selectedDay 改变
- **THEN**: 立即检查新日期的事件状态

## MODIFIED Requirements

### Requirement: 刷新机制
原方案：60秒定时刷新（太频繁，不合理）

新方案：
- **立即检查**：页面加载完成后立即检查所有状态
- **事件触发**：监听当前时间，当有新事件开始时刷新（可选）
- **手动切换**：用户切换日期时刷新
- **不再使用**：60秒定时刷新

### Requirement: 事件状态判断逻辑
确保 `effectivelyCompleted` 函数正确工作：
- 检查 `planDate` 是否存在
- 检查 `blockDate` 格式是否正确（应该是 ISO 日期字符串）
- 非学习类型 + 时间已过 → 自动完成
- 学习类型 → 不自动完成（需要手动勾选）

## Acceptance Criteria

### AC-1: 周二非学习事件自动完成
- **Given**: 今天是周二18:30
- **When**: 查看周二计划，有14:00-15:00的课程
- **Then**: 
  - 课程显示为完成状态
  - 绿色背景
  - 删除线
  - 勾选图标
- **Verification**: `human-judgment`

### AC-2: 刷新机制改进
- **Given**: 用户打开应用
- **When**: 页面加载
- **Then**: 
  - 所有可见的事件状态都是最新的
  - 不需要等待60秒
- **Verification**: `human-judgment`

### AC-3: 数据格式正确
- **Given**: 数据从 Supabase 加载
- **When**: 检查 dailySchedule 数据
- **Then**: 
  - dailySchedule["周二"].date 存在且格式正确
  - timeBlocks 的 type 字段正确
- **Verification**: `console.log` 调试

## Technical Notes

### 问题排查方向
1. 检查 `currentDaySchedule` 是否正确获取
2. 检查 `currentDaySchedule.date` 是否存在
3. 检查 `blockDate` 的格式（应该是 "2025-06-02" 这样的 ISO 日期）
4. 检查 `new Date(blockDate)` 是否正确解析

### 调试步骤
1. 在 `effectivelyCompleted` 函数中添加 console.log
2. 检查 `dayDate` 的实际值
3. 检查 `block.type` 的实际值
4. 检查 `isTimeBlockPast` 的返回值

### 修复方案
1. 确保 `currentDaySchedule.date` 正确获取
2. 添加数据格式验证
3. 移除60秒定时器（不需要）
4. 在页面加载和日期切换时立即检查
