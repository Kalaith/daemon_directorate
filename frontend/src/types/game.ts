// Game types for Daemon Directorate
export interface GameResources {
  credits: number;
  soulEssence: number;
  bureaucraticLeverage: number;
  rawMaterials: number;
}

export interface DaemonQuirk {
  name: string;
  effect: string;
  value: number;
  description: string;
}

export interface Daemon {
  id: string;
  name: string;
  specialization: 'Infiltration' | 'Combat' | 'Sabotage';
  health: number;
  morale: number;
  lifespanDays: number;
  quirks: DaemonQuirk[];
  assignments: string[];
  equipment: string | null;
  isActive: boolean;
  cost?: number; // For recruitment pool daemons

  // Legacy system
  generation: number;
  bloodline?: string;
  mentor?: string; // ID of the daemon who trained them
  inheritedTraits: string[]; // Traits passed down from previous generations
  legacy: {
    successfulMissions: number;
    planetsConquered: number;
    equipmentCreated: number;
    yearsServed: number;
  };
}

export interface Equipment {
  id: string;
  name: string;
  type: 'Infiltration' | 'Combat' | 'Sabotage';
  durability: number;
  ability: string;
  assignedTo: string | null;

  // Legacy system
  forgedBy?: string; // ID of daemon who created it
  generation: number; // How many times it's been inherited
  legacyBonus: number; // Accumulated bonus from inheritance
  history: string[]; // Notable achievements with this equipment
}

export interface Room {
  id: string;
  name: string;
  level: number;
  bonus: string;
  upgrade_cost: number;
}

export interface Planet {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  resistance: string;
  reward: string;
  conquered: boolean;
  lastMission: string | null;
}

export interface Mission {
  id: string;
  planetId: string;
  teamIds: string[];
  startTime: number;
  duration: number;
}

export interface MissionResult {
  success: boolean;
  successChance: number;
  narrative: string;
  rewards: Partial<GameResources>;
  casualties: {
    daemonId: string;
    survived: boolean;
    healthLost?: number;
    moraleLost?: number;
    lifespanLost?: number;
  }[];
  equipmentDamage: {
    equipmentId: string;
    durabilityLost: number;
  }[];
}

export interface CorporateEvent {
  id: string;
  title: string;
  description: string;
  type: 'automatic' | 'choice';
  timestamp: number;
  effects?: EventEffect[];
  choices?: EventChoice[];
  requirements?: Partial<GameResources>;
  resolved?: boolean;
  chosenOption?: string;
}

export interface EventEffect {
  type: string;
  value: number;
  description: string;
}

export interface EventChoice {
  label: string;
  description: string;
  effects: EventEffect[];
}

export interface GameModifiers {
  passiveIncome: number;
  recruitmentDiscount: number;
  equipmentRepairDiscount: number;
  missionSuccessBonus: number;
  managementStress: boolean;
  hrInvestigation: number;
  productivityBonus: number;
  productivityBonusRemainingMissions: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
  duration?: number;
}

export interface GameState {
  resources: GameResources;
  daemons: Daemon[];
  equipment: Equipment[];
  rooms: Room[];
  planets: Planet[];
  recruitmentPool: Daemon[];
  activeMission: Mission | null;
  corporateEvents: CorporateEvent[];
  gameModifiers: GameModifiers;
  daysPassed: number;
  gameStarted: boolean;
  tutorialCompleted: boolean;
  gameIntervalId?: number;

  // Corporate Progression System
  corporateTier: CorporateTier;
  promotionProgress: Record<string, number>;

  // Compliance System
  complianceTasks: ComplianceTask[];
  complianceDeadlines: Record<string, number>;

  // Legacy System
  legacyBook: Record<string, DaemonLegacy>;
  hallOfInfamy: LegacyStory[];

  // Endgame System
  endgameState: EndgameState;
  unlockedContent: UnlockedContent;

