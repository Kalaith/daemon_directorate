// components/game/Equipment.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';

const Equipment: React.FC = () => {
  const { equipment, repairEquipment, craftItem, canAfford } = useGameStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-header font-bold text-daemon-text-bright mb-4 uppercase tracking-wide">
          Equipment Depot
        </h2>
        <p className="text-daemon-text mb-8 bg-daemon-surface p-6 rounded-lg border border-daemon-secondary">
          Manage corporate-issued equipment and supplies. Note: Equipment
          degradation is normal and expected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {equipment.map(item => (
          <Card
            key={item.id}
            className="bg-daemon-panel border-daemon-secondary hover:border-daemon-primary hover:shadow-infernal transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-header font-semibold text-daemon-text-bright text-lg">
                {item.name}
              </h4>
              <span className="text-xs px-3 py-2 bg-daemon-surface border border-daemon-secondary text-daemon-text font-mono uppercase tracking-wide rounded-lg">
                {item.type}
              </span>
            </div>

            <div className="mb-4 text-daemon-text">
              <span className="text-daemon-text-muted font-mono uppercase tracking-wide mr-2">
                Ability:
              </span>
              <span className="text-daemon-text-bright font-mono font-semibold">
                {item.ability}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-daemon-text-muted font-mono uppercase tracking-wide">
                  Durability:
                </span>
                <span className="text-daemon-text-bright font-mono font-semibold">
                  {item.durability}%
                </span>
              </div>
              <div className="w-full bg-daemon-dark rounded-lg h-3 border border-daemon-secondary">
                <div
                  className={`h-full rounded-lg transition-all duration-200 ${
                    item.durability > 70
                      ? 'bg-daemon-success'
                      : item.durability > 30
                        ? 'bg-daemon-warning'
                        : 'bg-daemon-danger'
                  }`}
                  style={{ width: `${item.durability}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => repairEquipment(item.id)}
                disabled={item.durability >= 90}
                className="flex-1 px-4 py-3 bg-daemon-primary border border-daemon-primary text-daemon-text-bright font-mono text-sm rounded-lg uppercase tracking-wide hover:bg-daemon-primaryHover hover:shadow-infernal disabled:bg-daemon-surface disabled:border-daemon-text-dim disabled:text-daemon-text-dim disabled:cursor-not-allowed transition-all duration-200"
              >
                Repair ({Math.floor((100 - item.durability) * 2)} Credits)
              </button>
              <button className="px-4 py-3 bg-daemon-surface border border-daemon-secondary text-daemon-text-bright font-mono text-sm rounded-lg uppercase tracking-wide hover:bg-daemon-primary hover:border-daemon-primary hover:shadow-infernal transition-all duration-200">
                {item.assignedTo ? 'Unassign' : 'Assign'}
              </button>
            </div>

            {item.assignedTo && (
              <div className="mt-3 text-sm">
                <span className="text-daemon-text-muted font-mono uppercase tracking-wide mr-2">
                  Assigned to:
                </span>
                <span className="text-daemon-text-bright font-mono font-semibold">
                  {item.assignedTo}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="bg-daemon-panel border border-daemon-secondary rounded-lg p-8">
        <h3 className="text-xl font-header font-semibold text-daemon-text-bright mb-6 uppercase tracking-wide">
          Item Forge
        </h3>
        <p className="text-daemon-text mb-6">
          Craft new equipment using planetary resources:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => craftItem('briefcase')}
            disabled={!canAfford(100)}
            className="p-6 bg-daemon-surface border border-daemon-secondary rounded-lg hover:bg-daemon-panel hover:border-daemon-primary hover:shadow-infernal disabled:bg-daemon-dark disabled:border-daemon-text-dim disabled:cursor-not-allowed text-left transition-all duration-200"
          >
            <div className="font-header font-semibold text-daemon-text-bright text-lg mb-2">
              Standard Issue Briefcase
            </div>
            <div className="text-sm text-daemon-text mb-3">
              Infiltration - Blend In (+15 stealth)
            </div>
            <div className="text-sm text-daemon-text-bright font-mono font-semibold uppercase tracking-wide">
              Cost: 100 Credits
            </div>
          </button>

          <button
            onClick={() => craftItem('tie')}
            disabled={!canAfford(75)}
            className="p-6 bg-daemon-surface border border-daemon-secondary rounded-lg hover:bg-daemon-panel hover:border-daemon-primary hover:shadow-infernal disabled:bg-daemon-dark disabled:border-daemon-text-dim disabled:cursor-not-allowed text-left transition-all duration-200"
          >
            <div className="font-header font-semibold text-daemon-text-bright text-lg mb-2">
              Corporate Tie of Binding
            </div>
            <div className="text-sm text-daemon-text mb-3">
              Combat - Intimidate (+10 combat)
            </div>
            <div className="text-sm text-daemon-text-bright font-mono font-semibold uppercase tracking-wide">
              Cost: 75 Credits
            </div>
          </button>

          <button
            onClick={() => craftItem('calculator')}
            disabled={!canAfford(125)}
            className="p-6 bg-daemon-surface border border-daemon-secondary rounded-lg hover:bg-daemon-panel hover:border-daemon-primary hover:shadow-infernal disabled:bg-daemon-dark disabled:border-daemon-text-dim disabled:cursor-not-allowed text-left transition-all duration-200"
          >
            <div className="font-header font-semibold text-daemon-text-bright text-lg mb-2">
              Cursed Calculator
            </div>
            <div className="text-sm text-daemon-text mb-3">
              Sabotage - Data Corruption (+20 sabotage)
            </div>
            <div className="text-sm text-daemon-text-bright font-mono font-semibold uppercase tracking-wide">
              Cost: 125 Credits + 1 Raw Material
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
