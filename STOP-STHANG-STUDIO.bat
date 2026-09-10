@echo off
setlocal
echo Stopping Khmer Captions SRT...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8787,5188 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
echo Khmer Captions SRT stopped.
timeout /t 2 /nobreak >nul
