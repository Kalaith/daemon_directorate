// services/GameService.ts - Service layer abstraction for game operations
import type {
  Daemon,
  Planet,
  GameResources,
  Mission,
  MissionResult,
} from '../types/game';
import type { GameStore, ZustandGameStore } from '../types/storeInterfaces';
import {
  withErrorHandling,
  ErrorCategory,
} from '../utils/standardErrorHandling';

interface GameServiceInterface {
  // Daemon operations
  recruitDaemon(daemonId: string): Promise<Daemon>;
  dismissDaemon(daemonId: string): Promise<boolean>;
  getDaemonStats(daemonId: string): Promise<Daemon | null>;

  // Mission operations
  executeMission(planetId: string, teamIds: string[]): Promise<MissionResult>;
  getPlanetInfo(planetId: string): Promise<Planet | null>;
  getAvailableMissions(): Promise<Mission[]>;

  // Resource operations
  getResources(): Promise<GameResources>;
  spendResources(costs: Partial<GameResources>): Promise<boolean>;
  addResources(gains: Partial<GameResources>): Promise<void>;

  // Game state operations
  saveGameState(): Promise<boolean>;
  loadGameState(): Promise<boolean>;
  resetGame(): Promise<void>;
}

class GameService implements GameServiceInterface {
  private store: ZustandGameStore;

  constructor(storeInstance: ZustandGameStore) {
    this.store = storeInstance;
  }

  recruitDaemon = withErrorHandling(
    async (daemonId: string): Promise<Daemon> => {
      const state = this.store.getState();
      const candidate = state.recruitmentPool.find(
        (d: Daemon) => d.id === daemonId
      );

      if (!candidate) {
        throw new Error(
          `Daemon with id ${daemonId} not found in recruitment pool`
        );
      }

      if (!this.store.getState().canAfford(candidate.cost || 100)) {
        throw new Error('Insufficient resources to recruit daemon');
      }

      // Execute recruitment through store
      this.store.getState().recruitDaemon(daemonId);

      return candidate;
    },
    'GameService.recruitDaemon',
    ErrorCategory.BUSINESS_RULE
  );

  dismissDaemon = withErrorHandling(
    async (daemonId: string): Promise<boolean> => {
      const state = this.store.getState();
      const daemon = state.daemons.find((d: Daemon) => d.id === daemonId);

      if (!daemon) {
        throw new Error(`Daemon with id ${daemonId} not found`);
      }

      if (state.selectedDaemons.has(daemonId)) {
        throw new Error('Cannot dismiss daemon currently selected for mission');
      }

      // Execute dismissal through store
      this.store.getState().dismissDaemon(daemonId);

      return true;
    },
    'GameService.dismissDaemon',
    ErrorCategory.BUSINESS_RULE
  );

  getDaemonStats = withErrorHandling(
    async (daemonId: string): Promise<Daemon | null> => {
      const state = this.store.getState();
      return state.daemons.find((d: Daemon) => d.id === daemonId) || null;
    },
    'GameService.getDaemonStats',
    ErrorCategory.SYSTEM
  );

  executeMission = withErrorHandling(
    async (planetId: string, teamIds: string[]): Promise<MissionResult> => {
      const state = this.store.getState();

      // Validate planet exists
      const planet = state.planets.find((p: Planet) => p.id === planetId);
      if (!planet) {
        throw new Error(`Planet with id ${planetId} not found`);
      }

      // Validate team composition
      if (teamIds.length === 0) {
        throw new Error('Mission requires at least one daemon');
      }

      const team = teamIds
        .map(id => state.daemons.find((d: Daemon) => d.id === id))
        .filter(Boolean);
      if (team.length !== teamIds.length) {
        throw new Error('One or more daemons not found');
      }

      // Set selected team and planet
      await this.store.getState().setSelectedDaemons(new Set(teamIds));
      await this.store.getState().selectPlanetForMission(planetId);

      // Execute mission
      const result = await this.store.getState().executeMission();

      return result;
    },
    'GameService.executeMission',
    ErrorCategory.BUSINESS_RULE
  );

  getPlanetInfo = withErrorHandling(
    async (planetId: string): Promise<Planet | null> => {
      const state = this.store.getState();
      return state.planets.find((p: Planet) => p.id === planetId) || null;
    },
    'GameService.getPlanetInfo',
    ErrorCategory.SYSTEM
  );

  getAvailableMissions = withErrorHandling(
    async (): Promise<Mission[]> => {
      const state = this.store.getState();
      return state.availableProceduralMissions || [];
    },
    'GameService.getAvailableMissions',
    ErrorCategory.SYSTEM
  );

  getResources = withErrorHandling(
    async (): Promise<GameResources> => {
      const state = this.store.getState();
      return { ...state.resources };
    },
    'GameService.getResources',
    ErrorCategory.SYSTEM
  );

  spendResources = withErrorHandling(
    async (costs: Partial<GameResources>): Promise<boolean> => {
      const state = this.store.getState();

      if (!state.canAfford(costs)) {
        return false;
      }

      await state.spendResourceBatch(costs, 'Service layer operation');
      return true;
    },
    'GameService.spendResources',
    ErrorCategory.BUSINESS_RULE
  );

  addResources = withErrorHandling(
    async (gains: Partial<GameResources>): Promise<void> => {
      const state = this.store.getState();
      await state.addResources(gains, 'Service layer operation');
    },
    'GameService.addResources',
    ErrorCategory.SYSTEM
  );

  saveGameState = withErrorHandling(
    async (): Promise<boolean> => {
      try {
        await this.store.getState().saveGame();
        return true;
      } catch {
        return false;
      }
    },
    'GameService.saveGameState',
    ErrorCategory.SYSTEM
  );

  loadGameState = withErrorHandling(
    async (): Promise<boolean> => {
      try {
        return await this.store.getState().loadGame();
      } catch {
        return false;
      }
    },
    'GameService.loadGameState',
    ErrorCategory.SYSTEM
  );

  resetGame = withErrorHandling(
    async (): Promise<void> => {
      await this.store.getState().resetGame();
    },
    'GameService.resetGame',
    ErrorCategory.SYSTEM
  );
}

// Factory function to create service instance
export const createGameService = (
  storeInstance: unknown
): GameServiceInterface => {
  return new GameService(storeInstance);
};

// Export types
export type { GameServiceInterface };
export { GameService };
