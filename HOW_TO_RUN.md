# How to Run NegGes AI 🚀

## Option 1: Using the Batch Files (EASIEST - Windows Only)

### Step 1: Start Backend
1. Double-click `start_backend.bat`
2. Wait for installation to complete
3. You'll see: "Running on http://127.0.0.1:5000"
4. **Keep this window open!**

### Step 2: Start Frontend
1. Double-click `start_frontend.bat` (in a NEW window)
2. Wait for installation to complete
3. Browser will open automatically at http://localhost:3000
4. **Keep this window open too!**

### Step 3: Use the App
1. Allow camera and microphone access
2. Click "Start Analysis"
3. Start speaking and presenting!

---

## Option 2: Manual Setup (All Platforms)

### Terminal 1 - Backend

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors opencv-python mediapipe Pillow numpy SpeechRecognition
python app.py
```

**Mac/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors opencv-python mediapipe Pillow numpy SpeechRecognition
python app.py
```

✅ You should see: `Running on http://127.0.0.1:5000`
⚠️ **Keep this terminal open!**

---

### Terminal 2 - Frontend

Open a **NEW** terminal/command prompt:

```bash
cd frontend
npm install
npm start
```

✅ Browser opens at http://localhost:3000
⚠️ **Keep this terminal open!**

---

## Important Notes

### ⚡ Both Must Run Simultaneously
- Backend runs on port **5000**
- Frontend runs on port **3000**
- You need **BOTH** running at the same time!

### 🎥 Permissions
- You MUST allow camera and microphone access
- Click "Allow" when browser asks for permissions

### 🌐 Best Browser
- **Chrome** or **Edge** (recommended)
- Firefox has limited speech recognition support
- Safari is not recommended

### 📦 First Time Setup
- Backend: Installing Python packages takes 2-5 minutes
- Frontend: Installing npm packages takes 1-3 minutes
- **Be patient on first run!**

---

## Troubleshooting

### "Python is not recognized"
1. Install Python from https://www.python.org/downloads/
2. Make sure to check "Add Python to PATH" during installation
3. Restart your terminal

### "Node/npm is not recognized"
1. Install Node.js from https://nodejs.org/
2. Restart your terminal

### Backend Port 5000 Already in Use
Edit `backend/app.py`, last line:
```python
app.run(debug=True, port=5001, host='0.0.0.0')  # Change to 5001
```

Then edit `frontend/src/App.js`, line 4:
```javascript
const API_URL = 'http://localhost:5001/api';  // Change to 5001
```

### Camera/Microphone Not Working
1. Check browser permissions (click lock icon in address bar)
2. Make sure no other app is using the camera
3. Try reloading the page
4. Try a different browser (Chrome recommended)

### Speech Recognition Not Working
- Must use **Chrome** or **Edge** browser
- Check microphone permissions
- Make sure microphone is not muted
- Speak clearly and at moderate volume

---

## Quick Commands Reference

### Check if Backend is Running
Open browser: http://localhost:5000

You should see "Not Found" - that's OK! It means server is running.

### Check if Frontend is Running
Open browser: http://localhost:3000

You should see the app interface.

### Stop the Servers
- Press `Ctrl + C` in both terminal windows
- Or just close the terminal windows

---

## What You'll See

### While Running:
- **Left side**: Your live webcam feed
- **Right side**: Real-time feedback panels
  - Gesture warnings (crossed arms, fidgeting, etc.)
  - Speech analysis (filler words, pace)

### After Stopping:
- Overall performance score (0-100)
- Total words spoken
- Filler word percentage
- Detailed statistics

---

## System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Webcam**: Built-in or external
- **Microphone**: Built-in or external

---

## Need More Help?

1. Check [README.md](README.md) for detailed documentation
2. Check [QUICK_START.md](QUICK_START.md) for simplified guide
3. Make sure both backend and frontend are running
4. Check console for error messages

---

**Happy Speaking! 🎤✨**
