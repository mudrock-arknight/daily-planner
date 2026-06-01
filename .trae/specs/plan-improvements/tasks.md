# 个人规划助手改进 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] 任务1：修复时间块"已完成"判断逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修复HomePage和WeeklyPlanPage中判断时间块是否已完成的逻辑
  - 当前逻辑只看时间不看日期，导致未来日期也显示"已完成"
  - 需要正确结合日期和时间判断
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR1.1: 只有已过去的时间块才显示"已完成"标签
  - `human-judgement` TR1.2: 未来日期的所有时间块都不显示"已完成"
- **Notes**: 需要检查isTimeBlockPast函数的实现

## [ ] 任务2：优化数据统计页面
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 重新设计统计页面，显示有意义的数据
  - 添加打卡天数统计
  - 添加学习时长累计
  - 添加目标进度可视化
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR2.1: 统计页面数据清晰易懂
  - `human-judgement` TR2.2: 有图表或进度条展示数据
- **Notes**: 参考用户日记中的反馈

## [ ] 任务3：更新周计划生成脚本，添加日常时间块
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 修改generate-plan.js
  - 添加早饭、午饭、晚饭、洗漱等日常时间块
  - 合理安排休息和学习时间
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR3.1: 每日计划包含吃饭、洗漱等日常活动
  - `human-judgement` TR3.2: 学习时间安排合理，不超过用户接受范围

## [ ] 任务4：实现长期大学目标管理功能
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 在数据库中添加长期目标表或字段
  - 将用户列出的9大长期目标录入系统：
    1. 英语（刷高分、考六级、准备雅思）
    2. 人工智能
    3. 投资知识（股票、量化投资、基金）
    4. 编程能力
    5. 单片机
    6. 打字速度
    7. 练字
    8. 艺术爱好（乐器/唱歌）
    9. 普通话
  - 在周计划页面展示长期目标进度
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR4.1: 周计划包含全部9大长期目标
  - `human-judgement` TR4.2: 目标可按类别和时间跨度查看

## [ ] 任务5：合理安排英语学习时间（每天约2小时）
- **Priority**: P1
- **Depends On**: 任务3
- **Description**: 
  - 调整英语学习时间为每天约2小时
  - 合理分配到不同时间段
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgement` TR5.1: 每天英语学习时间约2小时
  - `human-judgement` TR5.2: 时间安排合理可行

## [ ] 任务6：运行脚本更新数据库中的周计划
- **Priority**: P2
- **Depends On**: 任务3, 任务4, 任务5
- **Description**: 
  - 运行更新后的generate-plan.js
  - 将新的计划推送到Supabase
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR6.1: 新计划成功保存到数据库
  - `human-judgement` TR6.2: 网站可以正确显示新计划
