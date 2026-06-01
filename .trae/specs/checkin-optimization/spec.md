# 个人规划助手 - 打卡规则优化与长期目标统计

## Overview

- **Summary**: 优化打卡规则，只统计学习相关的时间块；增加长期目标的时间统计功能；确认历史数据存储机制
- **Purpose**: 让打卡更聚焦于学习，提供清晰的目标进度可视化，确保数据长期可用
- **Target Users**: 需要详细规划日常学习的大学生

## Goals

1. 只统计学习类型的时间块完成情况
2. 为长期目标增加时间投入统计
3. 确保历史数据安全存储和查询
4. 提供直观的目标进度展示

## Non-Goals (Out of Scope)

- 不修改现有课程和休息块的数据结构
- 不重构整体前端架构
- 不改变数据库表结构

## Background & Context

现有系统：
- 所有时间块都显示打卡按钮
- 统计页面计算所有块的完成率
- 每日打卡数据保存在 `daily_checkins` 表
- 长期目标存在，但没有时间投入统计
- `generate-plan.js` 已经添加了 `countable` 字段标记哪些需要统计

## Functional Requirements

1. **打卡按钮显示优化**：只有 `type = 'study'` 且 `countable = true` 的时间块显示打卡按钮
2. **完成率统计调整**：只统计符合条件的时间块
3. **长期目标时间统计**：将学习内容与长期目标关联，统计各目标的时间投入
4. **历史数据展示**：展示长期的目标时间投入趋势

## Non-Functional Requirements

1. 保持现有页面加载速度
2. 数据统计逻辑清晰，易于维护
3. 展示效果美观，信息层次分明

## Constraints

- 使用现有的 `daily_checkins` 和 `weekly_plans` 表
- 使用 React 18 + TypeScript + Tailwind CSS 现有技术栈
- 兼容现有数据结构

## Assumptions

1. 学习内容可以通过 `content` 字段与长期目标关联（如"英语学习"关联语言目标）
2. 历史数据会长期保存在 Supabase 中
3. 用户会持续使用系统进行打卡

## Acceptance Criteria

### AC-1: 只显示学习块的打卡按钮

- **Given**: 用户在首页或周计划页
- **When**: 查看每日计划
- **Then**: 只有 `type = 'study'` 且 `countable = true` 的时间块显示打卡按钮
- **Verification**: `human-judgment`

### AC-2: 统计只计算学习块

- **Given**: 用户完成了部分学习块
- **When**: 查看统计页面
- **Then**: 完成率只统计学习相关的时间块
- **Verification**: `programmatic`

### AC-3: 长期目标时间统计展示

- **Given**: 有历史打卡数据
- **When**: 查看统计页面
- **Then**: 显示各长期目标的累计时间投入
- **Verification**: `human-judgment`

### AC-4: 历史数据长期存储

- **Given**: 用户持续打卡
- **When**: 随时查看之前的数据
- **Then**: 所有历史数据都能正确加载和展示
- **Verification**: `programmatic`

## Open Questions

- [ ] 学习内容与长期目标的匹配规则需要用户确认（关键词匹配还是手动选择）
- [ ] 是否需要展示目标完成度与时间投入的关系
