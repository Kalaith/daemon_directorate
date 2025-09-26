// stores/slices/coreSlice.ts - Core game actions slice
import type { StateCreator } from 'zustand';
import type { CoreGameActions } from '../../types/storeInterfaces';
import type { ComposedGameStore } from '../composedStore';
import { generateId } from '../../utils/gameHelpers';
import { STARTER_DATA } from '../../constants/gameData';

// Using the same initial resources as resourceSlice
const INITIAL_RESOURCES = {
  credits: 500,
  soulEssence: 0,
  bureaucraticLeverage: 0,
  rawMaterials: 0,
};

export type CoreSlice = CoreGameActions;

export const createCoreSlice: StateCreator<
  ComposedGameStore,
  [],
  [],
  CoreSlice
> = (set, get) => ({
  initializeGame: () => {
    // Initialize game when store is first created
    set(state => ({
      ...state,
    }));
  },

  startNewGame: () => {
    // Start a fresh game with starter data
    set(() => ({
      resources: INITIAL_RESOURCES,
      daemons: STARTER_DATA.starter_daemons.map(daemon => ({
        ...daemon,
        id: generateId(),
        isActive: true,
        assignments: [],
        equipment: null,
      })),
      equipment: STARTER_DATA.starter_equipment.map(equipment => ({
        ...equipment,
        id: generateId(),
      })),
      rooms: STARTER_DATA.apartment_rooms,
      gameStarted: true,
      daysPassed: 0,
    }));
  },

  resetToInitialState: () => {
    // Reset to clean initial state for testing - simplified
    set(() => ({
      resources: INITIAL_RESOURCES,
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
