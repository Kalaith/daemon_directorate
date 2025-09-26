/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      // Basic colors
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',

      // Daemon Directorate Color System
      daemon: {
        // Backgrounds
        dark: '#0a0a0a', // Primary background - near-black abyss
        panel: '#141414', // UI panels and cards - dark charcoal
        surface: '#1a1a1a', // Interactive surfaces - slightly lighter

        // Brand Colors
        primary: '#b11226', // Infernal red - primary actions
        primaryHover: '#e01b2f', // Brighter red for hover states
        secondary: '#660000', // Dark blood red - borders and accents
        danger: '#cc3333', // Error states and warnings

        // Hierarchy Colors
        gold: '#d4af37', // Executive tier - use sparingly
        silver: '#c0c0c0', // Management tier
        bronze: '#cd7f32', // Supervisor tier

        // Text Colors
        text: {
          DEFAULT: '#cccccc', // Standard readable text
          bright: '#f5f5f5', // Headers and emphasis
          muted: '#999999', // Secondary information
          dim: '#666666', // Disabled or placeholder text
        },

        // Status Colors
        success: '#2d5a2d', // Success states - dark green
        warning: '#8b6914', // Warning states - dark amber
        info: '#1e3a5f', // Information - dark blue
      },

      // Fallback colors for compatibility (minimal set)
      gray: {
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      red: {
        500: '#ef4444',
        600: '#dc2626',
      },
      green: {
        500: '#22c55e',
        600: '#16a34a',
      },
      yellow: {
        500: '#eab308',
      },

      // Legacy semantic colors - map to daemon colors
      primary: '#b11226',
      'primary-hover': '#e01b2f',
      'primary-active': '#e01b2f',
      background: '#0a0a0a',
      surface: '#141414',
      text: '#cccccc',
      'text-secondary': '#999999',
      border: '#660000',
      'card-border': '#660000',
      error: '#cc3333',
      success: '#2d5a2d',
      warning: '#8b6914',
      info: '#1e3a5f',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Primary UI text
        header: ['Cinzel Decorative', 'serif'], // Corporate titles
        mono: ['JetBrains Mono', 'Consolas', 'monospace'], // Data displays
        base: 'var(--font-family-base)', // Legacy support
      },
      boxShadow: {
        infernal: '0 0 10px rgba(177, 18, 38, 0.4)',
        'infernal-lg': '0 0 20px rgba(177, 18, 38, 0.6)',
        gold: '0 0 10px rgba(212, 175, 55, 0.4)',
        'gold-lg': '0 0 20px rgba(212, 175, 55, 0.6)',
        // Legacy support
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'inset-sm': 'var(--shadow-inset-sm)',
        focus: 'var(--focus-ring)',
      },
      keyframes: {
        pulseInfernal: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(177, 18, 38, 0.4)' },
          '50%': { boxShadow: '0 0 16px rgba(177, 18, 38, 0.8)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 16px rgba(212, 175, 55, 0.8)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseInfernal: 'pulseInfernal 2s infinite',
        pulseGold: 'pulseGold 2s infinite',
        fadeInUp: 'fadeInUp 0.3s ease-out',
        'pulse-game': 'pulse 0.3s ease-in-out', // Legacy support
      },
      // Legacy support
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
      },
      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        base: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
      maxWidth: {
        'container-sm': 'var(--container-sm)',
        'container-md': 'var(--container-md)',
        'container-lg': 'var(--container-lg)',
        'container-xl': 'var(--container-xl)',
      },
    },
  },
  plugins: [],
};
