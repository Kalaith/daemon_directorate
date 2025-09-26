// stores/slices/apartmentSlice.ts - Apartment and room management
import type { StateCreator } from 'zustand';
import type { Room } from '../../types/game';

export interface ApartmentState {
  rooms: Room[];
  apartmentLevel: number;
  totalRoomUpgrades: number;
}

export interface ApartmentActions {
  upgradeRoom: (roomId: string) => void;
  assignDaemonToRoom: (daemonId: string, roomId: string) => void;
  unassignDaemonFromRoom: (daemonId: string, roomId: string) => void;
  getRoomById: (roomId: string) => Room | undefined;
  getAvailableRooms: () => Room[];
  getRoomUpgradeCost: (roomId: string) => number;
  canUpgradeRoom: (roomId: string, credits: number) => boolean;
}

export type ApartmentSlice = ApartmentState & ApartmentActions;

// Initial room setup
const INITIAL_ROOMS: Room[] = [
  {
    id: 'living_quarters',
    name: 'Living Quarters',
    level: 1,
    bonus: '+10% daemon morale recovery',
    upgrade_cost: 200,
    assignedDaemons: [],
    maxAssignments: 2,
    roomType: 'recovery',
    unlocked: true,
  },
  {
    id: 'command_center',
    name: 'Command Center',
    level: 1,
    bonus: '+5% mission success rate',
    upgrade_cost: 300,
    assignedDaemons: [],
    maxAssignments: 1,
    roomType: 'command',
    unlocked: true,
  },
  {
    id: 'training_room',
    name: 'Training Room',
    level: 0,
    bonus: '+1 skill points per day',
    upgrade_cost: 400,
    assignedDaemons: [],
    maxAssignments: 3,
    roomType: 'training',
    unlocked: false,
  },
  {
    id: 'workshop',
    name: 'Equipment Workshop',
    level: 0,
    bonus: '+15% equipment durability',
    upgrade_cost: 500,
    assignedDaemons: [],
    maxAssignments: 2,
    roomType: 'utility',
    unlocked: false,
  },
  {
    id: 'meditation_chamber',
    name: 'Meditation Chamber',
    level: 0,
    bonus: '+20% soul essence generation',
    upgrade_cost: 600,
    assignedDaemons: [],
    maxAssignments: 1,
    roomType: 'special',
    unlocked: false,
  },
];

export const createApartmentSlice: StateCreator<
  import('../composedStore').ComposedGameStore,
  [],
  [],
  ApartmentSlice
> = (set, get) => ({
  // Initial state
  rooms: INITIAL_ROOMS,
  apartmentLevel: 1,
  totalRoomUpgrades: 0,

  // Actions
  upgradeRoom: (roomId: string) => {
    set(state => {
      const updatedRooms = state.rooms.map(room => {
        if (room.id === roomId) {
          const newLevel = room.level + 1;
          return {
            ...room,
            level: newLevel,
            unlocked: true,
            upgrade_cost: Math.floor(room.upgrade_cost * 1.5), // Increase cost
          };
        }
        return room;
      });

      return {
        rooms: updatedRooms,
        totalRoomUpgrades: state.totalRoomUpgrades + 1,
      };
    });
  },

  assignDaemonToRoom: (daemonId: string, roomId: string) => {
    set(state => {
      const room = state.rooms.find(r => r.id === roomId);
      if (!room || room.assignedDaemons.length >= room.maxAssignments) {
        return state;
      }

      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              assignedDaemons: [...room.assignedDaemons, daemonId],
            };
          }
          return room;
        }),
        daemons: state.daemons.map(daemon => {
          if (daemon.id === daemonId) {
            return {
              ...daemon,
              assignments: [...daemon.assignments, roomId],
            };
          }
          return daemon;
        }),
      };
    });
  },

  unassignDaemonFromRoom: (daemonId: string, roomId: string) => {
    set(state => ({
      rooms: state.rooms.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            assignedDaemons: room.assignedDaemons.filter(id => id !== daemonId),
          };
        }
        return room;
      }),
    }));
  },

  getRoomById: (roomId: string) => {
    return get().rooms.find(room => room.id === roomId);
  },

  getAvailableRooms: () => {
    return get().rooms.filter(room => room.unlocked);
  },

  getRoomUpgradeCost: (roomId: string) => {
    const room = get().getRoomById(roomId);
    return room ? room.upgrade_cost : 0;
  },

  canUpgradeRoom: (roomId: string, credits: number) => {
    const room = get().getRoomById(roomId);
    return room ? credits >= room.upgrade_cost : false;
  },
});
