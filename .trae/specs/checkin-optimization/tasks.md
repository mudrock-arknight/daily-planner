# 打卡规则优化与长期目标统计 - 实现计划

## [x] Task 1: 优化打卡按钮显示

- **Priority**: P0
- **Depends On**: None
- **Description**: 修改 HomePage.tsx 和 WeeklyPlanPage.tsx，只对学习类型且可统计的时间块显示打卡按钮
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment`: 首页只对学习块显示打卡按钮
  - `human-judgment`: 课程和休息块不显示打卡按钮
- **Notes**: 检查时间块的 `type` 和 `countable` 字段

## [x] Task 2: 调整统计页面逻辑

- **Priority**: P0
- **Depends On**: None
- **Description**: 修改 StatsPage.tsx，只统计学习类型的时间块，计算正确的完成率
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic`: 验证完成率计算只考虑学习块
  - `human-judgment`: 统计页面显示的数据正确

## [x] Task 3: 添加长期目标时间统计

- **Priority**: P1
- **Depends On**: None
- **Description**: 在统计页面添加长期目标的时间投入统计，通过内容关键词匹配关联目标
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment`: 显示各长期目标的累计学习时间
  - `human-judgment`: 有直观的进度展示

## [x] Task 4: 验证历史数据存储

- **Priority**: P1
- **Depends On**: None
- **Description**: 确认 Supabase 的历史数据加载功能正常，确保数据可以长期查询
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic`: 验证加载所有历史 checkin 数据
  - `human-judgment`: 确认页面可以显示久远的历史统计
