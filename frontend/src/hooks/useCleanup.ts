// hooks/useCleanup.ts - Comprehensive cleanup hooks for preventing memory leaks
import { useEffect, useRef, useCallback } from 'react';

// Hook for cleaning up timeouts and intervals
export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const timeoutId = setTimeout(() => savedCallback.current?.(), delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);
};

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const intervalId = setInterval(() => savedCallback.current?.(), delay);

    return () => clearInterval(intervalId);
  }, [delay]);
};

// Hook for managing multiple timers
export const useTimers = () => {
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const addTimeout = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timeoutId = setTimeout(() => {
      callback();
      timersRef.current.delete(timeoutId);
    }, delay);

    timersRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const addInterval = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const intervalId = setInterval(callback, delay);
    timersRef.current.add(intervalId);
    return intervalId;
  }, []);

  const clearTimer = useCallback((timerId: NodeJS.Timeout) => {
    clearTimeout(timerId);
    clearInterval(timerId);
    timersRef.current.delete(timerId);
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timerId => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    addTimeout,
    addInterval,
    clearTimer,
    clearAllTimers,
  };
};

// Hook for managing event listeners
export const useEventListener = <T extends keyof WindowEventMap>(
  event: T,
  handler: (event: WindowEventMap[T]) => void,
  target: EventTarget | null = window,
  options?: AddEventListenerOptions
) => {
  const savedHandler = useRef<(event: WindowEventMap[T]) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!target) return;

    const eventListener = (event: Event) => {
      savedHandler.current?.(event as WindowEventMap[T]);
    };

    target.addEventListener(event, eventListener, options);

    return () => {
      target.removeEventListener(event, eventListener, options);
    };
  }, [event, target, options]);
};

// Hook for managing AbortController
export const useAbortController = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const createController = useCallback(() => {
    // Abort existing controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const getSignal = useCallback(() => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    return abortControllerRef.current.signal;
  }, []);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    createController,
    abort,
    getSignal,
    get isAborted() {
      return abortControllerRef.current?.signal.aborted ?? false;
    },
  };
};

// Hook for managing WebSocket connections
export const useWebSocket = (url: string | null) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!url || socketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      socketRef.current = new WebSocket(url);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    send,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
  };
};

// Hook for managing IntersectionObserver
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  const observe = useCallback((element: Element) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(callback, options);
    }

    observerRef.current.observe(element);
    elementsRef.current.add(element);
  }, [callback, options]);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      elementsRef.current.clear();
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { observe, unobserve, disconnect };
};

// Hook for managing ResizeObserver
export const useResizeObserver = (
  callback: ResizeObserverCallback,
  target?: HTMLElement | null
) => {
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!target) return;

    observerRef.current = new ResizeObserver(callback);
    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, target]);

  return observerRef.current;
};

// Hook for managing DOM cleanup
export const useDOMCleanup = () => {
  const elementsRef = useRef<Set<Element>>(new Set());
  const listenersRef = useRef<Map<Element, Map<string, EventListenerOrEventListenerObject>>>(new Map());

  const registerElement = useCallback((element: Element) => {
    elementsRef.current.add(element);
  }, []);

  const addListener = useCallback((
    element: Element,
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) => {
    element.addEventListener(event, listener, options);

    if (!listenersRef.current.has(element)) {
      listenersRef.current.set(element, new Map());
    }

    listenersRef.current.get(element)?.set(event, listener);
  }, []);

  const removeListener = useCallback((element: Element, event: string) => {
    const elementListeners = listenersRef.current.get(element);
    const listener = elementListeners?.get(event);

    if (listener) {
      element.removeEventListener(event, listener);
      elementListeners?.delete(event);
    }
  }, []);

  const cleanup = useCallback(() => {
    // Clean up event listeners
    listenersRef.current.forEach((listeners, element) => {
      listeners.forEach((listener, event) => {
        element.removeEventListener(event, listener);
      });
    });

    // Clear references
    elementsRef.current.clear();
    listenersRef.current.clear();
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    registerElement,
    addListener,
    removeListener,
    cleanup,
  };
};

// Master cleanup hook that combines all cleanup strategies
export const useCleanup = () => {
  const timers = useTimers();
  const abortController = useAbortController();
  const domCleanup = useDOMCleanup();

  const cleanup = useCallback(() => {
    timers.clearAllTimers();
    abortController.abort();
    domCleanup.cleanup();
  }, [timers, abortController, domCleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...timers,
    ...abortController,
    ...domCleanup,
    cleanup,
  };
};