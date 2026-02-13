import { Stats, MistakeBank, Question } from '../types';

const STATS_KEY = 'math-practice-stats';
const MISTAKES_KEY = 'math-practice-mistakes';

// Stats helpers
export function loadStats(): Stats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        attempted: parsed.attempted || 0,
        correct: parsed.correct || 0,
        incorrect: parsed.incorrect || 0,
        timeSpentSeconds: parsed.timeSpentSeconds || 0,
        updatedAt: parsed.updatedAt || Date.now(),
      };
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  return {
    attempted: 0,
    correct: 0,
    incorrect: 0,
    timeSpentSeconds: 0,
    updatedAt: Date.now(),
  };
}

export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify({
      ...stats,
      updatedAt: Date.now(),
    }));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

export function updateStats(
  gotItRight: boolean,
  timeSpent: number = 0
): Stats {
  const stats = loadStats();
  stats.attempted += 1;
  if (gotItRight) {
    stats.correct += 1;
  } else {
    stats.incorrect += 1;
  }
  stats.timeSpentSeconds += timeSpent;
  saveStats(stats);
  return stats;
}

// Mistake Bank helpers
export function loadMistakes(): MistakeBank {
  try {
    const stored = localStorage.getItem(MISTAKES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        questionsById: parsed.questionsById || {},
        mistakeIds: parsed.mistakeIds || [],
      };
    }
  } catch (error) {
    console.error('Error loading mistakes:', error);
  }
  return {
    questionsById: {},
    mistakeIds: [],
  };
}

export function saveMistakes(mistakes: MistakeBank): void {
  try {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  } catch (error) {
    console.error('Error saving mistakes:', error);
  }
}

export function addMistake(question: Question): MistakeBank {
  const mistakes = loadMistakes();
  if (!mistakes.questionsById[question.id]) {
    mistakes.questionsById[question.id] = question;
    mistakes.mistakeIds.push(question.id);
    saveMistakes(mistakes);
  }
  return mistakes;
}

export function removeMistake(questionId: string): MistakeBank {
  const mistakes = loadMistakes();
  if (mistakes.questionsById[questionId]) {
    delete mistakes.questionsById[questionId];
    mistakes.mistakeIds = mistakes.mistakeIds.filter(id => id !== questionId);
    saveMistakes(mistakes);
  }
  return mistakes;
}

export function clearMistakes(): void {
  localStorage.removeItem(MISTAKES_KEY);
}

export function clearStats(): void {
  localStorage.removeItem(STATS_KEY);
}
