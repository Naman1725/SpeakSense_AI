@echo off
echo ========================================
echo    NegGes AI - Starting Application
echo ========================================
echo.

echo [1/3] Killing any processes on ports 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process on port 3000: %%a
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process on port 5000: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/3] Starting Backend on port 5000...
start "Backend Server" cmd /k "venv\Scripts\python.exe backend\app.py"

echo [3/3] Starting Frontend on port 3000...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Both servers are starting...
echo Wait for "Compiled successfully!" in Frontend window
echo.
pause
