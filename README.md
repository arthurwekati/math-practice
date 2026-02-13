# Math Practice App

A React-based math practice web app for children aged 7–12. Practice addition, subtraction, multiplication, and division with an engaging card-based interface.

## Features

- **Four Operations**: Addition, Subtraction, Multiplication, Division
- **Multiple Difficulty Levels**: 5 levels with increasing number ranges
- **Card-Based Interface**: Flip cards to reveal answers
- **Self-Assessment**: Mark your answers as correct or incorrect
- **Mistake Tracking**: Review questions you got wrong
- **Statistics**: Track your progress with detailed stats
- **Time Tracking**: Automatically tracks practice time
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Persistent Data**: All stats and mistakes saved in localStorage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd math-practice
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Usage

1. **Choose an Operation**: Select Addition, Subtraction, Multiplication, or Division from the home screen
2. **Select Difficulty Level**: Choose level 1-5 (affects number ranges)
3. **Answer Questions**: 
   - Select one of the 4 multiple-choice answers
   - Click "Flip Card" to see the correct answer
   - Mark whether you got it right or wrong
   - Automatically advances to the next question
4. **Review Mistakes**: Click "Review Mistakes" to practice questions you got wrong
5. **View Statistics**: Check your progress on the Statistics page

## Keyboard Shortcuts

- **Enter/Space**: Flip card (when choice selected) or mark as correct (on back)
- **Escape**: Mark as incorrect (on back)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence

## Project Structure

```
math-practice/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types.ts       # TypeScript type definitions
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── specification.md   # Detailed requirements
└── TODO.md           # Implementation checklist
```

## License

MIT
