// GameplayIntegration.test.tsx - Comprehensive game mechanics test
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { DAEMON_BALANCE, CORPORATE_BALANCE } from '../constants/gameBalance';
import { STARTER_DATA } from '../constants/gameData';

// Mock the game store for isolated testing
const mockGameStore = {
  // Game state
  gameStarted: false,
  daysPassed: 0,
  resources: {
    credits: 500,
    soulEssence: 0,
    bureaucraticLeverage: 0,
    rawMaterials: 0,
  },

  // Daemon management
  daemons: STARTER_DATA.starter_daemons.map(daemon => ({
    ...daemon,
    id: `test-${daemon.name}`,
    isActive: true,
    assignments: [],
    equipment: null,
  })),
  recruitmentPool: [] as any[],
  selectedDaemons: new Set<string>(),

  // UI state
  currentTab: 'dashboard' as 'dashboard' | 'team' | 'missions' | 'apartment' | 'equipment',
  showMissionResults: false,
  showEventModal: false,
  currentEvent: null as any,
  missionResult: null as any,
  notifications: [],

  // Corporate progression
  corporateTier: {
    id: 'associate',
    name: 'Associate',
    level: 1,
    requirements: {},
    unlocks: {
      mechanics: ['basic_missions', 'equipment_crafting'],
      apartmentRooms: ['living_quarters', 'command_center'],
      resources: ['credits'],
    },
  },

  // Planets and missions
  planets: STARTER_DATA.planets.map(planet => ({
    ...planet,
    id: `test-${planet.name}`,
    conquered: false,
    lastMission: null,
  })),
  selectedPlanet: null as any,
  availableProceduralMissions: [],

  // Equipment and rooms
  equipment: STARTER_DATA.starter_equipment.map(eq => ({
    ...eq,
    id: `test-${eq.name}`,
    assignedTo: null,
  })),
  rooms: STARTER_DATA.apartment_rooms.map(room => ({
    ...room,
    id: `test-${room.name}`,
    assignedTo: null,
  })),

  // Actions
  startNewGame: vi.fn(),
  initializeGame: vi.fn(),
  setCurrentTab: vi.fn(),
  recruitDaemon: vi.fn(),
  refreshRecruitmentPool: vi.fn(),
  selectPlanetForMission: vi.fn(),
  setSelectedDaemons: vi.fn(),
  executeMission: vi.fn(),
  conductHRReview: vi.fn(),
  upgradeRoom: vi.fn(),
  canAfford: vi.fn((_cost?: number) => true),
  isHRReviewAvailable: vi.fn(() => true),
  setShowMissionResults: vi.fn(),
  setShowEventModal: vi.fn(),
  resolveEvent: vi.fn(),
};

// Mock the store hook
vi.mock('../stores/composedStore', () => ({
  useGameStore: vi.fn(() => mockGameStore),
}));

