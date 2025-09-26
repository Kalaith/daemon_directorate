// hooks/useConfig.ts - React hook for configuration management
import { useEffect, useState } from 'react';
import { gameConfig, type GameConfig } from '../config/gameConfig';

// Hook to get configuration value by path
export const useConfig = <T = unknown>(path: string): T => {
  const [value, setValue] = useState<T>(() => gameConfig.get<T>(path));

  useEffect(() => {
    const unsubscribe = gameConfig.subscribe(() => {
      setValue(gameConfig.get<T>(path));
    });

    return unsubscribe;
  }, [path]);

  return value;
};

// Hook to get entire configuration
export const useGameConfig = (): GameConfig => {
  const [config, setConfig] = useState<GameConfig>(() => gameConfig.getAll());

  useEffect(() => {
    const unsubscribe = gameConfig.subscribe(newConfig => {
      setConfig(newConfig);
    });

    return unsubscribe;
  }, []);

  return config;
};

// Hook to update configuration
export const useConfigUpdater = () => {
  return {
    updateConfig: (updates: Partial<GameConfig>) => gameConfig.update(updates),
    setConfig: (path: string, value: unknown) => gameConfig.set(path, value),
    resetConfig: () => gameConfig.reset(),
  };
};
