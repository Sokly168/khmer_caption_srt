@echo off
setlocal
cd /d "%~dp0"
title Khmer Captions SRT - Install & Run

rem Forward to unified installer and launcher
if exist "%~dp0INSTALL-AND-RUN.bat" (
  call "%~dp0INSTALL-AND-RUN.bat" %*
  exit /b %errorlevel%
)

rem Fallback launch directly
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ensure-project-ready.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\launch-studio.ps1"
exit /b %errorlevel%