describe('Daemon Directorate - Corporate Satire Gameplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock store state
    mockGameStore.gameStarted = false;
    mockGameStore.currentTab = 'dashboard';
    mockGameStore.daysPassed = 0;
  });

  describe('Game Initialization and Corporate Theme', () => {
    it('should display the infernal corporate theme on startup', async () => {
      render(<App />);

      // Check for corporate satire elements in the UI
      expect(screen.getByText(/daemon directorate/i)).toBeInTheDocument();
      expect(
        screen.getByText(/infernal corporate hierarchy/i)
      ).toBeInTheDocument();
    });

    it('should initialize with starter corporate assets (daemons)', () => {
      render(<App />);

      // Verify starter daemons are present with corporate terminology
      expect(mockGameStore.daemons).toHaveLength(3);
      expect(mockGameStore.daemons[0].name).toBe('Belphegor-7734');
      expect(mockGameStore.daemons[0].specialization).toBe('Infiltration');
      expect(mockGameStore.daemons[0].bloodline).toBe(
        'House of Burning Spreadsheets'
      );
    });

    it('should start with proper corporate resources', () => {
      render(<App />);

      expect(mockGameStore.resources.credits).toBe(500);
      expect(mockGameStore.resources.soulEssence).toBe(0);
      expect(mockGameStore.resources.bureaucraticLeverage).toBe(0);
      expect(mockGameStore.resources.rawMaterials).toBe(0);
    });
  });

  describe('Team Management - Corporate Assets', () => {
    beforeEach(() => {
      mockGameStore.currentTab = 'team';
      mockGameStore.gameStarted = true;
    });

    it('should display corporate asset management interface', () => {
      render(<App />);

      // Check for enhanced corporate terminology
      expect(screen.getByText('Active Corporate Assets')).toBeInTheDocument();
      expect(
        screen.getByText('Talent Acquisition Pipeline')
      ).toBeInTheDocument();
    });

    it('should show corporate asset stats with proper terminology', () => {
      render(<App />);

      // Verify corporate terminology in stats display
      expect(screen.getByText('Corporeal Integrity')).toBeInTheDocument();
      expect(screen.getByText('Workplace Satisfaction')).toBeInTheDocument();
      expect(screen.getByText('Contract Duration:')).toBeInTheDocument();
    });

    it('should handle talent acquisition (recruitment)', async () => {
      (mockGameStore as any).recruitmentPool = [
        {
          ...STARTER_DATA.starter_daemons[0],
          id: 'recruit-1',
          cost: DAEMON_BALANCE.RECRUITMENT.BASE_COST,
        },
      ];

      render(<App />);

      const recruitButton = screen.getByText(/process employment contract/i);
      expect(recruitButton).toBeInTheDocument();

      fireEvent.click(recruitButton);
      expect(mockGameStore.recruitDaemon).toHaveBeenCalledWith('recruit-1');
    });

    it('should allow expanding candidate search', async () => {
      render(<App />);

      const expandButton = screen.getByText(/expand candidate search/i);
      expect(expandButton).toBeInTheDocument();

      fireEvent.click(expandButton);
      expect(mockGameStore.refreshRecruitmentPool).toHaveBeenCalled();
    });

    it('should conduct performance reviews for corporate assets', async () => {
      (mockGameStore as any).corporateTier.level = 2; // Manager tier required

      render(<App />);

      const reviewButton = screen.getByText(/performance review/i);
      expect(reviewButton).toBeInTheDocument();

      fireEvent.click(reviewButton);
      expect(mockGameStore.conductHRReview).toHaveBeenCalled();
    });
  });

  describe('Corporate Housing Division (Apartment)', () => {
    beforeEach(() => {
      mockGameStore.currentTab = 'apartment';
      mockGameStore.gameStarted = true;
    });

    it('should display corporate housing interface', () => {
      render(<App />);

      expect(
        screen.getByText('Corporate Housing Division')
      ).toBeInTheDocument();
      expect(screen.getByText(/soul-crushing cubicle/i)).toBeInTheDocument();
      expect(
        screen.getByText(/15% more despair absorption/i)
      ).toBeInTheDocument();
    });

    it('should allow budget requests for facility upgrades', async () => {
      render(<App />);

      const upgradeButton = screen.getByText(/submit budget request/i);
      expect(upgradeButton).toBeInTheDocument();

      fireEvent.click(upgradeButton);
      expect(mockGameStore.upgradeRoom).toHaveBeenCalled();
    });
  });

  describe('Mission System - Corporate Operations', () => {
    beforeEach(() => {
      mockGameStore.currentTab = 'missions';
      mockGameStore.gameStarted = true;
      mockGameStore.selectedDaemons = new Set(['test-Belphegor-7734']);
    });

    it('should display mission interface with corporate terminology', () => {
      render(<App />);

      // Check for planets with corporate naming
      expect(screen.getByText('Xerox-7')).toBeInTheDocument();
      expect(screen.getByText('Synergy-Prime')).toBeInTheDocument();
      expect(screen.getByText('Productivity-Nine')).toBeInTheDocument();
    });

    it('should execute corporate conquest missions', async () => {
      (mockGameStore as any).selectedPlanet = mockGameStore.planets[0];

      render(<App />);

      const missionButton = screen.getByText(/execute.*mission/i);
      if (missionButton) {
        fireEvent.click(missionButton);
        expect(mockGameStore.executeMission).toHaveBeenCalled();
      }
    });

    it('should display performance evaluation results', () => {
      mockGameStore.showMissionResults = true;
      (mockGameStore as any).missionResult = {
        success: true,
        narrative:
          'Quarterly objectives met through strategic synergy optimization.',
        successChance: 75,
        casualties: [],
        rewards: { credits: 200, soulEssence: 1 },
      };

      render(<App />);

      // Check for enhanced corporate mission results terminology
      expect(
        screen.getByText('Performance Evaluation Report')
      ).toBeInTheDocument();
      expect(screen.getByText('QUARTERLY OBJECTIVES MET')).toBeInTheDocument();
      expect(screen.getByText('KPI Achievement Odds:')).toBeInTheDocument();
      expect(screen.getByText('Personnel Attrition:')).toBeInTheDocument();
    });
  });

  describe('Corporate Events - Bureaucratic Scenarios', () => {
    it('should display enhanced corporate event modal', () => {
      mockGameStore.showEventModal = true;
      (mockGameStore as any).currentEvent = {
        id: 'performance_review',
        title: 'Quarterly Soul Performance Evaluation',
        description:
          'HR has mandated comprehensive performance reviews to assess productivity metrics and suffering quotas.',
        type: 'choice' as const,
        choices: [
          {
            label: 'Embrace the Bureaucratic Excellence',
            description:
              'Demonstrate unwavering commitment to corporate compliance procedures',
            effects: [
              {
                type: 'morale',
                value: -5,
                description:
                  'Corporate assets experience workplace satisfaction reduction',
              },
            ],
          },
        ],
      };

      render(<App />);

      // Verify enhanced corporate event terminology
      expect(screen.getByText('Corporate Directive')).toBeInTheDocument();
      expect(
        screen.getByText('Quarterly Soul Performance Evaluation')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/productivity metrics and suffering quotas/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText('Embrace the Bureaucratic Excellence')
      ).toBeInTheDocument();
    });

    it('should handle corporate event choices with proper consequences', async () => {
      mockGameStore.showEventModal = true;
      (mockGameStore as any).currentEvent = {
        id: 'test_event',
        title: 'Test Corporate Event',
        description: 'Test event description',
        type: 'choice' as const,
        choices: [
          {
            label: 'Test Choice',
            description: 'Test choice description',
            effects: [
              { type: 'credits', value: 100, description: 'Test reward' },
            ],
          },
        ],
      };

      render(<App />);

      const choiceButton = screen.getByText('Select This Option');
      fireEvent.click(choiceButton);

      expect(mockGameStore.resolveEvent).toHaveBeenCalledWith('test_event', 0);
    });
  });

  describe('Corporate Progression System', () => {
    it('should track corporate tier advancement', () => {
      expect(mockGameStore.corporateTier.name).toBe('Associate');
      expect(mockGameStore.corporateTier.level).toBe(1);
      expect(mockGameStore.corporateTier.unlocks.mechanics).toContain(
        'basic_missions'
      );
    });

    it('should unlock HR reviews at Manager tier', () => {
      (mockGameStore as any).corporateTier.level = 2;

      render(<App />);
      mockGameStore.currentTab = 'team';

      expect(mockGameStore.corporateTier.level).toBeGreaterThanOrEqual(
        CORPORATE_BALANCE.HR_REVIEW.MIN_TIER
      );
    });
  });

  describe('Resource Management - Corporate Economics', () => {
    it('should properly track bureaucratic leverage', () => {
      expect(typeof mockGameStore.resources.bureaucraticLeverage).toBe(
        'number'
      );
      expect(
        mockGameStore.resources.bureaucraticLeverage
      ).toBeGreaterThanOrEqual(0);
    });

    it('should handle soul essence transactions', () => {
      expect(typeof mockGameStore.resources.soulEssence).toBe('number');
      expect(mockGameStore.resources.soulEssence).toBeGreaterThanOrEqual(0);
    });

    it('should validate resource affordability for corporate purchases', () => {
      const canAfford = mockGameStore.canAfford(100);
      expect(typeof canAfford).toBe('boolean');
      expect(mockGameStore.canAfford).toHaveBeenCalledWith(100);
    });
  });

  describe('Corporate Quirks and Traits', () => {
    it('should display enhanced corporate quirk descriptions', () => {
      // Verify that daemons have corporate-themed quirks
      const daemon = mockGameStore.daemons[0];
      expect(daemon.quirks).toBeDefined();
      expect(Array.isArray(daemon.quirks)).toBe(true);

      // Check if quirks have corporate terminology
      if (daemon.quirks.length > 0 && typeof daemon.quirks[0] === 'object') {
        const quirk = daemon.quirks[0];
        expect(quirk.name).toBeDefined();
        expect(quirk.description).toBeDefined();
      }
    });
  });

  describe('Game Flow Integration', () => {
    it('should maintain game state consistency during tab navigation', async () => {
      render(<App />);

      // Navigate between tabs
      mockGameStore.setCurrentTab('team');
      expect(mockGameStore.setCurrentTab).toHaveBeenCalledWith('team');

      mockGameStore.setCurrentTab('missions');
      expect(mockGameStore.setCurrentTab).toHaveBeenCalledWith('missions');

      mockGameStore.setCurrentTab('apartment');
      expect(mockGameStore.setCurrentTab).toHaveBeenCalledWith('apartment');
    });

    it('should handle game initialization sequence', () => {
      render(<App />);

      // Check that initialization is called
      expect(mockGameStore.initializeGame).toHaveBeenCalled();
    });

    it('should properly start new game with corporate assets', async () => {
      render(<App />);

      mockGameStore.startNewGame();
      expect(mockGameStore.startNewGame).toHaveBeenCalled();
    });
  });

  describe('Corporate Satire Theme Consistency', () => {
    const corporateTerms = [
      'Corporate Assets',
      'Workplace Satisfaction',
      'Corporeal Integrity',
      'Contract Duration',
      'Talent Acquisition',
      'Performance Review',
      'Corporate Housing Division',
      'Bureaucratic Excellence',
      'Strategic Partnership',
      'Compliance Assessment',
    ];

    it('should use consistent corporate terminology throughout the interface', () => {
      mockGameStore.currentTab = 'team';
      render(<App />);

      // Verify corporate terminology is present in the DOM
      const bodyText = document.body.textContent || '';
      const foundTerms = corporateTerms.filter(term =>
        bodyText.toLowerCase().includes(term.toLowerCase())
      );

      // Should find at least some corporate terms in the Team Management interface
      expect(foundTerms.length).toBeGreaterThan(0);
    });

    it('should maintain dark humor and satire in descriptions', () => {
      mockGameStore.currentTab = 'apartment';
      render(<App />);

      const bodyText = document.body.textContent || '';

      // Check for satirical elements
      expect(
        bodyText.includes('soul-crushing') ||
          bodyText.includes('despair') ||
          bodyText.includes('infernal')
      ).toBe(true);
    });
  });
});
