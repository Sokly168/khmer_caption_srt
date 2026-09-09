@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Sthang Studio Setup

echo ========================================================================
echo   Sthang Studio - Setting Up Project Dependencies
echo   Installing dependencies and building for local use...
echo ========================================================================
echo.

rem 1. Ensure apps\server\.env exists
if not exist "apps\server\.env" (
  if exist ".env.example" (
    echo [*] Creating apps\server\.env from .env.example...
    if not exist "apps\server" mkdir "apps\server"
    copy /y ".env.example" "apps\server\.env" >nul
  )
)

rem 2. Install Node dependencies
echo [*] Installing Node.js packages (npm ci)...
call npm.cmd ci --include=dev --no-audit --no-fund
if not "!errorlevel!"=="0" (
  echo [!] npm ci encountered an issue, trying npm install...
  call npm.cmd install --include=dev --no-audit --no-fund
  if not "!errorlevel!"=="0" (
    echo [ERROR] Failed to install Node dependencies.
    exit /b !errorlevel!
  )
)
echo [OK] Node dependencies are ready.
echo.

rem 3. Setup Python local timing
echo [*] Setting up local Khmer caption timing (.venv)...
if exist "setup-local-timing-windows.bat" (
  call "setup-local-timing-windows.bat"
  if not "!errorlevel!"=="0" (
    echo [ERROR] Local timing setup failed.
    exit /b !errorlevel!
  )
) else (
  echo [ERROR] setup-local-timing-windows.bat was not found.
  exit /b 1
)
echo.

rem 4. Build project
echo [*] Building Sthang Studio for local use (npm run build)...
call npm.cmd run build
if not "!errorlevel!"=="0" (
  echo [ERROR] Project build failed.
  exit /b !errorlevel!
)

rem 5. Create Desktop Shortcut (Khmer Captions SRT)
echo.
echo [*] Creating Desktop Shortcut (Khmer Captions SRT)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ensure-shortcut.ps1"
if "!errorlevel!"=="0" (
  echo [OK] Desktop Shortcut "Khmer Captions SRT" created on Desktop.
)

echo.
echo ========================================================================
echo   [OK] Sthang Studio setup and build completed successfully!
echo   [OK] Shortcut "Khmer Captions SRT" is ready on your Desktop!
echo ========================================================================
exit /b 0
