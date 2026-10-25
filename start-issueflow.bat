@echo off
title IssueFlow Launcher
echo ==============================================
echo       Launching IssueFlow (Full-Stack)
echo ==============================================
echo.

set "PATH=C:\Users\msi\AppData\Local\Programs\Git\cmd;C:\Users\msi\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64;%PATH%"

echo [1/3] Starting Express Backend (Port 5000)...
start "IssueFlow Backend" /min cmd /c "cd /d C:\Users\msi\.gemini\antigravity\scratch\dev-issue-tracker\server && node src/index.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting React Vite Frontend (Port 5173)...
start "IssueFlow Frontend" /min cmd /c "cd /d C:\Users\msi\.gemini\antigravity\scratch\dev-issue-tracker\client && npx vite --host"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ==============================================
echo  IssueFlow is now running!
echo  Local:   http://localhost:5173
echo  Backend: http://localhost:5000
echo ==============================================
echo.
pause
