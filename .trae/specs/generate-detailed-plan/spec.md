# 详细周计划生成 - Product Requirement Document

## Overview
- **Summary**: 根据第13周（6月1日-6月7日）的课表，结合日记中的长期目标和近期考试，生成一份时间连续、学习内容明确的详细周计划。
- **Purpose**: 解决用户"计划时间分散、学习内容不明确、时间有空白的问题，帮助用户在兼顾近期考试（工程力学、毛概、六级）和长期目标（雅思、AI、投资等）。
- **Target Users**: 大学生用户（mudrock-arknight）

## Goals
- 生成符合第13周（6.1-6.7）完整、无时间空白的详细时间表
- 连续两节课合并显示
- 学习内容明确，不使用"自由学习"等模糊表述
- 结合近期考试安排（工程力学、毛概、六级）和长期目标（雅思、AI、投资等）
- 每天保证2小时英语学习（直到六级）
- 每天安排合理的休息和生活时间（吃饭、洗漱等
- 每日计划存入Supabase并在应用中可显示

## Non-Goals (Out of Scope)
- 修改应用界面UI调整
- 修改数据统计功能
- 第14周及以后的计划（除非特别说明

## Background & Context
- 已有大二下第13周课表（diary/大二下13周课表.csv
- 用户有长期目标（雅思、AI、投资、编程、单片机、打字、练字、音乐、普通话
- 近期考试：6月2日工程力学、6月4日毛概、6月13日六级（还剩13天）
- 技术栈：React + Supabase，已有插入脚本
- 应用部署在GitHub Pages

## Functional Requirements
- **FR-1**: 生成周一至周日每一天的详细时间表，从起床到睡觉
- **FR-2**: 所有时间连续无空白
- **FR-3**: 连续课程合并显示
- **FR-4**: 学习内容明确具体
- **FR-5**: 每天保证2小时英语
- **FR-6**: 计划存入weekly_plans和dailyCheckins
- **FR-7**: 包含长期目标的渐进安排

## Non-Functional Requirements
- **NFR-1**: 计划时间合理，考虑生理需求（吃饭、休息、睡眠
- **NFR-2**: 每天学习强度适中，不是7-8小时，劳逸结合
- **NFR-3**: 长期目标渐进安排合理安排

## Constraints
- **Technical**: 使用现有Supabase结构和add-weekly.mjs风格脚本
- **Business**: 免费使用现有数据库结构保持不变
- **Dependencies**: Supabase

## Assumptions
- 每日作息：6:45起床，22:45睡觉
- 三餐时间已安排：早餐7:00-7:40，午餐12:00-13:00，晚餐18:00-18:30
- 每天英语学习2小时（直到六级）
- 长期目标每天安排1-2小时

## Acceptance Criteria

### AC-1: 完整时间连续性
- **Given**: 已生成完整周计划
- **When**: 检查每一天的时间块
- **Then**: 时间从6:45到22:45覆盖全天
- **Verification**: `human-judgment`

### AC-2: 连续课程合并
- **Given**: 某一天有连续课程
- **When**: 显示当天计划
- **Then**: 连续2节课程合并为一个时间块
- **Verification**: `programmatic`

### AC-3: 学习内容明确
- **Given**: 所有学习时间块
- **When**: 查看内容
- **Then**: 不包含"自由学习"模糊词，有明确到具体科目或章节
- **Verification**: `human-judgment`

### AC-4: 每日英语2小时
- **Given**: 每天计划
- **When**: 检查英语学习时长
- **Then**: 至少有至少安排至少2小时
- **Verification**: `programmatic`

### AC-5: 计划成功存入
- **Given**: 计划已生成
- **When**: 调用Supabase插入
- **Then**: weekly_plans表中有记录，dailySchedule有完整详细
- **Verification**: `programmatic`

### AC-6: 长期目标安排
- **Given**: 周计划中包含长期目标的渐进安排
- **When**: 检查周目标列表和每日时间块
- **Then**: 雅思、AI、投资、编程、单片机等长期目标有安排
- **Verification**: `human-judgment`

## Open Questions
- [ ] 周六日是否需要特殊安排
- [ ] 车队工作安排？
