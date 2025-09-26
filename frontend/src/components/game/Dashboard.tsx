// components/game/Dashboard.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';
import { CorporateLadder } from './CorporateLadder';
import { ComplianceCenter } from './ComplianceCenter';
import { HallOfInfamy } from './HallOfInfamy';
import { CorporateRivals } from './CorporateRivals';
import { getTierIcon } from '../../utils/gameHelpers';
import { DashboardService } from '../../services/DashboardService';

const Dashboard: React.FC = () => {
  const {
    activeMission,
    daemons,
    daysPassed,
    legacyBook,
    hallOfInfamy
  } = useGameStore();

  const dashboardStats = useMemo(() =>
    DashboardService.calculateDashboardStats(
      daemons || [],
      [], // corporateEvents - not yet implemented
      [], // complianceTasks - not yet implemented
      daysPassed || 0,
      legacyBook || {},
      hallOfInfamy || []
    ), [daemons, daysPassed, legacyBook, hallOfInfamy]
  );

  const {
    activeDaemons,
    avgHealth,
    avgMorale,
    criticalLifespans,
    latestEvent,
    activeComplianceTasks,
    overdueComplianceTasks,
    totalBloodlines,
    recentStories,
  } = dashboardStats;

  // UI helper function now imported from utils

  return (
    <div className="space-y-6">
      {/* Corporate Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-daemon-panel border-2 border-daemon-gold shadow-gold">
          <div className="text-center">
            <span className="text-daemon-gold text-sm font-semibold uppercase tracking-wider mr-2">
              Executive
            </span>
            <div className="text-3xl mb-2 text-daemon-gold">{getTierIcon(1)}</div>
            <h3 className="font-header text-daemon-text-bright font-bold">Middle Management</h3>
            <p className="text-sm text-daemon-text-muted">Corporate Tier 1</p>
          </div>
        </Card>

        <Card className="bg-daemon-panel border border-daemon-secondary">
          <div className="text-center">
            <div className="text-2xl font-mono text-daemon-text-bright font-bold">{daysPassed}</div>
            <p className="text-sm text-daemon-text-muted uppercase tracking-wide">Days in Operation</p>
            <div className="text-xs text-daemon-text-dim mt-1">
              Corporate Survival Record
            </div>
          </div>
        </Card>

        <Card className="bg-daemon-panel border border-daemon-secondary">
          <div className="text-center">
            <div className="text-2xl font-mono text-daemon-text-bright font-bold">{activeComplianceTasks.length}</div>
            <p className="text-sm text-daemon-text-muted uppercase tracking-wide">Active Tasks</p>
            <div className="text-xs text-daemon-text-dim mt-1">
              {DashboardService.getComplianceStatusText(overdueComplianceTasks.length)}
            </div>
          </div>
        </Card>

        <Card className="bg-daemon-panel border border-daemon-secondary">
          <div className="text-center">
            <div className="text-2xl font-mono text-daemon-silver font-bold">{totalBloodlines}</div>
            <p className="text-sm text-daemon-text-muted uppercase tracking-wide">Bloodlines</p>
            <div className="text-xs text-daemon-text-dim mt-1">
              Legacy Dynasties
            </div>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Mission Status */}
        <Card className="bg-daemon-panel border-l-4 border-l-daemon-primary">
          <h3 className="font-header text-lg text-daemon-text-bright mb-4">
            Mission Status
          </h3>
          <div className="text-sm mb-4">
            {activeMission ? (
              <div className="bg-daemon-warning/20 border border-daemon-warning text-daemon-warning px-3 py-2 rounded">
                <span className="font-semibold uppercase tracking-wide">Mission in Progress:</span> Active deployment detected
              </div>
            ) : (
              <div className="bg-daemon-success/20 border border-daemon-success text-daemon-success px-3 py-2 rounded">
                No active missions
              </div>
            )}
          </div>
          <div className="bg-daemon-surface border border-daemon-secondary rounded p-3 text-sm text-daemon-text">
            <strong className="text-daemon-text-bright uppercase tracking-wide">MEMO:</strong> Productivity metrics
            indicate room for improvement. Please optimize daemon utilization for
            maximum corporate synergy.
          </div>
        </Card>

        {/* Team Overview */}
        <Card className="bg-daemon-panel border border-daemon-secondary">
          <h3 className="font-header text-lg text-daemon-text-bright mb-4">
            Team Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-daemon-text-muted font-medium uppercase tracking-wide text-xs">
                Active Operatives:
              </span>
              <span className="text-daemon-text-bright font-mono font-bold">
                {activeDaemons.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-daemon-text-muted font-medium uppercase tracking-wide text-xs">Average Health:</span>
              <span
                className={`font-mono font-bold ${avgHealth < 30 ? 'text-daemon-danger' : avgHealth < 70 ? 'text-daemon-warning' : 'text-daemon-success'}`}
              >
                {avgHealth}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-daemon-text-muted font-medium uppercase tracking-wide text-xs">Average Morale:</span>
              <span
                className={`font-mono font-bold ${avgMorale < 30 ? 'text-daemon-danger' : avgMorale < 70 ? 'text-daemon-warning' : 'text-daemon-success'}`}
              >
                {avgMorale}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-daemon-text-muted font-medium uppercase tracking-wide text-xs">
                Critical Lifespans:
              </span>
              <span
                className={`font-mono font-bold ${criticalLifespans > 0 ? 'text-daemon-danger' : 'text-daemon-success'}`}
              >
                {criticalLifespans}
              </span>
            </div>
          </div>
        </Card>

        {/* Corporate Events */}
        <Card className="bg-daemon-panel border border-daemon-secondary">
          <h3 className="font-header text-lg text-daemon-text-bright mb-4">
            Corporate Events
          </h3>
          <div className="text-sm mb-4">
            {latestEvent ? (
              <div className="bg-daemon-danger/20 border border-daemon-danger rounded p-3">
                <div className="font-semibold text-daemon-danger uppercase tracking-wide">
                  {latestEvent.title}
                </div>
                <div className="text-daemon-text mt-1">{latestEvent.description}</div>
              </div>
            ) : (
              <div className="text-daemon-text-muted">
                All systems nominal. Await further directives.
              </div>
            )}
          </div>
          <button
            onClick={() => console.log('Event processing not yet implemented')}
            className="w-full px-4 py-2 border-2 border-daemon-secondary text-daemon-text-muted rounded font-semibold uppercase tracking-wide text-sm transition-colors cursor-not-allowed"
            disabled
          >
            Process Pending Events (Coming Soon)
          </button>
        </Card>
      </div>

      {/* Recent Legacy Stories */}
      {recentStories.length > 0 && (
        <Card className="bg-daemon-panel border-2 border-daemon-gold shadow-gold-lg">
          <div className="flex items-center mb-4">
            <span className="text-daemon-gold text-sm font-semibold uppercase tracking-wider mr-2">
              Executive
            </span>
            <h3 className="font-header text-lg text-daemon-text-bright">📖 Recent Corporate Legends</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentStories.map(story => (
              <div
                key={story.id}
                className={`p-3 bg-daemon-surface rounded-lg border-l-4 ${
                  story.category === 'heroic' ? 'border-l-daemon-info' :
                  story.category === 'tragic' ? 'border-l-daemon-danger' :
                  story.category === 'absurd' ? 'border-l-daemon-gold' : 'border-l-daemon-warning'
                }`}
              >
                <h4 className="font-semibold text-daemon-text-bright text-sm uppercase tracking-wide">{story.title}</h4>
                <p className="text-xs text-daemon-text mt-1">{story.description}</p>
                <div className="text-xs text-daemon-text-muted mt-2 uppercase tracking-wider">
                  {story.category}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Corporate Progression Tabs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CorporateLadder />
        <ComplianceCenter />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <HallOfInfamy />
        <CorporateRivals />
      </div>
    </div>
  );
};

export default Dashboard;
