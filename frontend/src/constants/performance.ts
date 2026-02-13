// constants/performance.ts - Performance monitoring constants
export const performanceThresholds = {
  SLOW_COMPONENT_MS: 16,
  MEMORY_WARNING_MB: 50,
  BUNDLE_SIZE_WARNING_KB: 500,
} as const;

export const performanceColors = {
  GOOD: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
} as const;
