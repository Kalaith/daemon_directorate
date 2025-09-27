// components/ui/MissionModal.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';

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
      <div className="bg-daemon-panel border border-daemon-primary rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-infernal">
        <h2 className="text-xl font-header font-bold text-daemon-text-bright mb-6 uppercase tracking-wide">
          Mission Assignment
        </h2>

        <div className="mb-8">
          <h3 className="font-header font-semibold text-daemon-text-bright mb-4 text-lg">
            Operation:{' '}
            <span className="text-daemon-primary font-mono">{planet.name}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-daemon-text bg-daemon-surface p-4 rounded-lg border border-daemon-secondary">
            <div>
              <span className="text-daemon-text-muted font-mono uppercase tracking-wide">
                Target:
              </span>{' '}
              <span className="text-daemon-text-bright font-mono font-semibold">
                {planet.type}
              </span>
            </div>
            <div>
              <span className="text-daemon-text-muted font-mono uppercase tracking-wide">
                Opposition:
              </span>{' '}
              <span className="text-daemon-text-bright font-mono font-semibold">
                {planet.resistance}
              </span>
            </div>
            <div>
              <span className="text-daemon-text-muted font-mono uppercase tracking-wide">
                Difficulty:
              </span>{' '}
              <span className="text-daemon-text-bright font-mono font-semibold">
                {planet.difficulty}
              </span>
            </div>
            <div>
              <span className="text-daemon-text-muted font-mono uppercase tracking-wide">
                Expected Rewards:
              </span>{' '}
              <span className="text-daemon-text-bright font-mono font-semibold">
                {planet.reward}
              </span>
            </div>
          </div>
          <p className="mt-4 text-daemon-text bg-daemon-surface p-4 rounded-lg border border-daemon-secondary">
            Select operatives for deployment. Mission success depends on team
            composition and equipment readiness.
          </p>
        </div>

        <div className="mb-8">
          <h4 className="font-header font-semibold text-daemon-text-bright mb-4 uppercase tracking-wide">
            Mission Type Selection:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-daemon-surface rounded-lg border border-daemon-secondary">
              <h5 className="font-semibold text-daemon-text-bright mb-2">Corporate Conquest</h5>
              <p className="text-sm text-daemon-text mb-2">Standard territorial acquisition operation</p>
              <p className="text-xs text-daemon-text-muted">Requirements: 2+ operatives</p>
            </div>
            
            <div className="p-4 bg-daemon-surface rounded-lg border border-daemon-secondary">
              <h5 className="font-semibold text-daemon-text-bright mb-2">Deep Cover Operations</h5>
              <p className="text-sm text-daemon-text mb-2">Long-term infiltration mission</p>
              <p className="text-xs text-daemon-text-muted">Requirements: Infiltration + Sabotage specialists</p>
            </div>
            
            <div className="p-4 bg-daemon-surface rounded-lg border border-daemon-secondary">
              <h5 className="font-semibold text-daemon-text-bright mb-2">Tactical Assault</h5>
              <p className="text-sm text-daemon-text mb-2">High-intensity combat operation</p>
              <p className="text-xs text-daemon-text-muted">Requirements: 3+ Combat specialists only</p>
            </div>
            
            <div className="p-4 bg-daemon-surface rounded-lg border border-daemon-secondary">
              <h5 className="font-semibold text-daemon-text-bright mb-2">Multi-Phase Restructuring</h5>
              <p className="text-sm text-daemon-text mb-2">Complex operation with multiple objectives</p>
              <p className="text-xs text-daemon-text-muted">Requirements: All 3 specialization types, 4+ operatives</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-header font-semibold text-daemon-text-bright mb-4 uppercase tracking-wide">
            Available Operatives:
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableDaemons.map(daemon => (
              <div
                key={daemon.id}
                onClick={() => toggleDaemonSelection(daemon.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedDaemons.has(daemon.id)
                    ? 'border-daemon-primary bg-daemon-primary/20 shadow-infernal'
                    : 'border-daemon-secondary hover:border-daemon-primary bg-daemon-surface'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDaemons.has(daemon.id)}
                    onChange={() => {}} // Handled by onClick
                    className="mr-4 accent-daemon-primary"
                  />
                  <div>
                    <div className="text-daemon-text-bright font-header font-semibold text-lg">
                      {daemon.name}{' '}
                      <span className="text-daemon-text-muted font-mono font-normal uppercase tracking-wide">
                        ({daemon.specialization})
                      </span>
                    </div>
                    <div className="text-sm font-mono mt-2 space-x-4">
                      <span
                        className={
                          daemon.health > 70
                            ? 'text-daemon-success'
                            : daemon.health > 40
                              ? 'text-daemon-warning'
                              : 'text-daemon-danger'
                        }
                      >
                        <span className="text-daemon-text-muted uppercase tracking-wide">
                          Health:
                        </span>{' '}
                        {daemon.health}%
                      </span>
                      <span
                        className={
                          daemon.morale > 70
                            ? 'text-daemon-success'
                            : daemon.morale > 40
                              ? 'text-daemon-warning'
                              : 'text-daemon-danger'
                        }
                      >
                        <span className="text-daemon-text-muted uppercase tracking-wide">
                          Morale:
                        </span>{' '}
                        {daemon.morale}%
                      </span>
                      <span className="text-daemon-text">
                        <span className="text-daemon-text-muted uppercase tracking-wide">
                          Lifespan:
                        </span>{' '}
                        {daemon.lifespanDays} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => executeMission()}
            disabled={selectedDaemons.size === 0}
            className="flex-1 px-6 py-4 bg-daemon-primary border border-daemon-primary text-daemon-text-bright font-mono rounded-lg uppercase tracking-wide hover:bg-daemon-primaryHover hover:shadow-infernal disabled:bg-daemon-surface disabled:border-daemon-text-dim disabled:text-daemon-text-dim disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            Deploy Team
          </button>
          <button
            onClick={() => setShowMissionModal(false)}
            className="px-6 py-4 bg-daemon-surface border border-daemon-secondary text-daemon-text-bright font-mono rounded-lg uppercase tracking-wide hover:bg-daemon-secondary hover:border-daemon-primary transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionModal;
