# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Daemon Directorate is a dark corporate satire strategy game where players manage daemon operatives in the Infernal Corporate Hierarchy. Built as a React TypeScript frontend-only application using Vite, Tailwind CSS 4.x, and Zustand for state management with localStorage persistence.

## Common Development Commands

### Development Workflow
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check

# Testing
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:coverage
npm run test:ui     # Vitest UI

# Complete CI pipeline
npm run ci          # Runs lint + type-check + format:check + test:run + build
npm run ci:quick    # Runs lint + type-check + format:check (faster)
```

### Build and Deployment

#### PowerShell Publishing Script
The project uses a comprehensive `publish.ps1` script:

```powershell
# Deploy to preview environment (default)
.\publish.ps1

# Deploy to production environment
.\publish.ps1 -Production

# Frontend only deployment
.\publish.ps1 -Frontend

# Clean deployment with verbose output
.\publish.ps1 -All -Clean -Verbose
```

## Project Architecture

### Frontend-Only Structure
This is a modern React TypeScript application without a backend:

```
frontend/
├── src/
│   ├── components/
│   │   ├── game/           # Core game feature components
│   │   ├── layout/         # Header, TabNavigation
│   │   └── ui/             # Modals, notifications, controls
│   ├── stores/
│   │   ├── composedStore.ts    # Main Zustand store composition
│   │   └── slices/             # Domain-specific store slices
│   ├── types/
│   │   └── game.ts             # Comprehensive TypeScript types
│   ├── constants/              # Game data and configurations
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   └── api/                    # Game data fetching functions
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── vitest.config.ts
```

### Store Architecture Pattern - Domain Slicing with Zustand

The project uses **Zustand store composition** with domain slices - a sophisticated state management pattern:

- **composedStore.ts**: Main store that combines all domain slices using the spread operator
- **Store slices**: Separate domain logic into focused modules:
  - `daemonSlice.ts`: Daemon recruitment, management, selection, legacy tracking
  - `resourceSlice.ts`: Credits, soul essence, bureaucratic leverage, raw materials
  - `missionSlice.ts`: Planet conquest, mission execution, completion tracking
  - `equipmentSlice.ts`: Crafting, durability, assignment, repair systems
  - `apartmentSlice.ts`: Room upgrades, apartment level progression
  - `corporateSlice.ts`: Tier advancement, rivals, promotion progress
  - `complianceSlice.ts`: HR tasks, audits, deadlines
  - `endgameSlice.ts`: Prestige system, restart mechanics
  - `uiSlice.ts`: Modal states, notifications, tutorial progress
  - `coreSlice.ts`: Core game initialization and save/load mechanics

- **Selective Persistence**: Only core game data persisted, excludes temporary UI state via `partialize`
- **Selector Hooks**: Custom hooks for performance optimization (`useDaemons`, `useResources`, `useMissions`, `useUI`)
- **Migration System**: Built-in version management for save compatibility

Key store composition pattern:
```typescript
export const useGameStore = create<ComposedGameStore>()(
  persist(
    subscribeWithSelector((...a) => ({
      ...createDaemonSlice(...a),
      ...createResourceSlice(...a),
      ...createMissionSlice(...a),
      ...createUISlice(...a),
      // ... other slices
    })),
    {
      name: 'daemon-directorate-v2',
      version: 2,
      partialize: state => ({ /* selective persistence */ })
    }
  )
);
```

This pattern provides:
- **Clean separation of concerns** - each slice handles one domain
- **Type safety** - Combined type from all slice types
- **Performance optimization** - Selector hooks prevent unnecessary re-renders
- **Persistence control** - Selective state saving excludes UI volatiles
- **Testability** - Each slice can be tested in isolation

## Technology Stack

### Frontend Stack
- **React 19.1.0**: Latest React with modern features and concurrent rendering
- **TypeScript 5.8.3**: Strict typing throughout with comprehensive type definitions
- **Vite 6.3.5**: Fast build tool and dev server with base path: `/daemon_directorate/`
- **Tailwind CSS 4.1.10**: Utility-first styling with `@tailwindcss/vite` plugin
- **Zustand 5.0.5**: Lightweight state management with persistence and selector middleware
- **Framer Motion 12.18.1**: Animation library for UI transitions
- **Chart.js 4.4.9**: Data visualization for game metrics
- **React Router DOM 7.6.2**: Client-side routing (if used)
- **React Use 17.6.0**: Utility hooks collection

### Development Tools
- **Vitest 3.2.4**: Testing framework with jsdom environment, supports UI mode
- **ESLint 9.25.0**: Code quality with React hooks and TypeScript rules
- **Prettier 3.6.2**: Code formatting with consistent style
- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: Extended Jest matchers for DOM testing

## Game Architecture Patterns

### Core Game Systems
1. **Daemon Management**: Recruit, assign, and manage daemon operatives with specializations (Infiltration, Combat, Sabotage), quirks, and finite lifespans
2. **Resource Management**: Four resource types - Credits, Soul Essence, Bureaucratic Leverage, Raw Materials
3. **Mission System**: Deploy teams to conquer planets with procedural outcomes based on team composition and equipment
4. **Equipment System**: Craft and manage corporate equipment with durability that degrades with use
5. **Legacy System**: Generational progression where deceased daemons can pass equipment/traits to successors
6. **Corporate Events**: Random events affecting game state with corporate satire themes
7. **Apartment HQ**: Upgradeable rooms providing ongoing bonuses (Training Hall, Recovery Ward, etc.)
8. **Compliance Center**: Bureaucratic tasks, audits, and HR reviews
9. **Corporate Ladder**: Tier progression and rival corporation dynamics

### Component Organization
- **game/**: Core game features
  - `Dashboard.tsx`: Main game overview and resource display
  - `TeamManagement.tsx`: Daemon recruitment and assignment
  - `Missions.tsx`: Planet conquest interface
  - `Equipment.tsx`: Crafting and equipment management
  - `Apartment.tsx`: HQ room upgrades
  - `ComplianceCenter.tsx`: Bureaucratic tasks
  - `CorporateLadder.tsx`: Tier progression
  - `HallOfInfamy.tsx`: Memorial for deceased daemons
- **layout/**: Application structure (Header, TabNavigation)
- **ui/**: Reusable components
  - Various modal components for game interactions
  - `NotificationSystem.tsx`: Toast notifications
  - `GameControls.tsx`: Common game UI elements
  - `Tutorial.tsx`: Onboarding system

### State Management Patterns
- **Domain Slicing**: Game logic separated by concerns for maintainability
- **Selective Persistence**: Core game state saved, temporary UI state excluded
- **Performance Optimization**: Custom selector hooks prevent unnecessary re-renders
- **Event-Driven Updates**: Game loop mechanics using React hooks and Zustand subscriptions

## Development Notes

### TypeScript Patterns
- **Comprehensive Type System**: All game entities, state, and actions fully typed in `types/game.ts`
- **Interface-Based Contracts**: Components use strict TypeScript interfaces
- **Type-Safe Store Slices**: Each Zustand slice has its own type definition
- **Enum Usage**: Specializations, resource types, and other constants use TypeScript enums

### Key Files to Understand
- `src/stores/composedStore.ts` - Central state management with all domain slices
- `src/types/game.ts` - Complete TypeScript type definitions for all game entities
- `src/components/game/Dashboard.tsx` - Main game interface and resource display
- `src/constants/` - Game data including daemon names, quirks, equipment types
- `vite.config.ts` - Build configuration with base path for deployment

### Testing Strategy
- **Vitest** for unit testing with jsdom environment
- **React Testing Library** for component testing
- **Type checking** as first line of defense against bugs
- **CI pipeline** with comprehensive quality checks via `npm run ci`

### Code Quality Standards
- **ESLint** with React hooks and TypeScript rules
- **Prettier** for consistent code formatting
- **Type-first development** approach throughout codebase
- **Comprehensive CI pipeline** that must pass before deployment

## Environment Configuration
- **Vite Base Path**: Configured for subfolder deployment (`/daemon_directorate/`)
- **Environment Files**: Uses `.env` for deployment configuration
- **Build Modes**: Separate preview and production builds with different optimizations
- **Asset Handling**: Vite handles static assets with proper hashing for caching

## Deployment Process
- **PowerShell Script**: `publish.ps1` handles automated build and deployment
- **Dual Environment**: Preview (`H:\xampp\htdocs`) and Production (`F:\WebHatchery`) targets
- **Build Optimization**: Production builds include minification and tree-shaking
- **Asset Management**: Automated copying with exclusion patterns for dev files