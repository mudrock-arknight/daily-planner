# 个人规划助手 - 产品需求文档 (PRD)

## Overview
- **Summary**: 一个"给我课表 + 日记（包含想法），我帮你安排好计划"的个人规划助手。用户提供课程表和日记内容，AI分析后自动生成每日详细计划，展示在网页上。
- **Purpose**: 解决用户"时间被手机吸引、学习断断续续、缺少干劲"的痛点，通过AI辅助的结构化计划系统帮助用户保持健康作息和完成目标。
- **Target Users**: 大学生/学生群体，需要管理学习时间和待办事项、希望通过AI辅助制定计划的个人用户。

## Goals
- 📅 **AI计划生成**: 用户提供课表 + 日记，AI分析后生成详细计划
- 📊 **计划展示**: 清晰的每日、每周计划展示，含时间块和当前提示
- ✅ **待办管理**: 简单的待办事项添加、完成、删除
- 🎯 **周目标管理**: 本周重点目标展示和追踪
- 📱 **跨设备访问**: 手机/电脑都能查看计划
- 🤖 **AI直接操作**: AI可以直接添加/修改计划和待办

## Non-Goals (Out of Scope)
- 多人协作功能
- 复杂的项目管理功能
- 社交功能
- 特定考试的追踪（如英语六级）- 这是用户短期目标，不是软件开发目标

## Background & Context
- 用户现有：课程表CSV、日记文件、待办事项、周计划
- 现有技术栈：React + TypeScript + Vite + Supabase
- 已部署在 GitHub Pages
- 用户痛点：时间被手机吸引、学习断断续续、缺少干劲

## Functional Requirements
- **FR-1**: 基于日记内容和课表，AI能理解并生成详细计划
- **FR-2**: 每日计划展示，按时间块安排课程、学习、休息
- **FR-3**: 待办事项管理（添加、完成、删除）
- **FR-4**: 当前时间段提示，清晰显示现在该做什么
- **FR-5**: 周计划展示和管理
- **FR-6**: AI可直接操作数据库添加/修改计划和待办

## Non-Functional Requirements
- **NFR-1**: 界面设计美观、清晰、有视觉吸引力
- **NFR-2**: 移动端和桌面端都有良好体验
- **NFR-3**: 数据实时同步
- **NFR-4**: 加载速度快，响应式设计

## Constraints
- **Technical**: 使用现有的 React + Supabase 技术栈
- **Business**: 免费部署在 GitHub Pages
- **Dependencies**: Supabase 作为数据库和实时同步服务

## Assumptions
- 用户会按时写日记，内容包含当天情况和未来计划想法
- 课程表会定期更新
- 用户会参考计划安排学习

## Acceptance Criteria

### AC-1: 计划展示
- **Given**: 数据库中有周计划数据
- **When**: 打开应用首页
- **Then**: 看到今日详细计划，按时间块清晰展示
- **Verification**: `human-judgment`

### AC-2: 当前时间段提示
- **Given**: 用户在应用首页
- **When**: 查看当前时间
- **Then**: 清晰显示当前时间段该做什么
- **Verification**: `human-judgment`

### AC-3: 待办事项管理
- **Given**: 用户在待办页面
- **When**: 添加、完成、删除待办事项
- **Then**: 操作成功，数据同步到数据库
- **Verification**: `programmatic`

### AC-4: 周计划展示
- **Given**: 数据库中有周计划数据
- **When**: 打开周计划页面
- **Then**: 看到本周整体安排和每日计划
- **Verification**: `human-judgment`

### AC-5: AI操作数据库
- **Given**: 用户告诉AI想添加待办或修改计划
- **When**: AI通过脚本操作Supabase
- **Then**: 数据成功更新，页面刷新后能看到变化
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要习惯养成追踪（如"23点前上床"连续打卡）？
- [ ] 是否需要计划完成度统计？
