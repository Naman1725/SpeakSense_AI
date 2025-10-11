@echo off
echo ========================================
echo Starting NegGes AI Frontend
echo ========================================
echo.

cd frontend

echo Installing dependencies (if needed)...
if not exist "node_modules\" (
    echo Installing npm packages...
    call npm install
    echo.
)

echo.
echo ========================================
echo Starting React Development Server...
echo ========================================
echo Browser will open automatically at http://localhost:3000
echo.

call npm start

pause
