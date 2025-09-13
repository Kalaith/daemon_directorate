// components/game/Missions.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from '../ui/Card';

const Missions: React.FC = () => {
  const { planets, selectPlanetForMission } = useGameStore();

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-slate-900">
        Planetary Conquest Operations
      </h2>
      <p className="text-slate-600 mb-6 bg-cream-50 p-4 rounded border border-brown-600/10">
        Select target planets for corporate expansion. Mission success depends
        on team composition and equipment readiness.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planets.map(planet => (
          <Card
            key={planet.id}
            className="bg-cream-100 border-brown-600/12 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-slate-900">
                {planet.name}
              </h3>
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getDifficultyBadge(planet.difficulty)}`}
              >
                {planet.difficulty}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Type:</span>
                <span className="text-slate-900">{planet.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Resistance:</span>
                <span className="text-slate-900">{planet.resistance}</span>
              </div>
              {planet.conquered && (
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold text-sm rounded-full border border-teal-200">
                    ✓ CONQUERED
                  </span>
                </div>
              )}
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-sm text-slate-600 font-medium mb-1">
                Expected Rewards:
              </div>
              <div className="text-slate-900 font-semibold">
                {planet.reward}
              </div>
            </div>

            <button
              onClick={() => selectPlanetForMission(planet.id)}
              className={`w-full px-4 py-3 rounded font-semibold transition-colors ${
                planet.conquered
                  ? 'bg-orange-600 hover:bg-orange-700 text-cream-100'
                  : 'bg-teal-600 hover:bg-teal-700 text-cream-100'
              }`}
            >
              {planet.conquered ? 'Return Mission' : 'Deploy Team'}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Missions;
