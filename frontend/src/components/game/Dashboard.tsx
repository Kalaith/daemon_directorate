// components/game/Dashboard.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from '../ui/Card';

const Dashboard: React.FC = () => {
  const {
    activeMission,
    daemons,
    corporateEvents,
    triggerRandomEvent
  } = useGameStore();

  const activeDaemons = daemons.filter(d => d.isActive);
  const avgHealth = activeDaemons.length > 0
    ? Math.round(activeDaemons.reduce((sum, d) => sum + d.health, 0) / activeDaemons.length)
    : 0;
  const avgMorale = activeDaemons.length > 0
    ? Math.round(activeDaemons.reduce((sum, d) => sum + d.morale, 0) / activeDaemons.length)
    : 0;
  const criticalLifespans = activeDaemons.filter(d => d.lifespanDays <= 10).length;

  const latestEvent = corporateEvents[corporateEvents.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-cream-100 border-brown-600/12">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Mission Status</h3>
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
          <strong className="text-slate-900">MEMO:</strong> Productivity metrics indicate room for improvement. Please optimize daemon utilization for maximum corporate synergy.
        </div>
      </Card>

      <Card className="bg-cream-100 border-brown-600/12">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Team Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Active Operatives:</span>
            <span className="text-slate-900 font-bold">{activeDaemons.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Average Health:</span>
            <span className={`font-bold ${avgHealth >= 70 ? 'text-green-600' : avgHealth >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
              {avgHealth}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Average Morale:</span>
            <span className={`font-bold ${avgMorale >= 70 ? 'text-teal-600' : avgMorale >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
              {avgMorale}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Critical Lifespans:</span>
            <span className={`font-bold ${criticalLifespans > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {criticalLifespans}
            </span>
          </div>
        </div>
      </Card>

      <Card className="bg-cream-100 border-brown-600/12">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Corporate Events</h3>
        <div className="text-sm mb-4">
          {latestEvent ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-semibold text-red-800">{latestEvent.title}</div>
              <div className="text-red-700 mt-1">{latestEvent.description}</div>
            </div>
          ) : (
            <div className="text-slate-600">All systems nominal. Await further directives.</div>
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
  );
};

export default Dashboard;
