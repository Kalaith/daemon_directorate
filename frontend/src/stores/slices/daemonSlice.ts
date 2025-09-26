// stores/slices/daemonSlice.ts - Daemon management slice
import type { StateCreator } from 'zustand';
import type { Daemon, DaemonLegacy, LegacyStory } from '../../types/game';
import { STARTER_DATA, DAEMON_NAMES, DAEMON_QUIRKS } from '../../constants/gameData';
import { DAEMON_BALANCE } from '../../constants/gameBalance';
import { calculateSuccessorStats, shouldCreateSuccessor, generateId } from '../../utils/gameHelpers';

export interface DaemonState {
  // State
  daemons: Daemon[];
  recruitmentPool: Daemon[];
  selectedDaemons: Set<string>;
  legacyBook: Record<string, DaemonLegacy>;
  hallOfInfamy: LegacyStory[];
  lastHRReview: number;
}

export interface DaemonActions {
  // Core daemon management
  toggleDaemonSelection: (daemonId: string) => void;
  clearDaemonSelection: () => void;
  recruitDaemon: (daemonId: string) => void;
  refreshRecruitmentPool: () => void;
  generateRecruitmentPool: () => void;

  // HR and lifecycle management
  processDaemonDeath: (daemon: Daemon) => void;
  conductHRReview: (daemonId: string) => void;
  isHRReviewAvailable: () => boolean;

  // Legacy system
  addLegacyStory: (daemonId: string, story: Omit<LegacyStory, 'id' | 'timestamp'>) => void;
  generateLegacyLegend: (bloodline: string) => void;
  createNewLegacy: (daemon: Daemon) => DaemonLegacy;

  // Assignment management
  assignDaemonToRoom: (daemonId: string, roomId: string) => void;
  unassignDaemonFromRoom: (daemonId: string, roomId: string) => void;

  // Utility functions
  getDaemonById: (id: string) => Daemon | undefined;
  getActiveDaemons: () => Daemon[];
  getDaemonsBySpecialization: (specialization: string) => Daemon[];
  updateDaemonStats: (daemonId: string, updates: Partial<Pick<Daemon, 'health' | 'morale' | 'lifespanDays'>>) => void;
}

export type DaemonSlice = DaemonState & DaemonActions;

export const createDaemonSlice: StateCreator<
  DaemonSlice,
  [],
  [],
  DaemonSlice
