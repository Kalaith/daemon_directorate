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
import { useMemo } from 'react';

const Dashboard: React.FC = () => {
  const {
    activeMission,
    daemons,
    corporateEvents,
    triggerRandomEvent,
    corporateTier,
    complianceTasks,
    daysPassed,
    legacyBook,
    hallOfInfamy
  } = useGameStore();

  const dashboardStats = useMemo(() =>
    DashboardService.calculateDashboardStats(
      daemons,
      corporateEvents,
      complianceTasks,
      daysPassed,
      legacyBook,
      hallOfInfamy
    ), [daemons, corporateEvents, complianceTasks, daysPassed, legacyBook, hallOfInfamy]
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
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">{getTierIcon(corporateTier.level)}</div>
            <h3 className="font-bold">{corporateTier.name}</h3>
            <p className="text-sm opacity-90">Corporate Tier {corporateTier.level}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{daysPassed}</div>
            <p className="text-sm opacity-90">Days in Operation</p>
            <div className="text-xs opacity-75 mt-1">
              Corporate Survival Record
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-r text-white ${DashboardService.getComplianceStatusClass(overdueComplianceTasks.length, activeComplianceTasks.length)}`}>
          <div className="text-center">
            <div className="text-2xl font-bold">{activeComplianceTasks.length}</div>
            <p className="text-sm opacity-90">Active Tasks</p>
            <div className="text-xs opacity-75 mt-1">
              {DashboardService.getComplianceStatusText(overdueComplianceTasks.length)}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalBloodlines}</div>
            <p className="text-sm opacity-90">Bloodlines</p>
            <div className="text-xs opacity-75 mt-1">
              Legacy Dynasties
            </div>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Mission Status */}
        <Card className="bg-cream-100 border-brown-600/12">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">
            Mission Status
          </h3>
          <div className="text-sm mb-4">
            {activeMission ? (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded text-orange-800">
                <strong>Mission in Progress:</strong> Active deployment detected
              </div>
            ) : (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded text-teal-800">
                No active missions
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-700">
            <strong className="text-slate-900">MEMO:</strong> Productivity metrics
            indicate room for improvement. Please optimize daemon utilization for
            maximum corporate synergy.
          </div>
        </Card>

        {/* Team Overview */}
        <Card className="bg-cream-100 border-brown-600/12">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">
            Team Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">
                Active Operatives:
              </span>
              <span className="text-slate-900 font-bold">
                {activeDaemons.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">Average Health:</span>
              <span
                className={`font-bold ${DashboardService.getHealthStatusClass(avgHealth)}`}
              >
                {avgHealth}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">Average Morale:</span>
              <span
                className={`font-bold ${DashboardService.getMoraleStatusClass(avgMorale)}`}
              >
                {avgMorale}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">
                Critical Lifespans:
              </span>
              <span
                className={`font-bold ${criticalLifespans > 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {criticalLifespans}
              </span>
            </div>
          </div>
        </Card>

        {/* Corporate Events */}
        <Card className="bg-cream-100 border-brown-600/12">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">
            Corporate Events
          </h3>
          <div className="text-sm mb-4">
            {latestEvent ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="font-semibold text-red-800">
                  {latestEvent.title}
                </div>
                <div className="text-red-700 mt-1">{latestEvent.description}</div>
              </div>
            ) : (
              <div className="text-slate-600">
                All systems nominal. Await further directives.
              </div>
            )}
          </div>
          <button
            onClick={triggerRandomEvent}
            className="w-full px-4 py-2 bg-slate-600 text-cream-100 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Process Pending Events
          </button>
        </Card>
      </div>

      {/* Recent Legacy Stories */}
      {recentStories.length > 0 && (
        <Card className="bg-gradient-to-br from-indigo-900 to-purple-900">
          <h3 className="text-lg font-semibold mb-4 text-white">📖 Recent Corporate Legends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentStories.map(story => (
              <div
                key={story.id}
                className="p-3 bg-gray-800 rounded-lg border-l-4 border-opacity-50"
                style={{
                  borderLeftColor: story.category === 'heroic' ? '#3B82F6' :
                                 story.category === 'tragic' ? '#EF4444' :
                                 story.category === 'absurd' ? '#8B5CF6' : '#F59E0B'
                }}
              >
                <h4 className="font-semibold text-white text-sm">{story.title}</h4>
                <p className="text-xs text-gray-300 mt-1">{story.description}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {story.category.toUpperCase()}
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
