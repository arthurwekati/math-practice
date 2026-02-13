# Math Practice App (Ages 7–12) — Software Specification

## 1. Overview
A React-based math practice web app for children aged 7–12. The app generates random practice questions for one operation at a time (Addition, Subtraction, Multiplication, Division). Each question is presented as a multiple-choice card. The learner selects an option, flips the card to reveal the correct answer, then marks whether they got it right or wrong. The app persists mistakes and statistics in localStorage and provides an all-time statistics page including total time spent.

---

## 2. Goals
- Provide engaging, simple math practice for ages 7–12.
- Support operations: addition, subtraction, multiplication, division.
- Use card UI with:
  - multiple-choice selection
  - flip-to-reveal answer
  - self-assessment buttons (Right / Wrong)
- Persist:
  - questions marked wrong (mistake bank)
  - all-time stats (attempted/correct/incorrect/time spent)
- Provide a statistics page.

### Non-goals (v1)
- User accounts / multi-profile support
- Online sync / backend
- Adaptive learning algorithms beyond “bigger numbers” difficulty scaling

---

## 3. Target Platform & Tech Stack
- **Frontend:** React (recommended: Vite + React)
- **Routing:** react-router
- **State:** React Context + useReducer (or Zustand)
- **Persistence:** localStorage
- **Styling:** Tailwind CSS or CSS Modules
- **Testing:** Vitest + React Testing Library (optional but recommended)

---

## 4. Core User Experience
### 4.1 Main Flow
1. User chooses an operation (e.g., Multiplication).
2. App generates a random question and shows it on a card with **4 choices**.
3. User selects one choice (**choices are not shuffled**).
4. Flip action becomes available (button or tap).
5. User flips card to reveal correct answer and whether their selected choice matches.
6. Two buttons appear: **“I got it right”** and **“I got it wrong”**.
7. User taps one, app records the outcome, and automatically advances to the next card.

### 4.2 Mistakes Review
- A “Review Mistakes” mode repeats questions the user previously marked wrong (persisted).
- When a mistake is later marked correct, it can optionally be removed from the mistake bank (see rule below).

---

## 5. Requirements

## 5.1 Functional Requirements
### Practice
- FR-1: Operation selection screen shows 4 operations.
- FR-2: Practice screen generates questions randomly for the selected operation.
- FR-3: Each question card shows 4 multiple-choice answers.
- FR-4: Choices must be displayed in a stable order (**no shuffle**).
- FR-5: User must select an option before flipping the card.
- FR-6: Card can flip to reveal:
  - correct answer
  - user’s selected answer
  - indication correct/incorrect (visual)
- FR-7: After flipping, show two buttons:
  - “I got it right”
  - “I got it wrong”
- FR-8: After user marks Right/Wrong, app advances to next question automatically.

### Mistakes
- FR-9: If user marks “I got it wrong”, store that question in a **mistake bank** persisted to localStorage.
- FR-10: Provide a “Review Mistakes” entry point.
- FR-11: In Review Mistakes mode, present stored mistakes as cards (same interaction).
- FR-12 (Rule): If a mistake is marked “I got it right” during review, remove it from the mistake bank.

### Statistics
- FR-13: Track and persist all-time:
  - total questions attempted
  - total correct (based on self-report)
  - total incorrect (based on self-report)
  - total time spent practicing (seconds)
- FR-14: Statistics page displays:
  - attempted / correct / incorrect
  - accuracy %
  - total time spent
- FR-15: Time spent counts only while actively on practice/review screens (not while on menu/stats).

### Navigation
- FR-16: App has routes:
  - `/` home/operation selection
  - `/practice/:operation`
  - `/review`
  - `/stats`

---

## 5.2 Non-Functional Requirements
- NFR-1: Responsive layout for desktop + mobile.
- NFR-2: All key actions accessible by keyboard (focus states, Enter/Space).
- NFR-3: App loads quickly and works offline-ish (no server dependency).
- NFR-4: State is resilient: refresh should not lose mistakes or stats.

---

## 6. Question Generation Rules