> = (set, get) => ({
  // Initial state
  daemons: STARTER_DATA.starter_daemons,
  recruitmentPool: [],
  selectedDaemons: new Set(),
  legacyBook: {},
  hallOfInfamy: [],
  lastHRReview: 0,

  // Actions
  toggleDaemonSelection: (daemonId: string) => {
    set(state => {
      const newSelection = new Set(state.selectedDaemons);
      if (newSelection.has(daemonId)) {
        newSelection.delete(daemonId);
      } else {
        newSelection.add(daemonId);
      }
      return { selectedDaemons: newSelection };
    });
  },

  clearDaemonSelection: () => {
    set({ selectedDaemons: new Set() });
  },

  recruitDaemon: (daemonId: string) => {
    const candidate = get().recruitmentPool.find(d => d.id === daemonId);
    if (!candidate) return;

    set(state => ({
      daemons: [...state.daemons, { ...candidate, isActive: true }],
      recruitmentPool: state.recruitmentPool.filter(d => d.id !== daemonId),
    }));
  },

  refreshRecruitmentPool: () => {
    get().generateRecruitmentPool();
  },

  generateRecruitmentPool: () => {
    // Using centralized generateId from gameHelpers
    const specializations = ['Infiltration', 'Combat', 'Sabotage', 'Diplomacy'] as const;

    const pool: Daemon[] = Array.from({ length: 3 }, () => {
      const specialization = specializations[Math.floor(Math.random() * specializations.length)];
      const name = `${DAEMON_NAMES[Math.floor(Math.random() * DAEMON_NAMES.length)]}-${Math.floor(Math.random() * DAEMON_BALANCE.RECRUITMENT.NAMING.ID_RANGE) + DAEMON_BALANCE.RECRUITMENT.NAMING.ID_MIN}`;
      const bloodline = `House of ${['Burning Spreadsheets', 'Eternal Audits', 'Divine Bureaucracy', 'Sacred Forms'][Math.floor(Math.random() * 4)]}`;

      return {
        id: generateId(),
        name,
        specialization,
        health: Math.floor(Math.random() * DAEMON_BALANCE.RECRUITMENT.HEALTH.RANGE) + DAEMON_BALANCE.RECRUITMENT.HEALTH.MIN,
        morale: Math.floor(Math.random() * DAEMON_BALANCE.RECRUITMENT.MORALE.RANGE) + DAEMON_BALANCE.RECRUITMENT.MORALE.MIN,
        lifespanDays: Math.floor(Math.random() * DAEMON_BALANCE.RECRUITMENT.LIFESPAN.RANGE) + DAEMON_BALANCE.RECRUITMENT.LIFESPAN.MIN,
        quirks: DAEMON_QUIRKS.sort(() => 0.5 - Math.random()).slice(0, 2),
        assignments: [],
        equipment: null,
        isActive: false,
        generation: 1,
        bloodline,
        mentor: null,
        inheritedTraits: [],
        legacy: {
          successfulMissions: 0,
          planetsConquered: 0,
          equipmentCreated: 0,
          yearsServed: 0,
        },
      };
    });

    set({ recruitmentPool: pool });
  },

  processDaemonDeath: (daemon: Daemon) => {
    const { addLegacyStory, createNewLegacy } = get();

    // Add death story to hall of infamy
    addLegacyStory(daemon.id, {
      title: `${daemon.name}'s Final Form Submission`,
      description: `${daemon.name} completed their corporate lifecycle after ${daemon.legacy.successfulMissions} successful missions and ${daemon.legacy.planetsConquered} planetary conquests.`,
      category: daemon.legacy.successfulMissions >= DAEMON_BALANCE.LEGACY_REQUIREMENTS.VETERAN_STATUS_MISSIONS ? 'legendary' : 'tragic',
    });

    // Create legacy entry
    const legacy = createNewLegacy(daemon);

    // Create successor if qualified
    if (shouldCreateSuccessor(daemon)) {
      // Using centralized generateId from gameHelpers
      const successorName = `${DAEMON_NAMES[Math.floor(Math.random() * DAEMON_NAMES.length)]}-${Math.floor(Math.random() * DAEMON_BALANCE.RECRUITMENT.NAMING.ID_RANGE) + DAEMON_BALANCE.RECRUITMENT.NAMING.ID_MIN}`;
      const stats = calculateSuccessorStats(daemon);

      const successor: Daemon = {
        id: generateId(),
        name: successorName,
        specialization: daemon.specialization,
        health: stats.health,
        morale: stats.morale,
        lifespanDays: stats.lifespanDays,
        quirks: DAEMON_QUIRKS.sort(() => 0.5 - Math.random()).slice(0, 2),
        assignments: [],
        equipment: null,
        isActive: true,
        generation: daemon.generation + 1,
        bloodline: daemon.bloodline,
        mentor: daemon.id,
        inheritedTraits: [...daemon.inheritedTraits],
        legacy: {
          successfulMissions: 0,
          planetsConquered: 0,
          equipmentCreated: 0,
          yearsServed: 0,
        },
      };

      set(state => ({
        daemons: [
          ...state.daemons.filter(d => d.id !== daemon.id),
          successor,
        ],
        legacyBook: {
          ...state.legacyBook,
          [daemon.bloodline]: legacy,
        },
      }));

      // Add succession story
      addLegacyStory(successor.id, {
        title: `Rise of ${successorName}`,
        description: `${successorName} inherits the corporate legacy of ${daemon.name}, carrying forward the traditions of ${daemon.bloodline}.`,
        category: 'heroic',
      });
    } else {
      // Simply remove daemon without successor
      set(state => ({
        daemons: state.daemons.filter(d => d.id !== daemon.id),
      }));
    }
  },

  conductHRReview: (daemonId: string) => {
    if (!get().isHRReviewAvailable()) return;

    const daemon = get().getDaemonById(daemonId);
    if (!daemon) return;

    const reviewOutcome = Math.random();
    let healthChange = 0;
    let moraleChange = 0;
    let lifespanChange = 0;

    if (reviewOutcome < DAEMON_BALANCE.HR_REVIEW.POSITIVE_CHANCE) {
      // Positive review
      healthChange = DAEMON_BALANCE.HR_REVIEW.POSITIVE_HEALTH;
      moraleChange = DAEMON_BALANCE.HR_REVIEW.POSITIVE_MORALE;
    } else if (reviewOutcome < DAEMON_BALANCE.HR_REVIEW.POSITIVE_CHANCE + DAEMON_BALANCE.HR_REVIEW.NEUTRAL_CHANCE) {
      // Neutral review - no changes
    } else {
      // Negative review
      healthChange = DAEMON_BALANCE.HR_REVIEW.NEGATIVE_HEALTH;
      moraleChange = DAEMON_BALANCE.HR_REVIEW.NEGATIVE_MORALE;
      lifespanChange = DAEMON_BALANCE.HR_REVIEW.NEGATIVE_LIFESPAN;
    }

    get().updateDaemonStats(daemonId, {
      health: Math.max(0, Math.min(100, daemon.health + healthChange)),
      morale: Math.max(0, Math.min(100, daemon.morale + moraleChange)),
      lifespanDays: Math.max(0, daemon.lifespanDays + lifespanChange),
    });

    set({ lastHRReview: Date.now() });
  },

  isHRReviewAvailable: () => {
    const daysSinceLastReview = (Date.now() - get().lastHRReview) / (1000 * 60 * 60 * 24);
    return daysSinceLastReview >= DAEMON_BALANCE.HR_REVIEW.COOLDOWN_DAYS;
  },

  addLegacyStory: (daemonId: string, story: Omit<LegacyStory, 'id' | 'timestamp'>) => {
    const daemon = get().getDaemonById(daemonId);
    if (!daemon) return;

    const legacyStory: LegacyStory = {
      ...story,
      id: generateId(), // Using centralized ID generation
      timestamp: Date.now(),
    };

    set(state => ({
      hallOfInfamy: [...state.hallOfInfamy, legacyStory],
    }));
  },

  generateLegacyLegend: (bloodline: string) => {
    const legacy = get().legacyBook[bloodline];
    if (!legacy) return;

    // Implementation for generating legends based on legacy
    // Legend generation logic - using structured logging instead of console.log
  },

  createNewLegacy: (daemon: Daemon): DaemonLegacy => {
    return {
      bloodline: daemon.bloodline,
      founderName: daemon.name,
      generation: daemon.generation,
      totalSuccessfulMissions: daemon.legacy.successfulMissions,
      totalPlanetsConquered: daemon.legacy.planetsConquered,
      totalEquipmentCreated: daemon.legacy.equipmentCreated,
      totalYearsServed: daemon.legacy.yearsServed,
      specialAchievements: [],
      dominantTrait: daemon.quirks[0]?.name || 'Unknown',
    };
  },

  assignDaemonToRoom: (daemonId: string, roomId: string) => {
    set(state => ({
      daemons: state.daemons.map(daemon =>
        daemon.id === daemonId
          ? { ...daemon, assignments: [...daemon.assignments.filter(a => a !== roomId), roomId] }
          : daemon
      ),
    }));
  },

  unassignDaemonFromRoom: (daemonId: string, roomId: string) => {
    set(state => ({
      daemons: state.daemons.map(daemon =>
        daemon.id === daemonId
          ? { ...daemon, assignments: daemon.assignments.filter(a => a !== roomId) }
          : daemon
      ),
    }));
  },

  getDaemonById: (id: string) => {
    return get().daemons.find(daemon => daemon.id === id);
  },

  getActiveDaemons: () => {
    return get().daemons.filter(daemon => daemon.isActive);
  },

  getDaemonsBySpecialization: (specialization: string) => {
    return get().daemons.filter(daemon => daemon.specialization === specialization);
  },

  updateDaemonStats: (daemonId: string, updates: Partial<Pick<Daemon, 'health' | 'morale' | 'lifespanDays'>>) => {
    set(state => ({
      daemons: state.daemons.map(daemon =>
        daemon.id === daemonId
          ? { ...daemon, ...updates }
          : daemon
      ),
    }));
  },
});