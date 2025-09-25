// components/ui/MemorialModal.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import { DAEMON_BALANCE } from '../../constants/gameBalance';

const MemorialModal: React.FC = () => {
  const { showMemorial, memorialDaemon, setShowMemorial } = useGameStore();

  if (!showMemorial || !memorialDaemon) return null;

  const achievements = [
    `Completed ${Math.floor(Math.random() * DAEMON_BALANCE.MAX_MISSION_DISPLAY) + 1} successful missions`,
    `Maintained ${memorialDaemon.morale > DAEMON_BALANCE.MORALE_THRESHOLDS.GOOD ? 'excellent' : memorialDaemon.morale > DAEMON_BALANCE.MORALE_THRESHOLDS.WARNING ? 'adequate' : 'poor'} workplace morale`,
    `Specialized in ${memorialDaemon.specialization} operations`,
    `Known for: ${memorialDaemon.quirks.join(', ')}`,
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-red-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-xl font-bold text-red-400 mb-4">In Memoriam</h2>
        <div className="mb-6">
          <div className="text-lg font-semibold text-teal-300 mb-2">
            {memorialDaemon.name}
          </div>
          <p className="italic text-gray-400 mb-4">
            "A dedicated servant of the Corporate Hierarchy"
          </p>

          <div>
            <h4 className="font-semibold text-gray-300 mb-2">
              Service Record:
            </h4>
            <div className="text-gray-400 space-y-1">
              {achievements.map((achievement, index) => (
                <div key={index}>• {achievement}</div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded">
            <span className="text-teal-400 font-semibold">
              Corporate Legacy:
            </span>
            <span className="text-gray-300">
              {' '}
              Their dedication to bureaucratic excellence will be remembered in
              the employee handbook.
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowMemorial(false)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 border border-red-500 transition-colors font-semibold"
        >
          Honor Their Service
        </button>
      </div>
    </div>
  );
};

export default MemorialModal;
