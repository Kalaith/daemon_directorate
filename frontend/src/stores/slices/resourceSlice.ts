// stores/slices/resourceSlice.ts - Pure resource management
import type { StateCreator } from 'zustand';
import type { GameResources } from '../../types/game';

export interface ResourceState {
  resources: GameResources;
  resourceHistory: Array<{
    timestamp: number;
    change: Partial<GameResources>;
    reason: string;
  }>;
}

export interface ResourceActions {
  // Core resource management
  canAfford: (cost: number) => boolean;
  spendCredits: (amount: number) => boolean;
  addResources: (
    credits?: number,
    soulEssence?: number,
    bureaucraticLeverage?: number,
    rawMaterials?: number
  ) => void;

  // Bulk operations
  addResourceBatch: (resources: Partial<GameResources>, reason: string) => void;
  spendResourceBatch: (
    resources: Partial<GameResources>,
    reason: string
  ) => boolean;

  // Resource tracking
  getResourceHistory: (
    resourceType?: keyof GameResources
  ) => typeof ResourceState.prototype.resourceHistory;
  getTotalResourcesEarned: (resourceType: keyof GameResources) => number;
  getResourceChangeInPeriod: (
    resourceType: keyof GameResources,
    hours: number
  ) => number;

  // Resource validation
  validateResourceTransaction: (resources: Partial<GameResources>) => boolean;
  getResourceDeficit: (
    required: Partial<GameResources>
  ) => Partial<GameResources>;

  // Resource utilities
  getResourceValue: (resourceType: keyof GameResources) => number;
  resetResources: () => void;
}

export type ResourceSlice = ResourceState & ResourceActions;

const INITIAL_RESOURCES: GameResources = {
  credits: 500,
  soulEssence: 0,
  bureaucraticLeverage: 0,
  rawMaterials: 0,
};

export const createResourceSlice: StateCreator<
  ResourceSlice,
  [],
  [],
  ResourceSlice
> = (set, get) => ({
  // Initial state
  resources: INITIAL_RESOURCES,
  resourceHistory: [],

  // Actions
  canAfford: (cost: number) => {
    return get().resources.credits >= cost;
  },

  spendCredits: (amount: number) => {
    const { resources } = get();
    if (resources.credits >= amount) {
      set(state => ({
        resources: {
          ...state.resources,
          credits: state.resources.credits - amount,
        },
        resourceHistory: [
          ...state.resourceHistory,
          {
            timestamp: Date.now(),
            change: { credits: -amount },
            reason: 'Credit expenditure',
          },
        ],
      }));
      return true;
    }
    return false;
  },

  addResources: (
    credits = 0,
    soulEssence = 0,
    bureaucraticLeverage = 0,
    rawMaterials = 0
  ) => {
    const changes: Partial<GameResources> = {};
    if (credits !== 0) changes.credits = credits;
    if (soulEssence !== 0) changes.soulEssence = soulEssence;
    if (bureaucraticLeverage !== 0)
      changes.bureaucraticLeverage = bureaucraticLeverage;
    if (rawMaterials !== 0) changes.rawMaterials = rawMaterials;

    set(state => ({
      resources: {
        credits: Math.max(0, state.resources.credits + credits),
        soulEssence: Math.max(0, state.resources.soulEssence + soulEssence),
        bureaucraticLeverage: Math.max(
          0,
          state.resources.bureaucraticLeverage + bureaucraticLeverage
        ),
        rawMaterials: Math.max(0, state.resources.rawMaterials + rawMaterials),
      },
      resourceHistory: [
        ...state.resourceHistory,
        {
          timestamp: Date.now(),
          change: changes,
          reason: 'Resource addition',
        },
      ],
    }));
  },

  addResourceBatch: (
    resourceChanges: Partial<GameResources>,
    reason: string
  ) => {
    set(state => {
      const newResources = { ...state.resources };

      Object.entries(resourceChanges).forEach(([key, value]) => {
        const resourceKey = key as keyof GameResources;
        if (typeof value === 'number') {
          newResources[resourceKey] = Math.max(
            0,
            newResources[resourceKey] + value
          );
        }
      });

      return {
        resources: newResources,
        resourceHistory: [
          ...state.resourceHistory,
          {
            timestamp: Date.now(),
            change: resourceChanges,
            reason,
          },
        ],
      };
    });
  },

  spendResourceBatch: (
    resourceCosts: Partial<GameResources>,
    reason: string
  ) => {
    const { validateResourceTransaction } = get();

    // Check if we have enough resources
    if (!validateResourceTransaction(resourceCosts)) {
      return false;
    }

    // Spend the resources
    const spentResources: Partial<GameResources> = {};
    Object.entries(resourceCosts).forEach(([key, value]) => {
      if (typeof value === 'number') {
        spentResources[key as keyof GameResources] = -value;
      }
    });

    set(state => {
      const newResources = { ...state.resources };

      Object.entries(resourceCosts).forEach(([key, cost]) => {
        const resourceKey = key as keyof GameResources;
        if (typeof cost === 'number') {
          newResources[resourceKey] = Math.max(
            0,
            newResources[resourceKey] - cost
          );
        }
      });

      return {
        resources: newResources,
        resourceHistory: [
          ...state.resourceHistory,
          {
            timestamp: Date.now(),
            change: spentResources,
            reason,
          },
        ],
      };
    });

    return true;
  },

  getResourceHistory: (resourceType?: keyof GameResources) => {
    const { resourceHistory } = get();

    if (!resourceType) {
      return resourceHistory;
    }

    return resourceHistory.filter(entry =>
      Object.prototype.hasOwnProperty.call(entry.change, resourceType)
    );
  },

  getTotalResourcesEarned: (resourceType: keyof GameResources) => {
    const { resourceHistory } = get();

    return resourceHistory.reduce((total, entry) => {
      const change = entry.change[resourceType];
      return total + (typeof change === 'number' && change > 0 ? change : 0);
    }, 0);
  },

  getResourceChangeInPeriod: (
    resourceType: keyof GameResources,
    hours: number
  ) => {
    const { resourceHistory } = get();
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;

    return resourceHistory
      .filter(entry => entry.timestamp >= cutoffTime)
      .reduce((total, entry) => {
        const change = entry.change[resourceType];
        return total + (typeof change === 'number' ? change : 0);
      }, 0);
  },

  validateResourceTransaction: (required: Partial<GameResources>) => {
    const { resources } = get();

    return Object.entries(required).every(([key, amount]) => {
      const resourceKey = key as keyof GameResources;
      const available = resources[resourceKey];
      return typeof amount === 'number' ? available >= amount : true;
    });
  },

  getResourceDeficit: (required: Partial<GameResources>) => {
    const { resources } = get();
    const deficit: Partial<GameResources> = {};

    Object.entries(required).forEach(([key, amount]) => {
      const resourceKey = key as keyof GameResources;
      const available = resources[resourceKey];

      if (typeof amount === 'number' && available < amount) {
        deficit[resourceKey] = amount - available;
      }
    });

    return deficit;
  },

  getResourceValue: (resourceType: keyof GameResources) => {
    return get().resources[resourceType];
  },

  resetResources: () => {
    set({
      resources: INITIAL_RESOURCES,
      resourceHistory: [],
    });
  },
});
