@echo off
setlocal
cd /d "%~dp0"
title Sthang Studio - Local Khmer Timing Setup

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup-local-timing.ps1"
set "EXITCODE=%errorlevel%"
if not "%EXITCODE%"=="0" (
  echo.
  echo [ERROR] Local timing setup stopped with code %EXITCODE%.
)
exit /b %EXITCODE%
