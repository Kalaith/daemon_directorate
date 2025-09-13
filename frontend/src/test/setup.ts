// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for Zustand persist
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.confirm for game controls
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
});

// Mock setInterval/clearInterval for game timers
Object.defineProperty(globalThis, 'setInterval', {
  value: vi.fn((_fn: () => void) => {
    // Return a mock timer ID
    return 1;
  }),
});

Object.defineProperty(globalThis, 'clearInterval', {
  value: vi.fn(),
});
