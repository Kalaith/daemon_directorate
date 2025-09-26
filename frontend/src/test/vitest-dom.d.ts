// Type declarations for vitest with jest-dom matchers
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import type * as matchers from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Assertion<T = any> extends matchers.TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends matchers.TestingLibraryMatchers<any, void> {}
}