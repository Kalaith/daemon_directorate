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
      <div className="bg-daemon-panel border border-daemon-danger rounded-lg p-8 max-w-md w-full mx-4 shadow-lg shadow-daemon-danger/20">
        <h2 className="text-xl font-header font-bold text-daemon-text-bright mb-6 uppercase tracking-wide text-center">In Memoriam</h2>
        <div className="mb-8">
          <div className="text-xl font-header font-bold text-daemon-text-bright mb-4 text-center">
            {memorialDaemon.name}
          </div>
          <p className="italic text-daemon-text-muted mb-6 text-center bg-daemon-surface p-4 rounded-lg border border-daemon-secondary">
            "A dedicated servant of the Corporate Hierarchy"
          </p>

          <div>
            <h4 className="font-header font-semibold text-daemon-text-bright mb-4 uppercase tracking-wide">
              Service Record:
            </h4>
            <div className="text-daemon-text space-y-2 font-mono">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-daemon-primary mr-2">•</span>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-daemon-surface border border-daemon-secondary rounded-lg">
            <span className="text-daemon-text-bright font-header font-semibold uppercase tracking-wide">
              Corporate Legacy:
            </span>
            <span className="text-daemon-text font-mono ml-2">
              Their dedication to bureaucratic excellence will be remembered in
              the employee handbook.
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowMemorial(false)}
          className="w-full px-6 py-4 bg-daemon-danger border border-daemon-danger text-daemon-text-bright font-mono rounded-lg uppercase tracking-wide hover:bg-daemon-danger/80 hover:shadow-lg transition-all duration-200 font-semibold"
        >
          Honor Their Service
        </button>
      </div>
    </div>
  );
};

export default MemorialModal;
