# Testing Guide for Math Practice App

This document outlines the types of automated tests you can implement for your Math Practice application.

## Types of Tests

### 1. **Unit Tests** (Fast, Isolated)
Test individual functions in isolation.

**What to Test:**
- ✅ `questionGenerator.ts` - Question generation logic
- ✅ `choiceGenerator.ts` - Choice generation logic  
- ✅ `timeFormatter.ts` - Time formatting
- ✅ `storage.ts` - localStorage operations

**Example Test Cases:**
```typescript
// questionGenerator.test.ts
- generateQuestion('add', 1) returns valid addition question
- generateQuestion('sub', 1) ensures non-negative results
- generateQuestion('div', 1) never divides by zero
- generateQuestion('mul', 1) uses appropriate ranges

// choiceGenerator.test.ts
- generateChoices() always includes correct answer
- generateChoices() returns exactly 4 unique choices
- generateChoices() maintains fixed order [correct, wrong1, wrong2, wrong3]
- generateChoices() handles division remainders correctly

// timeFormatter.test.ts
- formatTime(3661) returns "1:01:01"
- formatTime(125) returns "2:05"
- formatTime(0) returns "0:00"

// storage.test.ts
- loadStats() returns default stats when localStorage is empty
- saveStats() persists stats correctly
- updateStats() increments correct counters
- addMistake() adds question to mistake bank
- removeMistake() removes question from mistake bank
```

---

### 2. **Component Tests** (React Testing Library)
Test React components in isolation with mocked dependencies.

**What to Test:**

#### **Home Component**
- ✅ Renders all 4 operation buttons
- ✅ Navigation links work (Review Mistakes, Statistics)
- ✅ Clicking operation navigates to correct route

#### **Practice Component**
- ✅ Renders question card with question text
- ✅ Shows 4 choice buttons
- ✅ Selecting choice enables flip button
- ✅ Flip button disabled until choice selected
- ✅ Card flips when button clicked
- ✅ Shows correct answer on back
- ✅ Shows "I got it right/wrong" buttons after flip
- ✅ Level selector changes difficulty
- ✅ Keyboard navigation works (Enter/Space/Escape)

#### **Review Component**
- ✅ Shows empty state when no mistakes
- ✅ Displays progress indicator
- ✅ Shows mistake questions in order
- ✅ Removes mistake when marked correct
- ✅ Keeps mistake when marked wrong

#### **Stats Component**
- ✅ Displays all stats correctly
- ✅ Calculates accuracy percentage
- ✅ Formats time correctly
- ✅ Reset stats button works
- ✅ Clear mistakes button works

**Example Test:**
```typescript
// Practice.test.tsx
- renders question text
- disables flip button initially
- enables flip button after selecting choice
- shows correct answer after flip
- calls updateStats when marking right/wrong
```

---

### 3. **Integration Tests** (User Flows)
Test multiple components working together.

**What to Test:**

#### **Practice Flow**
- ✅ Select operation → Generate question → Select choice → Flip → Mark → Next question
- ✅ Stats update correctly after marking
- ✅ Mistakes added to bank when marked wrong
- ✅ Time tracking works during practice

#### **Review Flow**
- ✅ Load mistakes → Display question → Mark correct → Remove from bank
- ✅ Mark wrong → Keep in bank → Move to next
- ✅ Stats update during review

#### **Persistence Flow**
- ✅ Stats persist after page refresh
- ✅ Mistakes persist after page refresh
- ✅ Time accumulates correctly across sessions

**Example Test:**
```typescript
// integration/practiceFlow.test.tsx
- complete practice flow updates stats
- marking wrong adds to mistake bank
- refreshing page preserves stats
```

---

### 4. **E2E Tests** (End-to-End)
Test the full application in a real browser.

**What to Test:**
- ✅ Full user journey: Home → Practice → Answer → Review → Stats
- ✅ Navigation between all pages
- ✅ localStorage persistence across page refreshes
- ✅ Card flip animations work
- ✅ Responsive design on mobile/tablet/desktop
- ✅ Keyboard shortcuts work
- ✅ Accessibility (screen reader, keyboard only)

**Tools:** Playwright, Cypress, or Puppeteer

---

### 5. **Custom Hook Tests**
Test React hooks in isolation.

**What to Test:**

