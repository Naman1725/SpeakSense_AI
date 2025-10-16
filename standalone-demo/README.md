# 🎭 SpeakSense.ai - Standalone Demo

This is a **frontend-only demonstration** of the SpeakSense.ai user interface, designed for quick previews and portfolio showcasing.

## 📌 What's This?

This standalone demo provides:
- ✅ Beautiful login page with social authentication UI
- ✅ Interactive dashboard interface
- ✅ Pre-loaded demo data and sample analytics
- ✅ YouTube video integration showing the actual working application
- ✅ Clear messaging about AI/ML model requirements

## ⚠️ Important Notice

**This is NOT the full application!**

The AI/ML models (TensorFlow, MediaPipe, spaCy) are too computationally heavy for simple web deployment. This demo shows:
- The user interface design
- The dashboard layout
- Sample data visualization
- Links to the full working version

## 🚀 How to Use

### Option 1: Direct File Access
Simply open `index.html` in your web browser - no server needed!

```bash
# Navigate to the folder
cd standalone-demo

# Open in your default browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

### Option 2: Local Web Server (Recommended)
For better experience, use a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Then open: http://localhost:8000
```

## 📂 File Structure

```
standalone-demo/
├── index.html              # Login page
├── dashboard.html          # Demo dashboard
├── css/
│   ├── login.css          # Login page styles
│   └── dashboard.css      # Dashboard styles
├── js/
│   ├── login.js           # Login functionality
│   └── dashboard.js       # Dashboard functionality
├── assets/                # Images and media (if any)
└── README.md              # This file
```

## 🎨 Features

### Login Page
- Email/password authentication UI
- Social login buttons (Google, GitHub, LinkedIn, Facebook)
- "Remember me" checkbox
- Forgot password link
- Beautiful glassmorphism design
- Animated gradient background

### Dashboard
- Pre-loaded demo video from YouTube
- Sample performance metrics (Clarity Score, WPM, Word Count)
- Mock analytics charts
- Sample gesture detection feedback
- Filler words analysis visualization
- Modal notification about demo limitations
- Links to full application and demo video

## 🔗 Links to Full Version

- **Demo Video**: https://www.youtube.com/watch?v=elljIA2965o
- **GitHub Repository**: https://github.com/Naman1725/SpeakSense_AI
- **Full Installation**: See main README in repository root

## 💡 Use Cases

Perfect for:
- Quick demos to stakeholders
- Portfolio showcasing
- UI/UX presentations
- Sharing the interface without full installation
- Mobile-friendly previews

## 🛠️ Technologies Used

- Pure HTML5, CSS3, JavaScript (no frameworks!)
- Font Awesome icons
- CSS animations and transitions
- LocalStorage for demo authentication
- YouTube iframe embed

## 📱 Browser Support

Works on all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## ⚙️ Customization

Feel free to customize:
1. Edit `css/login.css` and `css/dashboard.css` for styling
2. Modify `js/login.js` and `js/dashboard.js` for behavior
3. Update demo data in `dashboard.html`
4. Change YouTube video link to your own

## 🎯 What's NOT Included

This demo does NOT have:
- Real-time AI analysis
- MediaPipe gesture detection
- Speech recognition
- Backend server
- Database
- Actual ML models
- Live video processing

For the full working application with all AI/ML features, please:
1. Watch the demo video: https://www.youtube.com/watch?v=elljIA2965o
2. Clone the main repository: https://github.com/Naman1725/SpeakSense_AI
3. Follow installation instructions in the main README

## 👨‍💻 Developer

**Naman Sharma**
- GitHub: [@Naman1725](https://github.com/Naman1725)
- Email: naman.plk30@gmail.com

---

**© 2025 Naman Sharma. All rights reserved.**

*This is a demonstration interface. For the full AI-powered application, visit the main repository.*
