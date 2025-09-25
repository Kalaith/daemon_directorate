# Daemon Directorate Style Guide

A comprehensive visual design system for the dark corporate satire strategy game where players manage daemon operatives in the Infernal Corporate Hierarchy.

## 🎯 Design Philosophy

**Dark Corporate Aesthetic**: Professional yet sinister interface that mirrors the oppressive nature of bureaucratic hell. Think dystopian office building meets infernal council chambers.

**Visual Hierarchy**: Clear distinction between executive-level content (gold accents), operational elements (red highlights), and standard interface components (muted grays).

**Corporate Brutalism**: Sharp, angular designs with minimal softness to emphasize the harsh corporate environment.

## 🎨 Color System

### Core Palette

```javascript
// tailwind.config.js
colors: {
  daemon: {
    // Backgrounds
    dark: "#0a0a0a",        // Primary background - near-black abyss
    panel: "#141414",       // UI panels and cards - dark charcoal
    surface: "#1a1a1a",     // Interactive surfaces - slightly lighter

    // Brand Colors
    primary: "#b11226",     // Infernal red - primary actions
    primaryHover: "#e01b2f", // Brighter red for hover states
    secondary: "#660000",   // Dark blood red - borders and accents
    danger: "#cc3333",      // Error states and warnings

    // Hierarchy Colors
    gold: "#d4af37",        // Executive tier - use sparingly
    silver: "#c0c0c0",      // Management tier
    bronze: "#cd7f32",      // Supervisor tier

    // Text Colors
    text: {
      DEFAULT: "#cccccc",   // Standard readable text
      bright: "#f5f5f5",    // Headers and emphasis
      muted: "#999999",     // Secondary information
      dim: "#666666",       // Disabled or placeholder text
    },

    // Status Colors
    success: "#2d5a2d",     // Success states - dark green
    warning: "#8b6914",     // Warning states - dark amber
    info: "#1e3a5f",        // Information - dark blue
  }
}
```

### Color Usage Guidelines

- **Backgrounds**: Always use `daemon-dark` for main background, `daemon-panel` for cards/panels
- **Actions**: Reserve `daemon-primary` for important actions only (deploy, purchase, confirm)
- **Status**: Use appropriate status colors for feedback and state indication
- **Hierarchy**: Gold only for executive/premium features, silver for mid-tier, bronze for entry-level

## 📝 Typography

### Font Stack

```javascript
fontFamily: {
  sans: ["Inter", "system-ui", "sans-serif"],           // Primary UI text
  header: ["Cinzel Decorative", "serif"],               // Corporate titles
  mono: ["JetBrains Mono", "Consolas", "monospace"],    // Data displays
}
```

### Typography Hierarchy

```html
<!-- Main Page Titles -->
<h1 class="font-header text-3xl text-daemon-text-bright tracking-wide">
  Daemon Directorate
</h1>

<!-- Section Headers -->
<h2 class="font-header text-xl text-daemon-text-bright mb-4">
  Operative Management
</h2>

<!-- Subsection Headers -->
<h3 class="font-sans text-lg font-semibold text-daemon-text-bright">
  Current Missions
</h3>

<!-- Body Text -->
<p class="text-daemon-text leading-relaxed">
  Standard interface text for descriptions and content.
</p>

<!-- Small Text / Labels -->
<span class="text-sm text-daemon-text-muted uppercase tracking-wider">
  Resource Count
</span>

<!-- Data Values -->
<span class="font-mono text-daemon-text-bright">
  1,234,567
</span>
```

## 🧱 Component Patterns

### Layout Structure

```html
<!-- Main Application Container -->
<div class="min-h-screen bg-daemon-dark text-daemon-text font-sans">

  <!-- Header -->
  <header class="bg-gradient-to-r from-black to-daemon-dark border-b-2 border-daemon-secondary">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="font-header text-2xl text-daemon-text-bright tracking-wide">
        Daemon Directorate
      </h1>
      <nav class="flex space-x-6">
        <a href="#" class="text-daemon-gold hover:text-daemon-primary transition-colors">
          Dashboard
        </a>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto px-4 py-6">
    <!-- Content here -->
  </main>

</div>
```

### Card Components

