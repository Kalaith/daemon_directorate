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
  starter_daemons: Omit<Daemon, 'id' | 'assignments' | 'equipment' | 'isActive'>[];
  starter_equipment: Omit<Equipment, 'id' | 'assignedTo'>[];
  planets: Omit<Planet, 'id' | 'conquered' | 'lastMission'>[];
  apartment_rooms: Omit<Room, 'id'>[];
}

// Type aliases for clarity
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type SpecializationType = 'Infiltration' | 'Combat' | 'Sabotage';
export type TabType = 'dashboard' | 'team' | 'missions' | 'apartment' | 'equipment';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
