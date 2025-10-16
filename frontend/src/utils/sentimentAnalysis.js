// Simple rule-based sentiment analysis
export const analyzeSentiment = (text) => {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'awesome', 'perfect', 'happy', 'excited', 'confident', 'success', 'achieve', 'brilliant', 'outstanding', 'superb'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'fail', 'failed', 'problem', 'issue', 'difficult', 'hard', 'struggle', 'worried', 'concerned', 'unfortunately', 'sadly', 'poor'];
  const nervousWords = ['um', 'uh', 'like', 'you know', 'i mean', 'sort of', 'kind of', 'basically', 'actually', 'maybe', 'perhaps', 'i guess', 'i think'];
  const confidentWords = ['will', 'can', 'able', 'definitely', 'certainly', 'absolutely', 'clearly', 'obviously', 'undoubtedly', 'proven', 'guaranteed', 'ensure', 'commit'];

  const words = text.toLowerCase().split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;
  let nervousCount = 0;
  let confidentCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
    if (nervousWords.includes(word)) nervousCount++;
    if (confidentWords.includes(word)) confidentCount++;
  });

  // Normalize counts
  const totalWords = words.length || 1;
  const positiveScore = (positiveCount / totalWords) * 100;
  const negativeScore = (negativeCount / totalWords) * 100;
  const nervousScore = (nervousCount / totalWords) * 100;
  const confidentScore = (confidentCount / totalWords) * 100;

  // Determine overall sentiment
  let overall = 'neutral';
  let confidence = 'moderate';

  if (positiveScore > negativeScore + 2) {
    overall = 'positive';
  } else if (negativeScore > positiveScore + 2) {
    overall = 'negative';
  }

  if (confidentScore > nervousScore + 1) {
    confidence = 'confident';
  } else if (nervousScore > confidentScore + 1) {
    confidence = 'nervous';
  }

  return {
    overall,
    confidence,
    scores: {
      positive: Math.round(positiveScore),
      negative: Math.round(negativeScore),
      nervous: Math.round(nervousScore),
      confident: Math.round(confidentScore),
    },
    counts: {
      positive: positiveCount,
      negative: negativeCount,
      nervous: nervousCount,
      confident: confidentCount,
    }
  };
};

export const getEyeContactScore = (faceLandmarks) => {
  if (!faceLandmarks || faceLandmarks.length === 0) return 0;

  // Simple heuristic: check if eyes are centered
  // In a real implementation, you'd use eye gaze detection
  // For now, we'll use a placeholder calculation

  // Assume good eye contact if face is detected and centered
  return 75; // Placeholder - would need proper eye gaze detection
};

export const analyzePauses = (timestamps) => {
  if (!timestamps || timestamps.length < 2) return { avgPause: 0, longPauses: 0 };

  const pauses = [];
  for (let i = 1; i < timestamps.length; i++) {
    const pause = timestamps[i] - timestamps[i-1];
    if (pause > 1) { // More than 1 second
      pauses.push(pause);
    }
  }

  const avgPause = pauses.length > 0
    ? pauses.reduce((sum, p) => sum + p, 0) / pauses.length
    : 0;

  const longPauses = pauses.filter(p => p > 3).length; // Pauses longer than 3 seconds

  return {
    avgPause: Math.round(avgPause * 10) / 10,
    longPauses,
    totalPauses: pauses.length,
    recommendation: longPauses > 3
      ? 'Try to reduce long pauses. Brief pauses are good, but too many long ones can lose audience attention.'
      : avgPause < 0.5
      ? 'Good pacing! You maintain steady flow.'
      : 'Good use of pauses for emphasis.'
  };
};
