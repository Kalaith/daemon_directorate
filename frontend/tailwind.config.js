/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette from your CSS variables
        cream: {
          50: 'rgb(var(--color-cream-50) / <alpha-value>)',
          100: 'rgb(var(--color-cream-100) / <alpha-value>)',
        },
        charcoal: {
          700: 'rgb(var(--color-charcoal-700) / <alpha-value>)',
          800: 'rgb(var(--color-charcoal-800) / <alpha-value>)',
        },
        slate: {
          500: 'rgb(var(--color-slate-500) / <alpha-value>)',
          900: 'rgb(var(--color-slate-900) / <alpha-value>)',
        },
        teal: {
          300: 'rgb(var(--color-teal-300) / <alpha-value>)',
          400: 'rgb(var(--color-teal-400) / <alpha-value>)',
          500: 'rgb(var(--color-teal-500) / <alpha-value>)',
          600: 'rgb(var(--color-teal-600) / <alpha-value>)',
          700: 'rgb(var(--color-teal-700) / <alpha-value>)',
          800: 'rgb(var(--color-teal-800) / <alpha-value>)',
        },
        brown: {
          600: 'rgb(var(--color-brown-600) / <alpha-value>)',
        },
        // Semantic colors
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
        'primary-active': 'rgb(var(--color-primary-active) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'card-border': 'rgb(var(--color-card-border) / <alpha-value>)',
        // Background utility colors
        'bg-1': 'rgb(var(--color-bg-1) / <alpha-value>)',
        'bg-2': 'rgb(var(--color-bg-2) / <alpha-value>)',
        'bg-3': 'rgb(var(--color-bg-3) / <alpha-value>)',
        'bg-4': 'rgb(var(--color-bg-4) / <alpha-value>)',
        'bg-5': 'rgb(var(--color-bg-5) / <alpha-value>)',
        'bg-6': 'rgb(var(--color-bg-6) / <alpha-value>)',
        'bg-7': 'rgb(var(--color-bg-7) / <alpha-value>)',
        'bg-8': 'rgb(var(--color-bg-8) / <alpha-value>)',
      },
      fontFamily: {
        base: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
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
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'inset-sm': 'var(--shadow-inset-sm)',
      },
      animation: {
        ping: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 0.3s ease-in-out',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
    },
  },
  plugins: [],
};
