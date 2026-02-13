// components/game/Missions.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';

const Missions: React.FC = () => {
  const { planets, selectPlanetForMission } = useGameStore();

  return (
    <div>
      <h2 className="text-2xl font-header font-bold mb-6 text-daemon-text-bright uppercase tracking-wide">
        Planetary Conquest Operations
      </h2>
      <p className="text-daemon-text mb-8 bg-daemon-surface p-6 rounded-lg border border-daemon-secondary">
        Select target planets for corporate expansion. Mission success depends
        on team composition and equipment readiness.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planets.map(planet => (
          <div
            key={planet.id}
            className="bg-daemon-panel border border-daemon-secondary hover:border-daemon-primary hover:shadow-lg transition-all duration-200 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-header font-bold text-xl text-daemon-text-bright">
                {planet.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wide ${
                  planet.difficulty === 'Easy'
                    ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                    : planet.difficulty === 'Medium'
                      ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30'
                      : 'bg-red-900/50 text-red-400 border border-red-500/30'
                }`}
              >
                {planet.difficulty}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-daemon-text-muted font-mono uppercase tracking-wide text-sm">
                  Type:
                </span>
                <span className="text-daemon-text-bright font-mono font-semibold">
                  {planet.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-daemon-text-muted font-mono uppercase tracking-wide text-sm">
                  Resistance:
                </span>
                <span className="text-daemon-text-bright font-mono font-semibold">
                  {planet.resistance}
                </span>
              </div>
              {planet.conquered && (
                <div className="flex justify-center">
                  <span className="px-4 py-2 bg-daemon-success/20 border border-daemon-success text-daemon-text-bright font-mono font-bold text-sm rounded-lg">
                    ✓ CONQUERED
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6 p-4 bg-daemon-surface rounded-lg border border-daemon-secondary">
              <div className="text-sm text-daemon-text-muted font-mono uppercase tracking-wide mb-2">
                Expected Rewards:
              </div>
              <div className="text-daemon-text-bright font-mono font-semibold">
                {planet.reward}
              </div>
            </div>

            <button
              onClick={() => selectPlanetForMission(planet.id)}
              className={`w-full px-4 py-3 rounded-lg font-mono font-semibold uppercase tracking-wide transition-all duration-200 border ${
                planet.conquered
                  ? 'bg-daemon-warning/20 border-daemon-warning text-daemon-text-bright hover:bg-daemon-warning/30'
                  : 'bg-daemon-primary border-daemon-primary text-daemon-text-bright hover:bg-daemon-primaryHover hover:shadow-lg'
              }`}
            >
              {planet.conquered ? 'Return Mission' : 'Deploy Team'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Missions;
