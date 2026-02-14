// components/ui/Tutorial.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';

const Tutorial: React.FC = () => {
  const { setShowTutorial, setTutorialCompleted } = useGameStore();

  const handleClose = () => {
    setShowTutorial(false);
    setTutorialCompleted();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-daemon-panel border-2 border-daemon-gold rounded-lg p-8 max-w-md w-full mx-4 shadow-gold-lg">
        <div className="flex items-center mb-6">
          <span className="text-daemon-gold text-sm font-semibold uppercase tracking-wider mr-2">
            Executive
          </span>
          <h2 className="font-header text-xl font-bold text-daemon-text-bright uppercase tracking-wide">
            Welcome to Daemon Directorate
          </h2>
        </div>
        <div className="mb-8 text-daemon-text space-y-4">
          <p>
            Congratulations on your promotion to{' '}
            <span className="text-daemon-gold font-semibold font-header">Middle Management</span> in
            the Infernal Corporate Hierarchy!
          </p>
          <p>
            Your job: Manage daemon operatives, conquer planets, and maintain your apartment HQ.
            Remember - all daemons have finite lifespans, and equipment degrades with use.
          </p>
          <p>
            Success is measured not by infinite growth, but by creating memorable daemon dynasties
            before inevitable{' '}
            <span className="text-daemon-danger font-semibold">corporate restructuring</span>.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="w-full px-6 py-4 bg-daemon-primary border border-daemon-primary text-daemon-text-bright rounded-lg hover:bg-daemon-primaryHover hover:shadow-infernal transition-all duration-200 font-mono font-semibold uppercase tracking-wide"
        >
          Begin Your Corporate Hell
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
