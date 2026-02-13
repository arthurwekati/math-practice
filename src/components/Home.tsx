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
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-kid-orange font-bold text-sm uppercase tracking-wide mb-2">Pick one!</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
          What do you want to practice?
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Choose a type of math. Then pick an answer and flip the card to see if you got it! 🎯
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {operations.map(({ operation, label, emoji }) => (
          <button
            key={operation}
            onClick={() => navigate(`/practice/${operation}`)}
            className="btn-kid bg-white rounded-3xl shadow-lg border-4 border-gray-100 p-8 hover:shadow-xl hover:border-kid-sky/50 hover:-translate-y-1 transition-all duration-200 text-left group"
          >
            <div className="text-6xl mb-4" aria-hidden>{emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-kid-orange transition-colors">
              {label}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Tap to start →</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <button
          onClick={() => navigate('/review')}
          className="btn-kid bg-kid-berry text-white px-8 py-4 rounded-2xl hover:bg-kid-berry/90 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          📚 Review Mistakes
        </button>
        <button
          onClick={() => navigate('/stats')}
          className="btn-kid bg-kid-orange text-white px-8 py-4 rounded-2xl hover:bg-kid-orange/90 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          ⭐ My Stats
        </button>
      </div>
    </div>
  );
}
