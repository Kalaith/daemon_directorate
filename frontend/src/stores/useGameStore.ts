// stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Daemon, Equipment, MissionResult, CorporateEvent } from '../types/game';
import { STARTER_DATA, GAME_CONFIG, DAEMON_NAMES, DAEMON_QUIRKS, CORPORATE_EVENTS, DAEMON_BLOODLINES, INHERITED_TRAITS } from '../constants/gameData';

interface GameStore extends GameState {
  // Actions
  setCurrentTab: (tab: 'dashboard' | 'team' | 'missions' | 'apartment' | 'equipment') => void;
  toggleDaemonSelection: (daemonId: string) => void;
  clearDaemonSelection: () => void;
  setCurrentPlanet: (planetId: string | null) => void;
  setShowTutorial: (show: boolean) => void;
  setShowMemorial: (show: boolean, daemon?: Daemon) => void;
  setShowMissionModal: (show: boolean) => void;
  setShowMissionResults: (show: boolean, result?: MissionResult) => void;
  setShowEventModal: (show: boolean, event?: CorporateEvent) => void;

  // Game Actions
  initializeGame: () => void;
  startNewGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;

  // Resource Management
  canAfford: (cost: number) => boolean;
  spendCredits: (amount: number) => boolean;
  addResources: (credits?: number, soulEssence?: number, bureaucraticLeverage?: number, rawMaterials?: number) => void;

  // Daemon Management
  recruitDaemon: (daemonId: string) => void;
  refreshRecruitmentPool: () => void;
  generateRecruitmentPool: () => void;
  processDaemonDeath: (daemon: Daemon) => void;

  // Mission System
  selectPlanetForMission: (planetId: string) => void;
  executeMission: () => void;

  // Room Management
  upgradeRoom: (roomId: string) => void;

  // Equipment Management
  repairEquipment: (equipmentId: string) => void;
  craftItem: (itemType: string) => void;

  // Events
  triggerRandomEvent: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;

  // Daily Updates
  processDailyUpdate: () => void;

