// stores/slices/endgameSlice.ts - Endgame and prestige system
import type { StateCreator } from 'zustand';
import type { EndgameState, PrestigeBonus } from '../../types/game';

export interface EndgameSliceState {
  endgameState: EndgameState;
  prestigeBonuses: PrestigeBonus[];
  totalRestarts: number;
}

export interface EndgameActions {
  performCorporateRestructuring: () => void;
  triggerEnding: (
    managementStyle: EndgameState['managementStyle'],
    endingType: string
  ) => void;
  addPrestigeBonus: (bonus: PrestigeBonus) => void;
  resetToNewGame: () => void;
  calculatePrestigeMultiplier: () => number;
}

export type EndgameSlice = EndgameSliceState & EndgameActions;

const INITIAL_ENDGAME_STATE: EndgameState = {
  managementStyle: 'none',
  endingAchieved: false,
  endingType: '',
  prestigeLevel: 0,
  permanentBonuses: [],
};

export const createEndgameSlice: StateCreator<
  import('../composedStore').ComposedGameStore,
  [],
  [],
  EndgameSlice
> = (set, get) => ({
  // Initial state
  endgameState: INITIAL_ENDGAME_STATE,
  prestigeBonuses: [],
  totalRestarts: 0,

  // Actions
  performCorporateRestructuring: () => {
    const { endgameState } = get();

    set(state => ({
      endgameState: {
        ...INITIAL_ENDGAME_STATE,
        prestigeLevel: endgameState.prestigeLevel + 1,
        permanentBonuses: endgameState.permanentBonuses, // Keep bonuses
      },
      totalRestarts: state.totalRestarts + 1,
    }));
  },

  triggerEnding: (
    managementStyle: EndgameState['managementStyle'],
    endingType: string
  ) => {
    set(state => ({
      endgameState: {
        ...state.endgameState,
        managementStyle,
        endingAchieved: true,
        endingType,
      },
    }));
  },

  addPrestigeBonus: (bonus: PrestigeBonus) => {
    set(state => ({
      endgameState: {
        ...state.endgameState,
        permanentBonuses: [...state.endgameState.permanentBonuses, bonus],
      },
      prestigeBonuses: [...state.prestigeBonuses, bonus],
    }));
  },

  resetToNewGame: () => {
    const { endgameState } = get();

    set({
      endgameState: {
        ...INITIAL_ENDGAME_STATE,
        prestigeLevel: endgameState.prestigeLevel,
        permanentBonuses: endgameState.permanentBonuses,
      },
    });
  },

  calculatePrestigeMultiplier: () => {
    const { endgameState } = get();
    // Base 1.0 + 10% per prestige level
    return 1.0 + endgameState.prestigeLevel * 0.1;
  },
});
