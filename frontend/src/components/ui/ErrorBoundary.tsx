// components/ui/ErrorBoundary.tsx - Hierarchical error boundaries for better error handling
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'app' | 'component' | 'feature';
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error using structured logging
    logger.error('Error Boundary caught error', error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      metadata: {
        level: this.props.level || 'unknown',
        context: this.props.context || 'Unknown',
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { contexts: { errorInfo } });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private renderErrorUI() {
    const { level = 'component', context } = this.props;
    const { error } = this.state;

    // App-level error - critical failure
    if (level === 'app') {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">💀</div>
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              Critical System Error
            </h1>
            <p className="text-red-600 mb-6">
              The Daemon Directorate has encountered a fatal error and cannot
              continue. Your corporate empire may be in jeopardy.
            </p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Restart Corporate Operations
              </button>
              <button
                onClick={this.handleRetry}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Attempt Recovery
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left text-sm bg-gray-100 p-3 rounded">
                <summary className="font-medium cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {error?.message}
                  {error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // Feature-level error - major feature failure
    if (level === 'feature') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
          <div className="flex items-center mb-3">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="font-bold text-yellow-800">
                Feature Temporarily Unavailable
              </h3>
              <p className="text-yellow-600 text-sm">
                {context ? `The ${context} feature` : 'This feature'} has
                encountered an error and cannot be displayed.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // Component-level error - localized failure
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">⚡</span>
            <span className="text-sm text-gray-600">
              Component Error {context && `in ${context}`}
            </span>
          </div>
          <button
            onClick={this.handleRetry}
            className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorUI();
    }

    return this.props.children;
  }
}

// Convenience wrapper components
export const AppErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ErrorBoundary level="app" context="Application">
    {children}
  </ErrorBoundary>
);

export const FeatureErrorBoundary: React.FC<{
  children: ReactNode;
  feature: string;
}> = ({ children, feature }) => (
  <ErrorBoundary level="feature" context={feature}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{
  children: ReactNode;
  component?: string;
}> = ({ children, component }) => (
  <ErrorBoundary level="component" context={component}>
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
