// Game utility functions - extracted business logic for reusability
import type { Daemon, Planet, DifficultyLevel } from '../types/game';
import { DAEMON_BALANCE, MISSION_BALANCE, UI_CONSTANTS } from '../constants/gameBalance';

/**
 * UI Helper Functions
 */
export const getLifespanColor = (days: number): string => {
  if (days <= DAEMON_BALANCE.THRESHOLDS.CRITICAL_LIFESPAN) return UI_CONSTANTS.COLORS.LIFESPAN.CRITICAL;
  if (days <= DAEMON_BALANCE.THRESHOLDS.WARNING_LIFESPAN) return UI_CONSTANTS.COLORS.LIFESPAN.WARNING;
  return UI_CONSTANTS.COLORS.LIFESPAN.GOOD;
};

export const getProgressBarColor = (value: number, type: 'health' | 'morale'): string => {
  const colors = UI_CONSTANTS.COLORS[type === 'health' ? 'HEALTH' : 'MORALE'];
  if (value >= DAEMON_BALANCE.THRESHOLDS.GOOD_HEALTH) return colors.GOOD;
  if (value >= DAEMON_BALANCE.THRESHOLDS.LOW_HEALTH) return colors.WARNING;
  return colors.CRITICAL;
};

export const getTierIcon = (level: number): string => {
  return UI_CONSTANTS.TIER_ICONS[level - 1] || UI_CONSTANTS.TIER_ICONS[0];
};

/**
 * Mission Calculation Functions
 */
export const calculateTeamCompositionBonus = (
  team: Daemon[],
  planet: Planet
): number => {
  const hasInfiltrator = team.some(d => d.specialization === 'Infiltration');
  const hasCombat = team.some(d => d.specialization === 'Combat');
  const hasSaboteur = team.some(d => d.specialization === 'Sabotage');

  let bonus = 0;
  if (planet.difficulty === 'Easy' && hasInfiltrator) {
    bonus += MISSION_BALANCE.BONUSES.EASY_INFILTRATION;
  }
  if (planet.difficulty === 'Medium' && hasCombat) {
    bonus += MISSION_BALANCE.BONUSES.MEDIUM_COMBAT;
  }
  if (planet.difficulty === 'Hard' && hasSaboteur) {
    bonus += MISSION_BALANCE.BONUSES.HARD_SABOTAGE;
  }

  return bonus;
};

export const calculateTeamStatsBonus = (team: Daemon[]): number => {
  if (team.length === 0) return 0;

  const avgHealth = team.reduce((sum, d) => sum + d.health, 0) / team.length;
  const avgMorale = team.reduce((sum, d) => sum + d.morale, 0) / team.length;

  const healthBonus = (avgHealth - MISSION_BALANCE.SUCCESS_BOUNDS.BASE) * MISSION_BALANCE.MULTIPLIERS.HEALTH_IMPACT;
  const moraleBonus = (avgMorale - MISSION_BALANCE.SUCCESS_BOUNDS.BASE) * MISSION_BALANCE.MULTIPLIERS.MORALE_IMPACT;

  return healthBonus + moraleBonus;
};

export const calculateEquipmentBonus = (team: Daemon[]): number => {
  return team.filter(daemon => daemon.equipment).length * MISSION_BALANCE.BONUSES.EQUIPMENT_BONUS;
};

export const calculateMissionSuccessChance = (
  team: Daemon[],
  planet: Planet
): number => {
  let successChance = MISSION_BALANCE.SUCCESS_BOUNDS.BASE;

  // Apply various bonuses
  successChance += calculateTeamCompositionBonus(team, planet);
  successChance += calculateTeamStatsBonus(team);
  successChance += calculateEquipmentBonus(team);

  // Apply difficulty penalty
  successChance += MISSION_BALANCE.DIFFICULTY_PENALTIES[planet.difficulty];

  // Clamp to bounds
  return Math.max(
    MISSION_BALANCE.SUCCESS_BOUNDS.MIN,
    Math.min(MISSION_BALANCE.SUCCESS_BOUNDS.MAX, successChance)
  );
};

