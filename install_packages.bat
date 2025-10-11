@echo off
echo ========================================
echo Installing NegGes AI Dependencies
echo ========================================
echo.
echo This may take 5-10 minutes depending on your internet speed.
echo Please be patient...
echo.

cd backend

echo [1/7] Installing Flask...
python -m pip install --default-timeout=200 flask
if %errorlevel% neq 0 goto error

echo [2/7] Installing Flask-CORS...
python -m pip install --default-timeout=200 flask-cors
if %errorlevel% neq 0 goto error

echo [3/7] Installing NumPy...
python -m pip install --default-timeout=200 numpy
if %errorlevel% neq 0 goto error

echo [4/7] Installing Pillow...
python -m pip install --default-timeout=200 Pillow
if %errorlevel% neq 0 goto error

echo [5/7] Installing OpenCV (Large file - may take time)...
python -m pip install --default-timeout=300 opencv-python
if %errorlevel% neq 0 goto error

echo [6/7] Installing MediaPipe (Large file - may take time)...
python -m pip install --default-timeout=300 mediapipe
if %errorlevel% neq 0 goto error

echo [7/7] Installing SpeechRecognition...
python -m pip install --default-timeout=200 SpeechRecognition
if %errorlevel% neq 0 goto error

echo.
echo ========================================
echo ✓ All packages installed successfully!
echo ========================================
echo.
echo You can now run: python app.py
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ✗ Installation failed!
echo ========================================
echo.
echo Possible solutions:
echo 1. Check your internet connection
echo 2. Try running this script again
echo 3. Try installing packages one by one manually
echo.
pause
exit /b 1
