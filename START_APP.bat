@echo off
echo ========================================
echo    NegGes AI - Starting Application
echo ========================================
echo.

echo [1/2] Killing any process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/2] Starting Frontend on port 3000...
cd frontend
start cmd /k "npm start"

echo.
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Browser will open automatically in a few seconds...
echo.
pause
