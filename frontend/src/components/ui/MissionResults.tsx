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
        <h2 className="text-xl font-bold text-teal-300 mb-4">Mission Report</h2>

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
            {missionResult.success ? 'MISSION SUCCESSFUL' : 'MISSION FAILED'}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-3 text-gray-300">{missionResult.narrative}</p>

          <div className="space-y-2 text-sm text-gray-300">
            <div>
              <span className="text-teal-400 font-medium">
                Success Probability:
              </span>{' '}
              {missionResult.successChance}%
            </div>
            <div>
              <span className="text-teal-400 font-medium">Casualties:</span>{' '}
              <span
                className={
                  missionResult.casualties.filter(c => !c.survived).length > 0
                    ? 'text-red-400'
                    : 'text-teal-400'
                }
              >
                {missionResult.casualties.filter(c => !c.survived).length}/
                {missionResult.casualties.length} operatives
              </span>
            </div>

            <div className="mt-3">
              <span className="text-teal-400 font-medium">
                Resource Acquisition:
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
                      No resources acquired
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
          Acknowledge Report
        </button>
      </div>
    </div>
  );
};

export default MissionResults;
