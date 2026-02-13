import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import { corporateTiers } from '../../constants/gameData';
import Card from '../ui/Card';
import type { CorporateTier } from '../../types/game';
import {
  CorporateProgressionService,
  type ProgressionRequirements,
} from '../../services/CorporateProgressionService';

export const CorporateLadder: React.FC = () => {
  const {
    corporateTier,
    planets,
    daysPassed,
    legacyBook,
    corporateRivals,
    promotionProgress,
    meetsRequirements,
  } = useGameStore();

  const currentTierIndex = corporateTiers.findIndex(
    tier => tier.id === corporateTier.id
  );
  const nextTier = corporateTiers[currentTierIndex + 1];

  const getRequirementStatus = (
    requirements: CorporateTier['requirements']
  ): ProgressionRequirements => {
    return CorporateProgressionService.calculateRequirementStatus(
      requirements,
      planets,
      daysPassed,
      legacyBook,
      corporateRivals,
      promotionProgress
    );
  };

  const getTierIcon = (level: number) => {
    return CorporateProgressionService.getTierIcon(level);
  };

  return (
    <Card className="bg-daemon-panel border-2 border-daemon-gold shadow-gold">
      <div className="flex items-center mb-6">
        <span className="text-daemon-gold text-sm font-semibold uppercase tracking-wider mr-2">
          Executive
        </span>
        <h2 className="font-header text-xl font-bold text-daemon-text-bright uppercase tracking-wide">
          Corporate Ladder
        </h2>
      </div>
      <div className="space-y-4">
        {/* Current Tier */}
        <div className="text-center p-6 bg-daemon-surface border-2 border-daemon-gold rounded-lg shadow-gold">
          <div className="text-3xl mb-2 text-daemon-gold">
            {getTierIcon(corporateTier.level)}
          </div>
          <h3 className="text-xl font-header font-bold text-daemon-text-bright">
            {corporateTier.name}
          </h3>
          <p className="text-daemon-text-muted text-sm font-mono uppercase tracking-wide">
            Level {corporateTier.level}
          </p>
        </div>

        {/* Tier Progression */}
        <div className="space-y-2">
          {corporateTiers.map((tier, index) => {
            const isCurrentTier = tier.id === corporateTier.id;
            const isUnlocked = index <= currentTierIndex;
            const isNextTier = index === currentTierIndex + 1;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isCurrentTier
                    ? 'border-daemon-gold bg-daemon-gold/20 shadow-gold'
                    : isUnlocked
                      ? 'border-daemon-success bg-daemon-success/20'
                      : 'border-daemon-secondary bg-daemon-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTierIcon(tier.level)}</span>
                    <div>
                      <h4
                        className={`font-header font-semibold ${
                          isCurrentTier
                            ? 'text-daemon-gold'
                            : isUnlocked
                              ? 'text-daemon-success'
                              : 'text-daemon-text-muted'
                        }`}
                      >
                        {tier.name}
                      </h4>
                      <p className="text-sm text-daemon-text-muted font-mono uppercase tracking-wide">
                        Level {tier.level}
                      </p>
                    </div>
                  </div>
                  {isCurrentTier && (
                    <span className="px-3 py-1 bg-daemon-gold text-black font-mono font-semibold rounded uppercase tracking-wide text-xs">
                      CURRENT
                    </span>
                  )}
                  {isUnlocked && !isCurrentTier && (
                    <span className="px-3 py-1 bg-daemon-success text-daemon-text-bright font-mono font-semibold rounded uppercase tracking-wide text-xs">
                      UNLOCKED
                    </span>
                  )}
                </div>

                {/* Show unlocks for current and next tier */}
                {(isCurrentTier || isNextTier) && tier.unlocks && (
                  <div className="mt-3 space-y-2">
                    {tier.unlocks.mechanics && (
                      <div>
                        <p className="text-sm font-medium text-daemon-info font-mono uppercase tracking-wide">
                          Mechanics:
                        </p>
                        <p className="text-xs text-daemon-text font-mono">
                          {tier.unlocks.mechanics.join(', ')}
                        </p>
                      </div>
                    )}
                    {tier.unlocks.resources && (
                      <div>
                        <p className="text-sm font-medium text-daemon-success font-mono uppercase tracking-wide">
                          Resources:
                        </p>
                        <p className="text-xs text-daemon-text font-mono">
                          {tier.unlocks.resources.join(', ')}
                        </p>
                      </div>
                    )}
                    {tier.unlocks.apartmentRooms && (
                      <div>
                        <p className="text-sm font-medium text-daemon-silver font-mono uppercase tracking-wide">
                          Rooms:
                        </p>
                        <p className="text-xs text-daemon-text font-mono">
                          {tier.unlocks.apartmentRooms.join(', ')}
                        </p>
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
          <div className="mt-6 p-6 bg-daemon-surface border border-daemon-secondary rounded-lg">
            <h4 className="font-header font-semibold text-daemon-warning mb-4 uppercase tracking-wide">
              Promotion to {nextTier.name} Requirements:
            </h4>
            <div className="space-y-2">
              {Object.entries(getRequirementStatus(nextTier.requirements)).map(
                ([key, status]) => {
                  if (status.required === 0) return null;

                  return (
                    <div
                      key={key}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        status.met
                          ? 'bg-daemon-success/20 border-daemon-success text-daemon-success'
                          : 'bg-daemon-danger/20 border-daemon-danger text-daemon-danger'
                      }`}
                    >
                      <span className="text-sm font-mono uppercase tracking-wide">
                        {CorporateProgressionService.formatRequirementKey(key)}:
                      </span>
                      <span className="text-sm font-mono font-semibold">
                        {status.current} / {status.required}
                        {status.met ? ' ✓' : ' ✗'}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {meetsRequirements(nextTier.requirements) && (
              <div className="mt-4 p-4 bg-daemon-success/20 border-2 border-daemon-success rounded-lg text-center shadow-gold">
                <p className="text-daemon-text-bright font-header font-bold uppercase tracking-wide">
                  🎉 Ready for Promotion! 🎉
                </p>
                <p className="text-daemon-success text-sm font-mono mt-1">
                  Requirements will be checked automatically
                </p>
              </div>
            )}
          </div>
        )}

        {/* Max Level Reached */}
        {!nextTier && (
          <div className="mt-6 p-6 bg-daemon-gold/20 border-2 border-daemon-gold rounded-lg text-center shadow-gold-lg">
            <h4 className="font-header font-bold text-daemon-text-bright text-lg uppercase tracking-wide">
              👑 Maximum Tier Achieved! 👑
            </h4>
            <p className="text-daemon-gold text-sm font-mono mt-2">
              You have reached the pinnacle of corporate power
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
