@echo off
setlocal
cd /d "%~dp0"
title Khmer Captions SRT - Install & Run

rem Refresh PATH with portable tools if installed in user profile
set "LOCAL_TOOLS=%LOCALAPPDATA%\Sthang Studio\tools"
if exist "%LOCAL_TOOLS%\node-v22.22.0-win-x64" set "PATH=%LOCAL_TOOLS%\node-v22.22.0-win-x64;%PATH%"
if exist "%LOCAL_TOOLS%\python-3.12" set "PATH=%LOCAL_TOOLS%\python-3.12;%LOCAL_TOOLS%\python-3.12\Scripts;%PATH%"
if exist "%LOCAL_TOOLS%\ffmpeg\bin" set "PATH=%LOCAL_TOOLS%\ffmpeg\bin;%PATH%"
if exist "%LOCALAPPDATA%\Programs\Python\Python312" set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"

rem Check if setup or install is needed (auto-installs on new PC and creates Desktop Shortcut)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ensure-project-ready.ps1"
set "CHECK_EXIT=%errorlevel%"
if not "%CHECK_EXIT%"=="0" (
  echo.
  echo [ERROR] Khmer Captions SRT setup could not finish with code %CHECK_EXIT%.
  echo Please review the messages above.
  echo.
  pause
  exit /b %CHECK_EXIT%
)

rem Launch Khmer Captions SRT Studio
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\launch-studio.ps1"
set "EXITCODE=%errorlevel%"
if not "%EXITCODE%"=="0" (
  echo.
  echo Khmer Captions SRT exited with code %EXITCODE%.
  pause
)
exit /b %EXITCODE%
