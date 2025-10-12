from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import mediapipe as mp
import speech_recognition as sr
from collections import deque
import time
import re
import requests
import os

app = Flask(__name__)

# Configure CORS for production
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app,
     resources={r"/api/*": {"origins": cors_origins}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# Hugging Face API Configuration
HF_API_KEY = os.getenv('HF_API_KEY')
HF_API_URL_SENTIMENT = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
HF_API_URL_EMOTION = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"

# Initialize MediaPipe with advanced settings
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=0,  # Reduced from 2 to 0 for faster processing
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,  # Reduced from 0.7 for faster detection
    min_tracking_confidence=0.5
)

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=False,  # Disabled for better performance
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Store session data
session_data = {}

class GestureAnalyzer:
    def __init__(self):
        self.negative_gestures = []
        self.gesture_history = deque(maxlen=10)
        self.gesture_snapshots = []  # Store pose snapshots when negative gestures detected

    def analyze_pose(self, pose_landmarks, frame_timestamp):
        """Detect negative oratory gestures"""
        gestures_detected = []

        if not pose_landmarks:
            return gestures_detected

        landmarks = pose_landmarks.landmark

        # 1. Arms crossed detection
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
        right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
        left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
        right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]

        # Check if arms are crossed
        if (left_wrist.x > right_elbow.x and right_wrist.x < left_elbow.x):
            gestures_detected.append({
                'type': 'crossed_arms',
                'severity': 'high',
                'message': 'Arms crossed - appears defensive',
                'timestamp': frame_timestamp
            })

        # 2. Hands in pockets/behind back (low hand visibility)
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

        if (left_wrist.y > left_hip.y and right_wrist.y > right_hip.y and
            left_wrist.visibility < 0.5 and right_wrist.visibility < 0.5):
            gestures_detected.append({
                'type': 'hidden_hands',
                'severity': 'medium',
                'message': 'Hands hidden or in pockets - reduces engagement',
                'timestamp': frame_timestamp
            })

        # 3. Hands behind back
        nose = landmarks[mp_pose.PoseLandmark.NOSE]
        if (left_wrist.z > nose.z + 0.3 and right_wrist.z > nose.z + 0.3):
            gestures_detected.append({
                'type': 'hands_behind_back',
                'severity': 'medium',
                'message': 'Hands behind back - appears unconfident',
                'timestamp': frame_timestamp
            })

        # 4. Touching face/hair
        left_index = landmarks[mp_pose.PoseLandmark.LEFT_INDEX] if hasattr(mp_pose.PoseLandmark, 'LEFT_INDEX') else left_wrist
        right_index = landmarks[mp_pose.PoseLandmark.RIGHT_INDEX] if hasattr(mp_pose.PoseLandmark, 'RIGHT_INDEX') else right_wrist

        face_distance_left = np.sqrt((left_wrist.x - nose.x)**2 + (left_wrist.y - nose.y)**2)
        face_distance_right = np.sqrt((right_wrist.x - nose.x)**2 + (right_wrist.y - nose.y)**2)

        if face_distance_left < 0.15 or face_distance_right < 0.15:
            gestures_detected.append({
                'type': 'touching_face',
                'severity': 'medium',
                'message': 'Touching face/hair - shows nervousness',
                'timestamp': frame_timestamp
            })

        # 5. Poor posture (slouching)
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

        shoulder_slope = abs(left_shoulder.y - right_shoulder.y)
        if shoulder_slope > 0.1:
            gestures_detected.append({
                'type': 'poor_posture',
                'severity': 'low',
                'message': 'Uneven shoulders - maintain straight posture',
                'timestamp': frame_timestamp
            })

        # 6. Weak hand gestures (hands too close to body)
        shoulder_center_x = (left_shoulder.x + right_shoulder.x) / 2
        hand_spread = max(
            abs(left_wrist.x - shoulder_center_x),
            abs(right_wrist.x - shoulder_center_x)
        )

        if hand_spread < 0.1 and left_wrist.y < left_shoulder.y:
            gestures_detected.append({
                'type': 'weak_gestures',
                'severity': 'low',
                'message': 'Hands too close to body - use broader gestures',
                'timestamp': frame_timestamp
            })

        return gestures_detected

    def analyze_hand_movements(self, hand_landmarks, frame_timestamp):
        """Detect fidgeting and nervous hand movements with detailed hand gesture analysis"""
        gestures_detected = []

        if not hand_landmarks:
            return gestures_detected

        landmarks = hand_landmarks.landmark

        # Get key hand landmarks
        wrist = landmarks[0]
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]
        index_mcp = landmarks[5]
        middle_mcp = landmarks[9]
        ring_mcp = landmarks[13]
        pinky_mcp = landmarks[17]

        # 1. CLENCHED FIST DETECTION - Very negative gesture
        # Check if all fingertips are close to palm (closed fist)
        palm_center_y = (index_mcp.y + middle_mcp.y + ring_mcp.y + pinky_mcp.y) / 4
        fingertips_closed = (
            index_tip.y > index_mcp.y and
            middle_tip.y > middle_mcp.y and
            ring_tip.y > ring_mcp.y and
            pinky_tip.y > pinky_mcp.y
        )

        if fingertips_closed:
            gestures_detected.append({
                'type': 'clenched_fist',
                'severity': 'high',
                'message': 'Clenched fist detected - appears aggressive or tense',
                'timestamp': frame_timestamp
            })

        # 2. POINTING FINGER DETECTION - Can be perceived as rude
        # Index finger extended, others curled
        index_extended = index_tip.y < index_mcp.y - 0.05
        others_curled = (
            middle_tip.y > middle_mcp.y and
            ring_tip.y > ring_mcp.y and
            pinky_tip.y > pinky_mcp.y
        )

        if index_extended and others_curled:
            gestures_detected.append({
                'type': 'pointing_finger',
                'severity': 'high',
                'message': 'Pointing finger - can appear accusatory or aggressive',
                'timestamp': frame_timestamp
            })

        # 3. PALM FACING DOWN - Dismissive gesture
        # Check if hand is flat with palm down (fingers extended, similar y-values)
        fingers_extended = (
            index_tip.y < index_mcp.y and
            middle_tip.y < middle_mcp.y and
            ring_tip.y < ring_mcp.y and
            pinky_tip.y < pinky_mcp.y
        )

        fingertip_spread = max(
            abs(index_tip.y - middle_tip.y),
            abs(middle_tip.y - ring_tip.y),
            abs(ring_tip.y - pinky_tip.y)
        )

        if fingers_extended and fingertip_spread < 0.08:
            # Palm down gesture
            if wrist.y < palm_center_y:
                gestures_detected.append({
                    'type': 'palm_down',
                    'severity': 'medium',
                    'message': 'Palm down gesture - can appear dismissive',
                    'timestamp': frame_timestamp
                })

        # Store hand position for movement tracking
        self.gesture_history.append(hand_landmarks)

        # 4. FIDGETING DETECTION - Check for excessive movement
        if len(self.gesture_history) >= 10:
            movements = []
            for i in range(1, len(self.gesture_history)):
                if self.gesture_history[i] and self.gesture_history[i-1]:
                    wrist_curr = self.gesture_history[i].landmark[0]
                    wrist_prev = self.gesture_history[i-1].landmark[0]
                    movement = np.sqrt(
                        (wrist_curr.x - wrist_prev.x)**2 +
                        (wrist_curr.y - wrist_prev.y)**2
                    )
                    movements.append(movement)

            avg_movement = np.mean(movements) if movements else 0
            if avg_movement > 0.05:
                gestures_detected.append({
                    'type': 'fidgeting',
                    'severity': 'medium',
                    'message': 'Excessive hand movement - appears nervous',
                    'timestamp': frame_timestamp
                })

        # 5. HANDS TOO CLOSE TOGETHER - Nervous gesture
        # This would need multi-hand tracking, handled separately

        return gestures_detected


