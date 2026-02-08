// components/game/Apartment.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';
import AdvancedRooms from './AdvancedRooms';
import type { Room } from '../../types/game';

const Apartment: React.FC = () => {
  const { rooms, upgradeRoom, canAfford } = useGameStore();

  // Filter basic rooms for the existing UI
  const basicRooms = rooms.filter(room => room.roomType !== 'advanced');

  const handleRoomUpgrade = (room: Room) => {
    console.log('Attempting to upgrade room:', room.name, 'Cost:', room.upgrade_cost);
    console.log('Can afford?', canAfford(room.upgrade_cost));
    
    if (!canAfford(room.upgrade_cost)) {
      console.warn('Cannot afford room upgrade');
      alert('Insufficient credits for this upgrade');
      return;
    }
    
    try {
      upgradeRoom(room.id || room.name);
      console.log('Room upgrade attempted');
    } catch (error) {
      console.error('Room upgrade failed:', error);
      alert('Room upgrade failed: ' + error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-header font-bold mb-6 text-daemon-text-bright uppercase tracking-wide">
        Corporate Housing Division
      </h2>
      <p className="text-daemon-text mb-8 bg-daemon-surface p-6 rounded-lg border border-daemon-secondary">
        Welcome to your soul-crushing cubicle — now with 15% more despair
        absorption. Your assigned pit doubles as your office. Upgrades may
        slightly raise morale, or at least keep the screams from echoing quite
        so much.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {basicRooms.map(room => (
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
                Productivity Enhancement:
              </div>
              <div className="text-daemon-text-bright font-mono font-semibold">
                {room.bonus}
              </div>
            </div>

            <button
              onClick={() => handleRoomUpgrade(room)}
              disabled={!canAfford(room.upgrade_cost)}
              className="w-full px-4 py-3 bg-daemon-primary border border-daemon-primary text-daemon-text-bright font-mono rounded-lg uppercase tracking-wide hover:bg-daemon-primaryHover hover:shadow-infernal disabled:bg-daemon-surface disabled:border-daemon-text-dim disabled:text-daemon-text-dim disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              Submit Budget Request ({room.upgrade_cost} Credits)
            </button>
          </Card>
        ))}
      </div>
      
      {/* Advanced Rooms Section */}
      <AdvancedRooms />
    </div>
  );
};

export default Apartment;
