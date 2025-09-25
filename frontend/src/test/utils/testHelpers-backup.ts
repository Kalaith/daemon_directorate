// test/utils/testHelpers.ts - Comprehensive testing utilities
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { AppErrorBoundary } from '../../components/ui/ErrorBoundary';

// Enhanced render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withErrorBoundary?: boolean;
  withNotifications?: boolean;
}

const AllTheProviders = ({
  children,
  withErrorBoundary = true,
  withNotifications = true,
}: {
  children: ReactNode;
  withErrorBoundary?: boolean;
  withNotifications?: boolean;
}) => {
  let wrapped = children;

  if (withNotifications) {
    wrapped = <NotificationProvider>{wrapped}</NotificationProvider>;
  }

  if (withErrorBoundary) {
    wrapped = <AppErrorBoundary>{wrapped}</AppErrorBoundary>;
  }

  return <>{wrapped}</>;
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    withErrorBoundary = true,
    withNotifications = true,
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders
      withErrorBoundary={withErrorBoundary}
      withNotifications={withNotifications}
    >
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock data factories
export const createMockDaemon = (overrides: Partial<any> = {}) => ({
  id: 'test-daemon-1',
  name: 'Test Daemon',
  specialization: 'Infiltration',
  health: 100,
  morale: 75,
  lifespanDays: 45,
  quirks: [
    { name: 'Loves paperwork', effect: 'bureaucratic_bonus', value: 2, description: '+2 Bureaucratic Leverage per day' }
  ],
  assignments: [],
  equipment: null,
  isActive: true,
  generation: 1,
  bloodline: 'House of Burning Spreadsheets',
  mentor: null,
  inheritedTraits: [],
  legacy: {
    successfulMissions: 0,
    planetsConquered: 0,
    equipmentCreated: 0,
    yearsServed: 0,
  },
  ...overrides,
});

export const createMockPlanet = (overrides: Partial<any> = {}) => ({
  id: 'test-planet-1',
  name: 'Test Planet',
  type: 'Corporate Outpost',
  difficulty: 'Easy' as const,
  resistance: 'Minimal Security',
  conquered: false,
  stability: 50,
  corporatePresence: 0,
  missionHistory: [],
  lastMission: null,
  ...overrides,
});

export const createMockMission = (overrides: Partial<any> = {}) => ({
  id: 'test-mission-1',
  planetId: 'test-planet-1',
  teamIds: ['test-daemon-1'],
  startTime: Date.now(),
  duration: 86400000, // 1 day
  type: 'conquest' as const,
  objectives: [],
  consequences: [],
  ...overrides,
});

export const createMockResources = (overrides: Partial<any> = {}) => ({
  credits: 500,
  soulEssence: 0,
  bureaucraticLeverage: 0,
  rawMaterials: 0,
  ...overrides,
});

// Test state builders
export class GameStateBuilder {
  private state: any = {
    resources: createMockResources(),
    daemons: [createMockDaemon()],
    planets: [createMockPlanet()],
    equipment: [],
    rooms: [],
    recruitmentPool: [],
    corporateEvents: [],
    gameModifiers: {},
    daysPassed: 0,
    gameStarted: true,
    tutorialCompleted: true,
    currentTab: 'dashboard',
    selectedDaemons: new Set(),
    activeMission: null,
    legacyBook: {},
    hallOfInfamy: [],
  };

  withResources(resources: Partial<any>) {
    this.state.resources = { ...this.state.resources, ...resources };
    return this;
  }

  withDaemons(daemons: any[]) {
    this.state.daemons = daemons;
    return this;
  }

  withPlanets(planets: any[]) {
    this.state.planets = planets;
    return this;
  }

  withSelectedDaemons(daemonIds: string[]) {
    this.state.selectedDaemons = new Set(daemonIds);
    return this;
  }

  withActiveMission(mission: any) {
    this.state.activeMission = mission;
    return this;
  }

  withCurrentTab(tab: string) {
    this.state.currentTab = tab;
    return this;
  }

  withDaysPassed(days: number) {
    this.state.daysPassed = days;
    return this;
  }

  build() {
    return this.state;
  }
}

// Async testing helpers
export const waitForAsyncOperation = (timeout = 5000) => {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Async operation timed out after ${timeout}ms`));
    }, timeout);

    // Resolve immediately for testing
    setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, 0);
  });
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const startTime = performance.now();
  await renderFn();
  const endTime = performance.now();
  return endTime - startTime;
};

// Accessibility testing helpers
export const checkAccessibility = (container: Element): string[] => {
  const issues: string[] = [];

  // Check for missing alt text on images
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });

  // Check for missing labels on inputs
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = container.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');

    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Input missing label: ${input.tagName.toLowerCase()}`);
    }
  });

  // Check for missing focus indicators
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusableElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.outline === 'none' && !computedStyle.boxShadow.includes('focus')) {
      issues.push(`Element missing focus indicator: ${element.tagName.toLowerCase()}`);
    }
  });

  return issues;
};

// Error simulation helpers
export const simulateError = (errorMessage = 'Test error') => {
  throw new Error(errorMessage);
};

export const simulateAsyncError = (errorMessage = 'Async test error', delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, delay);
  });
};

// Local storage testing helpers
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      return Object.keys(store)[index] || null;
    },
  };
};

// Console testing helpers
export const mockConsole = () => {
  const originalConsole = { ...console };
  const logs: { level: string; args: any[] }[] = [];

  const mockFn = (level: string) => (...args: any[]) => {
    logs.push({ level, args });
  };

  console.log = mockFn('log');
  console.warn = mockFn('warn');
  console.error = mockFn('error');
  console.info = mockFn('info');

  return {
    logs,
    restore: () => {
      Object.assign(console, originalConsole);
    },
    getLogsByLevel: (level: string) => logs.filter(log => log.level === level),
  };
};

// Network testing helpers
export const createMockFetch = (responses: { [url: string]: any }) => {
  return jest.fn((url: string) => {
    const response = responses[url];
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`));
    }

    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    });
  });
};

// Re-export testing library functions for convenience
export * from '@testing-library/react';
export { renderWithProviders as render };