// components/ui/GameControls.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import { UI_CONSTANTS } from '../../constants/gameBalance';

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
    <div
      className={`fixed bottom-4 right-4 flex gap-2 z-${UI_CONSTANTS.Z_INDEX.GAME_CONTROLS}`}
    >
      <button
        onClick={saveGame}
        className="px-4 py-2 bg-daemon-primary hover:bg-daemon-primaryHover text-daemon-text-bright rounded font-semibold uppercase tracking-wide text-sm border border-daemon-secondary transition-all duration-200 shadow-infernal hover:shadow-infernal-lg"
      >
        Save Progress
      </button>
      <button
        onClick={loadGame}
        className="px-4 py-2 border-2 border-daemon-secondary hover:border-daemon-primary text-daemon-text hover:text-daemon-text-bright rounded font-semibold uppercase tracking-wide text-sm transition-all duration-200 bg-transparent"
      >
        Load Progress
      </button>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-daemon-danger hover:bg-red-600 text-daemon-text-bright rounded font-semibold uppercase tracking-wide text-sm border border-daemon-danger transition-all duration-200 shadow-lg"
      >
        New Corporate Restructure
      </button>
    </div>
  );
};

export default GameControls;
