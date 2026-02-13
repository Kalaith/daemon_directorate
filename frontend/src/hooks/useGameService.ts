
// hooks/useGameService.ts - React hook for game service
import { useMemo } from 'react';
import { useGameStore } from '../stores/composedStore';
import {
  createGameService,
  type GameServiceInterface,
} from '../services/GameService';
import type { GameStore, ZustandGameStore } from '../types/storeInterfaces';

export const useGameService = (): GameServiceInterface => {
  // Create a wrapper that matches the expected ZustandGameStore interface
  const gameService = useMemo(() => {
    const storeWrapper: ZustandGameStore = {
      getState: () => useGameStore.getState() as unknown as GameStore,
    };
    return createGameService(storeWrapper);
  }, []);

  return gameService;
};
