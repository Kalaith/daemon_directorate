// stores/slices/missionSlice.ts - Mission management slice
import type { StateCreator } from 'zustand';
import type { Planet, Mission, MissionResult } from '../../types/game';
import { STARTER_DATA } from '../../constants/gameData';
import { executeMissionLogic } from '../../utils/missionHelpers';
import { generateId } from '../../utils/gameHelpers';
import { logger } from '../../utils/logger';

export interface MissionState {
  planets: Planet[];
  activeMission: Mission | null;
  completedMissions: Mission[];
  currentPlanet: string | null;
  selectedMissionType: string;
  lastMissionResult: MissionResult | null;
}

export interface MissionActions {
  // Mission execution
  executeMission: (missionType?: string) => void;
  selectPlanetForMission: (planetId: string, missionType?: string) => void;
  setCurrentPlanet: (planetId: string) => void; // Alias for backward compatibility
  completeMission: (mission: Mission, result: MissionResult) => void;

  // Planet management
  getPlanetById: (id: string) => Planet | undefined;
  getAvailablePlanets: () => Planet[];
  updatePlanetStatus: (planetId: string, updates: Partial<Planet>) => void;

  // Mission history
  getMissionHistory: () => Mission[];
  getCompletedMissionsForPlanet: (planetId: string) => Mission[];
}

export type MissionSlice = MissionState & MissionActions;

export const createMissionSlice: StateCreator<
  import('../composedStore').ComposedGameStore,
  [],
  [],
  MissionSlice
> = (set, get) => ({
  // Initial state
  planets:
    STARTER_DATA.planets.map(
      (p): Planet => ({
        ...p,
        id: `planet-${Math.random().toString(36).substr(2, 9)}`,
        conquered: false,
        lastMission: null,
      })
    ) || [],
  activeMission: null,
  completedMissions: [],
  currentPlanet: null,
  selectedMissionType: 'conquest',
  lastMissionResult: null,

  // Actions
  executeMission: (missionType = 'conquest') => {
    const state = get();
    const { currentPlanet } = state;

    if (!currentPlanet) {
      throw new Error('No planet selected for mission');
    }

    try {
      // Access data from the composed store
      const context = {
        selectedDaemons: state.selectedDaemons,
        currentPlanet,
        daemons: state.daemons,
        planets: state.planets,
        equipment: state.equipment,
        selectedMissionType: missionType,
      };

      const result = executeMissionLogic(context, generateId);

      // Update both planets and daemons
      set(state => ({
        ...state,
        planets: result.updatedPlanets,
        activeMission: result.missionInstance,
        lastMissionResult: result.result,
        daemons: result.updatedDaemons,
      }));
    } catch (error) {
      logger.error(
        'Mission execution failed',
        error instanceof Error ? error : undefined,
        {
          component: 'MissionSlice',
          action: 'executeMission',
          metadata: { currentPlanet, missionType },
        }
      );
      // Error would be handled by error boundary
    }
  },

  selectPlanetForMission: (planetId: string, missionType = 'conquest') => {
    set({
      currentPlanet: planetId,
      selectedMissionType: missionType,
    });
    
    // Open the mission modal for team selection
    get().setShowMissionModal(true);
  },

  setCurrentPlanet: (planetId: string) => {
    // Alias for backward compatibility with tests
    set({ currentPlanet: planetId });
  },

  completeMission: (mission: Mission, result: MissionResult) => {
    set(state => ({
      activeMission: null,
      completedMissions: [...state.completedMissions, mission],
      lastMissionResult: result,
    }));
  },

  getPlanetById: (id: string) => {
    return get().planets.find(planet => planet.id === id);
  },

  getAvailablePlanets: () => {
    return get().planets.filter(planet => !planet.conquered);
  },

  updatePlanetStatus: (planetId: string, updates: Partial<Planet>) => {
    set(state => ({
      planets: state.planets.map(planet =>
        planet.id === planetId ? { ...planet, ...updates } : planet
      ),
    }));
  },

  getMissionHistory: () => {
    return get().completedMissions;
  },

  getCompletedMissionsForPlanet: (planetId: string) => {
    return get().completedMissions.filter(
      mission => mission.planetId === planetId
    );
  },
});