```html
<!-- Standard Panel -->
<div class="bg-daemon-panel border border-daemon-secondary rounded-lg p-6 shadow-lg">
  <h3 class="font-header text-lg text-daemon-text-bright mb-3">Panel Title</h3>
  <p class="text-daemon-text">Panel content goes here.</p>
</div>

<!-- Executive Panel (Premium) -->
<div class="bg-daemon-panel border-2 border-daemon-gold rounded-lg p-6 shadow-gold">
  <div class="flex items-center mb-3">
    <span class="text-daemon-gold text-sm font-semibold uppercase tracking-wider mr-2">
      Executive
    </span>
    <h3 class="font-header text-lg text-daemon-text-bright">Executive Panel</h3>
  </div>
  <p class="text-daemon-text">Premium content.</p>
</div>

<!-- Status Panel -->
<div class="bg-daemon-surface border border-daemon-secondary rounded-lg p-4">
  <div class="flex items-center justify-between">
    <span class="text-daemon-text-muted text-sm uppercase tracking-wide">Status</span>
    <span class="text-daemon-success font-semibold">Active</span>
  </div>
</div>
```

### Button Components

```html
<!-- Primary Action Button -->
<button class="bg-daemon-primary hover:bg-daemon-primaryHover text-daemon-text-bright px-6 py-3 font-bold uppercase tracking-wide shadow-infernal transition-all hover:shadow-infernal-lg">
  Deploy Operative
</button>

<!-- Secondary Button -->
<button class="border-2 border-daemon-secondary hover:border-daemon-primary text-daemon-text hover:text-daemon-text-bright px-6 py-3 font-semibold uppercase tracking-wide transition-colors">
  Cancel Mission
</button>

<!-- Executive Button -->
<button class="bg-daemon-gold hover:bg-yellow-500 text-black px-6 py-3 font-bold uppercase tracking-wide shadow-gold transition-all">
  Executive Action
</button>

<!-- Danger Button -->
<button class="bg-daemon-danger hover:bg-red-600 text-daemon-text-bright px-6 py-3 font-bold uppercase tracking-wide transition-colors">
  Terminate Contract
</button>

<!-- Icon Button -->
<button class="bg-daemon-surface hover:bg-daemon-panel text-daemon-text hover:text-daemon-text-bright p-3 rounded-lg border border-daemon-secondary hover:border-daemon-primary transition-all">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <!-- icon path -->
  </svg>
</button>
```

### Form Elements

```html
<!-- Input Fields -->
<input type="text"
       placeholder="Operative Name"
       class="bg-daemon-surface border border-daemon-secondary text-daemon-text placeholder-daemon-text-dim px-4 py-3 rounded-lg focus:border-daemon-primary focus:outline-none focus:ring-2 focus:ring-daemon-primary/20">

<!-- Select Dropdown -->
<select class="bg-daemon-surface border border-daemon-secondary text-daemon-text px-4 py-3 rounded-lg focus:border-daemon-primary focus:outline-none">
  <option>Choose Specialization</option>
  <option>Infiltration</option>
  <option>Combat</option>
  <option>Sabotage</option>
</select>

<!-- Checkbox -->
<label class="flex items-center space-x-3 cursor-pointer">
  <input type="checkbox" class="form-checkbox bg-daemon-surface border-daemon-secondary text-daemon-primary focus:ring-daemon-primary/20">
  <span class="text-daemon-text">Enable automatic deployment</span>
</label>
```

### Data Display

```html
<!-- Resource Counter -->
<div class="bg-daemon-panel border border-daemon-secondary rounded-lg p-4">
  <div class="flex items-center justify-between">
    <span class="text-daemon-text-muted text-sm uppercase tracking-wide">Credits</span>
    <span class="font-mono text-2xl text-daemon-text-bright">1,234,567</span>
  </div>
</div>

<!-- Progress Bar -->
<div class="bg-daemon-dark rounded-lg p-1">
  <div class="bg-daemon-primary h-2 rounded-lg transition-all duration-300" style="width: 65%"></div>
</div>

<!-- Status Badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-daemon-success/20 text-daemon-success border border-daemon-success/30">
  Active Mission
</span>
```

## ✨ Interactive Effects

### Shadows and Glows

```javascript
boxShadow: {
  infernal: "0 0 10px rgba(177, 18, 38, 0.4)",
  "infernal-lg": "0 0 20px rgba(177, 18, 38, 0.6)",
  gold: "0 0 10px rgba(212, 175, 55, 0.4)",
  "gold-lg": "0 0 20px rgba(212, 175, 55, 0.6)",
}
```

### Animations

```javascript
keyframes: {
  pulseInfernal: {
    "0%, 100%": { boxShadow: "0 0 8px rgba(177, 18, 38, 0.4)" },
    "50%": { boxShadow: "0 0 16px rgba(177, 18, 38, 0.8)" },
  },
  pulseGold: {
    "0%, 100%": { boxShadow: "0 0 8px rgba(212, 175, 55, 0.4)" },
    "50%": { boxShadow: "0 0 16px rgba(212, 175, 55, 0.8)" },
  },
  fadeInUp: {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
}

animation: {
  pulseInfernal: "pulseInfernal 2s infinite",
  pulseGold: "pulseGold 2s infinite",
  fadeInUp: "fadeInUp 0.3s ease-out",
}
```

