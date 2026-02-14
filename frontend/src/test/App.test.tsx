// src/test/App.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

const createMockState = () => ({
  // UI State
  currentTab: 'dashboard',
  showTutorial: false,
  showMemorial: false,
  showMissionModal: false,
  showMissionResults: false,
  showEventModal: false,
  selectedDaemons: new Set(),
  currentPlanet: null,
  memorialDaemon: null,
  missionResults: null,
  currentEvent: null,
  notifications: [],

  // Game State - properties used by Dashboard
  activeMission: null,
  daemons: [],
  corporateEvents: [],
  corporateTier: {
    id: 'associate',
    name: 'Associate',
    level: 1,
    requirements: {},
    unlocks: {
      resources: [],
      mechanics: [],
      apartmentRooms: [],
      eventTypes: [],
    },
  },
  complianceTasks: [],
  daysPassed: 0,
  legacyBook: {},
  hallOfInfamy: [],

  // Game State - other required properties
  resources: {
    credits: 500,
    soulEssence: 0,
    bureaucraticLeverage: 0,
    rawMaterials: 0,
  },
  equipment: [],
  rooms: [],
  planets: [],
  recruitmentPool: [],
  gameModifiers: {
    passiveIncome: 0,
    recruitmentDiscount: 0,
    equipmentRepairDiscount: 0,
    missionSuccessBonus: 0,
    missionSpeedBonus: 0,
    equipmentDurabilityBonus: 0,
    daemonHealthBonus: 0,
    daemonMoraleBonus: 0,
  },
  gameStarted: false,
  tutorialCompleted: false,
  promotionProgress: {},
  complianceDeadlines: {},
  endgameState: {
    hasTriggered: false,
    managementStyle: null,
    finalScore: 0,
    achievements: [],
  },
  unlockedContent: {
    apartmentRooms: [],
    equipmentTypes: [],
    daemonTypes: [],
    eventTypes: [],
  },
  corporateRivals: [],

  // Actions
  initializeGame: vi.fn(),
  triggerRandomEvent: vi.fn(),
  meetsRequirements: vi.fn().mockReturnValue(false),
});

type MockState = ReturnType<typeof createMockState>;

// Mock the game store
vi.mock('../stores/composedStore', () => ({
  useGameStore: (selector?: (state: MockState) => unknown) => {
    const state = createMockState();
    return selector ? selector(state) : state;
  },
  useCorporate: () => ({
    corporateTier: {
      id: 'associate',
      name: 'Associate',
      level: 1,
      requirements: {},
      unlocks: {
        resources: [],
        mechanics: [],
        apartmentRooms: [],
        eventTypes: [],
      },
    },
    corporateRivals: [],
    initializeRivals: vi.fn(),
    engageRival: vi.fn(),
    calculateRivalSuccessChance: vi.fn(),
    processRivalActions: vi.fn(),
  }),
  useCorporateRivals: () => [],
  useInitializeRivals: () => vi.fn(),
  useEngageRival: () => vi.fn(),
  useCalculateRivalSuccessChance: () => vi.fn(() => 75),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Daemon Directorate')).toBeDefined();
  });

  it('renders the header component', () => {
    render(<App />);
    expect(screen.getByText('Daemon Directorate')).toBeDefined();
  });

  it('renders the tab navigation', () => {
    render(<App />);
    expect(screen.getByText('Corporate Dashboard')).toBeDefined();
    expect(screen.getByText('Team Management')).toBeDefined();
    expect(screen.getByText('Planetary Operations')).toBeDefined();
    expect(screen.getByText('Apartment HQ')).toBeDefined();
    expect(screen.getByText('Equipment Depot')).toBeDefined();
  });

  it('renders the dashboard by default', () => {
    render(<App />);
    expect(screen.getByText('Days in Operation')).toBeDefined();
  });

  it('renders game controls', () => {
    render(<App />);
    expect(screen.getByText('Reset Game')).toBeDefined();
  });
});
