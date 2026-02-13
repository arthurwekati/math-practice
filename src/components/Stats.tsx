import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStats, clearStats, clearMistakes } from '../utils/storage';
import { formatTime } from '../utils/timeFormatter';
import { Stats as StatsType } from '../types';

export default function Stats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsType>(loadStats());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleResetStats = () => {
    if (showResetConfirm) {
      clearStats();
      setStats(loadStats());
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };

  const handleClearMistakes = () => {
    if (window.confirm('Clear all your saved mistakes? You can\'t undo this.')) {
      clearMistakes();
      alert('Mistakes cleared!');
    }
  };

  const accuracy = stats.attempted > 0 
    ? Math.round((stats.correct / stats.attempted) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-800">⭐ My Stats</h2>
        <button
          onClick={() => navigate('/')}
          className="btn-kid text-kid-orange hover:text-kid-orange/80 font-bold"
        >
          ← Home
        </button>
      </div>

      <p className="text-lg text-gray-600">Here’s how you’re doing! Keep it up! 🚀</p>

      <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-8 space-y-6">
        {/* Stats Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-kid-sky/20 rounded-2xl p-6 border-2 border-kid-sky/30">
            <div className="text-sm font-bold text-kid-sky uppercase mb-1">Questions tried</div>
            <div className="text-4xl font-extrabold text-gray-800">{stats.attempted}</div>
          </div>
          
          <div className="bg-kid-mint/20 rounded-2xl p-6 border-2 border-kid-mint/30">
            <div className="text-sm font-bold text-green-600 uppercase mb-1">Correct</div>
            <div className="text-4xl font-extrabold text-gray-800">{stats.correct}</div>
          </div>
          
          <div className="bg-red-100 rounded-2xl p-6 border-2 border-red-200">
            <div className="text-sm font-bold text-red-600 uppercase mb-1">To practice</div>
            <div className="text-4xl font-extrabold text-gray-800">{stats.incorrect}</div>
          </div>
          
          <div className="bg-kid-berry/20 rounded-2xl p-6 border-2 border-kid-berry/30">
            <div className="text-sm font-bold text-kid-berry uppercase mb-1">Accuracy</div>
            <div className="text-4xl font-extrabold text-gray-800">{accuracy}%</div>
          </div>
        </div>

        {/* Time Spent */}
        <div className="border-t-2 border-gray-100 pt-6">
          <div className="text-sm font-bold text-gray-600 uppercase mb-2">⏱️ Time spent practicing</div>
          <div className="text-3xl font-extrabold text-gray-800">{formatTime(stats.timeSpentSeconds)}</div>
        </div>

        {/* Actions */}
        <div className="border-t-2 border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResetStats}
            className="btn-kid px-5 py-3 bg-red-400 text-white rounded-2xl hover:bg-red-500 font-bold transition-all"
          >
            {showResetConfirm ? 'Sure, reset my stats' : 'Reset stats'}
          </button>
          {showResetConfirm && (
            <button
              onClick={() => setShowResetConfirm(false)}
              className="btn-kid px-5 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-bold"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleClearMistakes}
            className="btn-kid px-5 py-3 bg-kid-orange text-white rounded-2xl hover:bg-kid-orange/90 font-bold transition-all"
          >
            Clear mistakes list
          </button>
        </div>
      </div>
    </div>
  );
}
