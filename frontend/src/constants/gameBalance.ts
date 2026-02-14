// Game balance constants - centralized configuration for game mechanics
export const missionBalance = {
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

export const daemonBalance = {
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

  // Daemon recruitment/generation ranges
  RECRUITMENT: {
    HEALTH: {
      MIN: 70,
      MAX: 100,
      RANGE: 30, // 70-100
    },
    MORALE: {
      MIN: 60,
      MAX: 100,
      RANGE: 40, // 60-100
    },
    LIFESPAN: {
      MIN: 35,
      MAX: 60,
      RANGE: 25, // 35-60
    },
    NAMING: {
      ID_MIN: 1000,
      ID_RANGE: 9000, // 1000-9999
    },
    BASE_COST: 50,
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

export const roomBalance = {
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

export const corporateBalance = {
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

export const uiConstants = {
  // Percentage calculations
  PERCENTAGE_MULTIPLIER: 100,

  // Z-index layering
  Z_INDEX: {
    MODAL: 50,
    TOOLTIP: 60,
    GAME_CONTROLS: 50,
    NOTIFICATION: 55,
  },

  // Tailwind class constants
  CLASSES: {
    MODAL_OVERLAY: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center',
    MODAL_CONTAINER: 'bg-gray-900 border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl',
    BUTTON_PRIMARY: 'px-4 py-2 rounded transition-colors font-semibold',
    BUTTON_SECONDARY:
      'px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm border border-gray-600 transition-colors',
  },

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
