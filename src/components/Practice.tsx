import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Operation, Question } from '../types';
import { generateQuestion } from '../utils/questionGenerator';
import { generateChoices } from '../utils/choiceGenerator';
import { updateStats, addMistake } from '../utils/storage';
import { useTimeTracking } from '../hooks/useTimeTracking';

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
    return <div>Loading...</div>;
  }

  const isCorrect = selectedChoice === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {operationLabels[operation]}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="level" className="text-sm font-medium text-gray-700">
              Level:
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Home
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative perspective-1000">
            {/* Card Container */}
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
