// theme/tokens.ts - Design token system for consistent styling
export const DESIGN_TOKENS = {
  // Color palette
  colors: {
    // Primary brand colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Primary
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },

    // Semantic colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Info
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Neutral colors
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Game-specific colors
    corporate: {
      cream: '#faf8f5',
      brown: '#8b5a3c',
      teal: '#0d9488',
      slate: '#64748b',
    },
  },

  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing scale
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Z-index scale
  zIndex: {
    modal: 1000,
    tooltip: 1010,
    notification: 1020,
    overlay: 1030,
  },
} as const;

// Component variant system
export const COMPONENT_VARIANTS = {
  // Button variants
  button: {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
    success:
      'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    warning:
      'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
    error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    ghost: 'bg-transparent hover:bg-neutral-100 focus:ring-neutral-500',
  },

  // Badge/Tag variants
  badge: {
    easy: 'bg-success-100 text-success-800 border border-success-200',
    medium: 'bg-warning-100 text-warning-800 border border-warning-200',
    hard: 'bg-error-100 text-error-800 border border-error-200',
    info: 'bg-info-100 text-info-800 border border-info-200',
    neutral: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
  },

  // Card variants
  card: {
    default: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
    elevated: 'bg-white border border-neutral-200 rounded-lg shadow-md',
    interactive:
      'bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer',
    game: 'bg-corporate-cream border border-corporate-brown/12 rounded-lg shadow-sm hover:shadow-md transition-shadow',
  },

  // Status indicators
  status: {
    health: {
      good: 'bg-success-500',
      warning: 'bg-warning-400',
      critical: 'bg-error-500',
    },
    morale: {
      good: 'bg-primary-500',
      warning: 'bg-warning-400',
      critical: 'bg-error-500',
    },
    lifespan: {
      good: 'text-neutral-600',
      warning: 'text-warning-600',
      critical: 'text-error-600',
    },
  },

  // Gradient backgrounds
  gradient: {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700',
    success: 'bg-gradient-to-r from-success-600 to-success-700',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-700',
    error: 'bg-gradient-to-r from-error-600 to-error-700',
    corporate: 'bg-gradient-to-r from-primary-600 to-info-600',
    teal: 'bg-gradient-to-r from-primary-600 to-teal-600',
  },
} as const;

// Animation presets
export const ANIMATIONS = {
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  transform: {
    scale: 'transform hover:scale-105 transition-transform',
    slideIn: 'animate-in slide-in-from-right-full duration-300',
    fadeIn: 'animate-in fade-in duration-300',
  },
} as const;

// Layout presets
export const LAYOUT_PRESETS = {
  container: 'container mx-auto px-4',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  stackVertical: 'space-y-4',
  stackHorizontal: 'space-x-4',
} as const;
