// constants/notifications.ts - Notification constants
export const NOTIFICATION_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const DEFAULT_DURATIONS = {
  ERROR: 8000,
  SUCCESS: 4000,
  WARNING: 6000,
  INFO: 5000,
} as const;
