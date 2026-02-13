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
    if (window.confirm('Are you sure you want to clear all mistakes? This cannot be undone.')) {
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
        <h2 className="text-3xl font-bold text-gray-800">Statistics</h2>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Home
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Stats Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-sm text-blue-600 font-medium mb-1">Total Attempted</div>
            <div className="text-3xl font-bold text-blue-800">{stats.attempted}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-sm text-green-600 font-medium mb-1">Correct</div>
            <div className="text-3xl font-bold text-green-800">{stats.correct}</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-6">
            <div className="text-sm text-red-600 font-medium mb-1">Incorrect</div>
            <div className="text-3xl font-bold text-red-800">{stats.incorrect}</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="text-sm text-purple-600 font-medium mb-1">Accuracy</div>
            <div className="text-3xl font-bold text-purple-800">{accuracy}%</div>
          </div>
        </div>

        {/* Time Spent */}
        <div className="border-t pt-6">
          <div className="text-sm text-gray-600 font-medium mb-2">Total Time Spent</div>
          <div className="text-2xl font-bold text-gray-800">{formatTime(stats.timeSpentSeconds)}</div>
        </div>

        {/* Actions */}
        <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResetStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {showResetConfirm ? 'Confirm Reset Stats' : 'Reset Stats'}
          </button>
          {showResetConfirm && (
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleClearMistakes}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Clear Mistakes
          </button>
        </div>
      </div>
    </div>
  );
}
