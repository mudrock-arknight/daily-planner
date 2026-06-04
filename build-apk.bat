
@echo off
echo.
echo ========================================
echo Daily Planner APK Build Script
echo ========================================
echo.

REM 设置环境
set "JAVA_HOME=C:\Users\79480\.p2\pool\plugins\org.eclipse.justj.openjdk.hotspot.jre.full.win32.x86_64_21.0.8.v20250724-1412\jre"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "PROJECT_ROOT=%~dp0.."
set "ANDROID_DIR=%PROJECT_ROOT%\android"
set "OUTPUT_DIR=%~dp0output"

REM 创建输出目录
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM 检查JDK
echo [1/3] Checking JDK...
if not exist "%JAVA_HOME%\bin\javac.exe" (
    echo ERROR: JDK not found! Please install JDK 21.
    pause
    exit /b 1
)
echo OK: JDK found at %JAVA_HOME%

REM 构建Web应用
echo.
echo [2/3] Building web app...
cd /d "%PROJECT_ROOT%"
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build web app!
    pause
    exit /b 1
)
echo OK: Web app built successfully

REM 构建APK
echo.
echo [3/3] Building APK...
cd /d "%ANDROID_DIR%"
call .\gradlew assembleDebug --no-daemon
if errorlevel 1 (
    echo ERROR: Failed to build APK!
    pause
    exit /b 1
)

REM 复制APK
echo.
set "APK_SOURCE=%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"
set "APK_TARGET=%OUTPUT_DIR%\daily-planner.apk"
if exist "%APK_SOURCE%" (
    copy "%APK_SOURCE%" "%APK_TARGET%"
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo APK built and copied to:
    echo %APK_TARGET%
    echo ========================================
) else (
    echo ERROR: APK file not found at expected location!
)

echo.
pause
