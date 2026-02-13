import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../types';
import { loadMistakes, removeMistake } from '../utils/storage';
import { generateChoices } from '../utils/choiceGenerator';
import { updateStats } from '../utils/storage';
import { useTimeTracking } from '../hooks/useTimeTracking';

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
        <h2 className="text-3xl font-bold text-gray-800">Review Mistakes</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-600 mb-6 text-lg">
            No mistakes to review! Great job!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Review Mistakes</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">Loading...</p>
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
          <h2 className="text-2xl font-bold text-gray-800">Review Mistakes</h2>
          <p className="text-sm text-gray-600 mt-1">
            {currentIndex + 1} of {mistakes.mistakeIds.length} mistakes
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Home
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative perspective-1000">
            <div
              className={`card-flip-container bg-white rounded-lg shadow-lg p-8 transition-transform duration-500 ${
                isFlipped ? 'flipped' : ''
              }`}
            >
              {/* Front Side */}
              <div className="card-front space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6">
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
                      className={`p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        selectedChoice === choice
                          ? 'border-indigo-600 bg-indigo-50 font-semibold'
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
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
                  className={`w-full py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    selectedChoice
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Flip Card
                </button>
              </div>

              {/* Back Side */}
              <div className="card-back space-y-6">
                <div className="text-center">
                  <div className={`text-4xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {question.text} = {question.correctAnswer}
                  </h3>
                  <p className="text-gray-600">
                    You selected: <span className="font-semibold">{selectedChoice}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelfAssessment(true)}
                    aria-label="Mark as correct"
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    I got it right
                  </button>
                  <button
                    onClick={() => handleSelfAssessment(false)}
                    aria-label="Mark as incorrect"
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    I got it wrong
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
