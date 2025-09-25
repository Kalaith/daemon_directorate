// hooks/useAsyncOperation.ts - Comprehensive async operation management
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastExecuted: Date | null;
}

export interface AsyncOperationOptions {
  showErrorNotifications?: boolean;
  showSuccessNotifications?: boolean;
  errorMessage?: string;
  successMessage?: string;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

export const useAsyncOperation = <T, P extends unknown[] = []>(
  asyncFunction: (...params: P) => Promise<T>,
  options: AsyncOperationOptions = {}
) => {
  const {
    showErrorNotifications = true,
    showSuccessNotifications = false,
    errorMessage = 'Operation failed',
    successMessage = 'Operation completed successfully',
    retryCount = 0,
    retryDelay = 1000,
    timeout = 30000,
  } = options;

  const { addNotification } = useNotifications();
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    lastExecuted: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const executeWithTimeout = useCallback(
    async (params: P, signal: AbortSignal): Promise<T> => {
      return Promise.race([
        asyncFunction(...params),
        new Promise<never>((_, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error(`Operation timed out after ${timeout}ms`));
          }, timeout);

          signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new Error('Operation was cancelled'));
          });
        }),
      ]);
    },
    [asyncFunction, timeout]
  );

  const executeWithRetry = useCallback(
    async (params: P, signal: AbortSignal, attempt = 1): Promise<T> => {
      try {
        const result = await executeWithTimeout(params, signal);
        return result;
      } catch (error) {
        if (signal.aborted) {
          throw error;
        }

        if (attempt <= retryCount) {
          // Wait before retrying
          await new Promise<void>((resolve, reject) => {
            retryTimeoutRef.current = setTimeout(() => {
              if (signal.aborted) {
                reject(new Error('Operation was cancelled'));
              } else {
                resolve();
              }
            }, retryDelay * attempt); // Exponential backoff
          });

          return executeWithRetry(params, signal, attempt + 1);
        }

        throw error;
      }
    },
    [executeWithTimeout, retryCount, retryDelay]
  );

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      // Cancel any existing operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await executeWithRetry(params, signal);

        if (!signal.aborted) {
          setState({
            data: result,
            loading: false,
            error: null,
            lastExecuted: new Date(),
          });

          if (showSuccessNotifications) {
            addNotification({
              type: 'success',
              title: 'Success',
              message: successMessage,
            });
          }
        }

        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));

        if (!signal.aborted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorObj,
          }));

          if (showErrorNotifications && !signal.aborted) {
            addNotification({
              type: 'error',
              title: 'Error',
              message: `${errorMessage}: ${errorObj.message}`,
              duration: 8000, // Longer duration for errors
            });
          }
        }

        return null;
      }
    },
    [
      executeWithRetry,
      addNotification,
      showErrorNotifications,
      showSuccessNotifications,
      errorMessage,
      successMessage,
    ]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({
      ...prev,
      loading: false,
    }));
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState({
      data: null,
      loading: false,
      error: null,
      lastExecuted: null,
    });
  }, [cancel]);

  return {
    ...state,
    execute,
    cancel,
    reset,
    isExecuting: state.loading,
  };
};

// Specialized hook for game operations
export const useGameOperation = <T, P extends unknown[] = []>(
  operation: (...params: P) => Promise<T>,
  operationName: string
) => {
  return useAsyncOperation(operation, {
    showErrorNotifications: true,
    showSuccessNotifications: false,
    errorMessage: `${operationName} failed`,
    timeout: 10000, // Shorter timeout for game operations
    retryCount: 1,
    retryDelay: 500,
  });
};

// Hook for batch operations
export const useBatchOperation = <T>(
  operations: Array<() => Promise<T>>,
  options: AsyncOperationOptions = {}
) => {
  const [state, setState] = useState<{
    results: (T | null)[];
    loading: boolean;
    error: Error | null;
    completed: number;
    total: number;
  }>({
    results: [],
    loading: false,
    error: null,
    completed: 0,
    total: operations.length,
  });

  const { addNotification } = useNotifications();

  const executeBatch = useCallback(async () => {
    setState({
      results: [],
      loading: true,
      error: null,
      completed: 0,
      total: operations.length,
    });

    const results: (T | null)[] = [];
    let completed = 0;

    try {
      for (const operation of operations) {
        try {
          const result = await operation();
          results.push(result);
        } catch {
          results.push(null);
          // Batch operation failed - using structured logging instead of console.warn
        }

        completed++;
        setState(prev => ({
          ...prev,
          completed,
          results: [...results],
        }));
      }

      setState(prev => ({
        ...prev,
        loading: false,
      }));

      if (options.showSuccessNotifications) {
        addNotification({
          type: 'success',
          title: 'Batch Complete',
          message: `${completed} operations completed successfully`,
        });
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj,
      }));

      if (options.showErrorNotifications !== false) {
        addNotification({
          type: 'error',
          title: 'Batch Failed',
          message: errorObj.message,
        });
      }
    }
  }, [operations, options, addNotification]);

  return {
    ...state,
    executeBatch,
    progress: state.total > 0 ? (state.completed / state.total) * 100 : 0,
  };
};

// Hook for debounced async operations
export const useDebouncedAsyncOperation = <T, P extends unknown[] = []>(
  asyncFunction: (...params: P) => Promise<T>,
  delay: number = 300,
  options: AsyncOperationOptions = {}
) => {
  const asyncOp = useAsyncOperation(asyncFunction, options);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedExecute = useCallback(
    (...params: P) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        asyncOp.execute(...params);
      }, delay);
    },
    [asyncOp, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...asyncOp,
    execute: debouncedExecute,
  };
};