import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../types';
import { loadMistakes, removeMistake } from '../utils/storage';
import { generateChoices } from '../utils/choiceGenerator';
import { updateStats } from '../utils/storage';
import { useTimeTracking } from '../hooks/useTimeTracking';
import confetti from 'canvas-confetti';

export default function Review() {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState(loadMistakes());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const { getElapsedTime, reset } = useTimeTracking(mistakes.mistakeIds.length > 0);

  // Load current question
  useEffect(() => {
    if (mistakes.mistakeIds.length > 0 && currentIndex < mistakes.mistakeIds.length) {
      const questionId = mistakes.mistakeIds[currentIndex];
      const mistakeQuestion = mistakes.questionsById[questionId];
      if (mistakeQuestion) {
        const questionWithChoices = {
          ...mistakeQuestion,
          choices: generateChoices(mistakeQuestion),
        };
        setQuestion(questionWithChoices);
        setSelectedChoice(null);
        setIsFlipped(false);
      }
    }
  }, [mistakes, currentIndex]);

  const handleChoiceSelect = (choice: string) => {
    if (!isFlipped) {
      setSelectedChoice(choice);
    }
  };

  const handleFlip = useCallback(() => {
    if (selectedChoice && !isFlipped) {
      setIsFlipped(true);
    }
  }, [selectedChoice, isFlipped]);

  const handleSelfAssessment = useCallback((gotItRight: boolean) => {
    if (question) {
      // Get time spent
      const timeSpent = getElapsedTime();
      reset();

      // Update stats
      updateStats(gotItRight, timeSpent);

      // If marked correct, remove from mistake bank
      if (gotItRight) {
        // Celebrate with confetti when correct!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],
        });
        const updatedMistakes = removeMistake(question.id);
        setMistakes(updatedMistakes);
        
        // If no more mistakes, stay at current index (will show empty state)
        if (updatedMistakes.mistakeIds.length === 0) {
          setQuestion(null);
          return;
        }
        
        // Adjust index if needed
        if (currentIndex >= updatedMistakes.mistakeIds.length) {
          setCurrentIndex(Math.max(0, updatedMistakes.mistakeIds.length - 1));
        }
      } else {
        // Move to next mistake
        if (currentIndex < mistakes.mistakeIds.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // No more mistakes
          setQuestion(null);
        }
      }
    }
  }, [question, mistakes, currentIndex, getElapsedTime, reset]);

  // Empty state
  if (mistakes.mistakeIds.length === 0) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-800">📚 Review Mistakes</h2>
        <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-10 max-w-md mx-auto">
          <div className="text-7xl mb-4">🎉</div>
          <p className="text-xl font-bold text-gray-800 mb-2">You're all caught up!</p>
          <p className="text-gray-600 mb-8">
            No mistakes to practice right now. You're doing great!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-kid bg-kid-berry text-white px-8 py-4 rounded-2xl hover:bg-kid-berry/90 font-bold text-lg shadow-lg"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-800">📚 Review Mistakes</h2>
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <p className="text-4xl mb-4">⏳</p>
          <p className="text-xl font-bold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  const isCorrect = selectedChoice === question.correctAnswer;
  const progress = ((currentIndex + 1) / mistakes.mistakeIds.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">📚 Review Mistakes</h2>
          <p className="text-gray-600 mt-1 font-medium">
            Question {currentIndex + 1} of {mistakes.mistakeIds.length}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-kid text-kid-orange hover:text-kid-orange/80 font-bold"
        >
          ← Home
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-kid-berry h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
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
              <div className="card-front space-y-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-kid-berry uppercase mb-2">Try again!</p>
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
                      className={`btn-kid p-5 rounded-2xl border-4 text-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-kid-yellow ${
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
                  className={`w-full py-4 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-kid-orange ${
                    selectedChoice
                      ? 'btn-kid bg-kid-orange text-white hover:bg-kid-orange/90 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🔄 Flip card
                </button>
              </div>

              <div className="card-back space-y-6">
                <div className="text-center">
                  <div className={`text-6xl mb-4 ${isCorrect ? 'text-kid-mint' : 'text-red-400'}`}>
                    {isCorrect ? '🌟' : '🤔'}
                  </div>
                  <p className={`text-lg font-bold ${isCorrect ? 'text-kid-mint' : 'text-gray-600'}`}>
                    {isCorrect ? 'You got it!' : 'Keep trying!'}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {question.text} = {question.correctAnswer}
                  </h3>
                  <p className="text-gray-600">
                    You picked: <span className="font-bold text-gray-800">{selectedChoice}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelfAssessment(true)}
                    aria-label="Mark as correct"
                    className="flex-1 btn-kid py-4 bg-kid-mint text-white rounded-2xl hover:bg-kid-mint/90 font-bold text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-kid-mint"
                  >
                    👍 Yes!
                  </button>
                  <button
                    onClick={() => handleSelfAssessment(false)}
                    aria-label="Mark as incorrect"
                    className="flex-1 btn-kid py-4 bg-red-400 text-white rounded-2xl hover:bg-red-500 font-bold text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
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