class SpeechAnalyzer:
    def __init__(self):
        self.filler_words = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally', 'kind of', 'sort of']
        self.word_count = 0
        self.filler_count = 0
        self.start_time = None
        self.speech_segments = []
        self.sentiment_scores = []
        self.emotion_scores = []

    def analyze_sentiment_hf(self, text):
        """Use Hugging Face API for sentiment analysis"""
        try:
            headers = {"Authorization": f"Bearer {HF_API_KEY}"}
            response = requests.post(
                HF_API_URL_SENTIMENT,
                headers=headers,
                json={"inputs": text},
                timeout=5
            )
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    sentiments = result[0]
                    positive_score = next((s['score'] for s in sentiments if s['label'] == 'POSITIVE'), 0)
                    return {
                        'sentiment': 'positive' if positive_score > 0.5 else 'negative',
                        'confidence': positive_score,
                        'score': positive_score
                    }
        except Exception as e:
            print(f"Sentiment analysis error: {e}")
        return {'sentiment': 'neutral', 'confidence': 0.5, 'score': 0.5}

    def analyze_emotion_hf(self, text):
        """Use Hugging Face API for emotion detection"""
        try:
            headers = {"Authorization": f"Bearer {HF_API_KEY}"}
            response = requests.post(
                HF_API_URL_EMOTION,
                headers=headers,
                json={"inputs": text},
                timeout=5
            )
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    emotions = result[0]
                    top_emotion = max(emotions, key=lambda x: x['score'])
                    return {
                        'emotion': top_emotion['label'],
                        'confidence': top_emotion['score'],
                        'all_emotions': emotions
                    }
        except Exception as e:
            print(f"Emotion analysis error: {e}")
        return {'emotion': 'neutral', 'confidence': 0.5, 'all_emotions': []}

    def analyze_text(self, text, timestamp):
        """Comprehensive speech analysis with AI insights"""
        if not text:
            return {}

        text_lower = text.lower()
        words = text_lower.split()

        # Count filler words
        fillers_found = []
        for filler in self.filler_words:
            count = text_lower.count(filler)
            if count > 0:
                self.filler_count += count
                fillers_found.append({'word': filler, 'count': count})

        self.word_count += len(words)

        # Calculate speaking pace (words per minute)
        if self.start_time is None:
            self.start_time = timestamp

        duration = timestamp - self.start_time
        wpm = (self.word_count / duration * 60) if duration > 0 else 0

        # Analyze pace
        pace_feedback = ""
        if wpm > 160:
            pace_feedback = "Speaking too fast - slow down for clarity"
        elif wpm < 100 and wpm > 0:
            pace_feedback = "Speaking too slow - increase energy"
        else:
            pace_feedback = "Good speaking pace"

        # Get AI sentiment and emotion analysis
        sentiment_result = self.analyze_sentiment_hf(text)
        emotion_result = self.analyze_emotion_hf(text)

        self.sentiment_scores.append(sentiment_result['score'])
        self.emotion_scores.append(emotion_result)

        # Calculate confidence based on sentiment
        avg_sentiment = np.mean(self.sentiment_scores) if self.sentiment_scores else 0.5
        confidence_from_speech = avg_sentiment * 100

        return {
            'filler_words_found': fillers_found,
            'total_filler_count': self.filler_count,
            'word_count': self.word_count,
            'words_per_minute': round(wpm, 1),
            'pace_feedback': pace_feedback,
            'filler_percentage': round((self.filler_count / max(self.word_count, 1)) * 100, 1),
            'sentiment': sentiment_result['sentiment'],
            'sentiment_score': round(sentiment_result['score'] * 100, 1),
            'emotion': emotion_result['emotion'],
            'emotion_confidence': round(emotion_result['confidence'] * 100, 1),
            'confidence_score': round(confidence_from_speech, 1)
        }


