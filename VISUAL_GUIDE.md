# 🎯 Visual Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR COMPUTER                           │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   TERMINAL 1     │         │   TERMINAL 2     │         │
│  │                  │         │                  │         │
│  │   Backend        │────────▶│   Frontend       │         │
│  │   (Python)       │         │   (React)        │         │
│  │   Port 5000      │         │   Port 3000      │         │
│  │                  │         │                  │         │
│  │  [Flask Server]  │         │  [Dev Server]    │         │
│  │  [MediaPipe AI]  │         │  [Web Interface] │         │
│  └──────────────────┘         └──────────────────┘         │
│           │                            │                    │
│           │                            │                    │
│           └────────────────────────────┘                    │
│                      │                                      │
│                      ▼                                      │
│           ┌─────────────────────┐                          │
│           │   Browser           │                          │
│           │   (Chrome/Edge)     │                          │
│           │                     │                          │
│           │  📹 Webcam Feed     │                          │
│           │  🎤 Microphone      │                          │
│           │  📊 Real-time       │                          │
│           │     Feedback        │                          │
│           └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Flow

### 1️⃣ Start Backend (Terminal 1)

```
┌────────────────────────────────────────┐
│ C:\...\NegGes_AI>start_backend.bat     │
│                                        │
│ Creating virtual environment...        │
│ Installing dependencies...             │
│ ✓ Flask                                │
│ ✓ MediaPipe (AI for gesture detection)│
│ ✓ OpenCV (video processing)           │
│                                        │
│ ✅ Running on http://127.0.0.1:5000    │
│                                        │
│ [KEEP THIS WINDOW OPEN]               │
└────────────────────────────────────────┘
```

### 2️⃣ Start Frontend (Terminal 2)

```
┌────────────────────────────────────────┐
│ C:\...\NegGes_AI>start_frontend.bat    │
│                                        │
│ Installing npm packages...             │
│ ✓ React                                │
│ ✓ Axios                                │
│                                        │
│ Starting development server...         │
│                                        │
│ ✅ Compiled successfully!              │
│ ✅ Browser opened: localhost:3000     │
│                                        │
│ [KEEP THIS WINDOW OPEN TOO]           │
└────────────────────────────────────────┘
```

### 3️⃣ Browser Opens Automatically

```
┌───────────────────────────────────────────────────────┐
│ 🌐 http://localhost:3000                              │
├───────────────────────────────────────────────────────┤
│                                                       │
│  🎤 NegGes AI - Public Speaking Coach                │
│     Real-time analysis of your oratory skills        │
│                                                       │
│  ┌─────────────────────┐  ┌───────────────────────┐ │
│  │                     │  │ 🖐️ Gesture Feedback   │ │
│  │   📹 YOUR VIDEO     │  │                       │ │
│  │                     │  │ • Analyzing...        │ │
│  │   (Webcam Feed)     │  │                       │ │
│  │                     │  ├───────────────────────┤ │
│  │                     │  │ 💬 Speech Analysis    │ │
│  └─────────────────────┘  │                       │ │
│                           │ • Listening...        │ │
│  [  Start Analysis  ]     │                       │ │
│                           └───────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### 4️⃣ Allow Permissions

```
┌──────────────────────────────────────────┐
│  🔒 localhost:3000 wants to:             │
│                                          │
│  📹 Use your camera                      │
│  🎤 Use your microphone                  │
│                                          │
│      [ Block ]      [ ✓ Allow ]          │
└──────────────────────────────────────────┘
                       ↑
                  CLICK HERE!
```

### 5️⃣ Start Analysis

```
┌─────────────────────────────────────────────────────────┐
│  📹 [Recording...]                                      │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  YOUR LIVE VIDEO │  │ ⚠️ crossed_arms          │   │
│  │                  │  │    Arms crossed - appears │   │
│  │  [You speaking]  │  │    defensive             │   │
│  │                  │  │    Severity: high        │   │
│  │                  │  │                          │   │
│  └──────────────────┘  │ ⚠️ touching_face         │   │
│                        │    Touching face - shows │   │
│  [ Stop Analysis ]     │    nervousness           │   │
│                        │    Severity: medium      │   │
│                        ├──────────────────────────┤   │
│                        │ 💬 Speech Analysis       │   │
│                        │                          │   │
│                        │ Words: 127               │   │
│                        │ Fillers: 8 (6.3%)        │   │
│                        │ Pace: 145 WPM            │   │
│                        │                          │   │
│                        │ ✓ Good speaking pace     │   │
│                        └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6️⃣ Get Your Score

```
┌────────────────────────────────────┐
│  📊 Overall Performance            │
│                                    │
│          82/100                    │
│                                    │
│  Total Words: 247                  │
│  Filler Words: 12 (4.9%)           │
│  Frames Analyzed: 156              │
│                                    │
│  ✅ Excellent performance!         │
│     Keep it up!                    │
└────────────────────────────────────┘
```

## Common Issues & Solutions

```
❌ "Command not found: python"
✅ Install Python 3.8+ from python.org

❌ "Command not found: npm"
✅ Install Node.js from nodejs.org

❌ "Port 5000 already in use"
✅ Close other apps using port 5000
   Or change port in backend/app.py

❌ "Camera not working"
✅ Click lock icon in address bar
   → Site settings → Allow camera

❌ "Speech not recognized"
✅ Use Chrome or Edge browser
   Check microphone permissions
   Speak clearly
```

## File Structure

```
NegGes_AI/
│
├── 📄 RUN_ME_FIRST.txt          ← Start here!
├── 📄 HOW_TO_RUN.md             ← Detailed instructions
├── 📄 QUICK_START.md            ← Quick guide
├── 📄 README.md                 ← Full documentation
│
├── ⚡ start_backend.bat         ← Double-click to start backend
├── ⚡ start_frontend.bat        ← Double-click to start frontend
│
├── 📁 backend/
│   ├── app.py                   ← Flask server with AI
│   └── requirements.txt         ← Python packages
│
└── 📁 frontend/
    ├── src/
    │   ├── App.js               ← Main React app
    │   └── App.css              ← Styling
    ├── public/
    └── package.json             ← Node packages
```

## Timeline Expectations

```
⏱️  First Time Setup:
    ├─ Backend installation:  2-5 minutes
    ├─ Frontend installation: 1-3 minutes
    └─ Total:                 3-8 minutes

⏱️  Subsequent Runs:
    ├─ Backend startup:  5-10 seconds
    ├─ Frontend startup: 10-20 seconds
    └─ Total:            15-30 seconds
```

## Success Indicators

### ✅ Backend Running Successfully
```
* Serving Flask app 'app'
* Debug mode: on
WARNING: This is a development server.
* Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### ✅ Frontend Running Successfully
```
Compiled successfully!

You can now view negges-ai-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### ✅ App Working Correctly
- Webcam feed visible
- "Start Analysis" button clickable
- Real-time feedback appears when recording
- Speech analysis updates as you speak

---

**You're all set! Happy practicing! 🎤✨**
