import { useNavigate } from 'react-router-dom';
import { Operation } from '../types';

const operations: { operation: Operation; label: string; emoji: string }[] = [
  { operation: 'add', label: 'Addition', emoji: '➕' },
  { operation: 'sub', label: 'Subtraction', emoji: '➖' },
  { operation: 'mul', label: 'Multiplication', emoji: '✖️' },
  { operation: 'div', label: 'Division', emoji: '➗' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Choose an Operation
        </h2>
        <p className="text-gray-600">
          Practice math problems with multiple-choice questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {operations.map(({ operation, label, emoji }) => (
          <button
            key={operation}
            onClick={() => navigate(`/practice/${operation}`)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="text-4xl mb-2">{emoji}</div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {label}
            </h3>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          onClick={() => navigate('/review')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Review Mistakes
        </button>
        <button
          onClick={() => navigate('/stats')}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Statistics
        </button>
      </div>
    </div>
  );
}
