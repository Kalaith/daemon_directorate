// components/game/TeamManagement.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';
import { getLifespanColor, getProgressBarColor } from '../../utils/gameHelpers';
import { CORPORATE_BALANCE } from '../../constants/gameBalance';

const TeamManagement: React.FC = () => {
  const {
    daemons,
    recruitmentPool,
    recruitDaemon,
    refreshRecruitmentPool,
    canAfford,
    corporateTier,
    conductHRReview,
    isHRReviewAvailable,
  } = useGameStore();

  const activeDaemons = daemons.filter(d => d.isActive);

  // UI helper functions now imported from utils

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-header font-bold mb-6 text-daemon-text-bright uppercase tracking-wide">
          Active Daemon Operatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDaemons.map(daemon => (
            <Card
              key={daemon.id}
              className="bg-daemon-panel border-daemon-secondary hover:border-daemon-primary hover:shadow-infernal transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-header font-semibold text-daemon-text-bright text-lg">
                  {daemon.name}
                </h4>
                <span className="text-sm text-daemon-text-bright bg-daemon-secondary px-3 py-1 rounded-lg font-mono uppercase tracking-wide">
                  {daemon.specialization}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-daemon-text-muted uppercase tracking-wide font-mono">
                      Health
                    </span>
                    <span className="font-mono font-semibold text-daemon-text-bright">
                      {daemon.health}%
                    </span>
                  </div>
                  <div className="w-full bg-daemon-dark rounded-lg h-3 border border-daemon-secondary">
                    <div
                      className={`${getProgressBarColor(daemon.health, 'health')} h-full rounded-lg transition-all duration-200`}
                      style={{ width: `${daemon.health}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-daemon-text-muted uppercase tracking-wide font-mono">
                      Morale
                    </span>
                    <span className="font-mono font-semibold text-daemon-text-bright">
                      {daemon.morale}%
                    </span>
                  </div>
                  <div className="w-full bg-daemon-dark rounded-lg h-3 border border-daemon-secondary">
                    <div
                      className={`${getProgressBarColor(daemon.morale, 'morale')} h-full rounded-lg transition-all duration-200`}
                      style={{ width: `${daemon.morale}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-daemon-text-muted uppercase tracking-wide font-mono mr-2">
                    Lifespan:
                  </span>
                  <span
                    className={`font-mono font-semibold ${getLifespanColor(daemon.lifespanDays)}`}
                  >
                    {daemon.lifespanDays} days
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {daemon.quirks.map((quirk, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-daemon-surface border border-daemon-secondary text-xs rounded-lg text-daemon-text font-mono"
                    title={typeof quirk === 'object' ? quirk.description : ''}
                  >
                    {typeof quirk === 'object' ? quirk.name : quirk}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {corporateTier.level >=
                  CORPORATE_BALANCE.HR_REVIEW.MIN_TIER && (
                  <button
                    onClick={() => conductHRReview(daemon.id)}
                    disabled={!isHRReviewAvailable()}
                    className={`flex-1 px-4 py-3 text-daemon-text-bright font-mono text-sm rounded-lg uppercase tracking-wide transition-all duration-200 border ${
                      isHRReviewAvailable()
                        ? 'bg-daemon-warning border-daemon-warning hover:bg-daemon-warning/80 hover:shadow-gold'
                        : 'bg-daemon-surface border-daemon-text-dim text-daemon-text-dim cursor-not-allowed'
                    }`}
                    title={
                      isHRReviewAvailable()
                        ? 'Conduct Performance Review'
                        : `HR Reviews available every ${CORPORATE_BALANCE.HR_REVIEW.COOLDOWN_DAYS} days`
                    }
                  >
                    📊 Review
                  </button>
                )}
                <button className="flex-1 px-4 py-3 bg-daemon-surface border border-daemon-secondary text-daemon-text-bright font-mono text-sm rounded-lg uppercase tracking-wide hover:bg-daemon-primary hover:border-daemon-primary hover:shadow-infernal transition-all duration-200">
                  Equipment
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-header font-semibold mb-6 text-daemon-text-bright uppercase tracking-wide">
          Recruitment Department
        </h3>
        <p className="text-daemon-text mb-8 bg-daemon-surface p-6 rounded-lg border border-daemon-secondary">
          HR has identified suitable candidates for daemon operative positions.
          Background checks and soul assessments completed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {recruitmentPool.map(daemon => (
            <Card
              key={daemon.id}
              className="bg-daemon-panel border-daemon-secondary hover:border-daemon-primary hover:shadow-infernal transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-header font-semibold text-daemon-text-bright text-lg">
                  {daemon.name}
                </h4>
                <span className="text-sm text-daemon-text-bright bg-daemon-secondary px-3 py-1 rounded-lg font-mono uppercase tracking-wide">
                  {daemon.specialization}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-daemon-text-muted uppercase tracking-wide font-mono">
                      Health
                    </span>
                    <span className="font-mono font-semibold text-daemon-text-bright">
                      {daemon.health}%
                    </span>
                  </div>
                  <div className="w-full bg-daemon-dark rounded-lg h-3 border border-daemon-secondary">
                    <div
                      className={`${getProgressBarColor(daemon.health, 'health')} h-full rounded-lg transition-all duration-200`}
                      style={{ width: `${daemon.health}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-daemon-text-muted uppercase tracking-wide font-mono">
                      Morale
                    </span>
                    <span className="font-mono font-semibold text-daemon-text-bright">
                      {daemon.morale}%
                    </span>
                  </div>
                  <div className="w-full bg-daemon-dark rounded-lg h-3 border border-daemon-secondary">
                    <div
                      className={`${getProgressBarColor(daemon.morale, 'morale')} h-full rounded-lg transition-all duration-200`}
                      style={{ width: `${daemon.morale}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-daemon-text-muted uppercase tracking-wide font-mono mr-2">
                    Lifespan:
                  </span>
                  <span className="font-mono font-semibold text-daemon-text-bright">
                    {daemon.lifespanDays} days
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {daemon.quirks.map((quirk, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-daemon-surface border border-daemon-secondary text-xs rounded-lg text-daemon-text font-mono"
                    title={typeof quirk === 'object' ? quirk.description : ''}
                  >
                    {typeof quirk === 'object' ? quirk.name : quirk}
                  </span>
                ))}
              </div>

              <button
                onClick={() => recruitDaemon(daemon.id)}
                disabled={!canAfford(daemon.cost || 0)}
                className="w-full px-4 py-3 bg-daemon-primary text-daemon-text-bright font-mono rounded-lg hover:bg-daemon-primaryHover hover:shadow-infernal disabled:bg-daemon-surface disabled:text-daemon-text-dim disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wide border border-daemon-primary disabled:border-daemon-secondary"
              >
                Hire ({daemon.cost} Credits)
              </button>
            </Card>
          ))}
        </div>

        <button
          onClick={refreshRecruitmentPool}
          disabled={!canAfford(CORPORATE_BALANCE.RECRUITMENT_COST)}
          className="px-8 py-4 bg-daemon-secondary text-daemon-text-bright font-mono rounded-lg hover:bg-daemon-primary hover:shadow-infernal disabled:bg-daemon-surface disabled:text-daemon-text-dim disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wide font-semibold border border-daemon-secondary hover:border-daemon-primary disabled:border-daemon-text-dim"
        >
          Request New Candidates ({CORPORATE_BALANCE.RECRUITMENT_COST} Credits)
        </button>
      </div>
    </div>
  );
};

export default TeamManagement;
