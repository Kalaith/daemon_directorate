// stores/slices/corporateSlice.ts - Corporate progression system
import type { StateCreator } from 'zustand';
import type {
  CorporateTier,
  CorporateRival,
  CorporateEvent,
} from '../../types/game';
import { CORPORATE_TIERS, CORPORATE_EVENTS } from '../../constants/gameData';

export interface CorporateState {
  corporateTier: CorporateTier;
  promotionProgress: Record<string, number>;
  daysPassed: number;
  corporateRivals: CorporateRival[];
  activeEventChains: Record<string, {
    chainId: string;
    currentPosition: number;
    storylineData: Record<string, any>;
    pendingEvents: {
      eventId: string;
      triggerDay: number;
      condition?: string;
    }[];
  }>;
}

export interface CorporateActions {
  meetsRequirements: (requirements: CorporateTier['requirements']) => boolean;
  incrementDay: () => void;
  promoteToNextTier: () => boolean;
  checkPromotion: () => void;
  addCorporateRival: (rival: CorporateRival) => void;
  engageRival: (rivalId: string) => void;
  calculateRivalSuccessChance: (rivalId: string) => number;
  triggerRandomEvent: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;
  startEventChain: (chainId: string) => void;
  processEventChains: () => void;
  updateChainStorylineData: (chainId: string, data: Record<string, any>) => void;
}

export type CorporateSlice = CorporateState & CorporateActions;

export const createCorporateSlice: StateCreator<
  import('../composedStore').ComposedGameStore,
  [],
  [],
  CorporateSlice
> = (set, get) => ({
  // Initial state
  corporateTier: CORPORATE_TIERS[0], // Start with Associate tier
  promotionProgress: {},
  daysPassed: 0,
  corporateRivals: [],
  activeEventChains: {},

  // Actions
  meetsRequirements: (requirements: CorporateTier['requirements']) => {
    const { daysPassed } = get();

    return Object.entries(requirements).every(([key, value]) => {
      switch (key) {
        case 'daysLived':
          return daysPassed >= (value as number);
        case 'planetsControlled':
          return true; // TODO: Check actual conquered planets
        case 'legacyGenerations':
          return true; // TODO: Check legacy book
        case 'defeatedRivals':
          return true; // TODO: Check corporate rivals
        case 'complianceAudits':
          return true; // TODO: Check compliance system
        case 'completedHRReviews':
          return true; // TODO: Check HR reviews
        default:
          return true;
      }
    });
  },

  incrementDay: () => {
    set(state => ({
      daysPassed: state.daysPassed + 1,
    }));
  },

  promoteToNextTier: () => {
    const { corporateTier, meetsRequirements } = get();
    const currentIndex = CORPORATE_TIERS.findIndex(
      tier => tier.id === corporateTier.id
    );
    const nextTier = CORPORATE_TIERS[currentIndex + 1];

    if (!nextTier || !meetsRequirements(nextTier.requirements)) {
      return false;
    }

    set({ corporateTier: nextTier });
    return true;
  },

  checkPromotion: () => {
    // Check if promotion is possible and apply it
    get().promoteToNextTier();
  },

  addCorporateRival: (rival: CorporateRival) => {
    set(state => ({
      corporateRivals: [...state.corporateRivals, rival],
    }));
  },

  engageRival: (rivalId: string) => {
    set(state => ({
      corporateRivals: state.corporateRivals.map(rival =>
        rival.id === rivalId ? { ...rival, defeated: true } : rival
      ),
    }));
  },

  calculateRivalSuccessChance: (rivalId: string) => {
    const { corporateRivals } = get();
    const rival = corporateRivals.find(r => r.id === rivalId);
    if (!rival) return 0;

    // Simple calculation based on threat level
    switch (rival.threat) {
      case 'low':
        return 80;
      case 'medium':
        return 60;
      case 'high':
        return 40;
      default:
        return 50;
    }
  },

  triggerRandomEvent: () => {
    const randomEventTemplate =
      CORPORATE_EVENTS[Math.floor(Math.random() * CORPORATE_EVENTS.length)];
    const randomEvent: CorporateEvent = {
      ...randomEventTemplate,
      timestamp: Date.now(),
    } as CorporateEvent;
    const composedState = get();
    if ('setShowEventModal' in composedState) {
      composedState.setShowEventModal(true, randomEvent);
    }
  },

  resolveEvent: (eventId: string, choiceIndex?: number) => {
    // Suppress unused parameter warnings - these will be used when event effects are implemented
    void eventId;
    void choiceIndex;

    const composedState = get();
    if ('setShowEventModal' in composedState) {
      composedState.setShowEventModal(false);
    }
    // TODO: Apply event effects based on choice
  },

  startEventChain: (chainId: string) => {
    set(state => ({
      activeEventChains: {
        ...state.activeEventChains,
        [chainId]: {
          chainId,
          currentPosition: 0,
          storylineData: {},
          pendingEvents: []
        }
      }
    }));
  },

  processEventChains: () => {
    const state = get();
    Object.values(state.activeEventChains).forEach(chain => {
      const pendingToday = chain.pendingEvents.filter(
        pe => pe.triggerDay <= state.daysPassed
      );
      
      pendingToday.forEach(event => {
        // Trigger the event
        const composedState = get();
        if ('setShowEventModal' in composedState) {
          // Find event template and create event instance
          // This would need to be implemented with proper event loading
          console.log(`Triggering chained event: ${event.eventId}`);
        }
      });

      // Remove triggered events
      set(s => ({
        activeEventChains: {
          ...s.activeEventChains,
          [chain.chainId]: {
            ...chain,
            pendingEvents: chain.pendingEvents.filter(
              pe => pe.triggerDay > s.daysPassed
            )
          }
        }
      }));
    });
  },

  updateChainStorylineData: (chainId: string, data: Record<string, any>) => {
    set(state => ({
      activeEventChains: {
        ...state.activeEventChains,
        [chainId]: {
          ...state.activeEventChains[chainId],
          storylineData: {
            ...state.activeEventChains[chainId]?.storylineData,
            ...data
          }
        }
      }
    }));
  },
});
