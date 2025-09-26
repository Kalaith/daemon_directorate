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

  // Enhanced room system
  assignedDaemons: string[]; // IDs of daemons assigned to this room
  maxAssignments: number; // Maximum daemons that can be assigned
  specialization?: SpecializationType; // Room specialization bonus
  roomType: 'utility' | 'training' | 'recovery' | 'command' | 'special';
  synergyBonuses?: RoomSynergyBonus[];
  unlocked: boolean; // Whether the room is available for use
}

export interface RoomSynergyBonus {
  requiredRooms: string[]; // Room names that must be upgraded
  minLevel: number; // Minimum combined level
  bonus: string;
  effect: {
    type: string;
    value: number;
    appliesToDaemons?: boolean;
    appliesToMissions?: boolean;
  };
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
  stability?: number; // 0-100, affects available missions
  corporatePresence?: number; // 0-100, how established your company is
  availableMissions?: string[]; // Mission types available on this planet
  missionHistory?: string[]; // Previous mission IDs for consequences
  specialFeatures?: string[]; // Unique planet characteristics
}

export interface Mission {
  id: string;
  planetId: string;
  teamIds: string[];
  startTime: number;
  duration: number;
  type?:
    | 'conquest'
    | 'sabotage'
    | 'diplomacy'
    | 'reconnaissance'
    | 'extraction';
  objectives?: MissionObjective[];
  consequences?: MissionConsequence[];
  procedural?: boolean; // Generated based on conquered territories
}

export interface MissionObjective {
  id: string;
  type: 'primary' | 'secondary' | 'bonus';
  description: string;
  requirements: {
    specialization?: SpecializationType;
    minTeamSize?: number;
    equipment?: string[];
    resources?: Partial<GameResources>;
  };
  rewards: Partial<GameResources> & {
    experience?: number;
    reputation?: number;
    futureOpportunities?: string[];
  };
  completed?: boolean;
  failed?: boolean;
}

export interface MissionConsequence {
  id: string;
  triggerCondition: 'success' | 'failure' | 'partial' | 'abandonment';
  type: 'immediate' | 'delayed' | 'permanent';
  effects: {
    planets?: string[]; // Affects specific planets
    reputation?: number;
    futureOpportunities?: string[];
    corporateEvents?: string[];
    rivalActions?: string[];
  };
  description: string;
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

export type EventEffectType =
  | 'credits'
  | 'soulEssence'
  | 'bureaucraticLeverage'
  | 'rawMaterials'
  | 'morale'
  | 'equipment_durability'
  | 'recruitment_discount'
  | 'equipment_discount'
  | 'productivity_bonus'
  | 'passive_income'
  | 'daemon_retirement';

export interface EventEffect {
  type: EventEffectType;
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

  // Enhanced room system bonuses
  roomSynergyBonus: number;
  roomSynergyMissionBonus: number;

  // Defensive countermeasures
  takeoverDefense: number; // Resistance to hostile takeovers
  espionageImmunity: number; // Days remaining of espionage protection
  boardLoyalty: number; // Board member loyalty rating
  corporateControl: number; // Level of control over corporation
  regulatoryFavor: number; // Favor with regulatory authorities
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

  // Enhanced mission system
  reputation: number;
  availableProceduralMissions: Mission[];
  missionConsequences: MissionConsequence[];
  futureOpportunities: string[];

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
  selectedMissionType: string;
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

// Legacy Book - mapping of bloodline names to legacy data
export interface LegacyBook {
  [bloodline: string]: DaemonLegacy;
}

// Type alias for backward compatibility
export type Story = LegacyStory;

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

  // Enhanced AI system
  aiPersonality: RivalPersonality;
  currentStrategy: RivalStrategy;
  resources: {
    credits: number;
    influence: number;
    intelligence: number;
  };
  ownedPlanets: string[];
  activeOperations: RivalOperation[];
  relationshipWithPlayer: number; // -100 to 100, affects AI decisions
  lastActionDay: number;
  strategicGoals: string[];
}

export interface RivalPersonality {
  aggression: number; // 0-100, affects likelihood of direct attacks
  cunning: number; // 0-100, affects use of espionage and sabotage
  ambition: number; // 0-100, affects expansion rate and resource allocation
  loyalty: number; // 0-100, affects reliability in agreements
  adaptability: number; // 0-100, affects response to player actions
}

export interface RivalStrategy {
  type:
    | 'aggressive_expansion'
    | 'economic_dominance'
    | 'shadow_operations'
    | 'diplomatic_manipulation'
    | 'defensive_consolidation';
  priority: number; // 1-10, how committed they are to this strategy
  duration: number; // Days remaining on this strategy
  targetPlanets?: string[];
  targetPlayer?: boolean;
}

export interface RivalOperation {
  id: string;
  type:
    | 'espionage'
    | 'sabotage'
    | 'planet_attack'
    | 'trade_manipulation'
    | 'alliance_formation'
    | 'counter_intelligence';
  targetId: string; // Planet ID or 'player' for operations against the player
  duration: number; // Days to complete
  successChance: number;
  consequences: {
    success: RivalOperationEffect[];
    failure: RivalOperationEffect[];
  };
}

export interface RivalOperationEffect {
  type: string;
  target: 'player' | 'planet' | 'rival';
  value: number;
  description: string;
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
