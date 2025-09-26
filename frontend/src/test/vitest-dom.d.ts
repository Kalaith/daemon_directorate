// Type declarations for vitest with jest-dom matchers
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import type * as matchers from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown>
    extends matchers.TestingLibraryMatchers<T, void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining
    extends matchers.TestingLibraryMatchers<unknown, void> {}
}
