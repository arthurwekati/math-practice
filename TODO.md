# Math Practice App — Implementation TODO (Easy → Hard)

> Goal: implement one feature at a time, shipping a working app early and improving step-by-step.

---

## 1) Project Setup (Easy)
- [x] Create React app (Vite + React)
- [x] Add TypeScript (recommended)
- [x] Add basic styling (Tailwind or CSS Modules)
- [x] Add React Router
- [x] Create base layout component (Header + Main container)
- [x] Define route skeletons:
  - [x] `/` Home
  - [x] `/practice/:operation` Practice
  - [x] `/review` Review Mistakes
  - [x] `/stats` Statistics

---

## 2) Home Screen (Easy)
- [x] Build Home UI with buttons/cards:
  - [x] Addition
  - [x] Subtraction
  - [x] Multiplication
  - [x] Division
- [x] Add navigation links:
  - [x] Review Mistakes
  - [x] Statistics
- [x] Clicking an operation navigates to `/practice/:operation`

---

## 3) Question Generator (Core) (Easy → Medium)
- [x] Create types:
  - [x] `Operation`, `Question`
- [x] Implement `generateQuestion(operation, level): Question`
  - [x] Addition: `a + b`
  - [x] Subtraction: ensure `a >= b`
  - [x] Multiplication: generate operands
  - [x] Division: `b != 0`, compute `q` and `r`, format `"q"` or `"q R r"`
- [ ] Add unit tests for generator (optional but recommended)

---

## 4) Choice Generation (Medium)
- [x] Implement `generateChoices(question): string[4]`
  - [x] Ensure correct answer is included
  - [x] Ensure 4 unique choices
  - [x] Keep order fixed (no shuffle): `[correct, wrong1, wrong2, wrong3]`
  - [x] Handle division remainder distractors properly
- [ ] Add unit tests for choices (optional)

---

## 5) Practice Screen UI (Medium)
- [x] Build Practice screen layout:
  - [x] Header showing operation name
  - [x] Level selector (1–5)
  - [x] "Back to Home" button/link
- [x] Render a question card (front side only for now):
  - [x] Show question text
  - [x] Show 4 selectable choices (radio or tile buttons)
  - [x] Store `selectedChoice` state

---

## 6) Card Flip Interaction (Medium)
- [x] Add flip button
- [x] Enforce rule: flip disabled until a choice is selected
- [x] Implement flipped state:
  - [x] Front: question + choices
  - [x] Back: correct answer + selected choice + indicator (correct/incorrect)
- [x] Add simple flip animation (CSS)

---

## 7) Self-Assessment + Next Question (Medium)
- [x] After flip, show buttons:
  - [x] "I got it right"
  - [x] "I got it wrong"
- [x] On click, auto-advance:
  - [x] Generate next random question
  - [x] Reset `selectedChoice` and `isFlipped`

---

## 8) Persistent Stats (Medium → Hard)
- [x] Create `Stats` type + default stats
- [x] Implement localStorage helpers:
  - [x] `loadStats()`
  - [x] `saveStats(stats)`
- [x] On "Right/Wrong":
  - [x] Increment `attempted`
  - [x] Increment `correct` or `incorrect`
  - [x] Persist updates

---

## 9) Statistics Page (Medium → Hard)
- [x] Build stats UI:
  - [x] Attempted / Correct / Incorrect
  - [x] Accuracy %
  - [x] Time spent (formatted as hh:mm:ss)
- [x] Load stats from localStorage and display
- [x] Add actions:
  - [x] Reset stats (with confirmation)
  - [x] Clear mistakes

---

## 10) Mistake Bank Persistence (Hard)
- [x] Create `MistakeBank` type
- [x] Implement localStorage helpers:
  - [x] `loadMistakes()`
  - [x] `saveMistakes(mistakes)`
- [x] On "I got it wrong" in practice:
  - [x] Add question to mistake bank if not present
  - [x] Persist mistake bank

---

## 11) Review Mistakes Mode (Hard)
- [x] Build `/review` screen:
  - [x] If empty: show friendly empty state + link Home
  - [x] If not empty: show same card flow using stored mistake questions
- [x] Implement review rules:
  - [x] If marked "I got it right" → remove from mistake bank
  - [x] If marked "I got it wrong" → keep in bank
- [x] Ensure review attempts also update all-time stats
- [x] Add progress indicator

---

## 12) Time Tracking (Hard)
- [x] Add session timer that runs only on:
  - [x] `/practice/:operation`
  - [x] `/review`
- [x] Pause timer when:
  - [x] navigating away from those routes
  - [x] tab becomes hidden (Page Visibility API)
- [x] Persist `timeSpentSeconds` to stats:
  - [x] periodic checkpoint (e.g., every 10s)
  - [x] on route exit/unload
- [x] Show formatted time on Stats page (`hh:mm:ss`)

---

## 13) Accessibility + UX Polish (Hard)
- [x] Keyboard navigation for choices + flip + right/wrong
- [x] ARIA labels for key actions
- [x] Clear focus styles
- [x] Improve card visuals and feedback states

---

## 14) Testing & Hardening (Hardest)
- [ ] Integration tests for:
  - [ ] select → flip → mark → next flow
  - [ ] persistence after refresh
  - [ ] review remove-on-correct behavior
- [x] Handle corrupted localStorage gracefully:
  - [x] fallback to defaults
  - [ ] (optional) schema versioning
- [x] Performance check: ensure generation is instant, no UI lag

---

## Suggested "Definition of Done" for Each Feature
- [x] Works end-to-end in the browser
- [x] No console errors
- [x] Refresh does not break the feature (where persistence applies)
- [x] Basic mobile layout looks acceptable
