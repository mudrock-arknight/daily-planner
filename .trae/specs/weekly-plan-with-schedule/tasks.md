# 基于课表的周计划生成 - 实施计划

## [x] Task 1: 解析课表并更新第13周计划
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 解析大二下13周课表.csv文件
  - 根据课表重新生成第13周（6月6日-6月8日剩余天数）的计划
  - 考虑课程时间，在空闲时间段安排六级备考
- **Acceptance Criteria Addressed**: Requirement: 课表解析与时间块生成
- **Test Requirements**:
  - `programmatic` TR-1.1: 课表JSON格式正确，包含课程名称、教师、地点
  - `programmatic` TR-1.2: 连续课程已合并（如第1-2节合并）
  - `human-judgement` TR-1.3: 课程时间与课表CSV一致
- **Notes**: 第13周剩余天数：周五、周六、周日

## [x] Task 2: 创建第14周完整计划（含课表+长期目标）
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 根据13周课表生成第14周（6月9日-6月14日）完整计划
  - 结合六级备考冲刺（6月13日考试）
  - 六级考完后（6月14日）开始安排长期目标时间
- **Acceptance Criteria Addressed**: Requirement: 周计划生成规则
- **Test Requirements**:
  - `programmatic` TR-2.1: 包含完整的7天计划
  - `programmatic` TR-2.2: 每天时间块连续无空白
  - `human-judgement` TR-2.3: 六级备考每天至少4小时英语
  - `human-judgement` TR-2.4: 六级后开始安排长期目标时间
- **Notes**: 6月14日是周日，六级考后恢复日

## [x] Task 3: 同步计划到Supabase数据库
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 读取本地JSON计划文件
  - 使用Supabase upsert操作更新weekly_plans表
  - 验证更新成功
- **Acceptance Criteria Addressed**: Requirement: Supabase数据库同步
- **Test Requirements**:
  - `programmatic` TR-3.1: 第13周计划同步成功
  - `programmatic` TR-3.2: 第14周计划同步成功
  - `programmatic` TR-3.3: 数据库返回HTTP 200
- **Notes**: 使用upsert操作，根据week字段匹配

## [x] Task 4: 创建规划Skill
- **Priority**: P1
- **Depends On**: Task 1, Task 2, Task 3
- **Description**: 
  - 使用skill-creator创建可复用的规划Skill
  - Skill应包含：课表解析、日记分析、计划生成、文件创建、数据库同步
  - 提供清晰的使用说明和输入要求
- **Acceptance Criteria Addressed**: Requirement: 本地计划文件管理
- **Test Requirements**:
  - `human-judgement` TR-4.1: Skill定义完整，包含所有必要步骤
  - `human-judgement` TR-4.2: 使用说明清晰，用户知道如何提供输入
  - `programmatic` TR-4.3: Skill文件存在于skills目录
- **Notes**: Skill命名为"weekly-plan-generator"

## [x] Task 5: 更新规划系统文档
- **Priority**: P2
- **Depends On**: Task 4
- **Description**: 
  - 更新diary/规划系统使用指南.md
  - 添加课表解析流程说明
  - 添加长期目标时间分配策略
  - 添加Skill使用说明
- **Acceptance Criteria Addressed**: Requirement: 规划系统使用指南
- **Test Requirements**:
  - `human-judgement` TR-5.1: 文档包含完整的规划流程
  - `human-judgement` TR-5.2: 文档包含Skill使用说明
- **Notes**: 文档应简洁明了

# Task Dependencies
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 1, Task 2, Task 3]
- [Task 5] depends on [Task 4]
