import jsPDF from 'jspdf';

// Grammar and vocabulary checking functions
const analyzeGrammar = (text) => {
  const mistakes = [];

  // Common grammar issues
  const patterns = [
    { pattern: /\bi\s/gi, correct: 'I ', issue: 'Lowercase "i" should be capitalized' },
    { pattern: /\b(your|you\'re)\s+(going|gonna)\s+to\b/gi, correct: "you're going to", issue: 'Redundant "going to"' },
    { pattern: /\b(should|would|could)\s+of\b/gi, correct: 'should have / would have / could have', issue: 'Use "have" not "of"' },
    { pattern: /\bthere\s+(is|are)\s+a\s+lot\s+of\b/gi, correct: 'there are many / there is much', issue: 'Use "many" or "much" instead of "a lot of"' },
    { pattern: /\b(me|him|her|them)\s+and\s+\w+\s+(is|are|was|were|go|goes|went)\b/gi, correct: '...and I/he/she/they...', issue: 'Wrong pronoun order or form' },
    { pattern: /\bdoesn\'t\s+\w+\b/gi, check: (match) => {
      const words = match.toLowerCase().split(/\s+/);
      if (words.length > 1 && !['have', 'need', 'want', 'like', 'know', 'matter', 'work', 'mean', 'make', 'seem'].includes(words[1])) {
        return { issue: 'Check verb agreement with "doesn\'t"', correct: 'Verify subject-verb agreement' };
      }
      return null;
    }}
  ];

  patterns.forEach(({pattern, correct, issue, check}) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (check) {
        const result = check(match[0]);
        if (result) {
          mistakes.push({
            text: match[0],
            position: match.index,
            issue: result.issue,
            suggestion: result.correct
          });
        }
      } else {
        mistakes.push({
          text: match[0],
          position: match.index,
          issue,
          suggestion: correct
        });
      }
    }
  });

  // Check for double spaces
  const doubleSpaces = text.matchAll(/\s{2,}/g);
  for (const match of doubleSpaces) {
    mistakes.push({
      text: match[0],
      position: match.index,
      issue: 'Multiple spaces',
      suggestion: ' '
    });
  }

  return mistakes;
};

const analyzeVocabulary = (text) => {
  const issues = [];

  // Overused/weak words
  const weakWords = [
    { word: /\b(very|really|actually|basically|literally)\s+/gi, issue: 'Overused intensifier', suggestion: 'Use more specific descriptive words' },
    { word: /\b(thing|stuff|things|stuffs)\b/gi, issue: 'Vague noun', suggestion: 'Be more specific' },
    { word: /\b(good|bad|nice)\b/gi, issue: 'Generic adjective', suggestion: 'Use more descriptive words (excellent, terrible, pleasant, etc.)' },
    { word: /\b(got|get|gets|getting)\b/gi, issue: 'Overused verb', suggestion: 'Consider: obtained, received, became, etc.' },
    { word: /\b(like|kinda|sorta|kind of|sort of)\b/gi, issue: 'Informal filler', suggestion: 'Remove or use formal alternatives' },
  ];

  weakWords.forEach(({word, issue, suggestion}) => {
    const matches = text.matchAll(word);
    for (const match of matches) {
      issues.push({
        text: match[0],
        position: match.index,
        issue,
        suggestion
      });
    }
  });

  // Check for repeated words
  const words = text.toLowerCase().split(/\s+/);
  const wordCounts = {};
  words.forEach(word => {
    const cleaned = word.replace(/[^\w]/g, '');
    if (cleaned.length > 3) { // Only count words longer than 3 letters
      wordCounts[cleaned] = (wordCounts[cleaned] || 0) + 1;
    }
  });

  Object.entries(wordCounts).forEach(([word, count]) => {
    if (count > 5) {
      issues.push({
        text: word,
        position: -1,
        issue: `Word repeated ${count} times`,
        suggestion: 'Consider using synonyms for variety'
      });
    }
  });

  return issues;
};

