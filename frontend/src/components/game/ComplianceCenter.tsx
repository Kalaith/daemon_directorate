import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';
import type { ComplianceTask } from '../../types/game';

export const ComplianceCenter: React.FC = () => {
  const {
    complianceTasks,
    daysPassed,
    completeComplianceTask,
    spendCredits,
    resources,
    daemons,
  } = useGameStore();

  const activeTasks = (complianceTasks || []).filter(task => !task.completed);
  const overdueTasks = activeTasks.filter(task => daysPassed >= task.deadline);
  const upcomingTasks = activeTasks.filter(task => daysPassed < task.deadline);

  const getTaskIcon = (type: string) => {
    const icons = {
      performance_review: '📊',
      budget_cut: '💰',
      mandatory_training: '🎓',
      audit: '🔍',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getTaskColor = (task: ComplianceTask) => {
    const daysRemaining = task.deadline - daysPassed;
    if (daysRemaining < 0) return 'border-red-500 bg-red-500/20';
    if (daysRemaining <= 2) return 'border-yellow-500 bg-yellow-500/20';
    return 'border-blue-500 bg-blue-500/20';
  };

  const canCompleteTask = (task: ComplianceTask) => {
    if (task.requirements.resourceCost) {
      const cost = task.requirements.resourceCost;
      if (cost.credits && resources.credits < cost.credits) return false;
      if (
        cost.bureaucraticLeverage &&
        resources.bureaucraticLeverage < cost.bureaucraticLeverage
      )
        return false;
      if (cost.rawMaterials && resources.rawMaterials < cost.rawMaterials)
        return false;
    }
    if (
      task.requirements.daemonsRequired &&
      daemons.filter(d => d.isActive).length < task.requirements.daemonsRequired
    ) {
      return false;
    }
    return true;
  };

  const handleCompleteTask = (taskId: string) => {
    const task = activeTasks.find(t => t.id === taskId);
    if (!task || !canCompleteTask(task)) return;

    // Pay the resource costs
    if (task.requirements.resourceCost) {
      const cost = task.requirements.resourceCost;
      if (cost.credits) spendCredits(cost.credits);
      // Add logic for other resource costs if needed
    }

    completeComplianceTask(taskId);
  };

  return (
    <Card className="bg-gradient-to-br from-red-900 to-pink-900">
      <h2 className="text-xl font-bold text-white mb-4">
        📋 Compliance Center
      </h2>

      {activeTasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-green-300">
            All Caught Up!
          </h3>
          <p className="text-gray-300">No compliance tasks pending</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">
                🚨 OVERDUE TASKS
              </h3>
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 ${getTaskColor(task)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">
                          {getTaskIcon(task.type)}
                        </span>
                        <div>
                          <h4 className="font-semibold text-red-300">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-300 mb-2">
                            {task.description}
                          </p>
                          <div className="text-xs text-red-400">
                            OVERDUE by {daysPassed - task.deadline} days
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {task.requirements && (
                      <div className="mt-3 p-2 bg-gray-800 rounded">
                        <p className="text-xs font-medium text-gray-400 mb-1">
                          Requirements:
                        </p>
                        {task.requirements.daemonsRequired && (
                          <p className="text-xs text-gray-300">
                            • {task.requirements.daemonsRequired} daemons
                            required
                          </p>
                        )}
                        {task.requirements.resourceCost && (
                          <div className="text-xs text-gray-300">
                            {Object.entries(task.requirements.resourceCost).map(
                              ([resource, cost]) => (
                                <p key={resource}>
                                  • {cost} {resource}
                                </p>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Penalties */}
                    <div className="mt-3 p-2 bg-red-900/30 rounded">
                      <p className="text-xs font-medium text-red-400 mb-1">
                        Penalties Applied:
                      </p>
                      {task.penalties.moraleLoss && (
                        <p className="text-xs text-red-300">
                          • -{task.penalties.moraleLoss} morale to all daemons
                        </p>
                      )}
                      {task.penalties.resourceFines && (
                        <div className="text-xs text-red-300">
                          {Object.entries(task.penalties.resourceFines).map(
                            ([resource, fine]) => (
                              <p key={resource}>
                                • -{fine} {resource} fine
                              </p>
                            )
                          )}
                        </div>
                      )}
                      {task.penalties.daemonReassignment && (
                        <p className="text-xs text-red-300">
                          • One daemon reassigned to another department
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                ⏰ PENDING TASKS
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map(task => {
                  const daysRemaining = task.deadline - daysPassed;
                  const canComplete = canCompleteTask(task);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-2 ${getTaskColor(task)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">
                            {getTaskIcon(task.type)}
                          </span>
                          <div>
                            <h4 className="font-semibold text-white">
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-300 mb-2">
                              {task.description}
                            </p>
                            <div
                              className={`text-xs ${daysRemaining <= 2 ? 'text-yellow-400' : 'text-blue-400'}`}
                            >
                              Due in {daysRemaining} days
                            </div>
                          </div>
                        </div>

                        {canComplete && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>

                      {/* Requirements */}
                      {task.requirements && (
                        <div className="mt-3 p-2 bg-gray-800 rounded">
                          <p className="text-xs font-medium text-gray-400 mb-1">
                            Requirements:
                          </p>
                          {task.requirements.daemonsRequired && (
                            <p
                              className={`text-xs ${daemons.filter(d => d.isActive).length >= task.requirements.daemonsRequired ? 'text-green-300' : 'text-red-300'}`}
                            >
                              • {task.requirements.daemonsRequired} daemons
                              required ({daemons.filter(d => d.isActive).length}{' '}
                              available)
                            </p>
                          )}
                          {task.requirements.resourceCost && (
                            <div className="text-xs">
                              {Object.entries(
                                task.requirements.resourceCost
                              ).map(([resource, cost]) => {
                                const resourceKey =
                                  resource as keyof typeof resources;
                                const hasEnough =
                                  resources[resourceKey] >= (cost as number);
                                return (
                                  <p
                                    key={resource}
                                    className={
                                      hasEnough
                                        ? 'text-green-300'
                                        : 'text-red-300'
                                    }
                                  >
                                    • {cost} {resource} (
                                    {resources[resourceKey]} available)
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Show completion button status */}
                      {!canComplete && (
                        <div className="mt-3 p-2 bg-red-900/30 rounded">
                          <p className="text-xs text-red-400">
                            Cannot complete: Insufficient resources or daemons
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-3 bg-gray-800 rounded-lg">
        <h4 className="font-semibold text-gray-300 mb-2">Compliance Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-300">
              {upcomingTasks.length}
            </div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-300">
              {overdueTasks.length}
            </div>
            <div className="text-xs text-gray-400">Overdue</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-300">
              {complianceTasks.filter(t => t.completed).length}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
