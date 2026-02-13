export type Operation = "add" | "sub" | "mul" | "div";

export type Question = {
  id: string;                 // stable unique id for persistence
  operation: Operation;
  level: number;              // 1..5
  a: number;
  b: number;
  text: string;               // e.g., "12 ÷ 5"
  correctAnswer: string;      // e.g., "2 R 2"
  choices: string[];          // length 4 (no shuffle)
  createdAt: number;          // epoch ms
};

export type AttemptRecord = {
  questionId: string;
  selectedChoice: string;
  revealed: boolean;
  selfMarkedCorrect: boolean | null; // null until marked
  startedAt: number;
  answeredAt?: number;
};

export type Stats = {
  attempted: number;
  correct: number;
  incorrect: number;
  timeSpentSeconds: number;
  updatedAt: number;
};

export type MistakeBank = {
  questionsById: Record<string, Question>;
  mistakeIds: string[]; // order preserved (oldest-first)
};
