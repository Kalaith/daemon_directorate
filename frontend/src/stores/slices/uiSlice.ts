// stores/slices/uiSlice.ts - UI state management slice
import type { StateCreator } from 'zustand';
import type {
  TabType,
  NotificationType,
  MissionResult,
  CorporateEvent,
} from '../../types/game';
import { generateId } from '../../utils/gameHelpers';

export interface UIState {
  // Tab navigation
  currentTab: TabType;

  // Modal states
  showTutorial: boolean;
  showMemorial: boolean;
  showMissionModal: boolean;
  showMissionResults: boolean;
  showEventModal: boolean;

  // Game state
  gameStarted: boolean;
  tutorialCompleted: boolean;
  daysPassed: number;

  // Mission results
  missionResult: MissionResult | null;
  currentEvent: CorporateEvent | null;

  // Loading states
  loadingStates: Record<string, boolean>;

  // Notifications
  notifications: Array<{
    id: string;
    type: NotificationType;
    message: string;
    timestamp: number;
  }>;
}

export interface UIActions {
  // Tab management
  setCurrentTab: (tab: TabType) => void;

  // Modal management
  setShowTutorial: (show: boolean) => void;
  setShowMemorial: (show: boolean) => void;
  setShowMissionModal: (show: boolean) => void;
  setShowMissionResults: (show: boolean, result?: MissionResult) => void;
  setShowEventModal: (show: boolean, event?: CorporateEvent) => void;

  // Game state management
  setGameStarted: (started: boolean) => void;
  setTutorialCompleted: () => void;
  incrementDay: () => void;

  // Loading state management
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;

  // Notification management
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Game initialization
  initializeGame: () => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
}

export type UISlice = UIState & UIActions;

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (
  set,
  get
) => ({
  // Initial state
  currentTab: 'dashboard',
  showTutorial: false,
  showMemorial: false,
  showMissionModal: false,
  showMissionResults: false,
  showEventModal: false,
  gameStarted: false,
  tutorialCompleted: false,
  daysPassed: 0,
  missionResult: null,
  currentEvent: null,
  loadingStates: {},
  notifications: [],

  // Actions
  setCurrentTab: (tab: TabType) => {
    set({ currentTab: tab });
  },

  setShowTutorial: (show: boolean) => {
    set({ showTutorial: show });
  },

  setShowMemorial: (show: boolean) => {
    set({ showMemorial: show });
  },

  setShowMissionModal: (show: boolean) => {
    set({ showMissionModal: show });
  },

  setShowMissionResults: (show: boolean, result?: MissionResult) => {
    set({
      showMissionResults: show,
      missionResult: result || null,
    });
  },

  setShowEventModal: (show: boolean, event?: CorporateEvent) => {
    set({
      showEventModal: show,
      currentEvent: event || null,
    });
  },

  setGameStarted: (started: boolean) => {
    set({ gameStarted: started });
  },

  setTutorialCompleted: () => {
    set({ tutorialCompleted: true });
  },

  incrementDay: () => {
    set(state => ({ daysPassed: state.daysPassed + 1 }));
  },

  setLoading: (key: string, loading: boolean) => {
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    }));
  },

  isLoading: (key: string) => {
    return get().loadingStates[key] || false;
  },

  addNotification: (message: string, type: NotificationType = 'info') => {
    const notification = {
      id: generateId(), // Using centralized ID generation
      type,
      message,
      timestamp: Date.now(),
    };

    set(state => ({
      notifications: [...state.notifications, notification].slice(-10), // Keep last 10
    }));
  },

  removeNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  initializeGame: () => {
    // Initialize game systems
    set({
      gameStarted: false,
      tutorialCompleted: false,
      daysPassed: 0,
      currentTab: 'dashboard',
    });
  },

  resetGame: () => {
    set({
      gameStarted: false,
      tutorialCompleted: false,
      daysPassed: 0,
      currentTab: 'dashboard',
      showTutorial: false,
      showMemorial: false,
      showMissionModal: false,
      showMissionResults: false,
      showEventModal: false,
      missionResult: null,
      currentEvent: null,
      notifications: [],
      loadingStates: {},
    });
  },

  saveGame: () => {
    // Save game state to localStorage
    // This will be handled by the persist middleware
    get().addNotification('Game saved successfully', 'success');
  },

  loadGame: () => {
    try {
      // Load game state from localStorage
      // This will be handled by the persist middleware
      get().addNotification('Game loaded successfully', 'success');
      return true;
    } catch {
      get().addNotification('Failed to load game', 'error');
      return false;
    }
  },
});
