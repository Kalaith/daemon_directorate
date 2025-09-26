// hooks/useGameService.ts - React hook for game service
import { useMemo } from 'react';
import { useGameStore } from '../stores/composedStore';
import {
  createGameService,
  type GameServiceInterface,
} from '../services/GameService';

export const useGameService = (): GameServiceInterface => {
  // Create a wrapper that matches the expected ZustandGameStore interface
  const gameService = useMemo(() => {
    const storeWrapper = {
      getState: () => useGameStore.getState(),
    };
    return createGameService(storeWrapper as any);
  }, []);

  return gameService;
};
