// components/ui/MissionModal.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

const MissionModal: React.FC = () => {
  const {
    showMissionModal,
    currentPlanet,
    planets,
    daemons,
    selectedDaemons,
    toggleDaemonSelection,
    executeMission,
    setShowMissionModal,
  } = useGameStore();

  if (!showMissionModal || !currentPlanet) return null;

  const planet = planets.find(p => p.id === currentPlanet);
  if (!planet) return null;

  const availableDaemons = daemons.filter(d => d.isActive && d.health > 20);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-teal-500 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold text-teal-300 mb-4">
          Mission Assignment
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-200 mb-2">
            Operation: <span className="text-teal-400">{planet.name}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-teal-400 font-medium">Target:</span>{' '}
              {planet.type}
            </div>
            <div>
              <span className="text-teal-400 font-medium">Opposition:</span>{' '}
              {planet.resistance}
            </div>
            <div>
              <span className="text-teal-400 font-medium">Difficulty:</span>{' '}
              {planet.difficulty}
            </div>
            <div>
              <span className="text-teal-400 font-medium">
                Expected Rewards:
              </span>{' '}
              {planet.reward}
            </div>
          </div>
          <p className="mt-3 text-gray-400">
            Select operatives for deployment. Mission success depends on team
            composition and equipment readiness.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-200 mb-3">
            Available Operatives:
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableDaemons.map(daemon => (
              <div
                key={daemon.id}
                onClick={() => toggleDaemonSelection(daemon.id)}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedDaemons.has(daemon.id)
                    ? 'border-teal-500 bg-teal-900/30'
                    : 'border-gray-700 hover:border-teal-600 bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDaemons.has(daemon.id)}
                    onChange={() => {}} // Handled by onClick
                    className="mr-3 accent-teal-500"
                  />
                  <div>
                    <div className="text-teal-300 font-semibold">
                      {daemon.name}{' '}
                      <span className="text-gray-400 font-normal">
                        ({daemon.specialization})
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      <span
                        className={
                          daemon.health > 70
                            ? 'text-teal-400'
                            : daemon.health > 40
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }
                      >
                        Health: {daemon.health}%
                      </span>
                      {' | '}
                      <span
                        className={
                          daemon.morale > 70
                            ? 'text-teal-400'
                            : daemon.morale > 40
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }
                      >
                        Morale: {daemon.morale}%
                      </span>
                      {' | '}
                      <span className="text-gray-400">
                        Lifespan: {daemon.lifespanDays} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={executeMission}
            disabled={selectedDaemons.size === 0}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed border border-teal-500 transition-colors font-semibold"
          >
            Deploy Team
          </button>
          <button
            onClick={() => setShowMissionModal(false)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 border border-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionModal;
