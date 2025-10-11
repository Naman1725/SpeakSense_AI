@echo off
echo Restarting NegGes AI with updated code...

echo Killing old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

timeout /t 2 /nobreak >nul

echo Starting frontend...
cd frontend
start cmd /k "npm start"

echo Done! The app should reload with the new features.
echo - Live transcript will show during recording
echo - Export buttons (PDF/JSON/CSV) will appear after stopping recording