### Hover States

```html
<!-- Button Hover -->
<button class="bg-daemon-primary hover:bg-daemon-primaryHover hover:shadow-infernal-lg hover:animate-pulseInfernal transition-all duration-200">
  Critical Action
</button>

<!-- Card Hover -->
<div class="bg-daemon-panel hover:bg-daemon-surface border border-daemon-secondary hover:border-daemon-primary transition-all duration-200 cursor-pointer">
  Interactive Card
</div>
```

## 🎮 Game-Specific Patterns

### Resource Displays

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div class="bg-daemon-panel border border-daemon-secondary rounded-lg p-4">
    <div class="text-daemon-text-muted text-xs uppercase tracking-wide mb-1">Credits</div>
    <div class="font-mono text-xl text-daemon-text-bright">1,234,567</div>
  </div>
  <div class="bg-daemon-panel border border-daemon-secondary rounded-lg p-4">
    <div class="text-daemon-text-muted text-xs uppercase tracking-wide mb-1">Soul Essence</div>
    <div class="font-mono text-xl text-daemon-gold">89</div>
  </div>
</div>
```

### Mission Status Cards

```html
<div class="bg-daemon-panel border-l-4 border-l-daemon-primary rounded-lg p-4">
  <div class="flex items-center justify-between mb-2">
    <h4 class="font-semibold text-daemon-text-bright">Planet Acquisition</h4>
    <span class="bg-daemon-success/20 text-daemon-success px-2 py-1 rounded text-xs uppercase">In Progress</span>
  </div>
  <p class="text-daemon-text-muted text-sm mb-3">Deploying infiltration team to Corporate Zone 7</p>
  <div class="flex items-center space-x-4">
    <div class="flex-1">
      <div class="bg-daemon-dark rounded-full h-2">
        <div class="bg-daemon-primary h-2 rounded-full transition-all" style="width: 34%"></div>
      </div>
    </div>
    <span class="text-daemon-text-muted text-xs">34%</span>
  </div>
</div>
```

### Daemon Profile Cards

```html
<div class="bg-daemon-panel border border-daemon-secondary rounded-lg p-4 hover:border-daemon-primary transition-all">
  <div class="flex items-center space-x-3 mb-3">
    <div class="w-12 h-12 bg-daemon-primary rounded-full flex items-center justify-center text-daemon-text-bright font-bold">
      BX
    </div>
    <div>
      <h4 class="font-semibold text-daemon-text-bright">Belphegor Xerxes</h4>
      <p class="text-daemon-text-muted text-sm">Infiltration Specialist</p>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-2 text-center">
    <div>
      <div class="text-daemon-text-bright font-semibold">85</div>
      <div class="text-daemon-text-muted text-xs uppercase">Skill</div>
    </div>
    <div>
      <div class="text-daemon-text-bright font-semibold">42</div>
      <div class="text-daemon-text-muted text-xs uppercase">Morale</div>
    </div>
    <div>
      <div class="text-daemon-text-bright font-semibold">156</div>
      <div class="text-daemon-text-muted text-xs uppercase">Days Left</div>
    </div>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoint Usage

```html
<!-- Mobile First Approach -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Responsive grid -->
</div>

<!-- Navigation -->
<nav class="hidden md:flex space-x-6">
  <!-- Desktop navigation -->
</nav>
<button class="md:hidden" data-mobile-menu>
  <!-- Mobile menu button -->
</button>
```

## ⚠️ Usage Guidelines

### Do's
- Use `daemon-primary` sparingly for important actions only
- Reserve gold colors for executive/premium features
- Maintain consistent spacing with Tailwind's spacing scale
- Use uppercase text with letter spacing for labels and buttons
- Implement hover states for all interactive elements

### Don'ts
- Avoid bright or saturated colors outside the defined palette
- Don't use rounded corners except for specific UI elements (buttons, badges)
- Never use purple, pink, or bright blue colors
- Avoid gradients except in headers and special cases
- Don't overuse animations - keep them subtle and purposeful

### Accessibility
- Ensure sufficient contrast ratios (daemon-text on daemon-dark meets WCAG AA)
- Provide focus states for all interactive elements
- Use semantic HTML structure
- Include proper ARIA labels for complex components

This style guide provides a comprehensive foundation for building a cohesive, dark corporate aesthetic that supports the satirical tone of Daemon Directorate while maintaining usability and professional polish.