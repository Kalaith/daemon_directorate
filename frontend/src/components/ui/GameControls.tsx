// components/ui/GameControls.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

const GameControls: React.FC = () => {
  const { saveGame, loadGame, resetGame } = useGameStore();

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to start a new corporate restructure? All progress will be lost.'
      )
    ) {
      resetGame();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <button
        onClick={saveGame}
        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm border border-teal-500 transition-colors shadow-lg"
      >
        Save Progress
      </button>
      <button
        onClick={loadGame}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm border border-gray-600 transition-colors shadow-lg"
      >
        Load Progress
      </button>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm border border-red-500 transition-colors shadow-lg"
      >
        New Corporate Restructure
      </button>
    </div>
  );
};

export default GameControls;
