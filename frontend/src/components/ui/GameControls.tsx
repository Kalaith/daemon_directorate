// components/ui/GameControls.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';

const GameControls: React.FC = () => {
  const { resetGame } = useGameStore();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex gap-2 bg-daemon-panel p-3 rounded-lg border border-daemon-secondary shadow-lg">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-daemon-danger border border-daemon-danger text-daemon-text-bright font-mono rounded-lg uppercase tracking-wide hover:bg-red-600 hover:shadow-infernal transition-all duration-200 text-sm"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default GameControls;
