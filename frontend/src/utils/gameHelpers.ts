// Game utility functions - extracted business logic for reusability
import type { Daemon, Planet, DifficultyLevel } from '../types/game';
import { daemonBalance, missionBalance, uiConstants } from '../constants/gameBalance';

/**
 * Core Utility Functions
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getDifficultyMultiplier = (difficulty: 'Easy' | 'Medium' | 'Hard'): number => {
  switch (difficulty) {
    case 'Easy':
      return 0.7;
    case 'Medium':
      return 1.0;
    case 'Hard':
      return 1.5;
    default:
      return 1.0;
  }
};

/**
 * UI Helper Functions
 */
export const getLifespanColor = (days: number): string => {
  if (days <= daemonBalance.THRESHOLDS.CRITICAL_LIFESPAN)
    return uiConstants.COLORS.LIFESPAN.CRITICAL;
  if (days <= daemonBalance.THRESHOLDS.WARNING_LIFESPAN) return uiConstants.COLORS.LIFESPAN.WARNING;
  return uiConstants.COLORS.LIFESPAN.GOOD;
};

export const getProgressBarColor = (value: number, type: 'health' | 'morale'): string => {
  const colors = uiConstants.COLORS[type === 'health' ? 'HEALTH' : 'MORALE'];
  if (value >= daemonBalance.THRESHOLDS.GOOD_HEALTH) return colors.GOOD;
  if (value >= daemonBalance.THRESHOLDS.LOW_HEALTH) return colors.WARNING;
  return colors.CRITICAL;
};

export const getTierIcon = (level: number): string => {
  return uiConstants.TIER_ICONS[level - 1] || uiConstants.TIER_ICONS[0];
};

/**
 * Mission Calculation Functions
 */
export const calculateTeamCompositionBonus = (team: Daemon[], planet: Planet): number => {
  const hasInfiltrator = team.some(d => d.specialization === 'Infiltration');
  const hasCombat = team.some(d => d.specialization === 'Combat');
  const hasSaboteur = team.some(d => d.specialization === 'Sabotage');

  let bonus = 0;
  if (planet.difficulty === 'Easy' && hasInfiltrator) {
    bonus += missionBalance.BONUSES.EASY_INFILTRATION;
  }
  if (planet.difficulty === 'Medium' && hasCombat) {
    bonus += missionBalance.BONUSES.MEDIUM_COMBAT;
  }
  if (planet.difficulty === 'Hard' && hasSaboteur) {
    bonus += missionBalance.BONUSES.HARD_SABOTAGE;
  }

  return bonus;
};

export const calculateTeamStatsBonus = (team: Daemon[]): number => {
  if (team.length === 0) return 0;

  const avgHealth = team.reduce((sum, d) => sum + d.health, 0) / team.length;
  const avgMorale = team.reduce((sum, d) => sum + d.morale, 0) / team.length;

  const healthBonus =
    (avgHealth - missionBalance.SUCCESS_BOUNDS.BASE) * missionBalance.MULTIPLIERS.HEALTH_IMPACT;
  const moraleBonus =
    (avgMorale - missionBalance.SUCCESS_BOUNDS.BASE) * missionBalance.MULTIPLIERS.MORALE_IMPACT;

  return healthBonus + moraleBonus;
};

export const calculateEquipmentBonus = (team: Daemon[]): number => {
  return team.filter(daemon => daemon.equipment).length * missionBalance.BONUSES.EQUIPMENT_BONUS;
};

export const calculateMissionSuccessChance = (team: Daemon[], planet: Planet): number => {
  let successChance = missionBalance.SUCCESS_BOUNDS.BASE;

  // Apply various bonuses
  successChance += calculateTeamCompositionBonus(team, planet);
  successChance += calculateTeamStatsBonus(team);
  successChance += calculateEquipmentBonus(team);

  // Apply difficulty penalty
  successChance += missionBalance.DIFFICULTY_PENALTIES[planet.difficulty];

  // Clamp to bounds
  return Math.max(
    missionBalance.SUCCESS_BOUNDS.MIN,
    Math.min(missionBalance.SUCCESS_BOUNDS.MAX, successChance)
  );
};

