// Type declarations for vitest with jest-dom matchers
import type * as matchers from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
              matchers.TestingLibraryMatchers<T, void> {}
  }
}