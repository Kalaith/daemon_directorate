// components/game/Apartment.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from '../ui/Card';

const Apartment: React.FC = () => {
  const { rooms, upgradeRoom, canAfford } = useGameStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-slate-900">
        Apartment HQ Management
      </h2>
      <p className="text-slate-600 mb-6 bg-cream-50 p-4 rounded border border-brown-600/10">
        Your assigned living quarters double as operational headquarters. Room
        improvements enhance daemon performance and morale.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <Card
            key={room.id}
            className="bg-cream-100 border-brown-600/12 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-slate-900">{room.name}</h3>
              <span className="px-3 py-1 bg-slate-600 text-cream-100 text-sm rounded-full font-semibold">
                Level {room.level}
              </span>
            </div>

            <div className="mb-4 p-4 bg-teal-50 rounded border border-teal-200">
              <div className="text-sm text-teal-700 font-medium mb-1">
                Current Bonus:
              </div>
              <div className="text-teal-900 font-semibold">{room.bonus}</div>
            </div>

            <button
              onClick={() => upgradeRoom(room.id)}
              disabled={!canAfford(room.upgrade_cost)}
              className="w-full px-4 py-3 bg-teal-600 text-cream-100 rounded hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-semibold"
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
