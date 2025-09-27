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
  
  // Advanced Rival AI
  processRivalActions: () => void;
  executeRivalStrategy: (rivalId: string) => void;
  rivalAttackPlayer: (rivalId: string) => void;
  rivalEspionage: (rivalId: string) => void;
  updateRivalStrategy: (rivalId: string) => void;
  initializeRivals: () => void;
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
    const state = get();
    const rival = state.corporateRivals.find(r => r.id === rivalId);
    if (!rival) return;

    const successChance = get().calculateRivalSuccessChance(rivalId);
    const success = Math.random() < successChance;

    if (success) {
      // Defeat the rival
      set(s => ({
        corporateRivals: s.corporateRivals.map(r =>
          r.id === rivalId ? { ...r, defeated: true } : r
        ),
      }));

      // Grant rewards
      const composedState = get();
      if ('addResources' in composedState) {
        composedState.addResources(
          rival.strength * 10,
          Math.floor(rival.strength / 10),
          rival.strength / 2
        );
      }
    } else {
      // Rival counterattack
      console.log(`Failed to defeat ${rival.name}. Rival grows stronger!`);
      set(s => ({
        corporateRivals: s.corporateRivals.map(r =>
          r.id === rivalId 
            ? { 
                ...r, 
                strength: Math.min(100, r.strength + 5),
                relationshipWithPlayer: r.relationshipWithPlayer - 10
              } 
            : r
        ),
      }));
    }
  },

  calculateRivalSuccessChance: (rivalId: string) => {
    const state = get();
    const rival = state.corporateRivals.find(r => r.id === rivalId);
    if (!rival) return 0;

    const tierBonus = state.corporateTier.level * 0.1;
    const strengthPenalty = rival.strength * 0.01;
    
    return Math.max(0.1, Math.min(0.9, 0.5 + tierBonus - strengthPenalty));
  },

  // Advanced Rival AI Methods
  processRivalActions: () => {
    const state = get();
    state.corporateRivals
      .filter(r => !r.defeated && state.daysPassed > r.lastActionDay + 3)
      .forEach(rival => {
        get().executeRivalStrategy(rival.id);
      });
  },

  executeRivalStrategy: (rivalId: string) => {
    const state = get();
    const rival = state.corporateRivals.find(r => r.id === rivalId);
    if (!rival) return;

    const composedState = get();
    
    switch (rival.currentStrategy.type) {
      case 'aggressive_expansion':
        // Try to claim territories/planets
        if (rival.aiPersonality.aggression > 70) {
          get().rivalAttackPlayer(rivalId);
        }
        break;
      case 'economic_dominance':
        // Manipulate markets
        if ('addResources' in composedState) {
          composedState.addResources(-50);
          console.log(`${rival.name} manipulates markets, reducing your income!`);
        }
        break;
      case 'shadow_operations':
        // Espionage attempts
        get().rivalEspionage(rivalId);
        break;
      case 'diplomatic_manipulation':
        // Influence player decisions
        if (rival.aiPersonality.cunning > 80) {
          console.log(`${rival.name} attempts to influence your corporate decisions`);
        }
        break;
    }

    // Update last action day
    set(s => ({
      corporateRivals: s.corporateRivals.map(r =>
        r.id === rivalId ? { ...r, lastActionDay: s.daysPassed } : r
      ),
    }));
  },

  rivalAttackPlayer: (rivalId: string) => {
    const state = get();
    const rival = state.corporateRivals.find(r => r.id === rivalId);
    if (!rival) return;

    const attackSuccess = Math.random() < (rival.strength / 150);
    const composedState = get();
    
    if (attackSuccess && 'addResources' in composedState) {
      composedState.addResources( 
        -100 - rival.strength,
        0,
        -10
      );
      console.log(`${rival.name} launches successful hostile action against your operations!`);
    }
  },

  rivalEspionage: (rivalId: string) => {
    const state = get();
    const rival = state.corporateRivals.find(r => r.id === rivalId);
    if (!rival) return;

    const espionageSuccess = Math.random() < (rival.aiPersonality.cunning / 100);
    
    if (espionageSuccess) {
      // Spy on player operations
      console.log(`${rival.name} successfully gathers intelligence on your operations`);
      
      set(s => ({
        corporateRivals: s.corporateRivals.map(r =>
          r.id === rivalId 
            ? { 
                ...r, 
                resources: {
                  ...r.resources,
                  intelligence: Math.min(100, r.resources.intelligence + 10)
                }
              } 
            : r
        ),
      }));
    }
  },

  updateRivalStrategy: (rivalId: string) => {
    const state = get();
    const rival = state.corporateRivals.find(r => r.id === rivalId);
    if (!rival) return;

    // AI adapts strategy based on current situation
    
    let newStrategy = rival.currentStrategy.type;
    
    // Strategy selection based on personality and situation
    if (rival.relationshipWithPlayer < -50 && rival.aiPersonality.aggression > 60) {
      newStrategy = 'aggressive_expansion';
    } else if (rival.resources.intelligence > 60 && rival.aiPersonality.cunning > 70) {
      newStrategy = 'shadow_operations';
    } else if (rival.aiPersonality.ambition > 80) {
      newStrategy = 'economic_dominance';
    }

    if (newStrategy !== rival.currentStrategy.type) {
      set(s => ({
        corporateRivals: s.corporateRivals.map(r =>
          r.id === rivalId 
            ? { 
                ...r,
                currentStrategy: {
                  type: newStrategy as any,
                  priority: Math.floor(Math.random() * 5) + 5,
                  duration: Math.floor(Math.random() * 20) + 10,
                  targetPlayer: newStrategy === 'aggressive_expansion' || newStrategy === 'shadow_operations'
                }
              } 
            : r
        ),
      }));
    }
  },

  initializeRivals: () => {
    const state = get();
    if (state.corporateRivals.length === 0) {
      // Import RIVAL_CORPORATIONS and add them
      import('../../constants/gameData').then(({ RIVAL_CORPORATIONS }) => {
        set(() => ({
          corporateRivals: [...RIVAL_CORPORATIONS]
        }));
      });
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
