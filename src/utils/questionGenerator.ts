import { Operation, Question } from '../types';

/**
 * Get the range for a given level
 */
function getRangeForLevel(level: number): [number, number] {
  switch (level) {
    case 1: return [0, 10];
    case 2: return [0, 20];
    case 3: return [0, 50];
    case 4: return [0, 100];
    case 5: return [0, 500];
    default: return [0, 10];
  }
}

/**
 * Get multiplication operand range (with safety caps)
 */
function getMultiplicationRange(level: number): [number, number] {
  switch (level) {
    case 1:
    case 2: return [0, 12];
    case 3: return [0, 20];
    case 4: return [0, 50];
    case 5: return [0, 100];
    default: return [0, 12];
  }
}

/**
 * Generate a random integer in range [min, max] (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a unique ID for a question
 */
function generateQuestionId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a question for the given operation and level
 */
export function generateQuestion(operation: Operation, level: number): Question {
  const [min, max] = getRangeForLevel(level);
  let a: number, b: number;
  let text: string;
  let correctAnswer: string;

  switch (operation) {
    case "add": {
      a = randomInt(min, max);
      b = randomInt(min, max);
      text = `${a} + ${b}`;
      correctAnswer = String(a + b);
      break;
    }

    case "sub": {
      // Ensure non-negative result: a >= b
      b = randomInt(min, max);
      a = randomInt(b, max);
      text = `${a} - ${b}`;
      correctAnswer = String(a - b);
      break;
    }

    case "mul": {
      const [mulMin, mulMax] = getMultiplicationRange(level);
      a = randomInt(mulMin, mulMax);
      b = randomInt(mulMin, mulMax);
      text = `${a} × ${b}`;
      correctAnswer = String(a * b);
      break;
    }

    case "div": {
      // Generate division: ensure b != 0
      b = randomInt(1, max); // b must be at least 1
      const q = randomInt(0, Math.floor(max / b)); // quotient
      const r = randomInt(0, b - 1); // remainder
      a = q * b + r;
      text = `${a} ÷ ${b}`;
      if (r === 0) {
        correctAnswer = String(q);
      } else {
        correctAnswer = `${q} R ${r}`;
      }
      break;
    }
  }

  return {
    id: generateQuestionId(),
    operation,
    level,
    a,
    b,
    text,
    correctAnswer,
    choices: [], // Will be populated by generateChoices
    createdAt: Date.now(),
  };
}