export const calculateMissionRewards = (
  difficulty: DifficultyLevel,
  success: boolean
): Record<string, number> => {
  const baseRewards: Record<string, number> = {
    ...missionBalance.BASE_REWARDS[difficulty],
  };

  if (!success) {
    Object.keys(baseRewards).forEach(key => {
      baseRewards[key] = Math.floor(
        baseRewards[key] * missionBalance.MULTIPLIERS.FAILURE_REWARD_RATIO
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

export const calculateMissionDamage = (
  daemon: Daemon,
  missionDifficulty: number = 1
): {
  healthLoss: number;
  moraleLoss: number;
  lifespanLoss: number;
} => {
  // Base damage calculation
  let healthLoss = generateRandomDamage(
    daemonBalance.MISSION_DAMAGE.MIN_HEALTH_LOSS,
    daemonBalance.MISSION_DAMAGE.MAX_HEALTH_LOSS
  );
  let moraleLoss = generateRandomDamage(
    daemonBalance.MISSION_DAMAGE.MIN_MORALE_LOSS,
    daemonBalance.MISSION_DAMAGE.MAX_MORALE_LOSS
  );
  let lifespanLoss = generateRandomDamage(
    daemonBalance.MISSION_DAMAGE.MIN_LIFESPAN_LOSS,
    daemonBalance.MISSION_DAMAGE.MAX_LIFESPAN_LOSS
  );

  // Apply daemon-specific modifiers
  const difficultyMultiplier = Math.max(0.5, Math.min(2.0, missionDifficulty));

  // Specialization affects damage resistance
  const specializationResistance = 0.9; // 10% damage reduction for now

  // Current health affects vulnerability (wounded daemons take more damage)
  const healthMultiplier = daemon.health < 30 ? 1.2 : 1.0;

  // Apply quirks that affect damage resistance
  let quirkMultiplier = 1.0;
  daemon.quirks.forEach(quirk => {
    if (
      quirk.name.toLowerCase().includes('resilient') ||
      quirk.name.toLowerCase().includes('tough')
    ) {
      quirkMultiplier *= 0.8; // 20% damage reduction
    } else if (
      quirk.name.toLowerCase().includes('fragile') ||
      quirk.name.toLowerCase().includes('vulnerable')
    ) {
      quirkMultiplier *= 1.3; // 30% more damage
    }
  });

  // Apply all modifiers
  healthLoss = Math.round(
    healthLoss *
      difficultyMultiplier *
      specializationResistance *
      healthMultiplier *
      quirkMultiplier
  );
  moraleLoss = Math.round(moraleLoss * difficultyMultiplier * healthMultiplier * quirkMultiplier);
  lifespanLoss = Math.round(lifespanLoss * difficultyMultiplier * quirkMultiplier);

  return {
    healthLoss: Math.max(0, healthLoss),
    moraleLoss: Math.max(0, moraleLoss),
    lifespanLoss: Math.max(0, lifespanLoss),
  };
};

export const shouldCreateSuccessor = (daemon: Daemon): boolean => {
  return (
    daemon.legacy.successfulMissions >= daemonBalance.LEGACY_REQUIREMENTS.MIN_SUCCESSFUL_MISSIONS ||
    daemon.legacy.planetsConquered >= daemonBalance.LEGACY_REQUIREMENTS.MIN_PLANETS_CONQUERED ||
    daemon.generation >= daemonBalance.LEGACY_REQUIREMENTS.MIN_GENERATION_FOR_SUCCESSION
  );
};

export const calculateSuccessorStats = (
  originalDaemon: Daemon
): {
  health: number;
  morale: number;
  lifespanDays: number;
} => {
  return {
    health: Math.min(
      100,
      80 + originalDaemon.generation * daemonBalance.INHERITANCE.SUCCESSOR_HEALTH_BONUS
    ),
    morale: Math.min(
      100,
      70 + originalDaemon.generation * daemonBalance.INHERITANCE.SUCCESSOR_MORALE_BONUS
    ),
    lifespanDays: Math.min(
      80,
      40 + originalDaemon.generation * daemonBalance.INHERITANCE.SUCCESSOR_LIFESPAN_BONUS
    ),
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
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
