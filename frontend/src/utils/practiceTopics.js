// Practice topics for users to speak about
export const practiceTopics = {
  beginner: [
    "Introduce yourself and talk about your hobbies",
    "Describe your favorite place to visit",
    "Talk about a book or movie you recently enjoyed",
    "Explain your daily routine",
    "Describe a memorable childhood experience",
    "Talk about your favorite food and why you like it",
    "Discuss the importance of education",
    "Describe your dream vacation",
    "Talk about a person who inspires you",
    "Explain why you chose your career path",
  ],
  intermediate: [
    "Discuss the impact of social media on society",
    "Explain the importance of work-life balance",
    "Talk about climate change and its solutions",
    "Discuss the role of technology in modern education",
    "Explain your views on remote work",
    "Talk about the importance of mental health",
    "Discuss how to build effective teams",
    "Explain the future of artificial intelligence",
    "Talk about sustainable living practices",
    "Discuss the importance of cultural diversity",
  ],
  advanced: [
    "Present a business proposal for a new product",
    "Deliver a TED-style talk on innovation",
    "Discuss geopolitical challenges and solutions",
    "Present a technical concept to non-technical audience",
    "Debate the ethics of emerging technologies",
    "Deliver a motivational speech about overcoming failure",
    "Present quarterly results to stakeholders",
    "Discuss the future of work in the next decade",
    "Deliver a keynote on leadership in crisis",
    "Present a complex research finding to a general audience",
  ],
  professional: [
    "Pitch your startup idea to investors",
    "Present a marketing strategy to executives",
    "Deliver bad news to your team professionally",
    "Conduct a technical training session",
    "Present a crisis management plan",
    "Deliver a sales pitch for enterprise software",
    "Conduct a town hall meeting announcement",
    "Present a change management initiative",
    "Deliver a project post-mortem analysis",
    "Present a vision for your department's future",
  ],
};

export const getRandomTopic = (difficulty = 'intermediate') => {
  // Always return "Work-life balance" topic
  return "Explain the importance of work-life balance";
};

export const getAllDifficulties = () => Object.keys(practiceTopics);

export const getTimerPresets = () => [
  { label: '1 minute', value: 60 },
  { label: '2 minutes', value: 120 },
  { label: '3 minutes', value: 180 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '15 minutes', value: 900 },
];
