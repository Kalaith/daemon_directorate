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
  MissionSlice,
  [],
  [],
  MissionSlice
> = (set, get) => ({
  // Initial state
  planets: STARTER_DATA.planets || [],
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
      // This would integrate with the composed store's daemon and resource slices
      const context = {
        selectedDaemons: new Set<string>(), // Would come from daemon slice
        currentPlanet,
        daemons: [], // Would come from daemon slice
        planets: state.planets,
        equipment: [], // Would come from equipment slice
        selectedMissionType: missionType,
      };

      // Removed local generateId - now using centralized utility from gameHelpers
      const result = executeMissionLogic(context, generateId);

      set(() => ({
        planets: result.updatedPlanets,
        activeMission: result.missionInstance,
        lastMissionResult: result.result,
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
