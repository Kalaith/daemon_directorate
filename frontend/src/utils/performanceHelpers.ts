// utils/performanceHelpers.ts - Performance helper functions
export const performanceMonitor = {
  measurements: new Map<string, number>(),

  start(name: string) {
    this.measurements.set(name, performance.now());
  },

  end(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    return duration;
  },

  measure<T>(name: string, fn: () => T): { result: T; duration: number } {
    this.start(name);
    const result = fn();
    const duration = this.end(name);
    return { result, duration };
  },
};

export const analyzeBundleSize = async () => {
  if (process.env.NODE_ENV !== 'development') return {};

  // Simple bundle analysis - in real app would use webpack-bundle-analyzer
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  );

  return {
    scripts: scripts.length,
    styles: styles.length,
    // Placeholder for real bundle analysis
    totalSize: '~500KB (estimated)',
  };
};

export const initializePerformanceMonitoring = () => {
  if (process.env.NODE_ENV !== 'development') return;

  // Add performance monitoring to window for debugging
  (
    window as typeof window & {
      performanceMonitor?: typeof performanceMonitor;
      analyzeBundleSize?: typeof analyzeBundleSize;
    }
  ).performanceMonitor = performanceMonitor;
  (
    window as typeof window & {
      performanceMonitor?: typeof performanceMonitor;
      analyzeBundleSize?: typeof analyzeBundleSize;
    }
  ).analyzeBundleSize = analyzeBundleSize;

  console.log(
    '🚀 Performance monitoring enabled. Use window.performanceMonitor for debugging.'
  );
};
