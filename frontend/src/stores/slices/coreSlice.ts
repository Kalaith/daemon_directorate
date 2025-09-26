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
    // Initialize game with starter data (called on first load)
    const state = get();
    if (state.daemons.length === 0 && !state.gameStarted) {
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
          assignedTo: null,
        })),
        rooms: STARTER_DATA.apartment_rooms.map(room => ({
          ...room,
          id: generateId(),
        })),
        gameStarted: false, // Not fully started until player action
        daysPassed: 0,
      }));
    }
  },

  startNewGame: () => {
    // Start a fresh game with starter data
    const composedState = get();

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
        assignedTo: null,
      })),
      rooms: STARTER_DATA.apartment_rooms.map(room => ({
        ...room,
        id: generateId(),
      })),
      planets:
        STARTER_DATA.planets.map(planet => ({
          ...planet,
          id: generateId(),
          conquered: false,
          lastMission: null,
        })) || [],
      gameStarted: true,
      daysPassed: 0,
    }));

    // Initialize recruitment pool
    if ('generateRecruitmentPool' in composedState) {
      composedState.generateRecruitmentPool();
    }
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
