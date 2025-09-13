// src/test/utils/testUtils.tsx
import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

// Mock store provider for tests that need a full store context
const MockStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MockStoreProvider, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper function to create mock daemon data
export const createMockDaemon = (overrides = {}) => ({
  id: 'mock-daemon-1',
  name: 'Test Daemon',
  specialization: 'Infiltration' as const,
  quirk: 'Perfectionist',
  bloodline: 'Standard',
  lifespanDays: 100,
  morale: 75,
  skills: {
    combat: 60,
    infiltration: 80,
    sabotage: 40,
  },
  assignments: [],
  equipment: null,
  isActive: true,
  ...overrides,
});

// Helper function to create mock equipment data
export const createMockEquipment = (overrides = {}) => ({
  id: 'mock-equipment-1',
  name: 'Test Briefcase',
  type: 'Infiltration' as const,
  ability: 'Test ability (+10 infiltration)',
  durability: 100,
  assignedTo: null,
  ...overrides,
});

// Helper function to create mock planet data
export const createMockPlanet = (overrides = {}) => ({
  id: 'mock-planet-1',
  name: 'Test Planet',
  difficulty: 'Easy' as const,
  resistance: 'Corporate Security',
  description: 'A test planet for missions',
  rewards: {
    credits: 100,
    soulEssence: 10,
    bureaucraticLeverage: 5,
    rawMaterials: 2,
  },
  conquered: false,
  lastMission: null,
  ...overrides,
});
