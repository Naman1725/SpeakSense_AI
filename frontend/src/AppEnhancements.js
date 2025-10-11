// ADD THESE TO THE EXISTING APP.JS

// 1. ADD THESE IMPORTS AT THE TOP (after existing imports)
import { generatePDFReport, exportToJSON, exportToCSV } from './reportGenerator';

// 2. ADD THESE STATE VARIABLES (after existing state variables around line 21)
const [transcript, setTranscript] = useState([]);
const [allGesturesList, setAllGesturesList] = useState([]);

// 3. UPDATE THE SPEECH RECOGNITION onresult HANDLER (around line 63-100)
// Add this inside the onresult handler after setSpeechAnalysis:

// Track transcript for PDF report
const timestamp = new Date(Date.now()).toLocaleTimeString();
setTranscript(prev => [...prev, {
  timestamp,
  text: finalTranscript
}]);

// 4. UPDATE THE captureAndAnalyzeFrame FUNCTION (around line 140)
// After setGestures, add:

// Keep all gestures for report
setAllGesturesList(prev => [...prev, ...newGestures]);

// 5. ADD EXPORT HANDLERS (add these functions before the return statement, around line 240)

const handleExportPDF = () => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionData = {
    duration: formatTime(sessionDuration),
    overallScore: overallScore?.overall_score || 0,
    totalWords: speechAnalysis?.word_count || 0,
    fillerCount: speechAnalysis?.total_filler_count || 0,
    fillerPercentage: speechAnalysis?.filler_percentage || 0,
    avgWPM: speechAnalysis?.words_per_minute || 0,
    framesAnalyzed: overallScore?.frames_analyzed || 0,
    totalGestures: allGesturesList.length,
    fillerWordsData: fillerWordsData,
    gestureList: allGesturesList,
    transcript: transcript,
    gestureStats: gestureStats
  };

  generatePDFReport(sessionData);
};

const handleExportJSON = () => {
  const sessionData = {
    sessionId,
    date: new Date().toISOString(),
    duration: sessionDuration,
    overallScore: overallScore?.overall_score || 0,
    speechAnalysis,
    gestures: allGesturesList,
    transcript,
    wpmHistory,
    gestureStats
  };

  exportToJSON(sessionData);
};

const handleExportCSV = () => {
  const sessionData = {
    duration: `${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`,
    overallScore: overallScore?.overall_score || 0,
    totalWords: speechAnalysis?.word_count || 0,
    fillerCount: speechAnalysis?.total_filler_count || 0,
    fillerPercentage: speechAnalysis?.filler_percentage || 0,
    avgWPM: speechAnalysis?.words_per_minute || 0,
    totalGestures: allGesturesList.length
  };

  exportToCSV(sessionData);
};

// 6. ADD TRANSCRIPT PANEL IN THE JSX (add before the Final Score panel)
// Add this code in the right-column div, before the overallScore && check:

{/* Live Transcript Panel */}
{isRecording && transcript.length > 0 && (
  <div className="feedback-panel">
    <h3>📝 Live Transcript</h3>
    <div className="feedback-content transcript-content">
      {transcript.map((segment, index) => (
        <div key={index} className="transcript-segment">
          <span className="transcript-time">[{segment.timestamp}]</span>
          <span className="transcript-text">{segment.text}</span>
        </div>
      ))}
    </div>
  </div>
)}

// 7. ADD EXPORT BUTTONS PANEL (add after the overallScore panel)
// Add this after the score-panel div closes:

{/* Export Options */}
{overallScore && (
  <div className="export-panel">
    <h3>📥 Export Report</h3>
    <div className="export-buttons">
      <button className="export-btn export-pdf" onClick={handleExportPDF}>
        <span className="export-icon">📄</span>
        Download PDF Report
      </button>
      <button className="export-btn export-json" onClick={handleExportJSON}>
        <span className="export-icon">📊</span>
        Export JSON
      </button>
      <button className="export-btn export-csv" onClick={handleExportCSV}>
        <span className="export-icon">📋</span>
        Export CSV
      </button>
    </div>
    <p className="export-hint">Get comprehensive analysis in your preferred format</p>
  </div>
)}

// 8. ADD THESE CSS STYLES TO App.css

/* Live Transcript */
.transcript-content {
  max-height: 250px;
  overflow-y: auto;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.transcript-segment {
  margin-bottom: 12px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.transcript-time {
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 10px;
}

.transcript-text {
  color: #333;
  line-height: 1.6;
}

/* Export Panel */
.export-panel {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.export-panel h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.3rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.export-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

.export-btn {
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.export-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.export-pdf {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.export-json {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.export-csv {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.export-icon {
  font-size: 1.5rem;
}

.export-hint {
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  margin-top: 10px;
  font-style: italic;
}

@media (max-width: 768px) {
  .export-buttons {
    grid-template-columns: 1fr;
  }
}
