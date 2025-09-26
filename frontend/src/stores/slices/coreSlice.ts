// stores/slices/coreSlice.ts - Core game actions slice
import type { StateCreator } from 'zustand';
import type { CoreGameActions } from '../../types/storeInterfaces';
import type { ComposedGameStore } from '../composedStore';
import { generateId } from '../../utils/gameHelpers';

export type CoreSlice = CoreGameActions;

export const createCoreSlice: StateCreator<
  ComposedGameStore,
  [],
  [],
  CoreSlice
> = (set, get) => ({
  initializeGame: () => {
    // Initialize game when store is first created
    set((state) => ({
      ...state,
    }));
  },

  startNewGame: () => {
    // Start a fresh game - just reset basic state for now
    set(() => ({
      resources: {
        credits: 1000,
        soulEssence: 0,
        bureaucraticLeverage: 0,
        rawMaterials: 0,
      },
      daemons: [],
      equipment: [],
      gameStarted: true,
      daysPassed: 0,
    }));
  },

  resetToInitialState: () => {
    // Reset to clean initial state for testing - simplified
    set(() => ({
      resources: {
        credits: 1000,
        soulEssence: 0,
        bureaucraticLeverage: 0,
        rawMaterials: 0,
      },
      daemons: [],
      equipment: [],
      gameStarted: false,
      daysPassed: 0,
      tutorialCompleted: false,
    }));
  },

  saveGame: () => {
    // Game saving is handled automatically by Zustand persist middleware
    console.log('Game saved automatically by persist middleware');
  },

  loadGame: () => {
    // Game loading is handled automatically by Zustand persist middleware
    console.log('Game loaded automatically by persist middleware');
    return true;
  },

  resetGame: () => {
    // Full reset including tutorial state
    get().resetToInitialState();
    localStorage.removeItem('daemon-directorate-v2');
  },

  generateId,
});