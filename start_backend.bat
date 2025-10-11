@echo off
echo ========================================
echo Starting NegGes AI Backend Server
echo ========================================
echo.

cd backend

echo Checking for virtual environment...
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created!
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo Starting Flask Server on port 5000...
echo ========================================
echo.

python app.py

pause