export const calculateMissionRewards = (
  difficulty: DifficultyLevel,
  success: boolean
): Record<string, number> => {
  const baseRewards = { ...MISSION_BALANCE.BASE_REWARDS[difficulty] };

  if (!success) {
    Object.keys(baseRewards).forEach(key => {
      const typedKey = key as keyof typeof baseRewards;
      baseRewards[typedKey] = Math.floor(
        baseRewards[typedKey] * MISSION_BALANCE.MULTIPLIERS.FAILURE_REWARD_RATIO
      );
    });
  }

  return baseRewards;
};

/**
 * Daemon Management Functions
 */
export const generateRandomDamage = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const calculateMissionDamage = (): {
  healthLoss: number;
  moraleLoss: number;
  lifespanLoss: number;
} => {
  return {
    healthLoss: generateRandomDamage(
      DAEMON_BALANCE.MISSION_DAMAGE.MIN_HEALTH_LOSS,
      DAEMON_BALANCE.MISSION_DAMAGE.MAX_HEALTH_LOSS
    ),
    moraleLoss: generateRandomDamage(
      DAEMON_BALANCE.MISSION_DAMAGE.MIN_MORALE_LOSS,
      DAEMON_BALANCE.MISSION_DAMAGE.MAX_MORALE_LOSS
    ),
    lifespanLoss: generateRandomDamage(
      DAEMON_BALANCE.MISSION_DAMAGE.MIN_LIFESPAN_LOSS,
      DAEMON_BALANCE.MISSION_DAMAGE.MAX_LIFESPAN_LOSS
    ),
  };
};

export const shouldCreateSuccessor = (daemon: Daemon): boolean => {
  return (
    daemon.legacy.successfulMissions >= DAEMON_BALANCE.LEGACY_REQUIREMENTS.MIN_SUCCESSFUL_MISSIONS ||
    daemon.legacy.planetsConquered >= DAEMON_BALANCE.LEGACY_REQUIREMENTS.MIN_PLANETS_CONQUERED ||
    daemon.generation >= DAEMON_BALANCE.LEGACY_REQUIREMENTS.MIN_GENERATION_FOR_SUCCESSION
  );
};

export const calculateSuccessorStats = (originalDaemon: Daemon): {
  health: number;
  morale: number;
  lifespanDays: number;
} => {
  return {
    health: Math.min(100, 80 + originalDaemon.generation * DAEMON_BALANCE.INHERITANCE.SUCCESSOR_HEALTH_BONUS),
    morale: Math.min(100, 70 + originalDaemon.generation * DAEMON_BALANCE.INHERITANCE.SUCCESSOR_MORALE_BONUS),
    lifespanDays: Math.min(80, 40 + originalDaemon.generation * DAEMON_BALANCE.INHERITANCE.SUCCESSOR_LIFESPAN_BONUS),
  };
};

/**
 * Validation Functions
 */
export const validateDaemonId = (daemonId: string): void => {
  if (!daemonId || typeof daemonId !== 'string') {
    throw new Error('Invalid daemon ID provided');
  }
};

export const validateRoomId = (roomId: string): void => {
  if (!roomId || typeof roomId !== 'string') {
    throw new Error('Invalid room ID provided');
  }
};

export const validateAmount = (amount: number, min = 0): void => {
  if (typeof amount !== 'number' || amount < min || !isFinite(amount)) {
    throw new Error(`Invalid amount provided: ${amount}`);
  }
};

/**
 * Performance Helper Functions
 */
export const memoize = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Memoized versions of expensive calculations
export const memoizedCalculateMissionSuccessChance = memoize(calculateMissionSuccessChance);
export const memoizedCalculateTeamCompositionBonus = memoize(calculateTeamCompositionBonus);