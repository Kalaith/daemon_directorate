// components/game/TeamManagement.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from '../ui/Card';

const TeamManagement: React.FC = () => {
  const {
    daemons,
    recruitmentPool,
    recruitDaemon,
    refreshRecruitmentPool,
    canAfford,
  } = useGameStore();

  const activeDaemons = daemons.filter(d => d.isActive);

  const getLifespanColor = (days: number) => {
    if (days <= 10) return 'text-red-600';
    if (days <= 20) return 'text-orange-600';
    return 'text-slate-600';
  };

  const getProgressBarColor = (value: number, type: 'health' | 'morale') => {
    if (type === 'health') {
      if (value >= 70) return 'bg-green-500';
      if (value >= 40) return 'bg-orange-400';
      return 'bg-red-500';
    } else {
      if (value >= 70) return 'bg-teal-500';
      if (value >= 40) return 'bg-orange-400';
      return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Active Daemon Operatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDaemons.map(daemon => (
            <Card
              key={daemon.id}
              className="bg-cream-100 border-brown-600/12 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900">{daemon.name}</h4>
                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded font-medium">
                  {daemon.specialization}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Health</span>
                    <span className="font-semibold text-slate-900">
                      {daemon.health}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${getProgressBarColor(daemon.health, 'health')} h-2 rounded-full transition-all`}
                      style={{ width: `${daemon.health}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Morale</span>
                    <span className="font-semibold text-slate-900">
                      {daemon.morale}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${getProgressBarColor(daemon.morale, 'morale')} h-2 rounded-full transition-all`}
                      style={{ width: `${daemon.morale}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm">
                  <span
                    className={`font-medium ${getLifespanColor(daemon.lifespanDays)}`}
                  >
                    Lifespan: {daemon.lifespanDays} days
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {daemon.quirks.map((quirk, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-brown-600/10 text-xs rounded text-slate-700"
                    title={typeof quirk === 'object' ? quirk.description : ''}
                  >
                    {typeof quirk === 'object' ? quirk.name : quirk}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-slate-600 text-cream-100 text-sm rounded hover:bg-slate-700 transition-colors">
                  Equipment
                </button>
                <button className="flex-1 px-3 py-2 bg-teal-600 text-cream-100 text-sm rounded hover:bg-teal-700 transition-colors">
                  Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-900">
          Recruitment Department
        </h3>
        <p className="text-slate-600 mb-6 bg-cream-50 p-4 rounded border border-brown-600/10">
          HR has identified suitable candidates for daemon operative positions.
          Background checks and soul assessments completed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {recruitmentPool.map(daemon => (
            <Card
              key={daemon.id}
              className="bg-cream-100 border-brown-600/12 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900">{daemon.name}</h4>
                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded font-medium">
                  {daemon.specialization}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Health</span>
                    <span className="font-semibold text-slate-900">
                      {daemon.health}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${getProgressBarColor(daemon.health, 'health')} h-2 rounded-full transition-all`}
                      style={{ width: `${daemon.health}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Morale</span>
                    <span className="font-semibold text-slate-900">
                      {daemon.morale}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${getProgressBarColor(daemon.morale, 'morale')} h-2 rounded-full transition-all`}
                      style={{ width: `${daemon.morale}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-slate-600 font-medium">
                    Lifespan: {daemon.lifespanDays} days
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {daemon.quirks.map((quirk, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-brown-600/10 text-xs rounded text-slate-700"
                    title={typeof quirk === 'object' ? quirk.description : ''}
                  >
                    {typeof quirk === 'object' ? quirk.name : quirk}
                  </span>
                ))}
              </div>

              <button
                onClick={() => recruitDaemon(daemon.id)}
                disabled={!canAfford(daemon.cost || 0)}
                className="w-full px-4 py-2 bg-teal-600 text-cream-100 rounded hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Hire ({daemon.cost} Credits)
              </button>
            </Card>
          ))}
        </div>

        <button
          onClick={refreshRecruitmentPool}
          disabled={!canAfford(50)}
          className="px-6 py-3 bg-slate-700 text-cream-100 rounded hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Request New Candidates (50 Credits)
        </button>
      </div>
    </div>
  );
};

export default TeamManagement;
