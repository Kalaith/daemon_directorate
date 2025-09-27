import React, { useState } from 'react';
import { useCorporate } from '../../stores/composedStore';
import Card from '../ui/Card';
import type { CorporateRival } from '../../types/game';

export const CorporateRivals: React.FC = () => {
  const {
    corporateRivals,
    corporateTier,
    engageRival,
    calculateRivalSuccessChance,
    initializeRivals,
  } = useCorporate();
  
  const [selectedRival, setSelectedRival] = useState<string | null>(null);

  React.useEffect(() => {
    // Initialize rivals if none exist
    if (corporateRivals.length === 0 && initializeRivals) {
      console.log('Initializing rivals...');
      try {
        initializeRivals();
      } catch (error) {
        console.warn('Failed to initialize rivals:', error);
      }
    }
  }, [corporateRivals.length]); // Remove initializeRivals from deps to prevent infinite loop

  const activeRivals = (corporateRivals || []).filter(rival => !rival.defeated);
  const defeatedRivals = (corporateRivals || []).filter(rival => rival.defeated);

  const getThreatColor = (threat: string) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400',
    };
    return colors[threat as keyof typeof colors] || 'text-gray-400';
  };

  const getThreatIcon = (threat: string) => {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🔴',
    };
    return icons[threat as keyof typeof icons] || '⚪';
  };

  const getStrategyIcon = (strategyType: string) => {
    const icons: Record<string, string> = {
      aggressive_expansion: '⚔️',
      economic_dominance: '💰',
      shadow_operations: '🕵️',
      diplomatic_manipulation: '🤝',
      defensive_consolidation: '🛡️',
    };
    return icons[strategyType] || '📋';
  };

  const canEngageRivals = corporateTier.level >= 4; // VP tier and above

  const RivalDetailModal = ({ rival }: { rival: CorporateRival }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-gray-900 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{rival.name}</h3>
          <button
            onClick={() => setSelectedRival(null)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* AI Personality Analysis */}
          <div className="bg-gray-800 p-4 rounded">
            <h4 className="font-semibold text-blue-400 mb-3">AI Personality Profile</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-400">Aggression</div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div 
                    className="h-2 bg-red-500 rounded" 
                    style={{ width: `${rival.aiPersonality.aggression}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{rival.aiPersonality.aggression}/100</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Cunning</div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div 
                    className="h-2 bg-purple-500 rounded" 
                    style={{ width: `${rival.aiPersonality.cunning}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{rival.aiPersonality.cunning}/100</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Ambition</div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded" 
                    style={{ width: `${rival.aiPersonality.ambition}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{rival.aiPersonality.ambition}/100</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Adaptability</div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div 
                    className="h-2 bg-green-500 rounded" 
                    style={{ width: `${rival.aiPersonality.adaptability}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{rival.aiPersonality.adaptability}/100</div>
              </div>
            </div>
          </div>

          {/* Current Strategy */}
          <div className="bg-gray-800 p-4 rounded">
            <h4 className="font-semibold text-orange-400 mb-3">Current Strategy</h4>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{getStrategyIcon(rival.currentStrategy.type)}</span>
              <span className="text-white font-medium">
                {rival.currentStrategy.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Priority: {rival.currentStrategy.priority}/10 | Duration: {rival.currentStrategy.duration} days
            </div>
            <div className="text-sm text-gray-300">
              {rival.currentStrategy.targetPlayer && '🎯 Targeting player operations'}
            </div>
          </div>

          {/* Resources & Assets */}
          <div className="bg-gray-800 p-4 rounded">
            <h4 className="font-semibold text-green-400 mb-3">Corporate Assets</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-400">${rival.resources.credits}</div>
                <div className="text-xs text-gray-400">Credits</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">{rival.resources.influence}</div>
                <div className="text-xs text-gray-400">Influence</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">{rival.resources.intelligence}</div>
                <div className="text-xs text-gray-400">Intelligence</div>
              </div>
            </div>
          </div>

          {/* Active Operations */}
          <div className="bg-gray-800 p-4 rounded">
            <h4 className="font-semibold text-red-400 mb-3">Active Operations</h4>
            {rival.activeOperations.length > 0 ? (
              <div className="space-y-2">
                {rival.activeOperations.map((op, index) => (
                  <div key={index} className="bg-gray-700 p-2 rounded text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-medium">{op.type.replace('_', ' ')}</span>
                      <span className="text-gray-400">{op.duration}d</span>
                    </div>
                    <div className="text-gray-400 text-xs">Target: {op.targetId}</div>
                    <div className="text-xs mt-1">
                      Success Chance: <span className="text-yellow-400">{op.successChance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No active operations</div>
            )}
          </div>

          {/* Relationship Status */}
          <div className="bg-gray-800 p-4 rounded">
            <h4 className="font-semibold text-gray-300 mb-3">Relationship Status</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-700 rounded h-3">
                <div 
                  className={`h-3 rounded transition-all duration-300 ${
                    rival.relationshipWithPlayer > 0 
                      ? 'bg-green-500' 
                      : rival.relationshipWithPlayer < -25
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{ 
                    width: `${Math.abs(rival.relationshipWithPlayer)}%`,
                    marginLeft: rival.relationshipWithPlayer < 0 ? 'auto' : '0'
                  }}
                />
              </div>
              <span className={`text-sm font-medium ${
                rival.relationshipWithPlayer > 0 ? 'text-green-400' : 
                rival.relationshipWithPlayer < -25 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {rival.relationshipWithPlayer}/100
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-orange-900 to-red-900">
      <h2 className="text-xl font-bold text-white mb-4">🏢 Corporate Rivals</h2>

      {!canEngageRivals ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-orange-300">
            Insufficient Corporate Authority
          </h3>
          <p className="text-gray-300">
            Reach Vice President tier to engage with rival corporations
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Current tier: {corporateTier.name}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Rivals */}
          {activeRivals.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">
                🎯 Active Threats
              </h3>
              <div className="space-y-3">
                {activeRivals.map((rival: any) => (
                  <div
                    key={rival.id}
                    className="p-4 rounded-lg border-2 border-red-500 bg-red-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🏢</div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {rival.name}
                          </h4>
                          <p className="text-sm text-gray-300 mb-2">
                            Specialty: {rival.specialty}
                          </p>
                          
                          {/* Enhanced Info */}
                          <div className="flex items-center space-x-2 text-xs mb-2">
                            <span className="text-gray-400">Strategy:</span>
                            <span className="text-orange-300">
                              {getStrategyIcon(rival.currentStrategy?.type)} {rival.currentStrategy?.type?.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <span>Threat Level:</span>
                              <span className={getThreatColor(rival.threat)}>
                                {getThreatIcon(rival.threat)}{' '}
                                {rival.threat.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Strength:</span>
                              <span className="text-orange-300 ml-1">
                                {rival.strength}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Relationship:</span>
                              <span className={rival.relationshipWithPlayer > 0 ? 'text-green-400' : 'text-red-400'}>
                                {rival.relationshipWithPlayer}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <button
                          onClick={() => setSelectedRival(rival.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors mr-2"
                        >
                          Analyze
                        </button>
                        <button
                          onClick={() => engageRival(rival.id)}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white text-sm rounded transition-colors"
                        >
                          Engage
                        </button>
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.round(
                            calculateRivalSuccessChance(rival.id) * 100
                          )}
                          % success
                        </p>
                      </div>
                    </div>

                    {/* AI Status Display */}
                    <div className="mt-3 p-3 bg-gray-800 rounded">
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-red-400">Aggr:</span> {rival.aiPersonality?.aggression || 50}
                        </div>
                        <div>
                          <span className="text-purple-400">Cun:</span> {rival.aiPersonality?.cunning || 50}
                        </div>
                        <div>
                          <span className="text-yellow-400">Amb:</span> {rival.aiPersonality?.ambition || 50}
                        </div>
                        <div>
                          <span className="text-green-400">Adp:</span> {rival.aiPersonality?.adaptability || 50}
                        </div>
                      </div>
                    </div>

                    {/* Active Operations Preview */}
                    {rival.activeOperations?.length > 0 && (
                      <div className="mt-3 p-3 bg-red-900/30 rounded">
                        <h5 className="text-sm font-medium text-red-300 mb-2">
                          🚨 Active Operations: {rival.activeOperations.length}
                        </h5>
                        <div className="text-xs text-gray-300">
                          {rival.activeOperations.slice(0, 2).map((op: any, index: number) => (
                            <div key={index}>• {op.type.replace('_', ' ')} (Target: {op.targetId})</div>
                          ))}
                          {rival.activeOperations.length > 2 && (
                            <div className="text-gray-400">... and {rival.activeOperations.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Market Pressure Effects */}
                    <div className="mt-3 p-3 bg-red-900/30 rounded">
                      <h5 className="text-sm font-medium text-red-300 mb-2">
                        Market Pressure Effects:
                      </h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>
                          • -{rival.strength / 20}% mission success rate due to corporate interference
                        </li>
                        <li>
                          • +{rival.strength / 10}% equipment costs due to supply chain disruption
                        </li>
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
              <h3 className="text-lg font-semibold text-green-300">
                Market Dominance Achieved
              </h3>
              <p className="text-gray-300">
                No active corporate rivals detected
              </p>
            </div>
          )}

          {/* Defeated Rivals */}
          {defeatedRivals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                🏆 Conquered Corporations
              </h3>
              <div className="space-y-2">
                {defeatedRivals.map((rival: any) => (
                  <div
                    key={rival.id}
                    className="p-3 rounded-lg border border-green-500 bg-green-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">💀</div>
                        <div>
                          <h4 className="font-semibold text-green-300">
                            {rival.name}
                          </h4>
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

          {/* Statistics */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-3">
              Market Position
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-red-300">
                  {activeRivals.length}
                </div>
                <div className="text-xs text-gray-400">Active Rivals</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-300">
                  {defeatedRivals.length}
                </div>
                <div className="text-xs text-gray-400">Defeated</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-300">
                  {Math.round(
                    (defeatedRivals.length / (corporateRivals.length || 1)) * 100
                  )}
                  %
                </div>
                <div className="text-xs text-gray-400">Market Share</div>
              </div>
            </div>
          </div>

          {/* Corporate Warfare Tips */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-orange-300 mb-2">
              📋 Corporate Warfare Guide
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>
                • Rival corporations have dynamic AI that adapts to your actions
              </li>
              <li>• Each rival has unique personality traits affecting their behavior</li>
              <li>• Monitor their active operations to anticipate threats</li>
              <li>• Building positive relationships can reduce hostile activities</li>
              <li>• Defeating rivals grants significant corporate acquisition bonuses</li>
            </ul>
          </div>
        </div>
      )}

      {/* Rival Detail Modal */}
      {selectedRival && (
        <RivalDetailModal 
          rival={corporateRivals.find(r => r.id === selectedRival)!} 
        />
      )}
    </Card>
  );
};

export default CorporateRivals;
