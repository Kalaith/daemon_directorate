// src/test/setup.ts
import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Mock localStorage for Zustand persist
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Clean up after each test
afterEach(() => {
  cleanup();
  // Clear localStorage mock between tests
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

// Clear localStorage before each test
beforeEach(() => {
  localStorageMock.getItem.mockReturnValue(null);
});

// Mock window.confirm for game controls
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
});

// Mock setInterval/clearInterval for game timers
Object.defineProperty(globalThis, 'setInterval', {
  value: vi.fn(() => {
    // Return a mock timer ID
    return 1;
  }),
});

Object.defineProperty(globalThis, 'clearInterval', {
  value: vi.fn(),
});
