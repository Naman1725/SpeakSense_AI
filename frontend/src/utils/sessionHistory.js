// Session History Manager using localStorage

export const saveSession = (sessionData) => {
  try {
    const sessions = getSessionHistory();
    const newSession = {
      ...sessionData,
      id: `session_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    sessions.unshift(newSession); // Add to beginning

    // Keep only last 20 sessions
    const limitedSessions = sessions.slice(0, 20);
    localStorage.setItem('speaksense_sessions', JSON.stringify(limitedSessions));
    return newSession;
  } catch (error) {
    console.error('Error saving session:', error);
    return null;
  }
};

export const getSessionHistory = () => {
  try {
    const sessions = localStorage.getItem('speaksense_sessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error loading session history:', error);
    return [];
  }
};

export const deleteSession = (sessionId) => {
  try {
    const sessions = getSessionHistory();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('speaksense_sessions', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

export const clearAllSessions = () => {
  try {
    localStorage.removeItem('speaksense_sessions');
    return true;
  } catch (error) {
    console.error('Error clearing sessions:', error);
    return false;
  }
};

export const getSessionStats = () => {
  const sessions = getSessionHistory();
  if (sessions.length === 0) return null;

  const stats = {
    totalSessions: sessions.length,
    averageScore: 0,
    totalWords: 0,
    totalDuration: 0,
    bestScore: 0,
    improvement: 0,
  };

  sessions.forEach(session => {
    stats.averageScore += session.overallScore || 0;
    stats.totalWords += session.speechAnalysis?.totalWords || 0;
    stats.totalDuration += session.duration || 0;
    if ((session.overallScore || 0) > stats.bestScore) {
      stats.bestScore = session.overallScore || 0;
    }
  });

  stats.averageScore = Math.round(stats.averageScore / sessions.length);

  // Calculate improvement (last 5 vs first 5)
  if (sessions.length >= 5) {
    const recent = sessions.slice(0, 5);
    const old = sessions.slice(-5);
    const recentAvg = recent.reduce((sum, s) => sum + (s.overallScore || 0), 0) / 5;
    const oldAvg = old.reduce((sum, s) => sum + (s.overallScore || 0), 0) / 5;
    stats.improvement = Math.round(recentAvg - oldAvg);
  }

  return stats;
};
