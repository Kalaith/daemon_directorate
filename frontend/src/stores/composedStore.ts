// stores/composedStore.ts - Unified store composition using domain slices
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { createDaemonSlice, type DaemonSlice } from './slices/daemonSlice';
import {
  createResourceSlice,
  type ResourceSlice,
} from './slices/resourceSlice';
import { createMissionSlice, type MissionSlice } from './slices/missionSlice';
import { createUISlice, type UISlice } from './slices/uiSlice';
import {
  createCorporateSlice,
  type CorporateSlice,
} from './slices/corporateSlice';
import {
  createComplianceSlice,
  type ComplianceSlice,
} from './slices/complianceSlice';
import { createEndgameSlice, type EndgameSlice } from './slices/endgameSlice';
import {
  createApartmentSlice,
  type ApartmentSlice,
} from './slices/apartmentSlice';
import {
  createEquipmentSlice,
  type EquipmentSlice,
} from './slices/equipmentSlice';
import { createCoreSlice, type CoreSlice } from './slices/coreSlice';

// Combined store type
export type ComposedGameStore = DaemonSlice &
  ResourceSlice &
  MissionSlice &
  UISlice &
  CorporateSlice &
  ComplianceSlice &
  EndgameSlice &
  ApartmentSlice &
  EquipmentSlice &
  CoreSlice;

// Create the composed store
export const useGameStore = create<ComposedGameStore>()(
  persist(
    subscribeWithSelector((...a) => ({
      ...createDaemonSlice(...a),
      ...createResourceSlice(...a),
      ...createMissionSlice(...a),
      ...createUISlice(...a),
      ...createCorporateSlice(...a),
      ...createComplianceSlice(...a),
      ...createEndgameSlice(...a),
      ...createApartmentSlice(...a),
      ...createEquipmentSlice(...a),
      ...createCoreSlice(...a),
    })),
    {
      name: 'daemon-directorate-v2',
      version: 2,
      partialize: state => ({
        // Resource slice
        resources: state.resources,
        resourceHistory: state.resourceHistory,

        // Daemon slice
        daemons: state.daemons,
        recruitmentPool: state.recruitmentPool,
        legacyBook: state.legacyBook,
        hallOfInfamy: state.hallOfInfamy,

        // Mission slice
        planets: state.planets,
        completedMissions: state.completedMissions,

        // Corporate slice
        corporateTier: state.corporateTier,
        promotionProgress: state.promotionProgress,
        daysPassed: state.daysPassed,
        corporateRivals: state.corporateRivals,
        activeEventChains: state.activeEventChains,

        // Compliance slice
        complianceTasks: state.complianceTasks,
        complianceDeadlines: state.complianceDeadlines,
        completedAudits: state.completedAudits,
        hrReviewsCompleted: state.hrReviewsCompleted,

        // Endgame slice
        endgameState: state.endgameState,
        prestigeBonuses: state.prestigeBonuses,
        totalRestarts: state.totalRestarts,

        // Apartment slice
        rooms: state.rooms,
        apartmentLevel: state.apartmentLevel,
        totalRoomUpgrades: state.totalRoomUpgrades,

        // Equipment slice
        equipment: state.equipment,
        totalEquipmentCrafted: state.totalEquipmentCrafted,
        equipmentRepairCosts: state.equipmentRepairCosts,

        // UI state (selective)
        tutorialCompleted: state.tutorialCompleted,
        gameStarted: state.gameStarted,

        // Exclude temporary/volatile state
        // selectedDaemons, currentTab, showModals, etc.
      }),
      migrate: (persistedState: unknown, version: number) => {
        // Handle migrations from older versions
        if (version < 2) {
          return {
            ...(persistedState as object),
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
export const useDaemons = () =>
  useGameStore(state => ({
    daemons: state.daemons,
    selectedDaemons: state.selectedDaemons,
    recruitmentPool: state.recruitmentPool,
    toggleDaemonSelection: state.toggleDaemonSelection,
    clearDaemonSelection: state.clearDaemonSelection,
    recruitDaemon: state.recruitDaemon,
    getActiveDaemons: state.getActiveDaemons,
  }));

export const useResources = () =>
  useGameStore(state => ({
    resources: state.resources,
    canAfford: state.canAfford,
    spendCredits: state.spendCredits,
    addResources: state.addResources,
    resourceHistory: state.resourceHistory,
  }));

export const useMissions = () =>
  useGameStore(state => ({
    planets: state.planets,
    activeMission: state.activeMission,
    completedMissions: state.completedMissions,
    executeMission: state.executeMission,
    selectPlanetForMission: state.selectPlanetForMission,
  }));

export const useUI = () =>
  useGameStore(state => ({
    currentTab: state.currentTab,
    showTutorial: state.showTutorial,
    showMissionModal: state.showMissionModal,
    showMissionResults: state.showMissionResults,
    setCurrentTab: state.setCurrentTab,
    setShowTutorial: state.setShowTutorial,
    addNotification: state.addNotification,
  }));

export const useCorporate = () =>
  useGameStore(state => ({
    corporateTier: state.corporateTier,
    promotionProgress: state.promotionProgress,
    corporateRivals: state.corporateRivals,
    initializeRivals: state.initializeRivals,
    engageRival: state.engageRival,
    calculateRivalSuccessChance: state.calculateRivalSuccessChance,
    processRivalActions: state.processRivalActions,
  }));

// Store actions for external use
export const gameActions = {
  initializeGame: () => useGameStore.getState().initializeGame(),
  saveGame: () => useGameStore.getState().saveGame(),
  resetGame: () => useGameStore.getState().resetGame(),
};
