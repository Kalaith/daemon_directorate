import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import { ENDING_SCENARIOS } from '../../constants/gameData';

export const EndgameModal: React.FC = () => {
  const { endgameState, performCorporateRestructuring } = useGameStore();

  if (!endgameState.endingAchieved) return null;

  const ending =
    ENDING_SCENARIOS[
      endgameState.managementStyle as keyof typeof ENDING_SCENARIOS
    ];
  if (!ending) return null;

  const getEndingIcon = (style: string) => {
    const icons = {
      profit: '💰',
      cult: '👑',
      compliance: '📋',
      collapse: '💥',
    };
    return icons[style as keyof typeof icons] || '🏢';
  };

  const getEndingColor = (style: string) => {
    const colors = {
      profit: 'from-green-600 to-emerald-600',
      cult: 'from-purple-600 to-indigo-600',
      compliance: 'from-blue-600 to-cyan-600',
      collapse: 'from-red-600 to-orange-600',
    };
    return colors[style as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center z-50">
      <div className="bg-surface rounded-lg p-8 w-11/12 max-w-2xl max-h-96 overflow-y-auto border border-border">
        <div
          className={`text-center p-8 rounded-lg bg-gradient-to-br ${getEndingColor(endgameState.managementStyle)} text-white mb-6`}
        >
          <div className="text-6xl mb-4">
            {getEndingIcon(endgameState.managementStyle)}
          </div>
          <h1 className="text-3xl font-bold mb-2">{ending.title}</h1>
          <p className="text-xl opacity-90 mb-4">{ending.description}</p>
          <div className="text-sm opacity-75">
            Prestige Level: {endgameState.prestigeLevel + 1}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-yellow-300 mb-3">
              🎉 Unlocked Content:
            </h3>
            {ending.unlocks.length > 0 ? (
              <ul className="text-sm text-gray-300 space-y-1">
                {ending.unlocks.map((unlock: string, index: number) => (
                  <li key={index}>
                    •{' '}
                    {unlock
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">
                No additional content unlocked
              </p>
            )}
          </div>

          {endgameState.permanentBonuses.length > 0 && (
            <div className="p-4 bg-purple-900/30 rounded-lg">
              <h3 className="font-semibold text-purple-300 mb-3">
                ⭐ Prestige Bonuses:
              </h3>
              <div className="space-y-2">
                {endgameState.permanentBonuses.map(bonus => (
                  <div key={bonus.id} className="p-2 bg-purple-800/30 rounded">
                    <h4 className="font-medium text-purple-200">
                      {bonus.name}
                    </h4>
                    <p className="text-xs text-purple-300">
                      {bonus.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={performCorporateRestructuring}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-colors font-semibold"
          >
            🔄 Corporate Restructuring
            <div className="text-sm opacity-90 mt-1">
              Start new game with bonuses
            </div>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            🏃 Quit to Menu
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-300">
            Thank you for playing Daemon Directorate! Your corporate legacy will
            live on in infernal history.
          </p>
        </div>
      </div>
    </div>
  );
};
