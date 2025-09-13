import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from '../ui/Card';

export const CorporateRivals: React.FC = () => {
  const { corporateRivals, corporateTier } = useGameStore();

  const activerivals = corporateRivals.filter(rival => !rival.defeated);
  const defeatedRivals = corporateRivals.filter(rival => rival.defeated);

  const getThreatColor = (threat: string) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400'
    };
    return colors[threat as keyof typeof colors] || 'text-gray-400';
  };

  const getThreatIcon = (threat: string) => {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🔴'
    };
    return icons[threat as keyof typeof icons] || '⚪';
  };

  const canEngageRivals = corporateTier.level >= 4; // VP tier and above

  return (
    <Card className="bg-gradient-to-br from-orange-900 to-red-900">
      <h2 className="text-xl font-bold text-white mb-4">🏢 Corporate Rivals</h2>
      
      {!canEngageRivals ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-orange-300">Insufficient Corporate Authority</h3>
          <p className="text-gray-300">Reach Vice President tier to engage with rival corporations</p>
          <p className="text-sm text-gray-400 mt-2">Current tier: {corporateTier.name}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Rivals */}
          {activerivals.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">🎯 Active Threats</h3>
              <div className="space-y-3">
                {activerivals.map(rival => (
                  <div
                    key={rival.id}
                    className="p-4 rounded-lg border-2 border-red-500 bg-red-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🏢</div>
                        <div>
                          <h4 className="font-semibold text-white">{rival.name}</h4>
                          <p className="text-sm text-gray-300 mb-2">
                            Specialty: {rival.specialty}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <span>Threat Level:</span>
                              <span className={getThreatColor(rival.threat)}>
                                {getThreatIcon(rival.threat)} {rival.threat.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Strength:</span>
                              <span className="text-orange-300 ml-1">{rival.strength}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <button
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white text-sm rounded transition-colors"
                          disabled
                        >
                          Engage
                        </button>
                        <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
                      </div>
                    </div>

                    {/* Threat Assessment */}
                    <div className="mt-3 p-3 bg-gray-800 rounded">
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Threat Assessment:</h5>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            rival.threat === 'high' ? 'bg-red-500' :
                            rival.threat === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(rival.strength / 100) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Corporate Influence</span>
                        <span>{rival.strength}/100</span>
                      </div>
                    </div>

                    {/* Rivalry Effects */}
                    <div className="mt-3 p-3 bg-red-900/30 rounded">
                      <h5 className="text-sm font-medium text-red-300 mb-2">Market Pressure Effects:</h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>• -5% mission success rate due to corporate interference</li>
                        <li>• +10% equipment costs due to supply chain disruption</li>
                        <li>• Periodic hostile takeover attempts</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🕊️</div>
              <h3 className="text-lg font-semibold text-green-300">Market Dominance Achieved</h3>
              <p className="text-gray-300">No active corporate rivals detected</p>
            </div>
          )}

          {/* Defeated Rivals */}
          {defeatedRivals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">🏆 Conquered Corporations</h3>
              <div className="space-y-2">
                {defeatedRivals.map(rival => (
                  <div
                    key={rival.id}
                    className="p-3 rounded-lg border border-green-500 bg-green-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">💀</div>
                        <div>
                          <h4 className="font-semibold text-green-300">{rival.name}</h4>
                          <p className="text-sm text-gray-400">
                            Former {rival.specialty} specialists - Now absorbed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-green-600/30 text-green-300 rounded text-xs">
                          DEFEATED
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corporate Warfare Tips */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-orange-300 mb-2">📋 Corporate Warfare Guide</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Rival corporations apply market pressure effects to your operations</li>
              <li>• Higher tier unlocks direct engagement options</li>
              <li>• Defeating rivals grants corporate acquisition bonuses</li>
              <li>• Some endgame paths require defeating multiple rivals</li>
            </ul>
          </div>

          {/* Statistics */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-3">Market Position</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-red-300">{activerivals.length}</div>
                <div className="text-xs text-gray-400">Active Rivals</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-300">{defeatedRivals.length}</div>
                <div className="text-xs text-gray-400">Defeated</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-300">
                  {Math.round((defeatedRivals.length / corporateRivals.length) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Market Share</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
