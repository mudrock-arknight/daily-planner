# 详细周计划生成 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 生成详细计划数据结构
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 根据第13周课表、长期目标、近期考试安排，创建完整的周计划数据结构
  - 包含dailySchedule，每个天都有详细时间块
  - 合并连续课程，保证时间连续无空白
  - 每天安排至少2小时英语
  - 学习内容明确
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-6
- **Test Requirements**:
  - `programmatic` TR-1.1: 每日时间从6:45覆盖到22:45
  - `programmatic` TR-1.2: 连续课程合并为一个块
  - `human-judgement` TR-1.3: 学习内容具体，无"自由学习"
  - `programmatic` TR-1.4: 每天英语学习≥2小时
- **Notes**: 长期目标包括：雅思、AI、投资、编程、单片机、打字、练字、普通话、音乐爱好

## [ ] Task 2: 创建周目标列表
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 从日记中提取长期目标和近期考试任务
  - 按重要性排序
  - 每项目标有明确进度
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgement` TR-2.1: 目标涵盖近期考试和长期目标
  - `programmatic` TR-2.2: 每个目标有id, text, progress字段

## [ ] Task 3: 编写Supabase插入脚本
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 参考add-weekly.mjs的结构
  - 创建插入脚本，将完整计划写入weekly_plans表
  - 确保使用正确的数据库结构
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-3.1: 使用service_role key连接
  - `programmatic` TR-3.2: 完整data结构插入

## [ ] Task 4: 执行插入并验证
- **Priority**: P1
- **Depends On**: Task 3
- **Description**: 
  - 运行脚本
  - 验证数据已成功插入
  - 检查错误处理
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: weekly_plans表有新记录
  - `programmatic` TR-4.2: 日期为第13周
