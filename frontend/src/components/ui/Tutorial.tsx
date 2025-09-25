// components/ui/Tutorial.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import { UI_CONSTANTS } from '../../constants/gameBalance';

const Tutorial: React.FC = () => {
  const { setShowTutorial, setTutorialCompleted } = useGameStore();

  const handleClose = () => {
    setShowTutorial(false);
    setTutorialCompleted();
  };

  return (
    <div className={`${UI_CONSTANTS.CLASSES.MODAL_OVERLAY} z-${UI_CONSTANTS.Z_INDEX.MODAL} p-4`}>
      <div className="bg-gray-900 border border-teal-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-xl font-bold text-teal-300 mb-4">
          Welcome to Daemon Directorate
        </h2>
        <div className="mb-6 text-gray-300 space-y-3">
          <p>
            Congratulations on your promotion to{' '}
            <span className="text-teal-400 font-semibold">
              Middle Management
            </span>{' '}
            in the Infernal Corporate Hierarchy!
          </p>
          <p>
            Your job: Manage daemon operatives, conquer planets, and maintain
            your apartment HQ. Remember - all daemons have finite lifespans, and
            equipment degrades with use.
          </p>
          <p>
            Success is measured not by infinite growth, but by creating
            memorable daemon dynasties before inevitable{' '}
            <span className="text-red-400">corporate restructuring</span>.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 border border-teal-500 transition-colors font-semibold"
        >
          Begin Your Corporate Hell
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
