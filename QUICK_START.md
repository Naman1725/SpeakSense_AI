# Quick Start Guide 🚀

Get up and running in 5 minutes!

## Step 1: Backend Setup

Open a terminal/command prompt and run:

```bash
cd backend
python -m venv venv
```

**Windows:**
```bash
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Mac/Linux:**
```bash
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

✅ You should see: `Running on http://127.0.0.1:5000`

## Step 2: Frontend Setup

Open a **NEW** terminal/command prompt and run:

```bash
cd frontend
npm install
npm start
```

✅ Browser should open automatically at `http://localhost:3000`

## Step 3: Use the App

1. **Allow camera & microphone** when prompted
2. Click **"Start Analysis"**
3. Start speaking and presenting!
4. Watch real-time feedback on the right side
5. Click **"Stop Analysis"** to see your overall score

## Tips for Best Results

- 🎤 Speak clearly at a moderate pace
- 📹 Ensure good lighting for gesture detection
- 🔊 Use a good microphone for speech recognition
- 🌐 Use Chrome or Edge browser for best compatibility
- 👔 Position yourself so your upper body is visible

## Common Issues

**Backend won't start?**
- Make sure Python 3.8+ is installed: `python --version`
- Try using `python3` instead of `python`

**Frontend won't start?**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and run `npm install` again

**Camera not working?**
- Check browser permissions (click lock icon in address bar)
- Try Chrome/Edge instead of Firefox/Safari

**Speech recognition not working?**
- Use Chrome or Edge (best support)
- Check microphone permissions
- Make sure you're speaking clearly

## Need Help?

Check the full [README.md](README.md) for detailed troubleshooting!

---

**Enjoy your public speaking practice! 🎤✨**
