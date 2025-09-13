// Game types for Daemon Directorate
export interface GameResources {
  credits: number;
  soulEssence: number;
  bureaucraticLeverage: number;
  rawMaterials: number;
}

export interface Daemon {
  id: string;
  name: string;
  specialization: 'Infiltration' | 'Combat' | 'Sabotage';
  health: number;
  morale: number;
  lifespanDays: number;
  quirks: string[];
  assignments: string[];
  equipment: string | null;
  isActive: boolean;
  cost?: number; // For recruitment pool daemons
}

export interface Equipment {
  id: string;
  name: string;
  type: 'Infiltration' | 'Combat' | 'Sabotage';
  durability: number;
  ability: string;
  assignedTo: string | null;
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
  effect: string;
  timestamp: number;
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
  memorialDaemon: Daemon | null;
  missionResults: MissionResult | null;
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
