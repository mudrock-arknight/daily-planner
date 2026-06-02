# Daily Planner - 代码审查问题修复 Spec

## Overview
- **Summary**: 修复代码审查中发现的严重Bug和安全问题
- **Purpose**: 解决数据覆盖、状态管理和安全隐患问题
- **Target Users**: 项目维护者和未来的开发人员

## Goals
- 修复 HomePage 的 toggleCompletion 覆盖打卡数据问题
- 修复 CheckinPage 保存逻辑错误
- 修复 CheckinPage 的 stale state 问题
- 解决密钥硬编码和 RLS 安全问题

## Non-Goals (Out of Scope)
- 重写整个架构（这是后续重构任务）
- 实现性能优化（React Query等）
- 提取重复代码到 utils（这是后续任务）

## Background & Context
代码审查报告指出了多个严重问题，其中：
- 第3项：HomePage.tsx 的 toggleCompletion 在更新 daily_checkins 时覆盖了原有数据
- 第4项：CheckinPage.tsx 的保存逻辑把元数据存到了 data JSONB 中
- 第5项：CheckinPage.tsx 存在闭包导致的 stale state 问题

## Functional Requirements
- **FR-1**: HomePage 更新 completions 时必须保留原有打卡数据
- **FR-2**: CheckinPage 保存时只存储打卡相关字段，不包含元数据
- **FR-3**: CheckinPage 使用函数式 setState 避免 stale state
- **FR-4**: 将密钥从代码中移除，改用环境变量

## Non-Functional Requirements
- **NFR-1**: 修复后 TypeScript 编译通过
- **NFR-2**: 不引入新的依赖

## Constraints
- 项目使用 React + TypeScript + Supabase
- 需要兼容现有数据格式

---

## Acceptance Criteria

### AC-1: HomePage 保留原有打卡数据
- **Given**: 用户在 HomePage 完成一个时间块
- **When**: 点击完成按钮
- **Then**: daily_checkins 中的原有数据（睡眠、心情等）不应被覆盖
- **Verification**: `programmatic`

### AC-2: CheckinPage 正确保存数据
- **Given**: 用户在 CheckinPage 填写打卡信息
- **When**: 点击保存
- **Then**: 只有打卡字段被保存到 data JSONB，不包含 id/date 等元数据
- **Verification**: `programmatic`

### AC-3: CheckinPage 无 stale state 问题
- **Given**: 用户在数据加载完成前修改表单
- **When**: 数据加载完成
- **Then**: 用户的修改不会被覆盖
- **Verification**: `human-judgment`

### AC-4: 密钥从代码中移除
- **Given**: 查看项目源码
- **When**: 搜索 SUPABASE_SERVICE_KEY
- **Then**: 不应在源代码中找到密钥
- **Verification**: `programmatic`

---

## Open Questions
- [ ] 是否需要立即轮换 Supabase 密钥？（建议是）