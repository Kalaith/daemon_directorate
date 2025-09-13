// Helper functions for creating mock data in tests
export const createMockDaemon = (overrides = {}) => ({
  id: 'mock-daemon-1',
  name: 'Test Daemon',
  specialization: 'Infiltration' as const,
  quirk: 'Perfectionist',
  bloodline: 'Standard',
  lifespanDays: 100,
  morale: 75,
  health: 80,
  skills: {
    combat: 60,
    infiltration: 80,
    sabotage: 40,
  },
  assignments: [],
  equipment: null,
  isActive: true,
  generation: 1,
  inheritedTraits: [],
  legacy: {
    successfulMissions: 0,
    planetsConquered: 0,
    equipmentCreated: 0,
    yearsServed: 0,
  },
  ...overrides,
});

export const createMockEquipment = (overrides = {}) => ({
  id: 'mock-equipment-1',
  name: 'Test Briefcase',
  type: 'Infiltration' as const,
  ability: 'Test ability (+10 infiltration)',
  durability: 100,
  assignedTo: null,
  generation: 0,
  legacyBonus: 0,
  history: ['Test equipment'],
  ...overrides,
});

export const createMockPlanet = (overrides = {}) => ({
  id: 'mock-planet-1',
  name: 'Test Planet',
  difficulty: 'Easy' as const,
  type: 'Corporate',
  resistance: 'Corporate Security',
  reward: 'Credits and resources',
  conquered: false,
  lastMission: null,
  ...overrides,
});