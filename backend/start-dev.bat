@echo off
title AgroWatch Development Servers
echo.
echo 🚀 Starting AgroWatch Development Servers...
echo.

REM Start Backend Server in new window
echo 🐍 Starting Backend Server...
start "AgroWatch Backend" cmd /k "cd /d %~dp0 && python run_server.py"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Frontend Server in new window  
echo ⚛️  Starting Frontend Server...
start "AgroWatch Frontend" cmd /k "cd /d %~dp0\..\frontend\Agro2Watch && pnpm dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📋 Server URLs:
echo    🔗 Frontend: http://localhost:5173
echo    🔗 Backend:  http://127.0.0.1:8001
echo    🔗 API Docs: http://127.0.0.1:8001/docs
echo.
echo 💡 Two terminal windows will open - one for each server
echo    Press Ctrl+C in each window to stop the servers
echo.
pause