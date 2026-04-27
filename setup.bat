@echo off
setlocal enabledelayedexpansion
title GHE Academic Portal — Setup

echo.
echo  =====================================================
echo   GHE Academic Portal — Automated Setup
echo   Global Higher Education, Adelaide SA
echo  =====================================================
echo.

:: ── STEP 1: Check Node.js ──────────────────────────────
echo [1/4] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  Node.js not found. Attempting to install via winget...
    winget install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo  [!] winget install failed. Please install Node.js manually:
        echo      https://nodejs.org/en/download
        echo      Choose the LTS version, then re-run this script.
        pause
        exit /b 1
    )
    :: Refresh PATH so node is available
    for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "SYS_PATH=%%b"
    for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "USR_PATH=%%b"
    set "PATH=%SYS_PATH%;%USR_PATH%"
)
for /f "tokens=*" %%v in ('node --version 2^>nul') do set NODE_VER=%%v
echo  Node.js %NODE_VER% — OK

:: ── STEP 2: Check npm ──────────────────────────────────
echo [2/4] Checking npm...
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] npm not found. Please reinstall Node.js from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm --version 2^>nul') do set NPM_VER=%%v
echo  npm %NPM_VER% — OK

:: ── STEP 3: Install dependencies ──────────────────────
echo.
echo [3/4] Installing project dependencies (this may take a minute)...
cd /d "%~dp0"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo  [!] npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
)
echo  Dependencies installed — OK

:: ── STEP 4: Launch dev server ─────────────────────────
echo.
echo [4/4] Starting development server...
echo.
echo  =====================================================
echo   Portal running at: http://localhost:5173
echo   Press Ctrl+C to stop the server.
echo  =====================================================
echo.
call npm run dev

pause
