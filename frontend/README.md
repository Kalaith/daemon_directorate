# Daemon Directorate - Corporate Daemon Strategy Game

Welcome to Daemon Directorate, a dark corporate satire strategy game where you manage daemon operatives in the Infernal Corporate Hierarchy. Build your daemon dynasty, conquer planets, and navigate bureaucratic hell while managing finite lifespans and equipment degradation.

This project was built with React, TypeScript, and Tailwind CSS, featuring Zustand for state management and utilizing Vite for a fast and modern development experience.

## ✨ Features

- **Daemon Management:** Recruit and manage daemon operatives with unique specializations, quirks, and finite lifespans.
- **Planetary Conquest:** Deploy teams to conquer planets with varying difficulty levels and resistance types.
- **Apartment HQ:** Upgrade your corporate headquarters with rooms that provide ongoing bonuses and capabilities.
- **Equipment System:** Craft and manage corporate-issued equipment that degrades with use, forcing strategic decisions.
- **Corporate Satire:** Experience dark humor through bureaucratic events, corporate-speak, and workplace personality quirks.
- **Legacy System:** When daemons die, successors can inherit equipment, creating generational dynasties.
- **Responsive Design:** Dark corporate aesthetic with teal accents, optimized for any device.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd daemon_directorate/frontend
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

### Running the Development Server

To start the Vite development server, run the following command:

```bash
npm run dev
```

This will start the application on `http://localhost:5173` by default. You can now open your browser and see the game in action.

## 🛠️ Project Structure

Here's a breakdown of the most important files and directories:

```
/src
├── api/              # Functions for fetching game data
├── components/       # Reusable React components
│   ├── game/         # Core game feature components (Dashboard, TeamManagement, etc.)
│   ├── layout/       # Layout components (Header, TabNavigation)
│   └── ui/           # UI components (modals, notifications, game controls)
├── constants/        # Game data constants (daemon names, quirks, starter data)
├── stores/           # Zustand state management
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
├── main.tsx          # Entry point of the application
└── index.css         # Global styles and Tailwind CSS imports
```

- **`/src/components/game`**: Core game components including Dashboard, TeamManagement, Missions, Apartment, and Equipment management.
- **`/src/components/layout`**: Main application structure with Header and TabNavigation components.
- **`/src/components/ui`**: Reusable UI components including modals, notifications, and game controls.
- **`/src/constants`**: Game configuration data including daemon names, quirks, starter equipment, and corporate events.
- **`/src/stores`**: Zustand store for centralized game state management with persistence.
- **`/src/types`**: TypeScript type definitions for game entities, state, and components.

## 💻 Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/) for state management with persistence

## 🎮 Gameplay

Welcome to your promotion to Middle Management in the Infernal Corporate Hierarchy! Your objective is to manage daemon operatives, conquer planets, and maintain your apartment HQ while navigating the challenges of finite lifespans and equipment degradation.

**Core Gameplay Loop:**
1. **Recruit Daemons:** Start with three basic operatives, each with unique specializations and quirks
2. **Deploy Missions:** Send teams to conquer planets with varying difficulty and rewards
3. **Manage Resources:** Earn credits, soul essence, bureaucratic leverage, and raw materials
4. **Upgrade HQ:** Enhance your apartment with rooms like Training Halls and Recovery Wards
5. **Craft Equipment:** Create corporate-issued gear that provides bonuses but degrades with use
6. **Plan Succession:** When daemons die, new recruits can inherit equipment and continue the legacy

The game emphasizes strategic resource management and the tension between ambition and loss. Success isn't measured by infinite growth, but by how memorable your daemon dynasty becomes before inevitable corporate restructuring.

**Key Strategic Elements:**
- Daemon lifespans are finite - plan for succession
- Equipment degrades with use - choose when to deploy rare items
- Planet conquest unlocks new resources and challenges
- Room upgrades provide permanent bonuses to your operations
- Corporate events can help or hinder your progress

## 🗺️ Development Roadmap

### Phase 1 – Core Foundations (MVP)
- ✅ Basic daemon recruitment with randomized quirks and specializations
- ✅ Simple mission deployment (success/failure + basic rewards)
- ✅ Core resources: credits + materials
- ✅ Apartment HQ with 1–2 upgradeable rooms
- ✅ Basic equipment crafting + durability system
- ✅ Local persistence (Zustand + localStorage)

### Phase 2 – Depth & Systems Expansion
- 🔄 Add more resources (soul essence, bureaucratic leverage)
- 🔄 Introduce generational legacy/inheritance mechanics
- 📋 Expanded HQ rooms (Training Hall, Recovery Ward, War Room)
- 📋 More mission variety: multiple objectives, branching outcomes
- 📋 Expanded daemon quirks/personality traits that affect missions
- 📋 Randomized corporate events with positive/negative outcomes

### Phase 3 – Aesthetic & UX Polish
- 📋 Corporate UI polish: improved dashboard, animated mission reports
- 📋 Add sound effects & ambient corporate "hell" music
- 📋 Notifications + log system (track promotions, deaths, events)
- 📋 Improved daemon portraits/avatars with procedural variation
- 📋 First satire-driven flavor text pass (corporate emails, memos, HR notices)

### Phase 4 – Strategic & Narrative Layers
- 📋 Planetary conquest map with persistent control over territories
- 📋 Corporate rival factions / competition mechanics
- 📋 Deeper equipment system (rarity, set bonuses, cursed gear)
- 📋 Mid-game narrative beats (corporate restructuring, hostile takeovers)
- 📋 Expanded legacy mechanics: bloodlines, perks passed across generations

### Phase 5 – Replayability & Endgame
- 📋 Prestige / corporate restructuring meta-loop (restart with bonuses)
- 📋 Unlockable daemon archetypes & HQ upgrades
- 📋 Event chains & branching narratives tied to player choices
- 📋 Endgame bosses (planetary boardrooms, infernal CEOs)
- 📋 Challenge modes (ironman, hardcore resource scarcity)

**Legend:** ✅ Completed | 🔄 In Progress | 📋 Planned

## 🤝 Contributing

Contributions are welcome! If you have any ideas for new features, improvements, or bug fixes, please feel free to open an issue or submit a pull request.

When contributing, please follow the existing code style and conventions. Make sure to run the linter before committing your changes:

```bash
npm run lint
```

---

Welcome to your Corporate Hell! �
