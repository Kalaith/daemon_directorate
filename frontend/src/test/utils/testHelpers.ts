// test/utils/testHelpers.ts - Simple testing utilities
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Simple render function - just wrapping regular render for now
export const renderWithProviders = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  return render(ui, options);
};

// Re-export testing library functions for convenience
export * from '@testing-library/react';
