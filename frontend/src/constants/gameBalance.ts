// Game balance constants - centralized configuration for game mechanics
export const MISSION_BALANCE = {
  // Mission success bonuses by specialization and difficulty
  BONUSES: {
    EASY_INFILTRATION: 20,
    MEDIUM_COMBAT: 15,
    HARD_SABOTAGE: 25,
    EQUIPMENT_BONUS: 10,
  },

  // Success calculation multipliers
  MULTIPLIERS: {
    HEALTH_IMPACT: 0.3,
    MORALE_IMPACT: 0.2,
    FAILURE_REWARD_RATIO: 0.3,
  },

  // Success chance bounds
  SUCCESS_BOUNDS: {
    MIN: 10,
    MAX: 90,
    BASE: 50,
  },

  // Difficulty penalties
  DIFFICULTY_PENALTIES: {
    Easy: 0,
    Medium: -15,
    Hard: -30,
  } as const,

  // Base rewards by difficulty
  BASE_REWARDS: {
    Easy: { credits: 150, soulEssence: 2 },
    Medium: { credits: 300, bureaucraticLeverage: 5 },
    Hard: { credits: 500, rawMaterials: 3 },
  } as const,
} as const;

export const DAEMON_BALANCE = {
  // Health and morale thresholds
  THRESHOLDS: {
    CRITICAL_LIFESPAN: 10,
    WARNING_LIFESPAN: 20,
    LOW_HEALTH: 30,
    GOOD_HEALTH: 70,
    LOW_MORALE: 40,
    GOOD_MORALE: 70,
  },

  // UI display thresholds
  CRITICAL_LIFESPAN_THRESHOLD: 10,
  MAX_RECENT_STORIES: 3,
  MAX_MISSION_DISPLAY: 5,
  HEALTH_THRESHOLDS: {
    GOOD: 70,
    WARNING: 40,
  },
  MORALE_THRESHOLDS: {
    GOOD: 70,
    WARNING: 40,
  },

  // Daily damage ranges
  MISSION_DAMAGE: {
    MIN_HEALTH_LOSS: 5,
    MAX_HEALTH_LOSS: 25,
    MIN_MORALE_LOSS: 5,
    MAX_MORALE_LOSS: 20,
    MIN_LIFESPAN_LOSS: 1,
    MAX_LIFESPAN_LOSS: 3,
  },

  // Legacy system requirements
  LEGACY_REQUIREMENTS: {
    MIN_SUCCESSFUL_MISSIONS: 3,
    MIN_PLANETS_CONQUERED: 1,
    MIN_GENERATION_FOR_SUCCESSION: 2,
    VETERAN_STATUS_MISSIONS: 5,
  },

  // Equipment and inheritance bonuses
  INHERITANCE: {
    DURABILITY_BONUS: 20,
    LEGACY_BONUS_INCREMENT: 5,
    SUCCESSOR_HEALTH_BONUS: 5,
    SUCCESSOR_MORALE_BONUS: 3,
    SUCCESSOR_LIFESPAN_BONUS: 2,
  },
} as const;

export const ROOM_BALANCE = {
  // Room upgrade costs and bonuses
  UPGRADE_MULTIPLIER: 1.5,

  // Room bonuses
  LIVING_QUARTERS_MORALE_BONUS: 5,
  RECOVERY_WARD_HEALTH_BONUS: 15,
  RECOVERY_WARD_ASSIGNMENT_BONUS: 10,
  TRAINING_HALL_HEALTH_BONUS: 5,
  TRAINING_HALL_MORALE_BONUS: 3,
  WAR_ROOM_MORALE_BONUS: 7,
} as const;

export const CORPORATE_BALANCE = {
  // HR Review system
  HR_REVIEW: {
    COOLDOWN_DAYS: 5,
    MIN_TIER: 2,
    POSITIVE_CHANCE: 0.4,
    NEUTRAL_CHANCE: 0.4,
    NEGATIVE_CHANCE: 0.2,
    POSITIVE_MORALE: 15,
    POSITIVE_HEALTH: 5,
    NEGATIVE_MORALE: -10,
    NEGATIVE_HEALTH: -5,
    NEGATIVE_LIFESPAN: -2,
  },

  // Recruitment costs
  RECRUITMENT_COST: 50,

  // Event frequencies
  EVENT_CHANCES: {
    DAILY_CORPORATE_EVENT: 0.08,
    DAILY_SURREAL_EVENT_BASE: 0.03,
    SURREAL_EVENT_TIER_MULTIPLIER: 0.01,
    PROCEDURAL_MISSION_BASE: 0.02,
    PROCEDURAL_MISSION_PLANET_BONUS: 0.01,
    COMPLIANCE_TASK_BASE: 0.05,
    COMPLIANCE_TASK_TIER_MULTIPLIER: 0.02,
  },

  // Endgame triggers
  ENDGAME: {
    MIN_TIER_FOR_ENDGAME: 5,
    MIN_DAYS_FOR_ENDGAME: 200,
    BURNOUT_THRESHOLD: 3,
    DAILY_ENDING_CHANCE_TIER5: 0.05,
    DAILY_ENDING_CHANCE_EXTENDED: 0.1,
  },
} as const;

export const UI_CONSTANTS = {
  COLORS: {
    HEALTH: {
      GOOD: 'bg-green-500',
      WARNING: 'bg-orange-400',
      CRITICAL: 'bg-red-500',
    },
    MORALE: {
      GOOD: 'bg-teal-500',
      WARNING: 'bg-orange-400',
      CRITICAL: 'bg-red-500',
    },
    LIFESPAN: {
      GOOD: 'text-slate-600',
      WARNING: 'text-orange-600',
      CRITICAL: 'text-red-600',
    },
  },

  TIER_ICONS: ['👔', '📊', '🏢', '🌟', '👑'],
} as const;