export const generatePDFReport = (sessionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(102, 126, 234);
  doc.text('SpeakSense.ai - Public Speaking Report', margin, yPos);

  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
  doc.text(`Session Duration: ${sessionData.duration}`, margin, yPos + 7);

  // Line separator
  yPos += 17;
  doc.setDrawColor(102, 126, 234);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Overall Score Section
  yPos += 15;
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Overall Performance Score', margin, yPos);

  yPos += 10;
  doc.setFontSize(36);
  const score = sessionData.overallScore || 0;
  const scoreColor = score >= 80 ? [46, 204, 113] : score >= 60 ? [243, 156, 18] : [231, 76, 60];
  doc.setTextColor(...scoreColor);
  doc.text(`${score}/100`, margin, yPos);

  // Performance Breakdown
  yPos += 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Performance Breakdown', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const breakdown = [
    `Total Words Spoken: ${sessionData.speechAnalysis?.totalWords || 0}`,
    `Filler Words: ${sessionData.speechAnalysis?.fillerCount || 0} (${sessionData.speechAnalysis?.fillerPercentage || 0}%)`,
    `Average Speaking Pace: ${sessionData.speechAnalysis?.averageWpm || 0} WPM`,
    `Frames Analyzed: ${sessionData.framesAnalyzed || 0}`,
    `Gestures Detected: ${sessionData.gestures?.total || 0}`
  ];

  breakdown.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 7;
  });

  // Speech Analysis Section
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Speech Analysis', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  if (sessionData.speechAnalysis?.fillerWordsData && sessionData.speechAnalysis.fillerWordsData.length > 0) {
    doc.text('Filler Words Detected:', margin, yPos);
    yPos += 7;

    sessionData.speechAnalysis.fillerWordsData.forEach(filler => {
      doc.setTextColor(231, 76, 60);
      doc.text(`• "${filler.word}" - used ${filler.count} times`, margin + 5, yPos);
      yPos += 6;
    });
  } else {
    doc.setTextColor(46, 204, 113);
    doc.text('✓ No filler words detected - Excellent!', margin, yPos);
    yPos += 7;
  }

  // Gesture Analysis Section
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Gesture Analysis', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);

  if (sessionData.gestures?.list && sessionData.gestures.list.length > 0) {
    doc.setTextColor(60, 60, 60);
    doc.text('Negative Gestures Detected:', margin, yPos);
    yPos += 7;

    sessionData.gestures.list.forEach((gesture, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const severityColors = {
        high: [255, 71, 87],
        medium: [255, 165, 2],
        low: [255, 211, 42]
      };

      doc.setTextColor(...(severityColors[gesture.severity] || [0, 0, 0]));
      doc.text(`${index + 1}. ${gesture.type.replace(/_/g, ' ')}`, margin + 5, yPos);
      yPos += 6;
      doc.setTextColor(100, 100, 100);
      doc.text(`   ${gesture.message}`, margin + 5, yPos);
      yPos += 6;
      doc.text(`   Severity: ${gesture.severity}`, margin + 5, yPos);
      yPos += 8;
    });
  } else {
    doc.setTextColor(46, 204, 113);
    doc.text('✓ No negative gestures detected - Great posture!', margin, yPos);
    yPos += 7;
  }

  // Transcript Section with Grammar and Vocabulary Analysis
  if (sessionData.transcript && sessionData.transcript.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Speech Transcript', margin, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    // Analyze full transcript for grammar and vocabulary
    const fullTranscriptText = sessionData.transcript.map(s => s.text).join(' ');
    const grammarMistakes = analyzeGrammar(fullTranscriptText);
    const vocabularyIssues = analyzeVocabulary(fullTranscriptText);

    sessionData.transcript.forEach((segment, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(102, 126, 234);
      doc.text(`[${segment.timestamp}]`, margin, yPos);
      doc.setTextColor(60, 60, 60);

      // Word wrap for transcript
      const textLines = doc.splitTextToSize(segment.text, pageWidth - margin * 2 - 20);
      textLines.forEach(line => {
        doc.text(line, margin + 20, yPos);
        yPos += 5;
      });

      yPos += 3;
    });

    // Grammar Analysis Section
    if (grammarMistakes.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }

      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Grammar Issues Detected', margin, yPos);

      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(231, 76, 60);

      const uniqueGrammarIssues = Array.from(new Set(grammarMistakes.map(m => m.issue)))
        .map(issue => grammarMistakes.find(m => m.issue === issue));

      uniqueGrammarIssues.slice(0, 10).forEach((mistake, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(231, 76, 60);
        doc.text(`${index + 1}. "${mistake.text.trim()}"`, margin + 5, yPos);
        yPos += 6;
        doc.setTextColor(100, 100, 100);
        doc.text(`   Issue: ${mistake.issue}`, margin + 5, yPos);
        yPos += 5;
        doc.setTextColor(46, 204, 113);
        doc.text(`   Suggestion: ${mistake.suggestion}`, margin + 5, yPos);
        yPos += 8;
      });
    } else {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Grammar Analysis', margin, yPos);
      yPos += 10;
      doc.setFontSize(11);
      doc.setTextColor(46, 204, 113);
      doc.text('✓ No grammar issues detected - Well done!', margin, yPos);
      yPos += 7;
    }

    // Vocabulary Analysis Section
    if (vocabularyIssues.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }

      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Vocabulary Enhancement Suggestions', margin, yPos);

      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(243, 156, 18);

      const uniqueVocabIssues = Array.from(new Set(vocabularyIssues.map(v => v.text.toLowerCase())))
        .map(text => vocabularyIssues.find(v => v.text.toLowerCase() === text));

      uniqueVocabIssues.slice(0, 15).forEach((issue, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(243, 156, 18);
        doc.text(`${index + 1}. "${issue.text.trim()}"`, margin + 5, yPos);
        yPos += 6;
        doc.setTextColor(100, 100, 100);
        doc.text(`   ${issue.issue}`, margin + 5, yPos);
        yPos += 5;
        doc.setTextColor(102, 126, 234);
        const suggestionLines = doc.splitTextToSize(`   ${issue.suggestion}`, pageWidth - margin * 2 - 10);
        suggestionLines.forEach(line => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 3;
      });
    } else {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Vocabulary Analysis', margin, yPos);
      yPos += 10;
      doc.setFontSize(11);
      doc.setTextColor(46, 204, 113);
      doc.text('✓ Excellent vocabulary usage!', margin, yPos);
      yPos += 7;
    }
  }

  // Recommendations Section
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Recommendations for Improvement', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const recommendations = generateRecommendations(sessionData);
  recommendations.forEach((rec, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(102, 126, 234);
    doc.text(`${index + 1}.`, margin, yPos);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(rec, pageWidth - margin * 2 - 10);
    lines.forEach(line => {
      doc.text(line, margin + 7, yPos);
      yPos += 6;
    });
    yPos += 3;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Generated by SpeakSense.ai`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`SpeakSense.ai_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

const generateRecommendations = (sessionData) => {
  const recommendations = [];

  // Filler words recommendations
  const fillerPercentage = sessionData.speechAnalysis?.fillerPercentage || 0;
  if (fillerPercentage > 5) {
    recommendations.push(
      `Reduce filler words: You used filler words ${fillerPercentage}% of the time. Practice pausing instead of saying "um" or "uh". Try recording yourself and consciously replace fillers with brief silence.`
    );
  }

  // Speaking pace recommendations
  const avgWPM = sessionData.speechAnalysis?.averageWpm || 0;
  if (avgWPM > 160) {
    recommendations.push(
      `Slow down your pace: Your average speaking pace was ${avgWPM} WPM, which is quite fast. Aim for 120-150 WPM for better clarity and audience comprehension.`
    );
  } else if (avgWPM < 100 && avgWPM > 0) {
    recommendations.push(
      `Increase your pace: Your average speaking pace was ${avgWPM} WPM, which may seem monotonous. Try to be more energetic and aim for 120-150 WPM.`
    );
  }

  // Gesture recommendations
  const totalGestures = sessionData.gestures?.total || 0;
  if (totalGestures > 5) {
    recommendations.push(
      `Work on body language: ${totalGestures} negative gestures were detected. Practice in front of a mirror or record yourself to become more aware of your body language habits.`
    );
  }

  // General recommendations
  const totalWords = sessionData.speechAnalysis?.totalWords || 0;
  if (totalWords < 50) {
    recommendations.push(
      `Practice more: This was a short session. Try practicing for longer periods (5-10 minutes) to get more comprehensive feedback.`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Excellent performance! Keep practicing regularly to maintain your skills. Consider challenging yourself with more complex topics or longer presentations.'
    );
  }

  return recommendations;
};

export const exportToJSON = (sessionData) => {
  const dataStr = JSON.stringify(sessionData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SpeakSense.ai_Session_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (sessionData) => {
  const csvRows = [];

  // Headers
  csvRows.push('Metric,Value');

  // Add data
  csvRows.push(`Session Date,${new Date().toLocaleString()}`);
  csvRows.push(`Duration,${sessionData.duration}`);
  csvRows.push(`Overall Score,${sessionData.overallScore}`);
  csvRows.push(`Total Words,${sessionData.totalWords}`);
  csvRows.push(`Filler Words,${sessionData.fillerCount}`);
  csvRows.push(`Filler Percentage,${sessionData.fillerPercentage}%`);
  csvRows.push(`Average WPM,${sessionData.avgWPM}`);
  csvRows.push(`Gestures Detected,${sessionData.totalGestures}`);

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SpeakSense.ai_Session_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
