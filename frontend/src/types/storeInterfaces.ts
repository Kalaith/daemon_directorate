// types/storeInterfaces.ts - Split interfaces for better maintainability
import type {
  GameState,
  GameResources,
  Daemon,
  MissionResult,
  CorporateEvent,
  CorporateTier,
  ComplianceTask,
  DaemonLegacy,
  LegacyStory,
  ManagementStyle,
  SurrealEvent,
  RivalOperation,
  MissionConsequence,
  TabType,
  NotificationType,
  Mission,
} from './game';

// Core game actions interface
export interface CoreGameActions {
  initializeGame: () => void;
  startNewGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
  resetToInitialState: () => void;
  generateId: () => string;
}

// UI State management actions
export interface UIStateActions {
  setCurrentTab: (tab: TabType) => void;
  setCurrentPlanet: (planetId: string | null) => void;
  setShowTutorial: (show: boolean) => void;
  setTutorialCompleted: () => void;
  setShowMemorial: (show: boolean, daemon?: Daemon) => void;
  setShowMissionModal: (show: boolean) => void;
  setShowMissionResults: (show: boolean, result?: MissionResult) => void;
  setShowEventModal: (show: boolean, event?: CorporateEvent) => void;
  addNotification: (message: string, type?: NotificationType) => void;
}

// Resource management actions
export interface ResourceActions {
  canAfford: (cost: number | Partial<GameResources>) => boolean;
  spendCredits: (amount: number) => boolean;
  spendResourceBatch: (
    costs: Partial<GameResources>,
    reason?: string
  ) => boolean;
  addResources: (
    credits?: number,
    soulEssence?: number,
    bureaucraticLeverage?: number,
    rawMaterials?: number
  ) => void;
  addResourceBatch: (gains: Partial<GameResources>, reason?: string) => void;
}

// Daemon management actions
export interface DaemonActions {
  toggleDaemonSelection: (daemonId: string) => void;
  clearDaemonSelection: () => void;
  setSelectedDaemons: (daemonIds: Set<string>) => void;
  recruitDaemon: (daemonId: string) => void;
  dismissDaemon: (daemonId: string) => void;
  refreshRecruitmentPool: () => void;
  generateRecruitmentPool: () => void;
  processDaemonDeath: (daemon: Daemon) => void;
  conductHRReview: (daemonId: string) => void;
  isHRReviewAvailable: () => boolean;
}

// Mission system actions
export interface MissionActions {
  selectPlanetForMission: (planetId: string, missionType?: string) => void;
  executeMission: (missionType?: string) => MissionResult;
  generateProceduralMissions: () => void;
  processMissionConsequences: (consequences: MissionConsequence[]) => void;
  evaluateMissionObjectives: (
    mission: Mission,
    result: MissionResult
  ) => MissionResult;
}

// Room and apartment management actions
export interface RoomActions {
  upgradeRoom: (roomId: string) => void;
  assignDaemonToRoom: (daemonId: string, roomId: string) => void;
  unassignDaemonFromRoom: (daemonId: string, roomId: string) => void;
  calculateRoomSynergyBonuses: () => void;
  unlockRoom: (roomId: string) => void;
}

// Equipment management actions
export interface EquipmentActions {
  repairEquipment: (equipmentId: string) => void;
  craftItem: (itemType: string) => void;
}

// Corporate event actions
export interface EventActions {
  triggerRandomEvent: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;
  processDailyUpdate: () => void;
}

// Corporate progression actions
export interface ProgressionActions {
  checkPromotion: () => void;
  promotePlayer: (newTier: CorporateTier) => void;
  meetsRequirements: (requirements: CorporateTier['requirements']) => boolean;
  unlockTierFeatures: (tier: CorporateTier) => void;
}

// Compliance system actions
export interface ComplianceActions {
  generateComplianceTask: () => void;
  processComplianceDeadlines: () => void;
  applyCompliancePenalties: (task: ComplianceTask) => void;
  completeComplianceTask: (taskId: string) => void;
}

// Legacy system actions
export interface LegacyActions {
  addLegacyStory: (
    daemonId: string,
    story: Omit<LegacyStory, 'id' | 'timestamp'>
  ) => void;
  generateLegacyLegend: (bloodline: string) => void;
  createNewLegacy: (daemon: Daemon) => DaemonLegacy;
}

// Surreal events actions
export interface SurrealEventActions {
  triggerSurrealEvent: () => void;
  showEventWithEscalatedAbsurdity: (
    event: SurrealEvent,
    tierLevel: number
  ) => void;
}

// Endgame system actions
export interface EndgameActions {
  calculateManagementStyle: () => ManagementStyle;
  triggerEnding: (style: ManagementStyle) => void;
  performCorporateRestructuring: () => void;
}

// Corporate rivals actions
export interface RivalActions {
  engageRival: (rivalId: string) => void;
  defeatRival: (rivalId: string) => void;
  calculateRivalSuccessChance: (rivalId: string) => number;
  processRivalAI: () => void;
  executeRivalOperation: (rivalId: string, operation: RivalOperation) => void;
  updateRivalStrategy: (rivalId: string) => void;
  generateRivalOperation: (rivalId: string) => RivalOperation | null;
  checkTakeoverThreats: () => void;
}

// Zustand store interface
export interface ZustandGameStore {
  getState: () => GameStore;
}

// Combined GameStore interface - now much more manageable
export interface GameStore
  extends GameState,
    CoreGameActions,
    UIStateActions,
    ResourceActions,
    DaemonActions,
    MissionActions,
    RoomActions,
    EquipmentActions,
    EventActions,
    ProgressionActions,
    ComplianceActions,
    LegacyActions,
    SurrealEventActions,
    EndgameActions,
    RivalActions {}

// Type guards for better type safety
export const isValidDaemonId = (id: unknown): id is string => {
  return typeof id === 'string' && id.length > 0;
};

export const isValidAmount = (amount: unknown): amount is number => {
  return typeof amount === 'number' && amount >= 0 && isFinite(amount);
};

export const isActiveDaemon = (daemon: Daemon): boolean => {
  return daemon.isActive && daemon.health > 0 && daemon.lifespanDays > 0;
};

// Utility types for better type inference
export type DaemonSelector = (state: GameState) => Daemon[];
export type ResourceSelector = (state: GameState) => number;
export type BooleanSelector = (state: GameState) => boolean;

// Action parameter types for better type safety
export interface RecruitDaemonParams {
  daemonId: string;
  cost?: number;
}

export interface ExecuteMissionParams {
  missionType?: string;
  planetId?: string;
  teamIds?: string[];
}

export interface CraftItemParams {
  itemType: 'briefcase' | 'tie' | 'calculator';
  customName?: string;
}

export interface UpgradeRoomParams {
  roomId: string;
  levels?: number;
}
