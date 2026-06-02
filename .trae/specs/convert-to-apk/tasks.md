# 项目转换为APK - 实现计划（分解和优先级任务列表）

## [ ] Task 1: 安装Capacitor依赖包
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 安装@capacitor/core和@capacitor/cli
  - 初始化Capacitor配置
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-1.1: package.json包含capacitor相关依赖
  - `programmatic` TR-1.2: 生成capacitor.config.ts配置文件
- **Notes**: 需要先执行npm install安装基础依赖

## [ ] Task 2: 修改vite.config.ts配置base路径
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修改vite.config.ts中的base配置为'./'
  - 确保构建后的资源路径正确
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `human-judgment` TR-2.1: vite.config.ts中base设置为'./'
- **Notes**: 这是为了确保Capacitor能正确加载静态资源

## [ ] Task 3: 修改package.json添加Capacitor脚本
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 添加capacitor相关脚本命令
  - 添加sync脚本用于同步Web资源
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `human-judgment` TR-3.1: package.json包含capacitor脚本
- **Notes**: 脚本包括build、capacitor:sync等

## [ ] Task 4: 添加Android平台支持
- **Priority**: P0
- **Depends On**: Tasks 1, 2, 3
- **Description**: 
  - 使用Capacitor CLI添加Android平台
  - 生成android项目目录
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-4.1: 项目根目录下存在android文件夹
  - `programmatic` TR-4.2: android目录包含完整的Android项目结构
- **Notes**: 需要Java和Android SDK环境

## [ ] Task 5: 构建Web应用并同步到Capacitor
- **Priority**: P0
- **Depends On**: Tasks 1-4
- **Description**: 
  - 执行npm run build构建Web应用
  - 执行npx cap sync同步资源到Android项目
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-5.1: dist目录存在且包含构建产物
  - `programmatic` TR-5.2: android/app/src/main/assets/public目录包含同步的资源
- **Notes**: 确保构建过程无错误

## [ ] Task 6: 构建Android APK
- **Priority**: P0
- **Depends On**: Tasks 1-5
- **Description**: 
  - 使用Gradle构建debug版本APK
  - 生成可安装的APK文件
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-6.1: APK文件存在于android/app/build/outputs/apk/debug目录
- **Notes**: 需要配置JAVA_HOME和ANDROID_HOME环境变量

## [ ] Task 7: 验证APK功能
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 将APK安装到Android设备或模拟器
  - 测试应用的各项功能
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgment` TR-7.1: 应用能正常启动
  - `human-judgment` TR-7.2: 底部导航栏正常工作
  - `human-judgment` TR-7.3: 各页面能正常加载