  // Utility
  generateId: () => string;
  addNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const initialState: GameState = {
  resources: {
    credits: 500,
    soulEssence: 0,
    bureaucraticLeverage: 0,
    rawMaterials: 0
  },
  daemons: [],
  equipment: [],
  rooms: [],
  planets: [],
  recruitmentPool: [],
  activeMission: null,
  corporateEvents: [],
  gameModifiers: {
    passiveIncome: 0,
    recruitmentDiscount: 0,
    equipmentRepairDiscount: 0,
    missionSuccessBonus: 0,
    managementStress: false,
    hrInvestigation: 0,
    productivityBonus: 0,
    productivityBonusRemainingMissions: 0
  },
  daysPassed: 0,
  gameStarted: false,
  
  // UI State
  currentTab: 'dashboard',
  selectedDaemons: new Set(),
  currentPlanet: null,
  showTutorial: true,
  showMemorial: false,
  showMissionModal: false,
  showMissionResults: false,
  showEventModal: false,
  memorialDaemon: null,
  missionResults: null,
  currentEvent: null,
  notifications: []
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentTab: (tab) => set({ currentTab: tab }),

      toggleDaemonSelection: (daemonId) => {
        const { selectedDaemons } = get();
        const newSelection = new Set(selectedDaemons);
        if (newSelection.has(daemonId)) {
          newSelection.delete(daemonId);
        } else {
          newSelection.add(daemonId);
        }
        set({ selectedDaemons: newSelection });
      },

      clearDaemonSelection: () => set({ selectedDaemons: new Set() }),

      setCurrentPlanet: (planetId) => set({ currentPlanet: planetId }),

      setShowTutorial: (show) => set({ showTutorial: show }),

      setShowMemorial: (show, daemon) => set({
        showMemorial: show,
        memorialDaemon: daemon || null
      }),

      setShowMissionModal: (show) => set({ showMissionModal: show }),

      setShowMissionResults: (show, result) => set({
        showMissionResults: show,
        missionResults: result || null
      }),

      setShowEventModal: (show, event) => set({
        showEventModal: show,
        currentEvent: event || null
      }),

      initializeGame: () => {
        const { loadGame, startNewGame, gameStarted } = get();
        if (!loadGame()) {
          startNewGame();
        }

        if (!gameStarted) {
          set({ showTutorial: true });
        }

        // Start daily updates
        setInterval(() => get().processDailyUpdate(), GAME_CONFIG.DAILY_UPDATE_INTERVAL);
      },

      startNewGame: () => {
        const { generateId } = get();

        const daemons = STARTER_DATA.starter_daemons.map(d => ({
          ...d,
          id: generateId(),
          assignments: [],
          equipment: null,
          isActive: true
        }));

        const equipment = STARTER_DATA.starter_equipment.map(e => ({
          ...e,
          id: generateId(),
          assignedTo: null
        }));

        const rooms = STARTER_DATA.apartment_rooms.map(r => ({
          ...r,
          id: generateId()
        }));

        const planets = STARTER_DATA.planets.map(p => ({
          ...p,
          id: generateId(),
          conquered: false,
          lastMission: null
        }));

        set({
          daemons,
          equipment,
          rooms,
          planets,
          gameStarted: true
        });

        get().generateRecruitmentPool();
      },

      saveGame: () => {
        // Zustand persist middleware handles this automatically
      },

      loadGame: () => {
        // Zustand persist middleware handles this automatically
        return true;
      },

      resetGame: () => {
        set(initialState);
        get().startNewGame();
      },

      canAfford: (cost) => {
        return get().resources.credits >= cost;
      },

      spendCredits: (amount) => {
        const { resources, canAfford } = get();
        if (canAfford(amount)) {
          set({
            resources: {
              ...resources,
              credits: resources.credits - amount
            }
          });
          return true;
        }
        return false;
      },

      addResources: (credits = 0, soulEssence = 0, bureaucraticLeverage = 0, rawMaterials = 0) => {
        const { resources } = get();
        set({
          resources: {
            credits: resources.credits + credits,
            soulEssence: resources.soulEssence + soulEssence,
            bureaucraticLeverage: resources.bureaucraticLeverage + bureaucraticLeverage,
            rawMaterials: resources.rawMaterials + rawMaterials
          }
        });
      },

      recruitDaemon: (daemonId) => {
        const { recruitmentPool, daemons, spendCredits } = get();
        const daemon = recruitmentPool.find(d => d.id === daemonId);
        if (daemon && daemon.cost && spendCredits(daemon.cost)) {
          const newRecruitmentPool = recruitmentPool.filter(d => d.id !== daemonId);
          const newDaemon = { ...daemon };
          delete newDaemon.cost;
          newDaemon.assignments = [];
          newDaemon.equipment = null;

          set({
            recruitmentPool: newRecruitmentPool,
            daemons: [...daemons, newDaemon]
          });
          
          get().addNotification(`${daemon.name} has joined your corporate team!`, 'success');
        }
      },

      refreshRecruitmentPool: () => {
        const { spendCredits, generateRecruitmentPool } = get();
        if (spendCredits(GAME_CONFIG.RECRUITMENT_COST)) {
          generateRecruitmentPool();
          get().addNotification('New recruitment candidates available', 'info');
        }
      },

      generateRecruitmentPool: () => {
        const specializations: ('Infiltration' | 'Combat' | 'Sabotage')[] = ['Infiltration', 'Combat', 'Sabotage'];
        const { generateId } = get();

        const pool = [];
        for (let i = 0; i < 3; i++) {
          const daemon: Daemon & { cost: number } = {
            id: generateId(),
            name: `${DAEMON_NAMES[Math.floor(Math.random() * DAEMON_NAMES.length)]}-${Math.floor(Math.random() * 9999) + 1000}`,
            specialization: specializations[Math.floor(Math.random() * specializations.length)],
            health: Math.floor(Math.random() * 30) + 70,
            morale: Math.floor(Math.random() * 40) + 50,
            lifespanDays: Math.floor(Math.random() * 40) + 20,
            quirks: DAEMON_QUIRKS.sort(() => 0.5 - Math.random()).slice(0, 2),
            cost: Math.floor(Math.random() * 100) + 100,
            assignments: [],
            equipment: null,
            isActive: true,
            generation: 1,
            bloodline: DAEMON_BLOODLINES[Math.floor(Math.random() * DAEMON_BLOODLINES.length)],
            inheritedTraits: [],
            legacy: {
              successfulMissions: 0,
              planetsConquered: 0,
              equipmentCreated: 0,
              yearsServed: 0
            }
          };
          pool.push(daemon);
        }

        set({ recruitmentPool: pool });
      },

      processDaemonDeath: (daemon) => {
        const { daemons, equipment, setShowMemorial, generateRecruitmentPool, generateId } = get();

        // Mark as inactive
        const updatedDaemons = daemons.map(d =>
          d.id === daemon.id ? { ...d, isActive: false, lifespanDays: 0 } : d
        );

        // Enhanced legacy effects - equipment gets legacy bonus and durability boost
        let updatedEquipment = equipment;
        if (daemon.equipment) {
          updatedEquipment = equipment.map(e => {
            if (e.id === daemon.equipment) {
              return {
                ...e,
                durability: Math.min(100, e.durability + 20),
                assignedTo: null,
                generation: e.generation + 1,
                legacyBonus: e.legacyBonus + 5, // +5% effectiveness per inheritance
                history: [...e.history, `Inherited from ${daemon.name} (Gen ${daemon.generation})`]
              };
            }
            return e;
          });
        }

        // Check if daemon qualifies for creating a successor
        const shouldCreateSuccessor = daemon.legacy.successfulMissions >= 3 || 
                                     daemon.legacy.planetsConquered >= 1 ||
                                     daemon.generation >= 2;

        if (shouldCreateSuccessor) {
          // Generate a successor daemon from the same bloodline
          const successorName = `${DAEMON_NAMES[Math.floor(Math.random() * DAEMON_NAMES.length)]}-${Math.floor(Math.random() * 9999) + 1000}`;
          
          // Determine inherited traits
          // eslint-disable-next-line prefer-const
          let inheritedTraits = [...daemon.inheritedTraits];
          
          // Chance to gain new inherited trait based on accomplishments
          if (daemon.legacy.successfulMissions >= 5 && Math.random() < 0.3) {
            const availableTraits = INHERITED_TRAITS.filter(trait => !inheritedTraits.includes(trait));
            if (availableTraits.length > 0) {
              inheritedTraits.push(availableTraits[Math.floor(Math.random() * availableTraits.length)]);
            }
          }

          // Create successor daemon
          const successor: Daemon = {
            id: generateId(),
            name: successorName,
            specialization: daemon.specialization,
            health: Math.min(100, 80 + (daemon.generation * 5)), // Better health each generation
            morale: Math.min(100, 70 + (daemon.generation * 3)), // Better morale each generation
            lifespanDays: Math.min(80, 40 + (daemon.generation * 2)), // Slightly longer lifespan
            quirks: DAEMON_QUIRKS.sort(() => 0.5 - Math.random()).slice(0, 2),
            assignments: [],
            equipment: null,
            isActive: true,
            generation: daemon.generation + 1,
            bloodline: daemon.bloodline,
            mentor: daemon.id,
            inheritedTraits,
            legacy: {
              successfulMissions: 0,
              planetsConquered: 0,
              equipmentCreated: 0,
              yearsServed: 0
            }
          };

          // Add successor to the team
          updatedDaemons.push(successor);
          
          get().addNotification(
            `${successor.name} joins your team, carrying on the legacy of ${daemon.bloodline}`,
            'success'
          );
        }

        set({
          daemons: updatedDaemons,
          equipment: updatedEquipment
        });

        // Trigger recruitment pool refresh to honor the fallen
        generateRecruitmentPool();

        setShowMemorial(true, daemon);
      },

      selectPlanetForMission: (planetId) => {
        const { setCurrentPlanet, setShowMissionModal } = get();
        setCurrentPlanet(planetId);
        setShowMissionModal(true);
      },

      executeMission: () => {
        const { selectedDaemons, currentPlanet, daemons, planets, setShowMissionModal, setShowMissionResults, clearDaemonSelection, setCurrentPlanet } = get();

        if (selectedDaemons.size === 0 || !currentPlanet) return;

        const planet = planets.find(p => p.id === currentPlanet);
        if (!planet) return;

        const selectedTeam = Array.from(selectedDaemons).map(id =>
          daemons.find(d => d.id === id)
        ).filter(Boolean) as Daemon[];

        // Simple mission calculation
        let successChance = 50;
        
        // Team composition bonuses
        const hasInfiltrator = selectedTeam.some(d => d.specialization === 'Infiltration');
        const hasCombat = selectedTeam.some(d => d.specialization === 'Combat');
        const hasSaboteur = selectedTeam.some(d => d.specialization === 'Sabotage');
        
        if (planet.difficulty === 'Easy' && hasInfiltrator) successChance += 20;
        if (planet.difficulty === 'Medium' && hasCombat) successChance += 15;
        if (planet.difficulty === 'Hard' && hasSaboteur) successChance += 25;

        // Team health and morale
        const avgHealth = selectedTeam.reduce((sum, d) => sum + d.health, 0) / selectedTeam.length;
        const avgMorale = selectedTeam.reduce((sum, d) => sum + d.morale, 0) / selectedTeam.length;
        successChance += (avgHealth - 50) * 0.3;
        successChance += (avgMorale - 50) * 0.2;

        // Equipment bonus
        selectedTeam.forEach(daemon => {
          if (daemon.equipment) successChance += 10;
        });

        // Difficulty penalties
        const difficultyPenalties = { Easy: 0, Medium: -15, Hard: -30 };
        successChance += difficultyPenalties[planet.difficulty];

        successChance = Math.max(10, Math.min(90, successChance));
        const success = Math.random() * 100 < successChance;

        // Calculate rewards
        const baseRewards = {
          Easy: { credits: 150, soulEssence: 2 },
          Medium: { credits: 300, bureaucraticLeverage: 5 },
          Hard: { credits: 500, rawMaterials: 3 }
        };

        const rewards = { ...baseRewards[planet.difficulty] };
        if (!success) {
          rewards.credits = Math.floor(rewards.credits * 0.3);
        }

        // Apply results and update legacy tracking
        get().addResources(
          rewards.credits || 0, 
          'soulEssence' in rewards ? rewards.soulEssence || 0 : 0, 
          'bureaucraticLeverage' in rewards ? rewards.bureaucraticLeverage || 0 : 0, 
          'rawMaterials' in rewards ? rewards.rawMaterials || 0 : 0
        );

        // Update daemon legacy tracking
        const updatedDaemons = get().daemons.map(daemon => {
          if (selectedDaemons.has(daemon.id)) {
            const healthLoss = Math.floor(Math.random() * 20) + 5;
            const moraleLoss = Math.floor(Math.random() * 15) + 5;
            const lifespanLoss = Math.floor(Math.random() * 2) + 1;
            
            // Update legacy statistics
            const updatedLegacy = { ...daemon.legacy };
            if (success) {
              updatedLegacy.successfulMissions += 1;
              if (planet.conquered) {
                updatedLegacy.planetsConquered += 1;
              }
            }
            
            return {
              ...daemon,
              health: Math.max(0, daemon.health - healthLoss),
              morale: Math.max(0, daemon.morale - moraleLoss),
              lifespanDays: Math.max(0, daemon.lifespanDays - lifespanLoss),
              legacy: updatedLegacy
            };
          }
          return daemon;
        });

        // Mark planet as conquered if successful
        const updatedPlanets = planets.map(p =>
          p.id === currentPlanet ? { ...p, conquered: success } : p
        );

        const result: MissionResult = {
          success,
          successChance: Math.round(successChance),
          narrative: success 
            ? `Mission accomplished! Your team successfully neutralized ${planet.resistance} on ${planet.name}.`
            : `Mission failed. Your team encountered unexpected resistance from ${planet.resistance}.`,
          rewards,
          casualties: [],
          equipmentDamage: []
        };

        set({
          daemons: updatedDaemons,
          planets: updatedPlanets
        });

        setShowMissionModal(false);
        setShowMissionResults(true, result);
        clearDaemonSelection();
        setCurrentPlanet(null);

        get().addNotification(
          success ? 'Mission successful!' : 'Mission failed',
          success ? 'success' : 'error'
        );
      },

      upgradeRoom: (roomId) => {
        const { rooms, spendCredits } = get();
        const room = rooms.find(r => r.id === roomId);
        if (!room || !spendCredits(room.upgrade_cost)) return;

        const updatedRooms = rooms.map(r => {
          if (r.id === roomId) {
            return {
              ...r,
              level: r.level + 1,
              upgrade_cost: Math.floor(r.upgrade_cost * 1.5)
            };
          }
          return r;
        });

        set({ rooms: updatedRooms });
        get().addNotification(`${room.name} upgraded successfully!`, 'success');
      },

      repairEquipment: (equipmentId) => {
        const { equipment, spendCredits } = get();
        const equip = equipment.find(e => e.id === equipmentId);
        if (!equip) return;

        const repairCost = Math.floor((100 - equip.durability) * 2);
        if (spendCredits(repairCost)) {
          const updatedEquipment = equipment.map(e =>
            e.id === equipmentId
              ? { ...e, durability: Math.min(100, e.durability + 50) }
              : e
          );
          set({ equipment: updatedEquipment });
          get().addNotification(`${equip.name} repaired successfully!`, 'success');
        }
      },

      craftItem: (itemType) => {
        const { equipment, resources, spendCredits, addResources, generateId } = get();

        const recipes = {
          briefcase: { cost: 100, materials: 0, name: 'Standard Issue Briefcase', type: 'Infiltration' as const, ability: 'Blend In (+15 stealth)' },
          tie: { cost: 75, materials: 0, name: 'Corporate Tie of Binding', type: 'Combat' as const, ability: 'Intimidate (+10 combat)' },
          calculator: { cost: 125, materials: 1, name: 'Cursed Calculator', type: 'Sabotage' as const, ability: 'Data Corruption (+20 sabotage)' }
        };

        const recipe = recipes[itemType as keyof typeof recipes];
        if (!recipe) return;

        const canAffordCredits = get().canAfford(recipe.cost);
        const hasEnoughMaterials = resources.rawMaterials >= recipe.materials;

        if (canAffordCredits && hasEnoughMaterials) {
          spendCredits(recipe.cost);
          addResources(0, 0, 0, -recipe.materials);

          const newEquipment: Equipment = {
            id: generateId(),
            name: recipe.name,
            type: recipe.type,
            durability: 100,
            ability: recipe.ability,
            assignedTo: null,
            generation: 0,
            legacyBonus: 0,
            history: ["Newly crafted"]
          };

          set({ equipment: [...equipment, newEquipment] });
          get().addNotification(`${recipe.name} crafted successfully!`, 'success');
        }
      },

      triggerRandomEvent: () => {
        const { generateId, setShowEventModal } = get();
        
        // Select a random event from the new corporate events
        const randomEvent = CORPORATE_EVENTS[Math.floor(Math.random() * CORPORATE_EVENTS.length)];
        
        const eventInstance: CorporateEvent = {
          id: generateId(),
          title: randomEvent.title,
          description: randomEvent.description,
          type: randomEvent.type,
          timestamp: Date.now(),
          resolved: false,
          effects: randomEvent.type === 'automatic' ? randomEvent.effects : undefined,
          choices: randomEvent.type === 'choice' ? randomEvent.choices : undefined,
          requirements: randomEvent.requirements
        };

        // Add to events log
        set(state => ({
          corporateEvents: [...state.corporateEvents, eventInstance]
        }));

        // Show the event modal for player interaction
        setShowEventModal(true, eventInstance);
        
        get().addNotification(`Corporate Event: ${randomEvent.title}`, 'warning');
      },

      resolveEvent: (eventId, choiceIndex) => {
        const { corporateEvents, daemons, equipment, resources, gameModifiers } = get();
        const event = corporateEvents.find(e => e.id === eventId);
        
        if (!event) return;

        let effectsToApply = event.effects || [];
        
        // If it's a choice event, get the effects from the chosen option
        if (event.type === 'choice' && event.choices && choiceIndex !== undefined) {
          effectsToApply = event.choices[choiceIndex].effects;
        }

        // Apply all effects
        let updatedDaemons = [...daemons];
        let updatedEquipment = [...equipment];
        // eslint-disable-next-line prefer-const
        let updatedResources = { ...resources };
        // eslint-disable-next-line prefer-const
        let updatedModifiers = { ...gameModifiers };

        effectsToApply.forEach(effect => {
          switch (effect.type) {
            case 'credits':
              updatedResources.credits += effect.value;
              break;
            case 'soulEssence':
              updatedResources.soulEssence += effect.value;
              break;
            case 'bureaucraticLeverage':
              updatedResources.bureaucraticLeverage += effect.value;
              break;
            case 'rawMaterials':
              updatedResources.rawMaterials += effect.value;
              break;
            case 'morale':
              updatedDaemons = updatedDaemons.map(d =>
                d.isActive ? { ...d, morale: Math.max(0, Math.min(100, d.morale + effect.value)) } : d
              );
              break;
            case 'equipment_durability':
              updatedEquipment = updatedEquipment.map(e => ({
                ...e,
                durability: Math.max(0, Math.min(100, e.durability + effect.value))
              }));
              break;
            case 'passive_income':
              updatedModifiers.passiveIncome += effect.value;
              break;
            case 'recruitment_discount':
              updatedModifiers.recruitmentDiscount = effect.value;
              break;
            case 'equipment_discount':
              updatedModifiers.equipmentRepairDiscount = effect.value;
              break;
            case 'productivity_bonus':
              updatedModifiers.productivityBonus = effect.value;
              updatedModifiers.productivityBonusRemainingMissions = 5;
              break;
            case 'management_stress':
              updatedModifiers.managementStress = true;
              break;
            case 'hr_investigation':
              updatedModifiers.hrInvestigation += effect.value;
              break;
            case 'daemon_retirement': {
              // Find a random active daemon to retire
              const activeDaemons = updatedDaemons.filter(d => d.isActive);
              if (activeDaemons.length > 0) {
                const randomDaemon = activeDaemons[Math.floor(Math.random() * activeDaemons.length)];
                updatedDaemons = updatedDaemons.map(d =>
                  d.id === randomDaemon.id ? { ...d, isActive: false, lifespanDays: 0 } : d
                );
                get().addNotification(`${randomDaemon.name} has been transferred to another department`, 'info');
              }
              break;
            }
            case 'equipment_upgrade': {
              // Upgrade random equipment
              const repairableEquipment = updatedEquipment.filter(e => e.durability < 100);
              if (repairableEquipment.length > 0) {
                const randomEquip = repairableEquipment[Math.floor(Math.random() * repairableEquipment.length)];
                updatedEquipment = updatedEquipment.map(e =>
                  e.id === randomEquip.id ? { ...e, durability: Math.min(100, e.durability + 20) } : e
                );
              }
              break;
            }
          }
        });

        // Mark event as resolved
        const updatedEvents = corporateEvents.map(e =>
          e.id === eventId 
            ? { ...e, resolved: true, chosenOption: choiceIndex?.toString() }
            : e
        );

        set({
          daemons: updatedDaemons,
          equipment: updatedEquipment,
          resources: updatedResources,
          gameModifiers: updatedModifiers,
          corporateEvents: updatedEvents
        });
      },

      processDailyUpdate: () => {
        const { daemons, rooms, gameStarted, daysPassed, gameModifiers, addResources } = get();

        if (!gameStarted) return;

        const newDaysPassed = daysPassed + 1;

        // Apply passive income from modifiers
        if (gameModifiers.passiveIncome > 0) {
          addResources(gameModifiers.passiveIncome);
        }

        // Age all daemons
        const updatedDaemons = daemons.map(daemon => {
          if (!daemon.isActive) return daemon;

          // Base lifespan loss
          let lifespanLoss = 1;
          
          // Management stress modifier
          if (gameModifiers.managementStress) {
            lifespanLoss += 1;
          }

          const newLifespan = Math.max(0, daemon.lifespanDays - lifespanLoss);

          // Check for natural death
          if (newLifespan <= 0) {
            get().processDaemonDeath(daemon);
            return { ...daemon, lifespanDays: 0 };
          }

          // Room bonuses
          let newMorale = daemon.morale;
          let newHealth = daemon.health;

          const livingQuarters = rooms.find(r => r.name === 'Living Quarters');
          if (livingQuarters && livingQuarters.level > 0) {
            newMorale = Math.min(100, newMorale + (livingQuarters.level * 5));
          }

          const recoveryWard = rooms.find(r => r.name === 'Recovery Ward');
          if (recoveryWard && recoveryWard.level > 0 && daemon.health < 100) {
            newHealth = Math.min(100, newHealth + (recoveryWard.level * 15));
          }

          return {
            ...daemon,
            lifespanDays: newLifespan,
            morale: newMorale,
            health: newHealth
          };
        });

        // Decay temporary modifiers
        const updatedModifiers = {
          ...gameModifiers,
          productivityBonusRemainingMissions: Math.max(0, gameModifiers.productivityBonusRemainingMissions - 1),
          productivityBonus: gameModifiers.productivityBonusRemainingMissions <= 1 ? 0 : gameModifiers.productivityBonus,
          hrInvestigation: Math.max(0, gameModifiers.hrInvestigation - 0.5)
        };

        set({
          daemons: updatedDaemons,
          daysPassed: newDaysPassed,
          gameModifiers: updatedModifiers
        });

        // Random corporate events (8% chance per day, increased from 5%)
        if (Math.random() < 0.08) {
          get().triggerRandomEvent();
        }
      },

      generateId: () => {
        return 'id_' + Math.random().toString(36).substr(2, 9);
      },

      addNotification: (message, type = 'info') => {
        const { notifications } = get();
        const notification = {
          id: get().generateId(),
          message,
          type,
          timestamp: Date.now(),
          duration: GAME_CONFIG.NOTIFICATION_DEFAULT_DURATION
        };

        set({
          notifications: [...notifications, notification]
        });

        // Auto-remove notification after duration
        setTimeout(() => {
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== notification.id)
          }));
        }, notification.duration);
      }
    }),
    {
      name: 'daemon-directorate',
      partialize: (state) => ({
        resources: state.resources,
        daemons: state.daemons,
        equipment: state.equipment,
        rooms: state.rooms,
        planets: state.planets,
        recruitmentPool: state.recruitmentPool,
        corporateEvents: state.corporateEvents,
        gameModifiers: state.gameModifiers,
        daysPassed: state.daysPassed,
        gameStarted: state.gameStarted
      })
    }
  )
);
