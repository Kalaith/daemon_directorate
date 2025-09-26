// utils/performance.tsx - Performance monitoring and profiling utilities
import React, { Profiler, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { PERFORMANCE_THRESHOLDS } from '../constants/performance';

// Performance metrics interface
interface PerformanceMetric {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<string>;
}

// Performance data store
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private isEnabled: boolean = import.meta.env.MODE === 'development';

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  recordMetric(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    const componentMetrics = this.metrics.get(metric.id) || [];
    componentMetrics.push(metric);

    // Keep only last 100 metrics per component
    if (componentMetrics.length > 100) {
      componentMetrics.shift();
    }

    this.metrics.set(metric.id, componentMetrics);
  }

  getMetrics(componentId?: string): PerformanceMetric[] {
    if (componentId) {
      return this.metrics.get(componentId) || [];
    }

    return Array.from(this.metrics.values()).flat();
  }

  getAverageRenderTime(componentId: string): number {
    const componentMetrics = this.metrics.get(componentId) || [];
    if (componentMetrics.length === 0) return 0;

    const totalTime = componentMetrics.reduce(
      (sum, metric) => sum + metric.actualDuration,
      0
    );
    return totalTime / componentMetrics.length;
  }

  getSlowComponents(
    threshold: number = 16
  ): Array<{ id: string; averageTime: number }> {
    const slowComponents: Array<{ id: string; averageTime: number }> = [];

    for (const [id] of this.metrics) {
      const averageTime = this.getAverageRenderTime(id);
      if (averageTime > threshold) {
        slowComponents.push({ id, averageTime });
      }
    }

    return slowComponents.sort((a, b) => b.averageTime - a.averageTime);
  }

  clear() {
    this.metrics.clear();
  }

  exportMetrics() {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      summary: {
        totalComponents: this.metrics.size,
        slowComponents: this.getSlowComponents(),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Global performance monitor instance
// eslint-disable-next-line react-refresh/only-export-components
export const performanceMonitor = new PerformanceMonitor();

// Performance Profiler component
interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  enableLogging?: boolean;
  warningThreshold?: number;
}

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({
  id,
  children,
  enableLogging = false,
  warningThreshold = PERFORMANCE_THRESHOLDS.SLOW_COMPONENT_MS,
}) => {
  const onRenderCallback = useCallback(
    (
      profileId: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      const metric: PerformanceMetric = {
        id: profileId,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: new Set<string>(), // Default empty set since it's not provided in React 19
      };

      performanceMonitor.recordMetric(metric);

      if (enableLogging) {
        console.group(`⚡ Performance: ${profileId}`);
        console.log(`Phase: ${phase}`);
        console.log(`Actual Duration: ${actualDuration.toFixed(2)}ms`);
        console.log(`Base Duration: ${baseDuration.toFixed(2)}ms`);

        if (actualDuration > warningThreshold) {
          console.warn(
            `🐌 Slow render detected! (${actualDuration.toFixed(2)}ms > ${warningThreshold}ms)`
          );
        }

        console.groupEnd();
      }
    },
    [enableLogging, warningThreshold]
  );

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
};

// Hook for monitoring component performance
// eslint-disable-next-line react-refresh/only-export-components
export const usePerformanceMetrics = (componentId: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      const componentMetrics = performanceMonitor.getMetrics(componentId);
      setMetrics(componentMetrics);
    };

    // Update metrics initially
    updateMetrics();

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [componentId]);

  return {
    metrics,
    averageRenderTime: performanceMonitor.getAverageRenderTime(componentId),
    isSlowComponent: performanceMonitor.getAverageRenderTime(componentId) > 16,
  };
};

// Hook for memory usage monitoring
// eslint-disable-next-line react-refresh/only-export-components
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (!('memory' in performance)) {
      console.warn('Memory monitoring not supported in this browser');
      return;
    }

    const updateMemoryInfo = () => {
      const memory = (
        performance as typeof performance & {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }
      ).memory;

      if (!memory) return;

      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Performance monitoring dashboard component
export const PerformanceDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [slowComponents, setSlowComponents] = useState<
    Array<{ id: string; averageTime: number }>
  >([]);
  const memoryInfo = useMemoryMonitor();

  useEffect(() => {
    const updateSlowComponents = () => {
      setSlowComponents(performanceMonitor.getSlowComponents());
    };

    updateSlowComponents();
    const interval = setInterval(updateSlowComponents, 5000);

    return () => clearInterval(interval);
  }, []);

  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Performance Dashboard"
      >
        ⚡
      </button>

      {/* Dashboard */}
      {isVisible && (
        <div className="fixed bottom-16 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-md w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Memory Info */}
          {memoryInfo && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Memory Usage</h4>
              <div className="text-sm space-y-1">
                <div>
                  Used: {(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(1)}{' '}
                  MB
                </div>
                <div>
                  Total: {(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(1)}{' '}
                  MB
                </div>
                <div>
                  Limit: {(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(1)}{' '}
                  MB
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Slow Components */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Slow Components (&gt;16ms)</h4>
            {slowComponents.length === 0 ? (
              <p className="text-sm text-gray-500">
                No slow components detected
              </p>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {slowComponents.map(({ id, averageTime }) => (
                  <div key={id} className="text-sm flex justify-between">
                    <span className="truncate">{id}</span>
                    <span
                      className={`font-mono ${averageTime > 32 ? 'text-red-600' : 'text-orange-600'}`}
                    >
                      {averageTime.toFixed(1)}ms
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => performanceMonitor.exportMetrics()}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => performanceMonitor.clear()}
              className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Bundle size analyzer utility
// eslint-disable-next-line react-refresh/only-export-components
export const analyzeBundleSize = () => {
  if (import.meta.env.MODE !== 'development') {
    console.warn('Bundle size analysis only available in development mode');
    return;
  }

  // Estimate component sizes based on their render complexity
  const componentSizes = new Map<string, number>();

  performanceMonitor.getMetrics().forEach(metric => {
    const currentSize = componentSizes.get(metric.id) || 0;
    componentSizes.set(metric.id, currentSize + metric.actualDuration);
  });

  const sortedComponents = Array.from(componentSizes.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  console.group('📦 Estimated Component Complexity (Top 10)');
  sortedComponents.forEach(([component, complexity]) => {
    console.log(`${component}: ${complexity.toFixed(2)}ms total render time`);
  });
  console.groupEnd();

  return sortedComponents;
};

// Global performance tracking setup
if (import.meta.env.MODE === 'development') {
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
}
