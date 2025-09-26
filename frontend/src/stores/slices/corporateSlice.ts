// stores/slices/corporateSlice.ts - Corporate progression system
import type { StateCreator } from 'zustand';
import type { CorporateTier, CorporateRival } from '../../types/game';
import { CORPORATE_TIERS } from '../../constants/gameData';

export interface CorporateState {
  corporateTier: CorporateTier;
  promotionProgress: Record<string, number>;
  daysPassed: number;
  corporateRivals: CorporateRival[];
}

export interface CorporateActions {
  meetsRequirements: (requirements: CorporateTier['requirements']) => boolean;
  incrementDay: () => void;
  promoteToNextTier: () => boolean;
  addCorporateRival: (rival: CorporateRival) => void;
}

export type CorporateSlice = CorporateState & CorporateActions;

export const createCorporateSlice: StateCreator<
  CorporateSlice,
  [],
  [],
  CorporateSlice
> = (set, get) => ({
  // Initial state
  corporateTier: CORPORATE_TIERS[0], // Start with Associate tier
  promotionProgress: {},
  daysPassed: 0,
  corporateRivals: [],

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

  addCorporateRival: (rival: CorporateRival) => {
    set(state => ({
      corporateRivals: [...state.corporateRivals, rival],
    }));
  },
});
