import React from 'react';
import Card from '../ui/Card';
import { useGameStore } from '../../stores/composedStore';
import type { Room } from '../../types/game';

const AdvancedRooms: React.FC = () => {
  const {
    rooms,
    unlockAdvancedRoom,
    processRecovery,
    processMissionPlanning,
    processEquipmentInnovation,
    getMemorialBonuses,
    processAutomation,
  } = useGameStore();

  const advancedRooms = rooms.filter(room => room.roomType === 'advanced');

  const handleRoomAction = (room: Room) => {
    switch (room.name) {
      case 'Training Hall':
        // Would open training selection modal
        console.log('Opening training options...');
        break;
      case 'Recovery Ward':
        if (room.assignedDaemons.length > 0) {
          room.assignedDaemons.forEach(daemonId => processRecovery(daemonId));
        }
        break;
      case 'War Room': {
        const bonus = processMissionPlanning();
        console.log(`Mission planning bonus: ${bonus}%`);
        break;
      }
      case 'R&D Lab': {
        const innovation = processEquipmentInnovation();
        if (innovation) {
          console.log(`Prototype equipment created: ${innovation}`);
        }
        break;
      }
      case 'Memorial Chamber': {
        const bonuses = getMemorialBonuses();
        console.log('Memorial bonuses:', bonuses);
        break;
      }
      case 'Server Farm':
        processAutomation();
        break;
    }
  };

  const getRoomDescription = (room: Room) => {
    const baseDesc = room.description || '';
    const levelBonus = room.level > 0 ? ` (Level ${room.level})` : '';

    switch (room.name) {
      case 'Training Hall':
        return `${baseDesc} - Allows daemon specialization training${levelBonus}`;
      case 'Recovery Ward':
        return `${baseDesc} - Heals damaged daemons faster${levelBonus}`;
      case 'War Room':
        return `${baseDesc} - Provides mission planning bonuses${levelBonus}`;
      case 'R&D Lab':
        return `${baseDesc} - Enables equipment innovation${levelBonus}`;
      case 'Memorial Chamber':
        return `${baseDesc} - Honors fallen daemons, provides legacy bonuses${levelBonus}`;
      case 'Server Farm':
        return `${baseDesc} - Automates routine operations${levelBonus}`;
      default:
        return baseDesc + levelBonus;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-green-400 mb-4">Advanced HQ Rooms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advancedRooms.map(room => (
          <Card key={room.id} className="bg-gray-800 border-green-500/30">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-green-400">{room.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">{getRoomDescription(room)}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-400">
                    Level {room.level}/{room.maxLevel || 5}
                  </div>
                  <div className="text-xs text-gray-400">Efficiency: {room.efficiency || 50}%</div>
                </div>
              </div>

              {!room.unlocked ? (
                <div className="bg-gray-700/50 p-3 rounded border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm mb-2">
                    🔒 Locked - Requires Corporate Tier advancement
                  </p>
                  <button
                    onClick={() => unlockAdvancedRoom(room.name)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-black text-sm rounded font-medium"
                  >
                    Unlock Room
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-400">Assigned: </span>
                      <span className="text-green-400">
                        {room.assignedDaemons.length}/{room.maxAssignments}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleRoomAction(room)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
                        disabled={
                          room.assignedDaemons.length === 0 && room.name !== 'Training Hall'
                        }
                      >
                        {getRoomActionLabel(room)}
                      </button>
                    </div>
                  </div>

                  {room.assignedDaemons.length > 0 && (
                    <div className="bg-gray-700/30 p-2 rounded">
                      <p className="text-xs text-gray-400 mb-1">Assigned Daemons:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.assignedDaemons.map((daemonId, index) => (
                          <span
                            key={index}
                            className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs"
                          >
                            Daemon {daemonId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {room.level < (room.maxLevel || 5) && (
                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Next Level:</span>
                        <span className="text-yellow-400">{room.upgrade_cost} credits</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {advancedRooms.length === 0 && (
        <Card className="bg-gray-800 border-gray-600 text-center py-8">
          <p className="text-gray-400 mb-2">No advanced rooms available</p>
          <p className="text-sm text-gray-500">
            Advance your Corporate Tier to unlock specialized HQ facilities
          </p>
        </Card>
      )}
    </div>
  );
};

const getRoomActionLabel = (room: Room): string => {
  switch (room.name) {
    case 'Training Hall':
      return 'Train Daemons';
    case 'Recovery Ward':
      return 'Heal All';
    case 'War Room':
      return 'Plan Mission';
    case 'R&D Lab':
      return 'Research';
    case 'Memorial Chamber':
      return 'View Honors';
    case 'Server Farm':
      return 'Run Automation';
    default:
      return 'Activate';
  }
};

export default AdvancedRooms;
