# SpeakSense AI

**AI-Powered Public Speaking Analysis Platform**

SpeakSense AI is a comprehensive public speaking coach that uses advanced AI to analyze your presentations in real-time. Get instant feedback on speech patterns, body language, and gestures to become a confident speaker.

## Features

### Speech Analysis
- **Real-time transcription** with Web Speech API
- **Filler word detection** (um, uh, like, etc.)
- **Speaking pace analysis** (Words Per Minute)
- **Sentiment analysis** using HuggingFace DistilBERT
- **Emotion detection** with multi-label classification
- **Live confidence scoring** based on speech patterns

### Body Language & Gesture Detection
- **MediaPipe AI integration** for pose, hand, and face tracking
- **Advanced gesture recognition**:
  - Clenched fists
  - Pointing fingers
  - Palm-down dismissive gestures
  - Fidgeting detection
  - Face touching
  - Poor posture alerts
  - Hands behind back
  - Weak gestures
- **Real-time body language scoring**
- **Pose snapshot capture** for high-severity gestures
- **Visual landmark overlay** showing detection points

### Analysis & Reports
- **Overall performance score** combining speech and body language
- **Interactive charts**: WPM trends, gesture timeline, filler word breakdown
- **Comprehensive feedback**: Strengths and areas for improvement
- **Downloadable reports** in PDF, JSON, and CSV formats
- **Full transcript** with marked issues

### Video Support
- **Live webcam analysis** for real-time practice
- **Video upload** for analyzing pre-recorded presentations
- **Frame-by-frame analysis** with accurate timing

## Tech Stack

### Frontend
- React 18
- Recharts for data visualization
- React Circular Progressbar
- Web Speech API for transcription
- WebRTC for video capture
- Canvas API for visual overlays
- Axios for API communication
- jsPDF & html2canvas for reports

### Backend
- Flask web server
- MediaPipe (Pose, Hands, Face Mesh)
- OpenCV for video processing
- HuggingFace Transformers API
- NumPy for calculations
- Speech Recognition

### AI Models
- **MediaPipe Pose**: 33 landmarks for body tracking
- **MediaPipe Hands**: 21 points per hand, supports 2 hands
- **MediaPipe Face Mesh**: 468 facial landmarks
- **HuggingFace Sentiment**: distilbert-base-uncased-finetuned-sst-2-english
- **HuggingFace Emotion**: j-hartmann/emotion-english-distilroberta-base

## Project Structure

```
SpeakSense-AI/
├── backend/
│   ├── app.py                 # Flask server with AI analysis
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Modern dark theme styling
│   │   └── reportGenerator.js # Export functionality
│   └── package.json          # Node dependencies
├── render.yaml               # Render deployment config
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 16+
- Webcam and microphone

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server runs on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on http://localhost:3000

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions to Render.

### Quick Deploy

1. Push code to GitHub
2. Connect repository to Render
3. Render auto-detects `render.yaml` configuration
4. Both frontend and backend deploy automatically

## Environment Variables

### Backend
- `HF_API_KEY`: HuggingFace API key
- `CORS_ORIGINS`: Allowed frontend URLs
- `FLASK_ENV`: production

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Usage

1. **Start Analysis**: Click "Start Live Analysis" to begin webcam recording
2. **Upload Video**: Or click "Upload Video" to analyze a pre-recorded presentation
3. **Speak Naturally**: The AI analyzes your speech, gestures, and body language in real-time
4. **View Feedback**: See live scores, charts, and detected issues
5. **Stop & Review**: Click "Stop Analysis" to get comprehensive summary
6. **Export Report**: Download your analysis as PDF, JSON, or CSV

## Features in Detail

### Gesture Detection Algorithm
The system uses MediaPipe's 21-point hand landmark model to detect:
- Finger positions and orientations
- Hand movements and velocity
- Palm directions
- Gesture patterns over time

### Confidence Scoring
Confidence is calculated based on:
- Speaking pace consistency
- Filler word frequency
- Sentiment positivity
- Vocal variety (simulated)

### Body Language Scoring
Starts at 100 and deducts points for:
- High-severity gestures: -5 points
- Medium-severity gestures: -3 points
- Low-severity gestures: -1 point

## Browser Support
- Chrome/Edge (recommended) - full support
- Firefox - limited speech recognition
- Safari - limited speech recognition

## Performance
- Real-time analysis at 1 FPS
- Minimal latency (<100ms for gesture detection)
- Efficient landmark sampling for face mesh

## License
MIT License - See LICENSE file for details

## Author
Naman Sharma

## Acknowledgments
- MediaPipe by Google
- HuggingFace Transformers
- React team
- Render hosting platform
