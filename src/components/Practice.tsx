import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Operation, Question } from '../types';
import { generateQuestion } from '../utils/questionGenerator';
import { generateChoices } from '../utils/choiceGenerator';
import { updateStats, addMistake } from '../utils/storage';
import { useTimeTracking } from '../hooks/useTimeTracking';
import confetti from 'canvas-confetti';

const operationLabels: Record<Operation, string> = {
  add: 'Addition',
  sub: 'Subtraction',
  mul: 'Multiplication',
  div: 'Division',
};

export default function Practice() {
  const { operation } = useParams<{ operation: Operation }>();
  const navigate = useNavigate();
  
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { getElapsedTime, reset } = useTimeTracking(true);

  // Validate operation
  useEffect(() => {
    if (!operation || !['add', 'sub', 'mul', 'div'].includes(operation)) {
      navigate('/');
    }
  }, [operation, navigate]);

  // Generate initial question
  useEffect(() => {
    if (operation && ['add', 'sub', 'mul', 'div'].includes(operation)) {
      generateNewQuestion();
    }
  }, [operation, level]);

  const generateNewQuestion = () => {
    if (!operation || !['add', 'sub', 'mul', 'div'].includes(operation)) return;
    
    const newQuestion = generateQuestion(operation as Operation, level);
    newQuestion.choices = generateChoices(newQuestion);
    setQuestion(newQuestion);
    setSelectedChoice(null);
    setIsFlipped(false);
  };

  const handleChoiceSelect = (choice: string) => {
    if (!isFlipped) {
      setSelectedChoice(choice);
    }
  };

  const handleSelfAssessment = useCallback((gotItRight: boolean) => {
    if (question) {
      // Get time spent since last question
      const timeSpent = getElapsedTime();
      reset();
      
      // Update stats
      updateStats(gotItRight, timeSpent);
      
      // Add to mistake bank if wrong
      if (!gotItRight) {
        addMistake(question);
      } else {
        // Celebrate with confetti when correct!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],
        });
      }
    }
    generateNewQuestion();
  }, [question, getElapsedTime, reset]);

  const handleFlip = useCallback(() => {
    if (selectedChoice && !isFlipped) {
      setIsFlipped(true);
    }
  }, [selectedChoice, isFlipped]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFlipped) {
        // On back side: Space/Enter for "I got it right", Escape for "I got it wrong"
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelfAssessment(true);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleSelfAssessment(false);
        }
      } else {
        // On front side: Enter/Space to flip
        if (selectedChoice && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleFlip();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedChoice, isFlipped, handleSelfAssessment, handleFlip]);

  if (!operation || !question) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-4xl mb-4">⏳</p>
        <p className="text-xl font-bold text-gray-700">Loading your question...</p>
      </div>
    );
  }

  const isCorrect = selectedChoice === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            {operationLabels[operation]}
          </h2>
          <p className="text-gray-600 mt-1">Pick your answer, then flip the card! 🃏</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">Difficulty:</span>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="border-2 border-kid-sky/50 rounded-xl px-3 py-2 text-base font-bold bg-white focus:ring-2 focus:ring-kid-orange"
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl} {lvl <= 2 ? '(easier)' : lvl >= 4 ? '(harder)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-kid text-kid-orange hover:text-kid-orange/80 font-bold text-base"
          >
            ← Home
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative perspective-1000">
            <div
              className={`card-flip-container bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-8 transition-transform duration-500 ${
                isFlipped ? 'flipped' : ''
              }`}
            >
              {/* Front Side */}
              <div className="card-front space-y-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-kid-berry uppercase mb-2">Solve this!</p>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                    {question.text} = ?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Answer choices">
                  {question.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoiceSelect(choice)}
                      role="radio"
                      aria-checked={selectedChoice === choice}
                      aria-label={`Choice ${index + 1}: ${choice}`}
                      className={`btn-kid p-5 rounded-2xl border-4 text-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-kid-yellow focus:ring-offset-2 ${
                        selectedChoice === choice
                          ? 'border-kid-sky bg-kid-sky/20 text-gray-800'
                          : 'border-gray-200 hover:border-kid-sky/50 hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleFlip}
                  disabled={!selectedChoice}
                  aria-label="Flip card to see answer"
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-kid-orange focus:ring-offset-2 ${
                    selectedChoice
                      ? 'btn-kid bg-kid-orange text-white hover:bg-kid-orange/90 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🔄 Flip card to see answer
                </button>
              </div>

              {/* Back Side */}
              <div className="card-back space-y-6">
                <div className="text-center">
                  <div className={`text-6xl mb-4 ${isCorrect ? 'text-kid-mint' : 'text-red-400'}`}>
                    {isCorrect ? '🌟' : '🤔'}
                  </div>
                  <p className={`text-lg font-bold ${isCorrect ? 'text-kid-mint' : 'text-gray-600'}`}>
                    {isCorrect ? 'Nice job!' : 'Keep practicing!'}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {question.text} = {question.correctAnswer}
                  </h3>
                  <p className="text-gray-600">
                    You picked: <span className="font-bold text-gray-800">{selectedChoice}</span>
                  </p>
                </div>
                <p className="text-center text-sm text-gray-500 font-medium">Did you get it right?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelfAssessment(true)}
                    aria-label="Mark as correct"
                    className="flex-1 btn-kid py-4 bg-kid-mint text-white rounded-2xl hover:bg-kid-mint/90 font-bold text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-kid-mint focus:ring-offset-2"
                  >
                    👍 Yes!
                  </button>
                  <button
                    onClick={() => handleSelfAssessment(false)}
                    aria-label="Mark as incorrect"
                    className="flex-1 btn-kid py-4 bg-red-400 text-white rounded-2xl hover:bg-red-500 font-bold text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2"
                  >
                    👎 Not yet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
