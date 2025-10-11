import jsPDF from 'jspdf';

export const generatePDFReport = (sessionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(102, 126, 234);
  doc.text('SpeakSense AI - Public Speaking Report', margin, yPos);

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
    `Total Words Spoken: ${sessionData.totalWords || 0}`,
    `Filler Words: ${sessionData.fillerCount || 0} (${sessionData.fillerPercentage || 0}%)`,
    `Average Speaking Pace: ${sessionData.avgWPM || 0} WPM`,
    `Frames Analyzed: ${sessionData.framesAnalyzed || 0}`,
    `Gestures Detected: ${sessionData.totalGestures || 0}`
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

  if (sessionData.fillerWordsData && sessionData.fillerWordsData.length > 0) {
    doc.text('Filler Words Detected:', margin, yPos);
    yPos += 7;

    sessionData.fillerWordsData.forEach(filler => {
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

  if (sessionData.gestureList && sessionData.gestureList.length > 0) {
    doc.setTextColor(60, 60, 60);
    doc.text('Negative Gestures Detected:', margin, yPos);
    yPos += 7;

    sessionData.gestureList.forEach((gesture, index) => {
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

  // Transcript Section
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
      `Page ${i} of ${pageCount} | Generated by SpeakSense AI`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`SpeakSense_AI_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

const generateRecommendations = (sessionData) => {
  const recommendations = [];

  // Filler words recommendations
  if (sessionData.fillerPercentage > 5) {
    recommendations.push(
      `Reduce filler words: You used filler words ${sessionData.fillerPercentage}% of the time. Practice pausing instead of saying "um" or "uh". Try recording yourself and consciously replace fillers with brief silence.`
    );
  }

  // Speaking pace recommendations
  if (sessionData.avgWPM > 160) {
    recommendations.push(
      `Slow down your pace: Your average speaking pace was ${sessionData.avgWPM} WPM, which is quite fast. Aim for 120-150 WPM for better clarity and audience comprehension.`
    );
  } else if (sessionData.avgWPM < 100 && sessionData.avgWPM > 0) {
    recommendations.push(
      `Increase your pace: Your average speaking pace was ${sessionData.avgWPM} WPM, which may seem monotonous. Try to be more energetic and aim for 120-150 WPM.`
    );
  }

  // Gesture recommendations
  if (sessionData.totalGestures > 5) {
    recommendations.push(
      `Work on body language: ${sessionData.totalGestures} negative gestures were detected. Practice in front of a mirror or record yourself to become more aware of your body language habits.`
    );
  }

  // General recommendations
  if (sessionData.totalWords < 50) {
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
  link.download = `SpeakSense_AI_Session_${new Date().toISOString().slice(0, 10)}.json`;
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
  link.download = `SpeakSense_AI_Session_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