## 6.1 Difficulty Model (Bigger Numbers)
A single difficulty setting controls operand ranges. For v1, implement a simple “Level” (1–5).

Example ranges (can be tuned):
- Level 1: 0–10
- Level 2: 0–20
- Level 3: 0–50
- Level 4: 0–100
- Level 5: 0–500

UI: Level selector on practice screen (or in home screen before starting).

## 6.2 Operation-specific Constraints
### Addition
- `a + b`
- operands from range for chosen level

### Subtraction
- `a - b`
- Ensure non-negative results for ages 7–12:
  - generate `a >= b`
- operands from range

### Multiplication
- `a × b`
- optionally cap one operand at lower range to avoid huge results (e.g., one operand <= 12 for lower levels)
- v1: both operands from range, but consider safety cap:
  - Level 1–2: 0–12
  - Level 3: 0–20
  - Level 4: 0–50
  - Level 5: 0–100

### Division (Integer only, remainder allowed)
- Display as: `a ÷ b`
- Constraints:
  - `b != 0`
  - `a` and `b` from range
  - Compute:
    - `q = floor(a / b)`
    - `r = a % b`
- Answer format:
  - If `r == 0`: `"q"`
  - Else: `"q R r"` (e.g., `"3 R 2"`)
- The correct answer must always be integer quotient with remainder.

---

## 7. Multiple Choice Generation

## 7.1 Choice Count and Order
- Exactly **4 choices** per question.
- **No shuffle**: choices are displayed in a fixed order.
- Proposed order:
  1. Correct answer
  2. Plausible wrong #1
  3. Plausible wrong #2
  4. Plausible wrong #3

## 7.2 Distractor Rules
### For addition/subtraction/multiplication
Generate distractors using nearby values and common slip-ups:
- `correct ± 1`
- `correct ± 2`
- `correct ± 10` (when result is large enough)
- Ensure distractors:
  - are unique
  - are not negative (for simplicity)
  - don’t equal correct

### For division with remainder
Distractors should mimic typical mistakes:
- Wrong quotient off-by-one:
  - `(q±1) R r` (clamp at >=0)
- Wrong remainder:
  - `q R (r±1)` within 0..b-1
- “No remainder” mistake:
  - `"q"` when `r != 0`
- Ensure unique strings.

---

## 8. UI / Screens

## 8.1 Home (Operation Selection)
- Title + short instruction.
- Buttons/cards:
  - Addition
  - Subtraction
  - Multiplication
  - Division
- Links:
  - Review Mistakes
  - Statistics

## 8.2 Practice Screen
Elements:
- Header:
  - operation name
  - current level selector (1–5)
  - link back to Home
- Card area:
  - front: question text + 4 options (radio/tiles)
  - flip button disabled until an option is selected
  - back: correct answer + user selected answer + correctness indicator
- After flip:
  - show “I got it right” / “I got it wrong”
- Auto-advance after marking

## 8.3 Review Mistakes Screen
- If no mistakes:
  - friendly empty state + button back to Home
- If mistakes exist:
  - same card flow, pulling from mistake bank
  - on “I got it right” remove from mistake bank
  - on “I got it wrong” keep it (and still count stats)

## 8.4 Statistics Screen
Show:
- Total attempted
- Correct
- Incorrect
- Accuracy %
- Total time spent (hh:mm:ss)
Optional:
- “Reset stats” and “Clear mistakes” (with confirmation)

---

## 9. Data Model

## 9.1 Types (TypeScript-style)
```ts
type Operation = "add" | "sub" | "mul" | "div";

type Question = {
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

type AttemptRecord = {
  questionId: string;
  selectedChoice: string;
  revealed: boolean;
  selfMarkedCorrect: boolean | null; // null until marked
  startedAt: number;
  answeredAt?: number;
};

type Stats = {
  attempted: number;
  correct: number;
  incorrect: number;
  timeSpentSeconds: number;
  updatedAt: number;
};

type MistakeBank = {
  questionsById: Record<string, Question>;
  mistakeIds: string[]; // order preserved (oldest-first)
};
