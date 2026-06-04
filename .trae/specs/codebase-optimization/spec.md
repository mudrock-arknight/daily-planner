# 代码优化重构 Spec

## Why
代码审查报告中发现大量重复代码（200+行）、过期数据、缺失的错误处理和未使用的依赖，影响可维护性和用户体验。

## What Changes
- 提取重复代码到 `src/utils/` 和自定义 hooks
- 更新六级倒计时日期
- 添加 Toast 组件替代 alert()
- 清理根目录脚本到 `scripts/` 目录
- 删除未使用的 `pg` 依赖
- 添加 React Error Boundary

## Impact
- Affected code: HomePage.tsx, WeeklyPlanPage.tsx, StatsPage.tsx, CheckinPage.tsx, SchedulePage.tsx, App.tsx, package.json

## ADDED Requirements

### Requirement: 提取共享工具函数和自定义 Hooks
系统 SHALL 将 HomePage 和 WeeklyPlanPage 中重复的工具函数和逻辑提取到独立模块中。

#### Scenario: 代码复用
- **WHEN** 开发者需要修改日期解析或自动完成逻辑
- **THEN** 只需修改一处代码，两个页面同步生效

### Requirement: Toast 通知组件
系统 SHALL 提供 Toast 通知组件替代 alert()。

#### Scenario: 保存成功提示
- **WHEN** 用户保存打卡数据成功
- **THEN** 显示 Toast 通知而非浏览器 alert

### Requirement: Error Boundary
系统 SHALL 包含 React Error Boundary 防止组件错误导致白屏。

#### Scenario: 组件渲染错误
- **WHEN** 某个页面组件抛出渲染错误
- **THEN** 显示友好的错误提示页面，而非白屏

## MODIFIED Requirements

### Requirement: 六级倒计时
更新 StatsPage 中的六级考试日期为 `2026-06-14`，并改为可配置。

### Requirement: 根目录脚本整理
将根目录的 .mjs/.js 脚本移到 `scripts/` 目录。

## REMOVED Requirements

### Requirement: 未使用的 pg 依赖
**Reason**: 项目使用 Supabase 客户端，不需要直接使用 pg
**Migration**: 从 package.json 中移除