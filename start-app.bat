cd "C:\Users\DELL\Downloads\Telegram Desktop\Man\Man"
npm startgit --version@echo off
TITLE Smart Research Assistant - Starting Servers

echo ========================================
echo   SMART RESEARCH ASSISTANT
echo ========================================
echo.

echo Starting Backend Server on port 5000...
cd backend
start "Backend Server" /MIN node server.js
cd ..

echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo Starting Frontend Server on port 3000...
echo.
echo ========================================
echo   ACCESS YOUR APPLICATION:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:5000
echo ========================================
echo.

echo Press CTRL+C to stop both servers.
npx craco start