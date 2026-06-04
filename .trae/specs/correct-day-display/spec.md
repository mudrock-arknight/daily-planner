# 正确日期显示与历史任务自动完成 Spec

## Why
当前应用存在两个关键问题：
1. 日期显示错误：今天是周二(6月2日)，但页面显示的是周一的计划表
2. 历史任务未处理：周一已经过去的非学习事件没有被自动划掉，只有当天的任务被处理

## What Changes
- **BREAKING**: 修改日期选择逻辑，确保始终显示正确的当天计划
- **BREAKING**: 修改自动完成逻辑，处理本周所有已过去的非学习事件（不仅是当天）

## Impact
- Affected specs: timeblock-completion
- Affected code: HomePage.tsx, WeeklyPlanPage.tsx

## ADDED Requirements

### Requirement: 正确显示当天计划
系统 SHALL 根据当前实际日期显示对应的星期几计划

#### Scenario: 周二显示周二计划
- **GIVEN**: 今天是周二
- **WHEN**: 用户打开首页
- **THEN**: 显示周二的计划表，而不是周一的

#### Scenario: 日期与星期对应
- **GIVEN**: 今天是6月2日周二
- **WHEN**: 页面加载
- **THEN**: selectedDay 应该是 "周二"，显示的日期应该是 "6月2日"

### Requirement: 历史非学习事件自动完成
系统 SHALL 将本周所有已过去的非学习事件自动标记为完成

#### Scenario: 周一已过去的课程自动完成
- **GIVEN**: 今天是周二，周一已经过去
- **WHEN**: 查看周一的时间块
- **THEN**: 周一所有非学习类型且时间已过的事件显示为完成状态

#### Scenario: 当天已过去的非学习事件自动完成
- **GIVEN**: 今天是周二
- **WHEN**: 查看周二的时间块，某些事件时间已过
- **THEN**: 这些非学习事件显示为完成状态

## MODIFIED Requirements

### Requirement: 日期选择逻辑
原逻辑：根据 todayName 选择日期，但可能存在时区或日期计算错误

新逻辑：
- 使用 JavaScript Date 对象正确获取当前星期几
- 确保 dayNames 数组索引与 Date.getDay() 返回值正确对应
- 考虑时区问题，使用本地时间

## Acceptance Criteria

### AC-1: 正确显示当天计划
- **Given**: 今天是周二
- **When**: 打开首页
- **Then**: 
  - 页面标题显示 "周二"
  - 显示周二的计划内容
  - 不显示周一的计划
- **Verification**: `human-judgment`

### AC-2: 历史非学习事件自动完成
- **Given**: 今天是周二，周一有已结束的课程
- **When**: 切换到周一查看
- **Then**: 
  - 周一已结束的非学习事件显示绿色背景
  - 显示删除线和勾选图标
- **Verification**: `human-judgment`

### AC-3: 当天非学习事件自动完成
- **Given**: 今天是周二，当前时间14:00
- **When**: 查看周二计划，有12:00-13:00的午休
- **Then**: 午休事件显示为完成状态
- **Verification**: `human-judgment`
