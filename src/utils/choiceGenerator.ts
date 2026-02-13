import { Question } from '../types';

/**
 * Generate 4 unique choices for a question
 * Order: [correct, wrong1, wrong2, wrong3] (no shuffle)
 */
export function generateChoices(question: Question): string[] {
  const correct = question.correctAnswer;
  const choices: string[] = [correct];

  if (question.operation === "div") {
    // Handle division with remainder
    const parts = correct.split(" R ");
    const q = parseInt(parts[0], 10);
    const r = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    const b = question.b;

    // Generate distractors for division
    const distractors: string[] = [];

    // Wrong quotient, same remainder
    if (q > 0) {
      distractors.push(`${q - 1} R ${r}`);
    } else {
      distractors.push(`${q + 1} R ${r}`);
    }

    // Same quotient, wrong remainder
    if (r > 0 && r < b - 1) {
      distractors.push(`${q} R ${r + 1}`);
    } else if (r > 0) {
      distractors.push(`${q} R ${r - 1}`);
    } else {
      distractors.push(`${q} R 1`);
    }

    // "No remainder" mistake (if there is a remainder)
    if (r !== 0) {
      distractors.push(String(q));
    } else {
      distractors.push(`${q + 1}`);
    }

    // Add unique distractors
    for (const distractor of distractors) {
      if (!choices.includes(distractor) && choices.length < 4) {
        choices.push(distractor);
      }
    }
  } else {
    // For add/sub/mul: use nearby values
    const correctNum = parseInt(correct, 10);
    if (isNaN(correctNum)) {
      // Fallback: just add some variations
      choices.push(String(parseInt(correct, 10) + 1));
      choices.push(String(parseInt(correct, 10) + 2));
      choices.push(String(parseInt(correct, 10) + 10));
    } else {
      const distractors: number[] = [];

      // correct ± 1
      distractors.push(correctNum + 1);
      distractors.push(correctNum - 1);

      // correct ± 2
      distractors.push(correctNum + 2);
      distractors.push(correctNum - 2);

      // correct ± 10 (if result is large enough)
      if (correctNum >= 10) {
        distractors.push(correctNum + 10);
        distractors.push(correctNum - 10);
      }

      // Filter: must be non-negative and unique
      const uniqueDistractors = [...new Set(distractors)]
        .filter(d => d >= 0 && d !== correctNum)
        .map(d => String(d));

      // Add up to 3 distractors
      for (const distractor of uniqueDistractors) {
        if (!choices.includes(distractor) && choices.length < 4) {
          choices.push(distractor);
        }
      }
    }
  }

  // Ensure we have exactly 4 choices (pad if needed)
  while (choices.length < 4) {
    const correctNum = parseInt(correct, 10);
    if (!isNaN(correctNum)) {
      const newDistractor = String(correctNum + choices.length * 5);
      if (!choices.includes(newDistractor)) {
        choices.push(newDistractor);
      } else {
        choices.push(String(correctNum + choices.length * 10));
      }
    } else {
      choices.push(`Option ${choices.length + 1}`);
    }
  }

  return choices.slice(0, 4);
}
