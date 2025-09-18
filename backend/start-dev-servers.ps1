# AgroWatch Development Servers Launcher
# This script starts both backend (FastAPI) and frontend (React/Vite) servers simultaneously

Write-Host "🚀 Starting AgroWatch Development Servers..." -ForegroundColor Green
Write-Host ""

# Get current directory
$currentDir = Get-Location
$backendDir = "$currentDir"
$frontendDir = "$currentDir\..\frontend\Agro2Watch"

# Check if directories exist
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ Backend directory not found: $backendDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendDir)) {
    Write-Host "❌ Frontend directory not found: $frontendDir" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Backend directory: $backendDir" -ForegroundColor Cyan
Write-Host "📁 Frontend directory: $frontendDir" -ForegroundColor Cyan
Write-Host ""

# Function to start backend server
function Start-BackendServer {
    Write-Host "🐍 Starting Backend Server (FastAPI)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$backendDir'; Write-Host '🔥 Backend Server Starting...' -ForegroundColor Green; python run_server.py"
    ) -WindowStyle Normal
    Write-Host "✅ Backend server started at http://127.0.0.1:8001" -ForegroundColor Green
}

# Function to start frontend server
function Start-FrontendServer {
    Write-Host "⚛️  Starting Frontend Server (React + Vite)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList @(
        "-NoExit", 
        "-Command",
        "cd '$frontendDir'; Write-Host '🔥 Frontend Server Starting...' -ForegroundColor Green; pnpm dev"
    ) -WindowStyle Normal
    Write-Host "✅ Frontend server started at http://localhost:5173" -ForegroundColor Green
}

# Start both servers
Start-BackendServer
Start-Sleep -Seconds 2
Start-FrontendServer

Write-Host ""
Write-Host "🎉 Both servers are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Server Information:" -ForegroundColor White
Write-Host "   🔗 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   🔗 Backend:  http://127.0.0.1:8001" -ForegroundColor Cyan
Write-Host "   🔗 API Docs: http://127.0.0.1:8001/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Waiting for servers to fully start..." -ForegroundColor Yellow

# Wait and check if servers are running
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "🔍 Checking server status..." -ForegroundColor Yellow

# Check if ports are listening
$backendRunning = Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue

if ($backendRunning) {
    Write-Host "✅ Backend Server: Running on port 8001" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend Server: Not detected on port 8001" -ForegroundColor Yellow
}

if ($frontendRunning) {
    Write-Host "✅ Frontend Server: Running on port 5173" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend Server: Not detected on port 5173" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Development Environment Ready!" -ForegroundColor Green
Write-Host "   • Make changes to your code and both servers will auto-reload" -ForegroundColor White
Write-Host "   • Press Ctrl+C in each server window to stop them" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")