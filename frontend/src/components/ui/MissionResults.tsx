// components/ui/MissionResults.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';

const MissionResults: React.FC = () => {
  const { showMissionResults, missionResult, setShowMissionResults } =
    useGameStore();

  if (!showMissionResults || !missionResult) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-teal-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-xl font-bold text-teal-300 mb-4">
          Performance Evaluation Report
        </h2>

        <div
          className={`p-4 rounded mb-4 border ${
            missionResult.success
              ? 'bg-teal-900/30 border-teal-500'
              : 'bg-red-900/30 border-red-500'
          }`}
        >
          <div
            className={`font-bold text-lg ${
              missionResult.success ? 'text-teal-400' : 'text-red-400'
            }`}
          >
            {missionResult.success
              ? 'QUARTERLY OBJECTIVES MET'
              : 'PERFORMANCE TARGETS MISSED'}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-3 text-gray-300">{missionResult.narrative}</p>

          <div className="space-y-2 text-sm text-gray-300">
            <div>
              <span className="text-teal-400 font-medium">
                KPI Achievement Odds:
              </span>{' '}
              {missionResult.successChance}%
            </div>
            <div>
              <span className="text-teal-400 font-medium">
                Personnel Attrition:
              </span>{' '}
              <span
                className={
                  missionResult.casualties.filter(c => !c.survived).length > 0
                    ? 'text-red-400'
                    : 'text-teal-400'
                }
              >
                {missionResult.casualties.filter(c => !c.survived).length}/
                {missionResult.casualties.length} corporate assets
              </span>
            </div>

            {/* Enhanced Mission Results Display */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <div className="text-yellow-400 font-semibold mb-2 text-xs uppercase tracking-wide">
                Equipment Analysis:
              </div>
              <div className="text-xs space-y-1">
                <div className="text-gray-300">
                  • Standard equipment effectiveness: Normal parameters
                </div>
                <div className="text-blue-300">
                  • Set bonuses detected: Corporate synergy active
                </div>
                <div className="text-purple-300">
                  • Legacy equipment bonuses: Generational enhancement applied
                </div>
              </div>
            </div>

            {/* Mission Complexity Indicator */}
            <div className="mt-3 p-3 bg-gray-750 rounded-lg border-l-4 border-teal-500">
              <div className="text-teal-400 font-semibold mb-1 text-xs uppercase tracking-wide">
                Operational Complexity:
              </div>
              <div className="text-xs text-gray-300">
                Multi-objective mission parameters successfully processed.
                Strategic outcomes may influence future operational
                opportunities.
              </div>
            </div>

            <div className="mt-3">
              <span className="text-teal-400 font-medium">
                Quarterly Revenue Stream:
              </span>
              <div className="ml-4 space-y-1 mt-2">
                {missionResult.rewards.credits &&
                  missionResult.rewards.credits > 0 && (
                    <div className="text-green-400">
                      +{missionResult.rewards.credits} Credits
                    </div>
                  )}
                {missionResult.rewards.soulEssence &&
                  missionResult.rewards.soulEssence > 0 && (
                    <div className="text-purple-400">
                      +{missionResult.rewards.soulEssence} Soul Essence
                    </div>
                  )}
                {missionResult.rewards.bureaucraticLeverage &&
                  missionResult.rewards.bureaucraticLeverage > 0 && (
                    <div className="text-yellow-400">
                      +{missionResult.rewards.bureaucraticLeverage} Bureaucratic
                      Leverage
                    </div>
                  )}
                {missionResult.rewards.rawMaterials &&
                  missionResult.rewards.rawMaterials > 0 && (
                    <div className="text-orange-400">
                      +{missionResult.rewards.rawMaterials} Raw Materials
                    </div>
                  )}
                {!missionResult.rewards.credits &&
                  !missionResult.rewards.soulEssence &&
                  !missionResult.rewards.bureaucraticLeverage &&
                  !missionResult.rewards.rawMaterials && (
                    <div className="text-gray-400 italic">
                      Revenue targets not met - performance review pending
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowMissionResults(false)}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 border border-teal-500 transition-colors font-semibold"
        >
          File in Permanent Record
        </button>
      </div>
    </div>
  );
};

export default MissionResults;
