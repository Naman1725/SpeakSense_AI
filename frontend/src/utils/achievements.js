// Achievements and Badges System
export const achievements = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first speaking session',
    icon: '🎯',
    condition: (stats) => stats.totalSessions >= 1,
  },
  {
    id: 'five_sessions',
    title: 'Getting Started',
    description: 'Complete 5 speaking sessions',
    icon: '🔥',
    condition: (stats) => stats.totalSessions >= 5,
  },
  {
    id: 'ten_sessions',
    title: 'Dedicated Speaker',
    description: 'Complete 10 speaking sessions',
    icon: '🏆',
    condition: (stats) => stats.totalSessions >= 10,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieve a score of 95 or higher',
    icon: '⭐',
    condition: (stats) => stats.bestScore >= 95,
  },
  {
    id: 'high_performer',
    title: 'High Performer',
    description: 'Achieve a score of 85 or higher',
    icon: '💎',
    condition: (stats) => stats.bestScore >= 85,
  },
  {
    id: 'word_master',
    title: 'Word Master',
    description: 'Speak 1000+ words in total',
    icon: '📚',
    condition: (stats) => stats.totalWords >= 1000,
  },
  {
    id: 'marathon_speaker',
    title: 'Marathon Speaker',
    description: 'Speak for 30+ minutes total',
    icon: '⏱️',
    condition: (stats) => stats.totalDuration >= 1800,
  },
  {
    id: 'consistent',
    title: 'Consistent',
    description: 'Practice 3 days in a row',
    icon: '📅',
    condition: (stats) => checkConsecutiveDays(stats, 3),
  },
  {
    id: 'improving',
    title: 'On The Rise',
    description: 'Improve your average score by 10 points',
    icon: '📈',
    condition: (stats) => stats.improvement >= 10,
  },
  {
    id: 'filler_free',
    title: 'Filler Free',
    description: 'Complete a session with less than 2% filler words',
    icon: '🎤',
    condition: (stats) => stats.bestFillerPercentage !== undefined && stats.bestFillerPercentage < 2,
  },
];

const checkConsecutiveDays = (stats, days) => {
  // This would need to check actual dates from session history
  // Placeholder implementation
  return false;
};

export const checkAchievements = (stats, sessions = []) => {
  const unlockedAchievements = [];
  const lockedAchievements = [];

  // Enhance stats with additional calculated values
  const enhancedStats = {
    ...stats,
    bestFillerPercentage: sessions.length > 0
      ? Math.min(...sessions.map(s => s.speechAnalysis?.fillerPercentage || 100))
      : 100,
  };

  achievements.forEach(achievement => {
    if (achievement.condition(enhancedStats)) {
      unlockedAchievements.push(achievement);
    } else {
      lockedAchievements.push(achievement);
    }
  });

  return { unlockedAchievements, lockedAchievements };
};

export const saveAchievementUnlock = (achievementId) => {
  try {
    const unlocked = JSON.parse(localStorage.getItem('speaksense_achievements') || '[]');
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      localStorage.setItem('speaksense_achievements', JSON.stringify(unlocked));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving achievement:', error);
    return false;
  }
};

export const getUnlockedAchievements = () => {
  try {
    return JSON.parse(localStorage.getItem('speaksense_achievements') || '[]');
  } catch (error) {
    console.error('Error loading achievements:', error);
    return [];
  }
};
