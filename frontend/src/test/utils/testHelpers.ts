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

// Re-export testing library functions for convenience
export * from '@testing-library/react';