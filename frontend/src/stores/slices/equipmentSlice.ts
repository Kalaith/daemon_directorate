// stores/slices/equipmentSlice.ts - Equipment management and crafting system
import type { StateCreator } from 'zustand';
import type { Equipment, EquipmentSetBonus } from '../../types/game';
import { starterData, equipmentSets } from '../../constants/gameData';

// Helper function
const generateId = () => Math.random().toString(36).substring(2, 15);

export interface EquipmentState {
  equipment: Equipment[];
  totalEquipmentCrafted: number;
  equipmentRepairCosts: Record<string, number>;
}

export interface EquipmentActions {
  repairEquipment: (equipmentId: string) => void;
  craftEquipment: (equipmentId: string) => boolean;
  craftItem: (itemType: string) => void;
  assignEquipment: (equipmentId: string, daemonId: string) => void;
  unassignEquipment: (equipmentId: string) => void;
  getEquipmentById: (equipmentId: string) => Equipment | undefined;
  getUnassignedEquipment: () => Equipment[];
  degradeEquipment: (equipmentId: string, amount: number) => void;
  calculateRepairCost: (durability: number) => number;
  calculateSetBonuses: (daemonId: string) => EquipmentSetBonus[];
  getEquipmentByRarity: (rarity: Equipment['rarity']) => Equipment[];
  upgradeEquipmentRarity: (equipmentId: string) => void;
}

export type EquipmentSlice = EquipmentState & EquipmentActions;

// Initial equipment setup
const initialEquipment: Equipment[] = [
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
    rarity: 'Common',
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
    rarity: 'Common',
  },
];

export const createEquipmentSlice: StateCreator<
  import('../composedStore').ComposedGameStore,
  [],
  [],
  EquipmentSlice
> = (set, get) => ({
  // Initial state
  equipment: initialEquipment,
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

  craftEquipment: (equipmentId: string) => {
    // Find equipment template
    const template = starterData.starter_equipment.find(
      eq => eq.name === equipmentId
    );
    if (!template) {
      console.warn('Equipment template not found:', equipmentId);
      return false;
    }

    const craftingCost = 50; // Default cost
    const canAfford = get().canAfford(craftingCost);

    if (!canAfford) {
      console.warn('Cannot afford crafting cost:', craftingCost);
      return false;
    }

    // Actually spend the credits
    const success = get().spendCredits(craftingCost);
    if (!success) {
      console.warn('Failed to spend credits for crafting');
      return false;
    }

    const newEquipment: Equipment = {
      id: generateId(),
      name: template.name,
      type: template.type,
      ability: template.ability,
      assignedTo: null,
      rarity: template.rarity || 'Common',
      durability: template.durability || 100,
      generation: 0,
      legacyBonus: 0,
      history: [],
      setBonuses: template.setBonuses,
    };

    set(state => ({
      equipment: [...state.equipment, newEquipment],
      totalEquipmentCrafted: state.totalEquipmentCrafted + 1,
    }));

    console.log(
      'Equipment crafted successfully:',
      equipmentId,
      'Cost:',
      craftingCost
    );
    return true;
  },

  craftItem: (itemType: string) => {
    // Legacy function - delegate to craftEquipment
    get().craftEquipment(itemType);
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

  calculateSetBonuses: (daemonId: string) => {
    const state = get();
    const daemonEquipment = state.equipment.filter(
      eq => eq.assignedTo === daemonId
    );
    const setBonuses: EquipmentSetBonus[] = [];

    // Group equipment by set name
    const setGroups = daemonEquipment.reduce(
      (acc, item) => {
        if (item.setName) {
          if (!acc[item.setName]) acc[item.setName] = [];
          acc[item.setName].push(item);
        }
        return acc;
      },
      {} as Record<string, Equipment[]>
    );

    // Calculate bonuses for each set
    Object.entries(setGroups).forEach(([setName, items]) => {
      if (!Object.prototype.hasOwnProperty.call(equipmentSets, setName)) return;
      const setConfig = equipmentSets[setName as keyof typeof equipmentSets];
      if (setConfig) {
        setConfig.setBonuses.forEach(bonus => {
          if (items.length >= bonus.requiredPieces) {
            setBonuses.push({
              setName,
              requiredPieces: bonus.requiredPieces,
              activeBonus: true,
              effects: bonus.effects.map(effect => ({ ...effect })),
            });
          }
        });
      }
    });

    return setBonuses;
  },

  getEquipmentByRarity: (rarity: Equipment['rarity']) => {
    return get().equipment.filter(item => item.rarity === rarity);
  },

  upgradeEquipmentRarity: (equipmentId: string) => {
    set(state => ({
      equipment: state.equipment.map(item => {
        if (item.id === equipmentId) {
          const rarityUpgrade = {
            Common: 'Uncommon',
            Uncommon: 'Rare',
            Rare: 'Legendary',
            Legendary: 'Cursed',
            Cursed: 'Cursed',
          } as const;

          return {
            ...item,
            rarity: rarityUpgrade[item.rarity] as Equipment['rarity'],
            history: [
              ...item.history,
              `Upgraded to ${rarityUpgrade[item.rarity]} quality`,
            ],
          };
        }
        return item;
      }),
    }));
  },
});