#### **useTimeTracking Hook**
- ✅ Starts tracking when active
- ✅ Pauses when tab hidden (Page Visibility API)
- ✅ Accumulates time correctly
- ✅ Resets correctly
- ✅ Saves time periodically

---

## Recommended Testing Stack

Since you're using **Vite**, here's the recommended setup:

### **Vitest** (Unit & Component Tests)
- Fast, Vite-native test runner
- Compatible with Jest API
- Great TypeScript support

### **React Testing Library** (Component Tests)
- Tests components from user's perspective
- Encourages best practices
- Works great with Vitest

### **Playwright** or **Cypress** (E2E Tests)
- Full browser testing
- Real user interactions
- Screenshot/video recording

---

## Test Structure Example

```
src/
├── utils/
│   ├── questionGenerator.ts
│   └── questionGenerator.test.ts      # Unit tests
├── components/
│   ├── Practice.tsx
│   └── Practice.test.tsx              # Component tests
├── hooks/
│   ├── useTimeTracking.ts
│   └── useTimeTracking.test.ts       # Hook tests
└── __tests__/
    └── integration/
        └── practiceFlow.test.tsx      # Integration tests

e2e/
└── practice.spec.ts                   # E2E tests
```

---

## Priority Testing Checklist

### High Priority (Core Functionality)
1. ✅ Question generation (all operations, all levels)
2. ✅ Choice generation (unique, correct order)
3. ✅ Stats persistence (save/load)
4. ✅ Mistake bank (add/remove)
5. ✅ Practice flow (select → flip → mark → next)

### Medium Priority (User Experience)
1. ✅ Component rendering
2. ✅ Navigation
3. ✅ Keyboard shortcuts
4. ✅ Time tracking
5. ✅ Review mode flow

### Low Priority (Polish)
1. ✅ Accessibility features
2. ✅ Error handling
3. ✅ Edge cases
4. ✅ Performance

---

## Quick Start: Setting Up Tests

### 1. Install Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Configure Vitest

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### 3. Create Test Setup File

`src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

### 4. Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Example Test Implementation

### Unit Test Example
```typescript
// src/utils/questionGenerator.test.ts
import { describe, it, expect } from 'vitest';
import { generateQuestion } from './questionGenerator';

describe('generateQuestion', () => {
  it('generates valid addition question', () => {
    const question = generateQuestion('add', 1);
    expect(question.operation).toBe('add');
    expect(question.text).toMatch(/\d+ \+ \d+/);
    expect(Number(question.correctAnswer)).toBe(
      question.a + question.b
    );
  });

  it('ensures subtraction never produces negative results', () => {
    for (let i = 0; i < 100; i++) {
      const question = generateQuestion('sub', 1);
      expect(question.a).toBeGreaterThanOrEqual(question.b);
      expect(Number(question.correctAnswer)).toBeGreaterThanOrEqual(0);
    }
  });
});
```

### Component Test Example
```typescript
// src/components/Practice.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Practice from './Practice';

describe('Practice Component', () => {
  it('renders question text', () => {
    render(
      <BrowserRouter>
        <Practice />
      </BrowserRouter>
    );
    expect(screen.getByText(/= \?/)).toBeInTheDocument();
  });

  it('disables flip button until choice selected', () => {
    render(
      <BrowserRouter>
        <Practice />
      </BrowserRouter>
    );
    const flipButton = screen.getByText('Flip Card');
    expect(flipButton).toBeDisabled();
  });
});
```

---

## Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Test what users see/do, not internal state

2. **Keep Tests Simple**
   - One assertion per test when possible
   - Clear test names describing what's tested

3. **Use Descriptive Names**
   - `it('should disable flip button when no choice selected')`
   - Not: `it('test1')`

4. **Test Edge Cases**
   - Empty states, error conditions, boundary values

5. **Mock External Dependencies**
   - localStorage, timers, API calls

6. **Maintain Test Coverage**
   - Aim for 80%+ coverage on critical paths
   - Focus on business logic over UI details

---

## Next Steps

1. Install testing dependencies
2. Set up Vitest configuration
3. Write unit tests for utilities first (easiest)
4. Add component tests for critical flows
5. Set up E2E tests for full user journeys

Would you like me to set up the testing infrastructure and create example tests for your app?
