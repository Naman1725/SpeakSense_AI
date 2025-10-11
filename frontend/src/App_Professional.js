import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';

const API_URL = 'http://localhost:5000/api';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [gestures, setGestures] = useState([]);
  const [speechAnalysis, setSpeechAnalysis] = useState(null);
  const [overallScore, setOverallScore] = useState(null);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [gestureStats, setGestureStats] = useState({});
  const [sessionDuration, setSessionDuration] = useState(0);
  const [fillerWordsData, setFillerWordsData] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const sessionStartTime = useRef(null);
  const durationIntervalRef = useRef(null);

  // Initialize webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Please allow camera and microphone access to use this app.');
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        try {
          const response = await axios.post(`${API_URL}/analyze-audio`, {
            text: finalTranscript,
            session_id: sessionId,
            timestamp: Date.now() / 1000
          });

          if (response.data.success) {
            const analysis = response.data.speech_analysis;
            setSpeechAnalysis(analysis);

            // Update WPM history for graph
            if (analysis.words_per_minute > 0) {
              setWpmHistory(prev => {
                const newData = [...prev, {
                  time: Math.floor((Date.now() - sessionStartTime.current) / 1000),
                  wpm: analysis.words_per_minute
                }];
                return newData.slice(-20); // Keep last 20 data points
              });
            }

            // Update filler words data for chart
            if (analysis.filler_words_found && analysis.filler_words_found.length > 0) {
              setFillerWordsData(analysis.filler_words_found);
            }
          }
        } catch (err) {
          console.error('Error analyzing audio:', err);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
        setTimeout(() => {
          if (isRecording) {
            recognition.start();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  };

  // Capture and send frame for analysis
  const captureAndAnalyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const frameData = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const response = await axios.post(`${API_URL}/analyze-frame`, {
        frame: frameData,
        session_id: sessionId,
        timestamp: Date.now() / 1000
      });

      if (response.data.success && response.data.gestures.length > 0) {
        setGestures(prev => {
          const newGestures = response.data.gestures;
          const combined = [...prev, ...newGestures];

          // Update gesture statistics
          const stats = {};
          combined.forEach(g => {
            stats[g.type] = (stats[g.type] || 0) + 1;
          });
          setGestureStats(stats);

          // Keep only last 10 unique gestures
          const uniqueTypes = new Map();
          combined.reverse().forEach(g => {
            if (!uniqueTypes.has(g.type) ||
                Date.now() / 1000 - g.timestamp < 3) {
              uniqueTypes.set(g.type, g);
            }
          });
          return Array.from(uniqueTypes.values()).slice(0, 10);
        });
      }
    } catch (err) {
      console.error('Error analyzing frame:', err);
    }
  }, [sessionId]);

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setGestures([]);
    setSpeechAnalysis(null);
    setOverallScore(null);
    setWpmHistory([]);
    setGestureStats({});
    setFillerWordsData([]);
    setSessionDuration(0);
    sessionStartTime.current = Date.now();

    // Reset session
    axios.post(`${API_URL}/reset-session`, { session_id: sessionId });

    // Start speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log('Recognition already started');
      }
    }

    // Start frame analysis (every 1 second)
    frameIntervalRef.current = setInterval(captureAndAnalyzeFrame, 1000);

    // Start duration counter
    durationIntervalRef.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = async () => {
    setIsRecording(false);

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Stop frame analysis
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }

    // Stop duration counter
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }

    // Get summary
    try {
      const response = await axios.post(`${API_URL}/get-summary`, {
        session_id: sessionId
      });

      if (response.data.success) {
        setOverallScore(response.data.summary);
      }
    } catch (err) {
      console.error('Error getting summary:', err);
    }
  };

  // Initialize on mount
  useEffect(() => {
    startWebcam();
    initializeSpeechRecognition();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#ffd32a';
      default: return '#1e90ff';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#2ecc71';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  // Prepare gesture data for pie chart
  const gestureChartData = Object.entries(gestureStats).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  }));

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div>
            <h1>🎤 NegGes AI - Public Speaking Coach</h1>
            <p>Real-time AI-powered analysis of your oratory skills</p>
          </div>
          {isRecording && (
            <div className="session-timer">
              <span className="timer-label">Session Duration:</span>
              <span className="timer-value">{formatTime(sessionDuration)}</span>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        {/* Left Column - Video and Controls */}
        <div className="left-column">
          <div className="video-section">
            <div className="video-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="video-feed"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {isRecording && (
                <div className="recording-indicator">
                  <span className="recording-dot"></span>
                  Recording...
                </div>
              )}
            </div>

            <div className="controls">
              {!isRecording ? (
                <button className="btn btn-start" onClick={startRecording}>
                  <span className="btn-icon">▶</span> Start Analysis
                </button>
              ) : (
                <button className="btn btn-stop" onClick={stopRecording}>
                  <span className="btn-icon">■</span> Stop Analysis
                </button>
              )}
            </div>
          </div>

          {/* Real-time Performance Gauge */}
          {isRecording && speechAnalysis && (
            <div className="performance-gauge">
              <h3>Real-time Performance</h3>
              <div className="gauge-container">
                <div className="gauge-item">
                  <div className="circular-progress">
                    <CircularProgressbar
                      value={100 - speechAnalysis.filler_percentage * 10}
                      text={`${Math.round(100 - speechAnalysis.filler_percentage * 10)}%`}
                      styles={buildStyles({
                        pathColor: speechAnalysis.filler_percentage < 5 ? '#2ecc71' : '#f39c12',
                        textColor: '#333',
                        trailColor: '#e0e0e0',
                      })}
                    />
                  </div>
                  <p className="gauge-label">Clarity Score</p>
                </div>
                <div className="gauge-item">
                  <div className="stat-box">
                    <div className="stat-number">{speechAnalysis.words_per_minute}</div>
                    <div className="stat-unit">WPM</div>
                  </div>
                  <p className="gauge-label">Speaking Pace</p>
                </div>
                <div className="gauge-item">
                  <div className="stat-box">
                    <div className="stat-number">{speechAnalysis.word_count}</div>
                    <div className="stat-unit">Words</div>
                  </div>
                  <p className="gauge-label">Total Words</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Analytics and Feedback */}
        <div className="right-column">
          {/* Speaking Pace Chart */}
          {wpmHistory.length > 0 && (
            <div className="analytics-panel">
              <h3>📊 Speaking Pace Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={wpmHistory}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Seconds', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="wpm" stroke="#667eea" fillOpacity={1} fill="url(#colorWpm)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="pace-indicator">
                <span className={speechAnalysis?.words_per_minute > 160 ? 'warning' : speechAnalysis?.words_per_minute < 100 ? 'warning' : 'good'}>
                  {speechAnalysis?.pace_feedback || 'Waiting for speech...'}
                </span>
              </div>
            </div>
          )}

          {/* Filler Words Chart */}
          {fillerWordsData.length > 0 && (
            <div className="analytics-panel">
              <h3>🗣️ Filler Words Analysis</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fillerWordsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f5576c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Gesture Statistics */}
          {gestureChartData.length > 0 && (
            <div className="analytics-panel">
              <h3>🖐️ Gesture Distribution</h3>
              <div className="chart-row">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={gestureChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gestureChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="gesture-legend">
                  {gestureChartData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="legend-text">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Gestures List */}
          <div className="feedback-panel">
            <h3>⚠️ Recent Gesture Warnings</h3>
            <div className="feedback-content">
              {gestures.length === 0 ? (
                <p className="no-data">
                  {isRecording ? 'Analyzing your gestures...' : 'Start recording to see feedback'}
                </p>
              ) : (
                <div className="gesture-list">
                  {gestures.map((gesture, index) => (
                    <div
                      key={index}
                      className="gesture-item"
                      style={{ borderLeftColor: getSeverityColor(gesture.severity) }}
                    >
                      <div className="gesture-header">
                        <span className="gesture-type">{gesture.type.replace(/_/g, ' ')}</span>
                        <span className="gesture-severity" style={{ color: getSeverityColor(gesture.severity) }}>
                          {gesture.severity}
                        </span>
                      </div>
                      <div className="gesture-message">{gesture.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overall Score Summary */}
          {overallScore && (
            <div className="score-panel">
              <h3>🏆 Final Performance Score</h3>
              <div className="score-content">
                <div className="score-circle">
                  <CircularProgressbar
                    value={overallScore.overall_score}
                    text={`${overallScore.overall_score}`}
                    styles={buildStyles({
                      pathColor: getScoreColor(overallScore.overall_score),
                      textColor: getScoreColor(overallScore.overall_score),
                      trailColor: '#e0e0e0',
                      textSize: '24px',
                    })}
                  />
                </div>
                <div className="score-details">
                  <div className="detail-item">
                    <span className="detail-label">Total Words:</span>
                    <span className="detail-value">{overallScore.total_words}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Filler Words:</span>
                    <span className="detail-value">{overallScore.filler_count} ({overallScore.filler_percentage}%)</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Frames Analyzed:</span>
                    <span className="detail-value">{overallScore.frames_analyzed}</span>
                  </div>
                  <div className="score-message">
                    {overallScore.overall_score >= 80 && "🎉 Excellent performance! Keep it up!"}
                    {overallScore.overall_score >= 60 && overallScore.overall_score < 80 && "👍 Good job! Work on reducing filler words."}
                    {overallScore.overall_score < 60 && "💪 Keep practicing! Focus on gestures and reducing fillers."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
