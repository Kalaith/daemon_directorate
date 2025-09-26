// components/game/Apartment.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';

const Apartment: React.FC = () => {
  const { rooms, upgradeRoom, canAfford } = useGameStore();

  return (
    <div>
      <h2 className="text-2xl font-header font-bold mb-6 text-daemon-text-bright uppercase tracking-wide">
        Apartment HQ Management
      </h2>
      <p className="text-daemon-text mb-8 bg-daemon-surface p-6 rounded-lg border border-daemon-secondary">
        Your assigned living quarters double as operational headquarters. Room
        improvements enhance daemon performance and morale.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <Card
            key={room.id}
            className="bg-daemon-panel border-daemon-secondary hover:border-daemon-primary hover:shadow-infernal transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-header font-bold text-xl text-daemon-text-bright">
                {room.name}
              </h3>
              <span className="px-4 py-2 bg-daemon-secondary border border-daemon-secondary text-daemon-text-bright text-sm rounded-lg font-mono font-semibold uppercase tracking-wide">
                Level {room.level}
              </span>
            </div>

            <div className="mb-6 p-4 bg-daemon-surface rounded-lg border border-daemon-secondary">
              <div className="text-sm text-daemon-text-muted font-mono uppercase tracking-wide mb-2">
                Current Bonus:
              </div>
              <div className="text-daemon-text-bright font-mono font-semibold">
                {room.bonus}
              </div>
            </div>

            <button
              onClick={() => upgradeRoom(room.id)}
              disabled={!canAfford(room.upgrade_cost)}
              className="w-full px-4 py-3 bg-daemon-primary border border-daemon-primary text-daemon-text-bright font-mono rounded-lg uppercase tracking-wide hover:bg-daemon-primaryHover hover:shadow-infernal disabled:bg-daemon-surface disabled:border-daemon-text-dim disabled:text-daemon-text-dim disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              Upgrade ({room.upgrade_cost} Credits)
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Apartment;
