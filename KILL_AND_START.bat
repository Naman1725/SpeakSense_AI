@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd frontend
start "NegGes Frontend" cmd /k npm start

echo.
echo ========================================
echo Backend: http://localhost:5000 (Already Running)
echo Frontend: http://localhost:3000 (Starting...)
echo ========================================
echo.
echo Wait 20 seconds, then open: http://localhost:3000
echo.
