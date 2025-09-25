// hooks/useGameService.ts - React hook for game service
import { useMemo } from 'react';
import { useGameStore } from '../stores/composedStore';
import { createGameService, type GameServiceInterface } from '../services/GameService';

export const useGameService = (): GameServiceInterface => {
  const store = useGameStore;

  const gameService = useMemo(() => {
    return createGameService(store);
  }, [store]);

  return gameService;
};