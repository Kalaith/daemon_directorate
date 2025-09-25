// constants/performance.ts - Performance monitoring constants
export const PERFORMANCE_THRESHOLDS = {
  SLOW_COMPONENT_MS: 16,
  MEMORY_WARNING_MB: 50,
  BUNDLE_SIZE_WARNING_KB: 500,
} as const;

export const PERFORMANCE_COLORS = {
  GOOD: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
} as const;