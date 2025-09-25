# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Daemon Directorate is a dark corporate satire strategy game where players manage daemon operatives in the Infernal Corporate Hierarchy. Built as a React TypeScript frontend-only application using Vite, Tailwind CSS 4.x, and Zustand for state management with localStorage persistence.

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

### Store Architecture Pattern

The project uses **Zustand store composition** with domain slices:

- **composedStore.ts**: Main store that combines all slices
- **Store slices**: Separate domain logic (daemon, resource, mission, UI slices)
- **Persistence**: Selective state persistence using Zustand middleware
- **Selectors**: Custom hooks for performance optimization (`useDaemons`, `useResources`, etc.)

Key store pattern:
```typescript
export const useGameStore = create<ComposedGameStore>()(
  persist(
    subscribeWithSelector((...a) => ({
      ...createDaemonSlice(...a),
      ...createResourceSlice(...a),
      ...createMissionSlice(...a),
      ...createUISlice(...a),
    })),
    { name: 'daemon-directorate-v2', version: 2 }
  )
);
```

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

#### Environment Configuration
- Uses `.env` file for deployment configuration
- Vite base path configured dynamically based on deployment mode
- Supports both root and subfolder deployment modes

## Technology Stack

### Frontend Stack
- **React 19.1.0**: Latest React with modern features
- **TypeScript 5.8.3**: Strict typing throughout
- **Vite 6.3.5**: Fast build tool and dev server with base path: `/daemon_directorate/`
- **Tailwind CSS 4.1.10**: Utility-first styling with `@tailwindcss/vite` plugin
- **Zustand 5.0.5**: Lightweight state management with persistence
- **Framer Motion 12.18.1**: Animation library
- **Chart.js 4.4.9**: Data visualization
- **React Router DOM 7.6.2**: Client-side routing
- **React Use 17.6.0**: Utility hooks

### Development Tools
- **Vitest 3.2.4**: Testing framework with jsdom environment
- **ESLint 9.25.0**: Code quality with React-specific rules
- **Prettier 3.6.2**: Code formatting
- **TypeScript ESLint**: Enhanced TypeScript linting

## Game Architecture Patterns

### Core Game Systems
1. **Daemon Management**: Recruit, assign, and manage daemon operatives with specializations and quirks
2. **Resource Management**: Credits, soul essence, bureaucratic leverage, raw materials
3. **Mission System**: Deploy teams to conquer planets with procedural outcomes
4. **Equipment System**: Craft and manage degradable corporate equipment
5. **Legacy System**: Generational progression with inheritance mechanics
6. **Corporate Events**: Random events affecting game state

### State Management Patterns
- **Domain Slicing**: Game logic separated by concerns (daemons, resources, missions, UI)
- **Selective Persistence**: Only core game data persisted, excludes temporary UI state
- **Migration System**: Built-in version management for save compatibility
- **Performance Optimization**: Custom selector hooks prevent unnecessary re-renders

### Component Organization
- **game/**: Core game features (Dashboard, TeamManagement, Missions, Apartment, Equipment)
- **layout/**: Application structure (Header, TabNavigation)
- **ui/**: Reusable components (modals, notifications, game controls)
- **Modal System**: Comprehensive modal management for game interactions

## Key Features and Mechanics

### Daemon System
- Finite lifespans with succession planning
- Specializations: Infiltration, Combat, Sabotage
- Procedural quirks affecting mission outcomes
- Legacy inheritance across generations

### Mission System
- Planetary conquest with varying difficulty levels
- Team-based deployment with specialization requirements
- Equipment degradation through use
- Narrative outcomes with corporate satire

### Corporate Progression
- Apartment HQ with upgradeable rooms
- Corporate tier advancement system
- Compliance tasks and bureaucratic challenges
- Rival corporation interactions

### Dark Humor Elements
- Corporate-speak and workplace satire
- Bureaucratic event system
- Memorial system for deceased daemons
- Hall of Infamy for memorable failures

## Development Notes

### TypeScript Patterns
- Comprehensive type definitions in `types/game.ts`
- Strict typing for all store state and actions
- Interface-based component contracts
- Type-safe event handling and game mechanics

### Performance Considerations
- Zustand selector hooks for component optimization
- React.memo usage in performance-critical components
- Efficient re-rendering patterns for game loops
- Lazy loading for non-critical components

### Testing Strategy
- Vitest for unit testing with jsdom environment
- React Testing Library for component testing
- Type checking as first line of defense
- CI pipeline with comprehensive quality checks

### Code Quality Standards
- ESLint with React hooks and TypeScript rules
- Prettier for consistent formatting
- Comprehensive CI pipeline (`npm run ci`)
- Type-first development approach

## Deployment Considerations

### Build Configuration
- Vite configured for subfolder deployment (`/daemon_directorate/`)
- Environment-specific builds (preview vs production)
- Asset optimization and minification
- Source map generation for debugging

### Publishing Process
- Automated frontend build and deployment
- Environment variable handling
- Asset copying with exclusion patterns
- FTP and file system deployment support