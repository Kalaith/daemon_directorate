// components/game/Equipment.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from '../ui/Card';

const Equipment: React.FC = () => {
  const { equipment, repairEquipment, craftItem, canAfford } = useGameStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-teal-300 mb-2">
          Equipment Depot
        </h2>
        <p className="text-gray-400 mb-6">
          Manage corporate-issued equipment and supplies. Note: Equipment
          degradation is normal and expected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {equipment.map(item => (
          <Card key={item.id} className="bg-gray-900 border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-teal-300">{item.name}</h4>
              <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                {item.type}
              </span>
            </div>

            <div className="mb-3 text-gray-300">
              <span className="text-teal-400 font-medium">Ability:</span>{' '}
              {item.ability}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">
                  Durability: {item.durability}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.durability > 70
                      ? 'bg-teal-500'
                      : item.durability > 30
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${item.durability}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => repairEquipment(item.id)}
                disabled={item.durability >= 90}
                className="flex-1 px-3 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Repair ({Math.floor((100 - item.durability) * 2)} Credits)
              </button>
              <button className="px-3 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                {item.assignedTo ? 'Unassign' : 'Assign'}
              </button>
            </div>

            {item.assignedTo && (
              <div className="mt-2 text-sm text-gray-400">
                Assigned to:{' '}
                <span className="text-teal-400">{item.assignedTo}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-teal-300 mb-4">Item Forge</h3>
        <p className="text-gray-400 mb-4">
          Craft new equipment using planetary resources:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => craftItem('briefcase')}
            disabled={!canAfford(100)}
            className="p-4 bg-gray-800 border border-gray-700 rounded hover:bg-gray-750 hover:border-teal-600 disabled:bg-gray-900 disabled:border-gray-800 disabled:cursor-not-allowed text-left transition-all"
          >
            <div className="font-semibold text-teal-300">
              Standard Issue Briefcase
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Infiltration - Blend In (+15 stealth)
            </div>
            <div className="text-sm text-teal-400 mt-2 font-medium">
              Cost: 100 Credits
            </div>
          </button>

          <button
            onClick={() => craftItem('tie')}
            disabled={!canAfford(75)}
            className="p-4 bg-gray-800 border border-gray-700 rounded hover:bg-gray-750 hover:border-teal-600 disabled:bg-gray-900 disabled:border-gray-800 disabled:cursor-not-allowed text-left transition-all"
          >
            <div className="font-semibold text-teal-300">
              Corporate Tie of Binding
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Combat - Intimidate (+10 combat)
            </div>
            <div className="text-sm text-teal-400 mt-2 font-medium">
              Cost: 75 Credits
            </div>
          </button>

          <button
            onClick={() => craftItem('calculator')}
            disabled={!canAfford(125)}
            className="p-4 bg-gray-800 border border-gray-700 rounded hover:bg-gray-750 hover:border-teal-600 disabled:bg-gray-900 disabled:border-gray-800 disabled:cursor-not-allowed text-left transition-all"
          >
            <div className="font-semibold text-teal-300">Cursed Calculator</div>
            <div className="text-sm text-gray-400 mt-1">
              Sabotage - Data Corruption (+20 sabotage)
            </div>
            <div className="text-sm text-teal-400 mt-2 font-medium">
              Cost: 125 Credits + 1 Raw Material
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