@app.route('/api/analyze-frame', methods=['POST'])
def analyze_frame():
    """Analyze a single video frame and return feedback"""
    try:
        data = request.json
        image_data = data.get('frame')
        session_id = data.get('session_id', 'default')
        timestamp = data.get('timestamp', time.time())

        # Initialize session if needed
        if session_id not in session_data:
            session_data[session_id] = {
                'gesture_analyzer': GestureAnalyzer(),
                'speech_analyzer': SpeechAnalyzer(),
                'frame_count': 0
            }

        session = session_data[session_id]
        session['frame_count'] += 1

        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(BytesIO(image_bytes))

        # Resize image for faster processing (reduce to 50% of original size)
        image = image.resize((image.width // 2, image.height // 2), Image.LANCZOS)

        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Process with MediaPipe
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pose_results = pose.process(frame_rgb)
        hand_results = hands.process(frame_rgb)
        face_results = face_mesh.process(frame_rgb)

        # Analyze gestures
        negative_gestures = []

        if pose_results.pose_landmarks:
            pose_gestures = session['gesture_analyzer'].analyze_pose(
                pose_results.pose_landmarks,
                timestamp
            )
            negative_gestures.extend(pose_gestures)

        if hand_results.multi_hand_landmarks:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                hand_gestures = session['gesture_analyzer'].analyze_hand_movements(
                    hand_landmarks,
                    timestamp
                )
                negative_gestures.extend(hand_gestures)

        # Remove duplicates based on type
        unique_gestures = []
        seen_types = set()
        for gesture in negative_gestures:
            if gesture['type'] not in seen_types:
                unique_gestures.append(gesture)
                seen_types.add(gesture['type'])

        # Capture pose snapshot when significant negative gesture detected
        if unique_gestures:
            high_severity_gestures = [g for g in unique_gestures if g.get('severity') == 'high']
            if high_severity_gestures:
                # Store snapshot with pose data
                snapshot = {
                    'timestamp': timestamp,
                    'gestures': high_severity_gestures,
                    'frame_base64': image_data  # Store the frame for reference
                }
                session['gesture_analyzer'].gesture_snapshots.append(snapshot)
                # Keep only last 20 snapshots to manage memory
                if len(session['gesture_analyzer'].gesture_snapshots) > 20:
                    session['gesture_analyzer'].gesture_snapshots.pop(0)

        # Prepare landmark data for visualization
        landmarks_data = {
            'pose': [],
            'hands': [],
            'face': []
        }

        # Extract pose landmarks
        if pose_results.pose_landmarks:
            for landmark in pose_results.pose_landmarks.landmark:
                landmarks_data['pose'].append({
                    'x': landmark.x,
                    'y': landmark.y,
                    'visibility': landmark.visibility
                })

        # Extract hand landmarks
        if hand_results.multi_hand_landmarks:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                hand_data = []
                for landmark in hand_landmarks.landmark:
                    hand_data.append({
                        'x': landmark.x,
                        'y': landmark.y
                    })
                landmarks_data['hands'].append(hand_data)

        # Extract face landmarks (only key points for performance)
        if face_results.multi_face_landmarks:
            face_landmarks = face_results.multi_face_landmarks[0]
            # Only send key facial points (every 5th point to reduce data)
            for i, landmark in enumerate(face_landmarks.landmark):
                if i % 5 == 0:  # Sample every 5th landmark
                    landmarks_data['face'].append({
                        'x': landmark.x,
                        'y': landmark.y
                    })

        return jsonify({
            'success': True,
            'gestures': unique_gestures,
            'landmarks': landmarks_data,
            'frame_count': session['frame_count']
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/analyze-audio', methods=['POST'])
def analyze_audio():
    """Analyze audio transcript for speech quality"""
    try:
        data = request.json
        text = data.get('text', '')
        session_id = data.get('session_id', 'default')
        timestamp = data.get('timestamp', time.time())

        if session_id not in session_data:
            session_data[session_id] = {
                'gesture_analyzer': GestureAnalyzer(),
                'speech_analyzer': SpeechAnalyzer(),
                'frame_count': 0
            }

        session = session_data[session_id]
        analysis = session['speech_analyzer'].analyze_text(text, timestamp)

        return jsonify({
            'success': True,
            'speech_analysis': analysis
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/get-summary', methods=['POST'])
def get_summary():
    """Get comprehensive summary of speaking performance"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')

        if session_id not in session_data:
            return jsonify({'success': False, 'error': 'Session not found'}), 404

        session = session_data[session_id]
        speech_analyzer = session['speech_analyzer']
        gesture_analyzer = session['gesture_analyzer']

        # === SPEECH ANALYSIS ===
        total_words = speech_analyzer.word_count
        filler_count = speech_analyzer.filler_count
        filler_percentage = round((filler_count / max(total_words, 1)) * 100, 1)

        # Calculate WPM and pace
        duration_minutes = ((time.time() - speech_analyzer.start_time) / 60) if speech_analyzer.start_time else 0
        wpm = round(total_words / duration_minutes) if duration_minutes > 0 else 0

        # Pace feedback
        if wpm == 0:
            pace_feedback = "No speech detected"
            pace_score = 0
        elif wpm < 100:
            pace_feedback = "Too slow - try to speak faster"
            pace_score = 60
        elif wpm > 160:
            pace_feedback = "Too fast - slow down for clarity"
            pace_score = 70
        else:
            pace_feedback = "Good pace - clear and understandable"
            pace_score = 100

        # Sentiment analysis summary
        avg_sentiment = np.mean(speech_analyzer.sentiment_scores) if speech_analyzer.sentiment_scores else 0.5
        sentiment_feedback = "Positive tone" if avg_sentiment > 0.6 else "Neutral tone" if avg_sentiment > 0.4 else "Negative tone"

        # Emotion analysis summary
        emotion_summary = "Confident" if len(speech_analyzer.emotion_scores) > 0 else "Not enough data"

        # === GESTURE ANALYSIS ===
        gesture_snapshots = gesture_analyzer.gesture_snapshots
        total_negative_gestures = len(gesture_snapshots)

        # Count gesture types
        gesture_type_counts = {}
        for snapshot in gesture_snapshots:
            for gesture in snapshot['gestures']:
                g_type = gesture['type']
                gesture_type_counts[g_type] = gesture_type_counts.get(g_type, 0) + 1

        # Body language score (based on negative gestures frequency)
        body_language_penalty = min(total_negative_gestures * 2, 40)
        body_language_score = max(100 - body_language_penalty, 0)

        # === OVERALL SCORING ===
        base_score = 100

        # Speech penalties
        filler_penalty = min(filler_percentage * 2, 30)
        pace_penalty = (100 - pace_score) * 0.15

        # Gesture penalties
        gesture_penalty = min(body_language_penalty * 0.5, 20)

        overall_score = max(base_score - filler_penalty - pace_penalty - gesture_penalty, 0)

        # === PERFORMANCE FEEDBACK ===
        strengths = []
        improvements = []

        # Speech strengths and improvements
        if filler_percentage < 5:
            strengths.append("Minimal use of filler words")
        elif filler_percentage > 10:
            improvements.append(f"Reduce filler words ({filler_count} fillers detected)")

        if 100 <= wpm <= 160:
            strengths.append("Excellent speaking pace")
        elif wpm > 160:
            improvements.append("Slow down your speaking pace for better clarity")
        elif wpm > 0 and wpm < 100:
            improvements.append("Increase speaking pace to maintain audience engagement")

        # Body language strengths and improvements
        if total_negative_gestures == 0:
            strengths.append("Excellent body language and hand gestures")
        elif total_negative_gestures < 5:
            strengths.append("Generally good body language")
        else:
            improvements.append(f"Avoid negative gestures ({total_negative_gestures} detected)")

        if 'clenched_fist' in gesture_type_counts:
            improvements.append("Avoid clenched fists - use open hands instead")
        if 'pointing_finger' in gesture_type_counts:
            improvements.append("Avoid pointing - it can appear accusatory")
        if 'crossed_arms' in gesture_type_counts:
            improvements.append("Keep arms open and welcoming")
        if 'touching_face' in gesture_type_counts:
            improvements.append("Avoid touching your face - it shows nervousness")

        # === COMPREHENSIVE SUMMARY ===
        if overall_score >= 85:
            performance_summary = "Excellent presentation! Your speaking skills are outstanding."
        elif overall_score >= 70:
            performance_summary = "Good presentation with room for minor improvements."
        elif overall_score >= 50:
            performance_summary = "Decent presentation but needs improvement in several areas."
        else:
            performance_summary = "Needs significant improvement. Focus on body language and reducing fillers."

        return jsonify({
            'success': True,
            'summary': {
                # Overall metrics
                'overall_score': round(overall_score, 1),
                'performance_summary': performance_summary,
                'duration_minutes': round(duration_minutes, 1),

                # Speech metrics
                'total_words': total_words,
                'words_per_minute': wpm,
                'filler_count': filler_count,
                'filler_percentage': filler_percentage,
                'pace_feedback': pace_feedback,
                'pace_score': pace_score,
                'sentiment_feedback': sentiment_feedback,
                'sentiment_score': round(avg_sentiment * 100, 1),

                # Body language metrics
                'body_language_score': round(body_language_score, 1),
                'total_negative_gestures': total_negative_gestures,
                'gesture_breakdown': gesture_type_counts,
                'gesture_snapshots_count': len(gesture_snapshots),

                # Frames analyzed
                'frames_analyzed': session['frame_count'],

                # Feedback
                'strengths': strengths if strengths else ["Keep practicing to develop more strengths"],
                'improvements': improvements if improvements else ["Keep up the good work!"]
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/reset-session', methods=['POST'])
def reset_session():
    """Reset a session"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')

        if session_id in session_data:
            del session_data[session_id]

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
