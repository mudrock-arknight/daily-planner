# Daily Planner - 代码审查问题修复任务列表

## [x] Task 1: 修复 HomePage 的 toggleCompletion 覆盖数据问题
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 HomePage.tsx 中的 handleToggleCompletion 函数
  - 更新 daily_checkins 时使用展开运算符保留原有数据
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic`: TypeScript 编译通过
  - `human-judgement`: 查看代码确认使用了 `{ ...checkinData[0].data, completions: ... }` 模式
- **Notes**: 参考 WeeklyPlanPage.tsx 第 192-196 行的正确实现

## [x] Task 2: 修复 CheckinPage 保存逻辑错误
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 CheckinPage.tsx 的保存逻辑
  - 确保只保存打卡相关字段到 data JSONB，不包含 id/date 等元数据
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic`: TypeScript 编译通过
  - `human-judgement`: 确认保存的数据结构不包含 id、date 等元数据字段

## [x] Task 3: 修复 CheckinPage 的 stale state 问题
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 CheckinPage.tsx 中的 setCheckin 调用
  - 使用函数式更新 `setCheckin(prev => {...})` 避免闭包导致的 stale state
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: TypeScript 编译通过
  - `human-judgement`: 确认使用了函数式 setState

## [x] Task 4: 创建 .env 文件并更新密钥配置
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 创建 .env 文件存储 Supabase 密钥
  - 更新 supabase.ts 和 supabase-admin.ts 使用环境变量
  - 更新 .gitignore 排除 .env
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic`: 搜索源代码确认没有硬编码的 SERVICE_KEY
  - `human-judgement`: 确认 .env 文件已创建且 .gitignore 已更新

## [x] Task 5: 验证所有修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **Description**: 
  - 运行 TypeScript 编译验证
  - 提交并推送代码
- **Acceptance Criteria Addressed**: 所有 AC
- **Test Requirements**:
  - `programmatic`: TypeScript 编译通过 (exit_code 0)
  - `programmatic`: 代码成功推送到 GitHub

# Task Dependencies
- Task 5 depends on Task 1, Task 2, Task 3, Task 4