// stores/slices/equipmentSlice.ts - Equipment management and crafting
import type { StateCreator } from 'zustand';
import type { Equipment } from '../../types/game';

export interface EquipmentState {
  equipment: Equipment[];
  totalEquipmentCrafted: number;
  equipmentRepairCosts: Record<string, number>;
}

export interface EquipmentActions {
  repairEquipment: (equipmentId: string) => void;
  craftItem: (itemType: string) => void;
  assignEquipment: (equipmentId: string, daemonId: string) => void;
  unassignEquipment: (equipmentId: string) => void;
  getEquipmentById: (equipmentId: string) => Equipment | undefined;
  getUnassignedEquipment: () => Equipment[];
  degradeEquipment: (equipmentId: string, amount: number) => void;
  calculateRepairCost: (durability: number) => number;
}

export type EquipmentSlice = EquipmentState & EquipmentActions;

// Initial equipment setup
const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'starter_briefcase',
    name: 'Standard Issue Briefcase',
    type: 'Infiltration',
    durability: 85,
    ability: 'Blend In (+15 stealth)',
    assignedTo: null,
    generation: 1,
    legacyBonus: 0,
    history: [],
  },
  {
    id: 'starter_tie',
    name: 'Corporate Tie of Binding',
    type: 'Combat',
    durability: 90,
    ability: 'Intimidate (+10 combat)',
    assignedTo: null,
    generation: 1,
    legacyBonus: 0,
    history: [],
  },
];

export const createEquipmentSlice: StateCreator<
  EquipmentSlice,
  [],
  [],
  EquipmentSlice
> = (set, get) => ({
  // Initial state
  equipment: INITIAL_EQUIPMENT,
  totalEquipmentCrafted: 0,
  equipmentRepairCosts: {},

  // Actions
  repairEquipment: (equipmentId: string) => {
    set(state => ({
      equipment: state.equipment.map(item => {
        if (item.id === equipmentId) {
          return {
            ...item,
            durability: Math.min(100, item.durability + 30), // Repair by 30%
          };
        }
        return item;
      }),
    }));
  },

  craftItem: (itemType: string) => {
    const newEquipmentMap: Record<string, Omit<Equipment, 'id'>> = {
      briefcase: {
        name: 'Standard Issue Briefcase',
        type: 'Infiltration',
        durability: 100,
        ability: 'Blend In (+15 stealth)',
        assignedTo: null,
        generation: 1,
        legacyBonus: 0,
        history: ['Crafted in Equipment Depot'],
      },
      tie: {
        name: 'Corporate Tie of Binding',
        type: 'Combat',
        durability: 100,
        ability: 'Intimidate (+10 combat)',
        assignedTo: null,
        generation: 1,
        legacyBonus: 0,
        history: ['Crafted in Equipment Depot'],
      },
      calculator: {
        name: 'Cursed Calculator',
        type: 'Sabotage',
        durability: 100,
        ability: 'Data Corruption (+20 sabotage)',
        assignedTo: null,
        generation: 1,
        legacyBonus: 0,
        history: ['Forged with raw materials'],
      },
    };

    const template = newEquipmentMap[itemType];
    if (!template) return;

    const newEquipment: Equipment = {
      ...template,
      id: `${itemType}_${Date.now()}`,
    };

    set(state => ({
      equipment: [...state.equipment, newEquipment],
      totalEquipmentCrafted: state.totalEquipmentCrafted + 1,
    }));
  },

  assignEquipment: (equipmentId: string, daemonId: string) => {
    set(state => ({
      equipment: state.equipment.map(item => {
        if (item.id === equipmentId) {
          return {
            ...item,
            assignedTo: daemonId,
            history: [...item.history, `Assigned to daemon ${daemonId}`],
          };
        }
        // Unassign any other equipment from this daemon
        if (item.assignedTo === daemonId && item.id !== equipmentId) {
          return {
            ...item,
            assignedTo: null,
            history: [...item.history, `Unassigned from daemon ${daemonId}`],
          };
        }
        return item;
      }),
    }));
  },

  unassignEquipment: (equipmentId: string) => {
    set(state => ({
      equipment: state.equipment.map(item => {
        if (item.id === equipmentId && item.assignedTo) {
          return {
            ...item,
            assignedTo: null,
            history: [...item.history, `Unassigned from daemon`],
          };
        }
        return item;
      }),
    }));
  },

  getEquipmentById: (equipmentId: string) => {
    return get().equipment.find(item => item.id === equipmentId);
  },

  getUnassignedEquipment: () => {
    return get().equipment.filter(item => !item.assignedTo);
  },

  degradeEquipment: (equipmentId: string, amount: number) => {
    set(state => ({
      equipment: state.equipment.map(item => {
        if (item.id === equipmentId) {
          const newDurability = Math.max(0, item.durability - amount);
          return {
            ...item,
            durability: newDurability,
            history:
              newDurability <= 0
                ? [...item.history, 'Equipment destroyed from wear']
                : [...item.history, `Durability reduced by ${amount}%`],
          };
        }
        return item;
      }),
    }));
  },

  calculateRepairCost: (durability: number) => {
    return Math.floor((100 - durability) * 2);
  },
});
