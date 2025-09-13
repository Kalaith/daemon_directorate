import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CORPORATE_TIERS } from '../../constants/gameData';
import Card from '../ui/Card';
import type { CorporateTier } from '../../types/game';

export const CorporateLadder: React.FC = () => {
  const { 
    corporateTier, 
    planets, 
    daysPassed, 
    legacyBook, 
    corporateRivals, 
    promotionProgress, 
    meetsRequirements 
  } = useGameStore();

  const currentTierIndex = CORPORATE_TIERS.findIndex(tier => tier.id === corporateTier.id);
  const nextTier = CORPORATE_TIERS[currentTierIndex + 1];

  const getRequirementStatus = (requirements: CorporateTier['requirements']) => {
    const conqueredPlanets = planets.filter(p => p.conquered).length;
    const maxGeneration = Math.max(0, ...Object.values(legacyBook).map(l => l.generation));
    const defeatedRivals = corporateRivals.filter(r => r.defeated).length;
    const completedHRReviews = promotionProgress.hrReviews || 0;
    const complianceAudits = promotionProgress.complianceAudits || 0;

    return {
      planetsControlled: {
        current: conqueredPlanets,
        required: requirements.planetsControlled || 0,
        met: !requirements.planetsControlled || conqueredPlanets >= requirements.planetsControlled
      },
      daysLived: {
        current: daysPassed,
        required: requirements.daysLived || 0,
        met: !requirements.daysLived || daysPassed >= requirements.daysLived
      },
      legacyGenerations: {
        current: maxGeneration,
        required: requirements.legacyGenerations || 0,
        met: !requirements.legacyGenerations || maxGeneration >= requirements.legacyGenerations
      },
      defeatedRivals: {
        current: defeatedRivals,
        required: requirements.defeatedRivals || 0,
        met: !requirements.defeatedRivals || defeatedRivals >= requirements.defeatedRivals
      },
      completedHRReviews: {
        current: completedHRReviews,
        required: requirements.completedHRReviews || 0,
        met: !requirements.completedHRReviews || completedHRReviews >= requirements.completedHRReviews
      },
      complianceAudits: {
        current: complianceAudits,
        required: requirements.complianceAudits || 0,
        met: !requirements.complianceAudits || complianceAudits >= requirements.complianceAudits
      }
    };
  };

  const getTierIcon = (level: number) => {
    const icons = ['👔', '📊', '🏢', '🌟', '👑'];
    return icons[level - 1] || '👔';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-indigo-900">
      <h2 className="text-xl font-bold text-white mb-4">Corporate Ladder</h2>
      <div className="space-y-4">
        {/* Current Tier */}
        <div className="text-center p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
          <div className="text-3xl mb-2">{getTierIcon(corporateTier.level)}</div>
          <h3 className="text-xl font-bold text-white">{corporateTier.name}</h3>
          <p className="text-yellow-100 text-sm">Level {corporateTier.level}</p>
        </div>

        {/* Tier Progression */}
        <div className="space-y-2">
          {CORPORATE_TIERS.map((tier, index) => {
            const isCurrentTier = tier.id === corporateTier.id;
            const isUnlocked = index <= currentTierIndex;
            const isNextTier = index === currentTierIndex + 1;

            return (
              <div
                key={tier.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isCurrentTier
                    ? 'border-yellow-500 bg-yellow-500/20'
                    : isUnlocked
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 bg-gray-700/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTierIcon(tier.level)}</span>
                    <div>
                      <h4 className={`font-semibold ${isCurrentTier ? 'text-yellow-300' : isUnlocked ? 'text-green-300' : 'text-gray-400'}`}>
                        {tier.name}
                      </h4>
                      <p className="text-sm text-gray-400">Level {tier.level}</p>
                    </div>
                  </div>
                  {isCurrentTier && <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs">CURRENT</span>}
                  {isUnlocked && !isCurrentTier && <span className="px-2 py-1 bg-green-600 text-green-100 rounded text-xs">UNLOCKED</span>}
                </div>

                {/* Show unlocks for current and next tier */}
                {(isCurrentTier || isNextTier) && tier.unlocks && (
                  <div className="mt-3 space-y-2">
                    {tier.unlocks.mechanics && (
                      <div>
                        <p className="text-sm font-medium text-blue-300">Mechanics:</p>
                        <p className="text-xs text-gray-300">{tier.unlocks.mechanics.join(', ')}</p>
                      </div>
                    )}
                    {tier.unlocks.resources && (
                      <div>
                        <p className="text-sm font-medium text-green-300">Resources:</p>
                        <p className="text-xs text-gray-300">{tier.unlocks.resources.join(', ')}</p>
                      </div>
                    )}
                    {tier.unlocks.apartmentRooms && (
                      <div>
                        <p className="text-sm font-medium text-purple-300">Rooms:</p>
                        <p className="text-xs text-gray-300">{tier.unlocks.apartmentRooms.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Promotion Requirements */}
        {nextTier && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-orange-300 mb-3">
              Promotion to {nextTier.name} Requirements:
            </h4>
            <div className="space-y-2">
              {Object.entries(getRequirementStatus(nextTier.requirements)).map(([key, status]) => {
                if (status.required === 0) return null;
                
                return (
                  <div key={key} className={`flex justify-between items-center p-2 rounded ${status.met ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-sm font-mono">
                      {status.current} / {status.required}
                      {status.met ? ' ✓' : ' ✗'}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {meetsRequirements(nextTier.requirements) && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-center">
                <p className="text-white font-semibold">🎉 Ready for Promotion! 🎉</p>
                <p className="text-green-100 text-sm">Requirements will be checked automatically</p>
              </div>
            )}
          </div>
        )}

        {/* Max Level Reached */}
        {!nextTier && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-center">
            <h4 className="font-bold text-white text-lg">👑 Maximum Tier Achieved! 👑</h4>
            <p className="text-purple-100 text-sm">You have reached the pinnacle of corporate power</p>
          </div>
        )}
      </div>
    </Card>
  );
};
