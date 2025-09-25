// stores/composedStore.ts - Unified store composition using domain slices
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { createDaemonSlice, type DaemonSlice } from './slices/daemonSlice';
import { createResourceSlice, type ResourceSlice } from './slices/resourceSlice';
import { createMissionSlice, type MissionSlice } from './slices/missionSlice';
import { createUISlice, type UISlice } from './slices/uiSlice';

// Combined store type
export type ComposedGameStore = DaemonSlice & ResourceSlice & MissionSlice & UISlice;

// Create the composed store
export const useGameStore = create<ComposedGameStore>()(
  persist(
    subscribeWithSelector((...a) => ({
      ...createDaemonSlice(...a),
      ...createResourceSlice(...a),
      ...createMissionSlice(...a),
      ...createUISlice(...a),
    })),
    {
      name: 'daemon-directorate-v2',
      version: 2,
      partialize: (state) => ({
        // Core game data
        resources: state.resources,
        daemons: state.daemons,
        recruitmentPool: state.recruitmentPool,
        legacyBook: state.legacyBook,
        hallOfInfamy: state.hallOfInfamy,

        // Mission data
        planets: state.planets,
        completedMissions: state.completedMissions,

        // UI state (selective)
        tutorialCompleted: state.tutorialCompleted,
        gameStarted: state.gameStarted,
        daysPassed: state.daysPassed,

        // Exclude temporary/volatile state
        // selectedDaemons, currentTab, showModals, etc.
      }),
      migrate: (persistedState: unknown, version: number) => {
        // Handle migrations from older versions
        if (version < 2) {
          return {
            ...persistedState,
            // Add new fields, rename old ones, etc.
            resourceHistory: [],
            lastHRReview: 0,
          };
        }
        return persistedState;
      },
    }
  )
);

// Selector hooks for better performance
export const useDaemons = () => useGameStore((state) => ({
  daemons: state.daemons,
  selectedDaemons: state.selectedDaemons,
  recruitmentPool: state.recruitmentPool,
  toggleDaemonSelection: state.toggleDaemonSelection,
  clearDaemonSelection: state.clearDaemonSelection,
  recruitDaemon: state.recruitDaemon,
  getActiveDaemons: state.getActiveDaemons,
}));

export const useResources = () => useGameStore((state) => ({
  resources: state.resources,
  canAfford: state.canAfford,
  spendCredits: state.spendCredits,
  addResources: state.addResources,
  resourceHistory: state.resourceHistory,
}));

export const useMissions = () => useGameStore((state) => ({
  planets: state.planets,
  activeMission: state.activeMission,
  completedMissions: state.completedMissions,
  executeMission: state.executeMission,
  selectPlanetForMission: state.selectPlanetForMission,
}));

export const useUI = () => useGameStore((state) => ({
  currentTab: state.currentTab,
  showTutorial: state.showTutorial,
  showMissionModal: state.showMissionModal,
  showMissionResults: state.showMissionResults,
  setCurrentTab: state.setCurrentTab,
  setShowTutorial: state.setShowTutorial,
  addNotification: state.addNotification,
}));

// Store actions for external use
export const gameActions = {
  initializeGame: () => useGameStore.getState().initializeGame(),
  saveGame: () => useGameStore.getState().saveGame(),
  resetGame: () => useGameStore.getState().resetGame(),
};