  // Corporate Rivals
  corporateRivals: CorporateRival[];

  // UI State
  currentTab: 'dashboard' | 'team' | 'missions' | 'apartment' | 'equipment';
  selectedDaemons: Set<string>;
  currentPlanet: string | null;
  showTutorial: boolean;
  showMemorial: boolean;
  showMissionModal: boolean;
  showMissionResults: boolean;
  showEventModal: boolean;
  memorialDaemon: Daemon | null;
  missionResults: MissionResult | null;
  currentEvent: CorporateEvent | null;
  notifications: Notification[];
}

export interface StarterData {
  starter_daemons: Omit<
    Daemon,
    'id' | 'assignments' | 'equipment' | 'isActive'
  >[];
  starter_equipment: Omit<Equipment, 'id' | 'assignedTo'>[];
  planets: Omit<Planet, 'id' | 'conquered' | 'lastMission'>[];
  apartment_rooms: Omit<Room, 'id'>[];
}

// Corporate Tier System
export interface CorporateTier {
  id: string;
  name: string;
  level: number;
  requirements: {
    planetsControlled?: number;
    daysLived?: number;
    legacyGenerations?: number;
    defeatedRivals?: number;
    complianceAudits?: number;
    completedHRReviews?: number;
  };
  unlocks: {
    resources?: string[];
    mechanics?: string[];
    apartmentRooms?: string[];
    eventTypes?: string[];
  };
}

// Compliance System
export interface ComplianceTask {
  id: string;
  type: 'performance_review' | 'budget_cut' | 'mandatory_training' | 'audit';
  title: string;
  description: string;
  deadline: number; // days
  requirements: {
    daemonsRequired?: number;
    resourceCost?: Partial<GameResources>;
    duration?: number;
  };
  penalties: {
    moraleLoss?: number;
    resourceFines?: Partial<GameResources>;
    daemonReassignment?: boolean;
  };
  completed?: boolean;
}

// Legacy System
export interface DaemonLegacy {
  daemonId: string;
  bloodline: string;
  generation: number;
  stories: LegacyStory[];
  legends: LegacyLegend[];
  achievements: string[];
}

export interface LegacyStory {
  id: string;
  title: string;
  description: string;
  category: 'heroic' | 'tragic' | 'absurd' | 'legendary';
  timestamp: number;
}

export interface LegacyLegend {
  name: string;
  description: string;
  effects: {
    type: string;
    value: number;
    applies_to: 'bloodline' | 'company' | 'global';
  }[];
}

// Endgame System
export interface EndgameState {
  managementStyle: 'profit' | 'cult' | 'compliance' | 'collapse' | 'none';
  endingAchieved: boolean;
  endingType: string;
  prestigeLevel: number;
  permanentBonuses: PrestigeBonus[];
}

export interface PrestigeBonus {
  id: string;
  name: string;
  description: string;
  effects: GameModifier[];
  unlockedBy: string;
}

export interface GameModifier {
  type: string;
  value: number;
  description: string;
}

// Surreal Events
export interface SurrealEvent {
  id: string;
  title: string;
  description: string;
  type: 'choice' | 'automatic';
  tierLevel: number;
  choices?: EventChoice[];
  effects?: EventEffect[];
}

// Corporate Rivals
export interface CorporateRival {
  id: string;
  name: string;
  strength: number;
  specialty: string;
  threat: 'low' | 'medium' | 'high';
  defeated: boolean;
}

// Unlocked Content
export interface UnlockedContent {
  daemonArchetypes: string[];
  factions: string[];
  events: string[];
  tierFeatures: string[];
}

// Type aliases for clarity
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type SpecializationType = 'Infiltration' | 'Combat' | 'Sabotage';
export type TabType =
  | 'dashboard'
  | 'team'
  | 'missions'
  | 'apartment'
  | 'equipment';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type ManagementStyle = 'profit' | 'cult' | 'compliance' | 'collapse';
