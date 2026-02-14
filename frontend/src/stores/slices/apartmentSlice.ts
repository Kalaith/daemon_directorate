// stores/slices/apartmentSlice.ts - Apartment and room management
import type { StateCreator } from 'zustand';
import type { Room, RoomSynergyBonus, SpecializationType } from '../../types/game';
import { advancedRooms } from '../../constants/gameData';

export interface MemorialBonuses {
  experience_bonus: number;
  morale_bonus: number;
  legacy_bonus: number;
}

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
  calculateRoomEfficiency: (room: Room) => number;
  getRoomSynergies: () => RoomSynergyBonus[];
  unlockAdvancedRoom: (roomName: string) => boolean;
  canUnlockAdvancedRoom: (roomName: string) => boolean;
  processTraining: (daemonId: string, newSpecialization: SpecializationType) => void;
  processRecovery: (daemonId: string) => void;
  processMissionPlanning: () => number;
  processEquipmentInnovation: () => string | null;
  getMemorialBonuses: () => Partial<MemorialBonuses>;
  processAutomation: () => void;
}

export type ApartmentSlice = ApartmentState & ApartmentActions;

// Initial room setup
const initialRooms: Room[] = [
  {
    id: 'living_quarters',
    name: 'Living Quarters',
    level: 1,
    bonus: '+10% daemon morale recovery',
    upgrade_cost: 200,
    assignedDaemons: [],
    maxAssignments: 2,
    roomType: 'advanced',
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
    roomType: 'operations',
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
    roomType: 'advanced',
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
    roomType: 'advanced',
    unlocked: false,
  },
  // Advanced rooms from configuration
  ...advancedRooms.map(room => ({
    id: room.name.toLowerCase().replace(/\s+/g, '_'),
    ...room,
  })),
];

export const createApartmentSlice: StateCreator<
  import('../composedStore').ComposedGameStore,
  [],
  [],
  ApartmentSlice
> = (set, get) => ({
  // Initial state
  rooms: initialRooms,
  apartmentLevel: 1,
  totalRoomUpgrades: 0,

  // Actions
  upgradeRoom: (roomId: string) => {
    const state = get();
    const composedState = get();
    const room = state.rooms.find(r => r.id === roomId || r.name === roomId);

    if (!room) {
      console.warn('Room not found:', roomId);
      return;
    }

    const canAfford =
      'canAfford' in composedState ? composedState.canAfford(room.upgrade_cost) : false;
    if (!canAfford) {
      console.warn('Cannot afford room upgrade:', room.upgrade_cost);
      return;
    }

    // Spend credits
    if ('spendCredits' in composedState) {
      const success = composedState.spendCredits(room.upgrade_cost);
      if (!success) {
        console.warn('Failed to spend credits for room upgrade');
        return;
      }
    }

    set(state => ({
      rooms: state.rooms.map(r =>
        r.id === roomId || r.name === roomId
          ? {
              ...r,
              level: r.level + 1,
              upgrade_cost: Math.floor(r.upgrade_cost * 1.5),
            }
          : r
      ),
      totalRoomUpgrades: state.totalRoomUpgrades + 1,
    }));

    console.log('Room upgraded successfully:', roomId);
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

  calculateRoomEfficiency: (room: Room) => {
    const baseEfficiency = 50 + room.level * 10;
    const assignmentBonus = (room.assignedDaemons.length / room.maxAssignments) * 20;
    return Math.min(100, baseEfficiency + assignmentBonus);
  },

  getRoomSynergies: () => {
    const state = get();
    const synergies: RoomSynergyBonus[] = [];

    // Calculate room synergies based on available rooms and their levels
    state.rooms.forEach(room => {
      if (!room.synergyBonuses) return;
      room.synergyBonuses.forEach(bonus => {
        if (
          bonus.requiredRooms.every(reqRoom =>
            state.rooms.some(r => r.name === reqRoom && r.level > 0)
          )
        ) {
          synergies.push(bonus);
        }
      });
    });

    return synergies;
  },

  unlockAdvancedRoom: (roomName: string) => {
    const state = get();
    const room = state.rooms.find(r => r.name === roomName);
    if (!room || room.unlocked) return false;

    // Basic implementation - would need access to corporate tier and resources
    const canUnlock = true;
    if (!canUnlock) return false;

    set(state => ({
      rooms: state.rooms.map(room => (room.name === roomName ? { ...room, unlocked: true } : room)),
    }));
    return true;
  },

  canUnlockAdvancedRoom: (roomName: string) => {
    const state = get();
    const room = state.rooms.find(r => r.name === roomName);
    if (!room || room.unlocked) return false;

    // Basic implementation - would need access to corporate tier and resources
    return true;
  },

  processTraining: (daemonId: string, newSpecialization: SpecializationType) => {
    // Implementation would update daemon specialization
    console.log(`Training ${daemonId} to ${newSpecialization}`);
  },

  processRecovery: (daemonId: string) => {
    // Implementation would heal daemon
    console.log(`Recovering ${daemonId}`);
  },

  processMissionPlanning: () => {
    const state = get();
    const warRoom = state.rooms.find(r => r.name === 'War Room');
    if (!warRoom || warRoom.assignedDaemons.length === 0) return 0;

    return 10 + warRoom.level * 5 + warRoom.assignedDaemons.length * 3;
  },

  processEquipmentInnovation: () => {
    const state = get();
    const rdLab = state.rooms.find(r => r.name === 'R&D Lab');
    if (!rdLab || rdLab.assignedDaemons.length === 0) return null;

    const innovationChance = 0.1 + rdLab.level * 0.05;
    if (Math.random() < innovationChance) {
      return 'prototype_equipment_' + Date.now();
    }
    return null;
  },

  getMemorialBonuses: () => {
    const state = get();
    const memorial = state.rooms.find(r => r.name === 'Memorial Chamber');
    if (!memorial || memorial.level === 0) return {};

    return {
      experience_bonus: memorial.level * 5,
      morale_bonus: memorial.level * 2,
      legacy_bonus: memorial.level * 3,
    };
  },

  processAutomation: () => {
    const state = get();
    const serverFarm = state.rooms.find(r => r.name === 'Server Farm');
    if (!serverFarm || serverFarm.assignedDaemons.length === 0) return;

    console.log('Processing automation...');
  },
});
