@echo off
setlocal
cd /d "%~dp0"
title Khmer Caption SRT - New PC Setup

call "%~dp0INSTALL-AND-RUN.bat" %*
exit /b %errorlevel%
