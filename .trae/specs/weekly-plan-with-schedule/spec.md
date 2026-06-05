# 基于课表的周计划生成系统 - Spec

## Why
用户需要AI根据每周课表和日记内容，自动生成结构化的每周学习计划。课表是固定的时间约束，必须在规划时优先安排，然后在空闲时间段填充学习、长期目标和其他活动。

## What Changes
- 创建完整的周计划生成工作流（课表解析 → 日记分析 → 计划生成 → 本地文件创建 → 数据库同步）
- 建立计划文件管理规范（JSON格式，按周存储）
- 创建可复用的规划Skill，供后续每周使用

## Impact
- Affected specs: personal-planner
- Affected code: 新增规划工作流脚本、本地文件目录、Skill定义
- Affected files: diary/weekly_plans/*.json（计划文件）

## ADDED Requirements

### Requirement: 课表解析与时间块生成
系统应能从CSV格式的课表文件中解析出每周的课程安排，并转换为标准时间块格式。

#### Scenario: 课表解析成功
- **WHEN** 用户提供课表CSV文件
- **THEN** 系统解析出每天每节课的课程名称、教师、地点
- **AND** 连续的同门课程合并为一个时间块

### Requirement: 日记分析与目标提取
系统应从用户日记中提取关键信息，包括：
- 近期考试安排
- 长期目标（英语、AI、投资、编程、单片机、练字、打字、音乐、普通话）
- 短期任务和事件
- 用户的作息偏好和约束

#### Scenario: 日记分析完成
- **WHEN** 用户提供日记文件
- **THEN** 系统提取所有目标、考试、事件信息
- **AND** 按优先级和时间紧迫度排序

### Requirement: 周计划生成规则
生成计划时应遵循以下规则：
- 时间连续不空白，从起床到睡觉每段时间都有安排
- 课程时间优先安排，不可调整
- 连续课程合并（如第1-2节合并）
- 六级备考期间每天至少4小时英语学习
- 六级后每天4-6小时分配给长期目标
- 学习内容具体明确，不使用模糊描述
- 作息：8:00起床，00:00前上床

#### Scenario: 生成周计划
- **WHEN** 课表和日记分析完成
- **THEN** 系统生成完整的7天时间块计划
- **AND** 每天包含课程、学习、休息、任务等类型

### Requirement: 本地计划文件管理
系统应将生成的计划保存为JSON格式文件，存放在diary/weekly_plans/目录下。

#### Scenario: 创建计划文件
- **WHEN** 周计划生成完成
- **THEN** 创建diary/weekly_plans/第X周_YYYYMMDD-YYYYMMDD.json文件
- **AND** 包含weeklyGoals、longTermGoals、dailySchedule、notes

### Requirement: Supabase数据库同步
系统应将本地计划文件同步到Supabase的weekly_plans表中。

#### Scenario: 同步到数据库
- **WHEN** 本地计划文件创建完成
- **THEN** 系统读取JSON文件并upsert到weekly_plans表
- **AND** 根据week字段匹配更新

## MODIFIED Requirements

### Requirement: 规划系统使用指南
更新现有文档，添加：
- 课表解析流程说明
- 长期目标时间分配策略
- 本地文件管理规范
- Skill使用说明
