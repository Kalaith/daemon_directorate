// stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Daemon,
  Equipment,
  MissionResult,
  CorporateEvent,
  CorporateTier,
  ComplianceTask,
  DaemonLegacy,
  LegacyStory,
  ManagementStyle,
  SurrealEvent,
  RivalOperation,
  RivalStrategy,
  RivalOperationEffect,
  Mission,
  MissionConsequence,
} from '../types/game';
import {
  STARTER_DATA,
  GAME_CONFIG,
  DAEMON_NAMES,
  DAEMON_QUIRKS,
  CORPORATE_EVENTS,
  DAEMON_BLOODLINES,
  INHERITED_TRAITS,
  CORPORATE_TIERS,
  ASSOCIATE_TIER,
  COMPLIANCE_TEMPLATES,
  SURREAL_EVENTS,
  RIVAL_CORPORATIONS,
  MISSION_CONSEQUENCES,
  PROCEDURAL_MISSIONS,
} from '../constants/gameData';
import { DAEMON_BALANCE } from '../constants/gameBalance';
import {
  executeMissionLogic,
  evaluateMissionObjectives as evaluateObjectives,
  type MissionExecutionContext,
} from '../utils/missionHelpers';

interface GameStore extends GameState {
  // Actions
  setCurrentTab: (
    tab: 'dashboard' | 'team' | 'missions' | 'apartment' | 'equipment'
  ) => void;
  toggleDaemonSelection: (daemonId: string) => void;
  clearDaemonSelection: () => void;
  setCurrentPlanet: (planetId: string | null) => void;
  setShowTutorial: (show: boolean) => void;
  setTutorialCompleted: () => void;
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
  resetToInitialState: () => void;

  // Resource Management
  canAfford: (cost: number) => boolean;
  spendCredits: (amount: number) => boolean;
  addResources: (
    credits?: number,
    soulEssence?: number,
    bureaucraticLeverage?: number,
    rawMaterials?: number
  ) => void;

  // Daemon Management
  recruitDaemon: (daemonId: string) => void;
  refreshRecruitmentPool: () => void;
  generateRecruitmentPool: () => void;
  processDaemonDeath: (daemon: Daemon) => void;

  // Mission System
  selectPlanetForMission: (planetId: string, missionType?: string) => void;
  executeMission: (missionType?: string, objectives?: string[]) => void;
  generateProceduralMissions: () => void;
  processMissionConsequences: (consequences: MissionConsequence[]) => void;
  evaluateMissionObjectives: (mission: Mission, result: MissionResult) => void;

  // Room Management
  upgradeRoom: (roomId: string) => void;
  assignDaemonToRoom: (daemonId: string, roomId: string) => void;
  unassignDaemonFromRoom: (daemonId: string, roomId: string) => void;
  calculateRoomSynergyBonuses: () => void;
  unlockRoom: (roomId: string) => void;

  // Equipment Management
  repairEquipment: (equipmentId: string) => void;
  craftItem: (itemType: string) => void;

  // Events
  triggerRandomEvent: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;

  // Daily Updates
  processDailyUpdate: () => void;

  // Corporate Progression
  checkPromotion: () => void;
  promotePlayer: (newTier: CorporateTier) => void;
  meetsRequirements: (requirements: CorporateTier['requirements']) => boolean;
  unlockTierFeatures: (tier: CorporateTier) => void;

  // Compliance System
  generateComplianceTask: () => void;
  processComplianceDeadlines: () => void;
  applyCompliancePenalties: (task: ComplianceTask) => void;
  completeComplianceTask: (taskId: string) => void;

  // Legacy System
  addLegacyStory: (daemonId: string, story: Omit<LegacyStory, 'id' | 'timestamp'>) => void;
  generateLegacyLegend: (bloodline: string) => void;
  createNewLegacy: (daemon: Daemon) => DaemonLegacy;

  // Surreal Events
  triggerSurrealEvent: () => void;
  showEventWithEscalatedAbsurdity: (event: SurrealEvent, tierLevel: number) => void;

  // Endgame System
  calculateManagementStyle: () => ManagementStyle;
  triggerEnding: (style: ManagementStyle) => void;
  performCorporateRestructuring: () => void;

  // Corporate Rivals
  engageRival: (rivalId: string) => void;
  defeatRival: (rivalId: string) => void;
  calculateRivalSuccessChance: (rivalId: string) => number;
  processRivalAI: () => void;
  executeRivalOperation: (rivalId: string, operation: RivalOperation) => void;
  updateRivalStrategy: (rivalId: string) => void;
  generateRivalOperation: (rivalId: string) => RivalOperation | null;
  checkTakeoverThreats: () => void;

  // HR Reviews
  conductHRReview: (daemonId: string) => void;
  isHRReviewAvailable: () => boolean;

  // Utility
  generateId: () => string;
  addNotification: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info'
  ) => void;
}

const initialState: GameState = {
  resources: {
    credits: 500,
    soulEssence: 0,
    bureaucraticLeverage: 0,
    rawMaterials: 0,
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
    productivityBonusRemainingMissions: 0,
    roomSynergyBonus: 0,
    roomSynergyMissionBonus: 0,
    takeoverDefense: 0,
    espionageImmunity: 0,
    boardLoyalty: 50, // Start with neutral board loyalty
    corporateControl: 60, // Start with moderate control
    regulatoryFavor: 50, // Start with neutral regulatory relationship
  },
  daysPassed: 0,
  gameStarted: false,
  tutorialCompleted: false,

  // Enhanced mission system
  reputation: 50, // Start with neutral reputation
  availableProceduralMissions: [],
  missionConsequences: [],
  futureOpportunities: [],

  // Corporate Progression System
  corporateTier: ASSOCIATE_TIER,
  promotionProgress: {},

  // Compliance System
  complianceTasks: [],
  complianceDeadlines: {},

  // Legacy System
  legacyBook: {},
  hallOfInfamy: [],

  // Endgame System
  endgameState: {
    managementStyle: 'none',
    endingAchieved: false,
    endingType: '',
    prestigeLevel: 0,
    permanentBonuses: [],
  },
  unlockedContent: {
    daemonArchetypes: [],
    factions: [],
    events: [],
    tierFeatures: [],
  },

  // Corporate Rivals
  corporateRivals: [...RIVAL_CORPORATIONS],

  // UI State
  currentTab: 'dashboard',
  selectedDaemons: new Set(),
  currentPlanet: null,
  selectedMissionType: 'conquest',
  showTutorial: false,
  showMemorial: false,
  showMissionModal: false,
  showMissionResults: false,
  showEventModal: false,
  memorialDaemon: null,
  missionResults: null,
  currentEvent: null,
  notifications: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentTab: tab => set({ currentTab: tab }),

      toggleDaemonSelection: daemonId => {
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

      setCurrentPlanet: planetId => set({ currentPlanet: planetId }),

      setShowTutorial: show => set({ showTutorial: show }),

      setTutorialCompleted: () => set({ tutorialCompleted: true }),

      setShowMemorial: (show, daemon) =>
        set({
          showMemorial: show,
          memorialDaemon: daemon || null,
        }),

      setShowMissionModal: show => set({ showMissionModal: show }),

      setShowMissionResults: (show, result) =>
        set({
          showMissionResults: show,
          missionResults: result || null,
        }),

      setShowEventModal: (show, event) =>
        set({
          showEventModal: show,
          currentEvent: event || null,
        }),

      initializeGame: () => {
        const { loadGame, startNewGame, tutorialCompleted } = get();
        if (!loadGame()) {
          startNewGame();
        }

        if (!tutorialCompleted) {
          set({ showTutorial: true });
        }

        // Start daily updates
        const intervalId = setInterval(
          () => get().processDailyUpdate(),
          GAME_CONFIG.DAILY_UPDATE_INTERVAL
        );
        
        // Store interval ID for cleanup if needed
        set({ gameIntervalId: intervalId });
      },

      startNewGame: () => {
        const { generateId } = get();

        const daemons = STARTER_DATA.starter_daemons.map(d => ({
          ...d,
          id: generateId(),
          assignments: [],
          equipment: null,
          isActive: true,
        }));

        const equipment = STARTER_DATA.starter_equipment.map(e => ({
          ...e,
          id: generateId(),
          assignedTo: null,
        }));

        const rooms = STARTER_DATA.apartment_rooms.map(r => ({
          ...r,
          id: generateId(),
        }));

        const planets = STARTER_DATA.planets.map(p => ({
          ...p,
          id: generateId(),
          conquered: false,
          lastMission: null,
        }));

        set({
          daemons,
          equipment,
          rooms,
          planets,
          gameStarted: true,
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

      resetToInitialState: () => {
        set(initialState);
      },

      canAfford: cost => {
        return get().resources.credits >= cost;
      },

      spendCredits: amount => {
        const { resources, canAfford } = get();
        if (canAfford(amount)) {
          set({
            resources: {
              ...resources,
              credits: resources.credits - amount,
            },
          });
          return true;
        }
        return false;
      },

      addResources: (
        credits = 0,
        soulEssence = 0,
        bureaucraticLeverage = 0,
        rawMaterials = 0
      ) => {
        const { resources } = get();
        set({
          resources: {
            credits: resources.credits + credits,
            soulEssence: resources.soulEssence + soulEssence,
            bureaucraticLeverage:
              resources.bureaucraticLeverage + bureaucraticLeverage,
            rawMaterials: resources.rawMaterials + rawMaterials,
          },
        });
      },

      recruitDaemon: daemonId => {
        const { recruitmentPool, daemons, spendCredits } = get();
        const daemon = recruitmentPool.find(d => d.id === daemonId);
        if (daemon && daemon.cost && spendCredits(daemon.cost)) {
          const newRecruitmentPool = recruitmentPool.filter(
            d => d.id !== daemonId
          );
          const newDaemon = { ...daemon };
          delete newDaemon.cost;
          newDaemon.assignments = [];
          newDaemon.equipment = null;

          set({
            recruitmentPool: newRecruitmentPool,
            daemons: [...daemons, newDaemon],
          });

          get().addNotification(
            `${daemon.name} has joined your corporate team!`,
            'success'
          );
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
        const specializations: ('Infiltration' | 'Combat' | 'Sabotage')[] = [
          'Infiltration',
          'Combat',
          'Sabotage',
        ];
        const { generateId } = get();

        const pool = [];
        for (let i = 0; i < 3; i++) {
          const daemon: Daemon & { cost: number } = {
            id: generateId(),
            name: `${DAEMON_NAMES[Math.floor(Math.random() * DAEMON_NAMES.length)]}-${Math.floor(Math.random() * 9999) + 1000}`,
            specialization:
              specializations[
                Math.floor(Math.random() * specializations.length)
              ],
            health: Math.floor(Math.random() * 30) + 70,
            morale: Math.floor(Math.random() * 40) + 50,
            lifespanDays: Math.floor(Math.random() * 40) + 20,
            quirks: DAEMON_QUIRKS.sort(() => 0.5 - Math.random()).slice(0, 2),
            cost: Math.floor(Math.random() * 100) + 100,
            assignments: [],
            equipment: null,
            isActive: true,
            generation: 1,
            bloodline:
              DAEMON_BLOODLINES[
                Math.floor(Math.random() * DAEMON_BLOODLINES.length)
              ],
            inheritedTraits: [],
            legacy: {
              successfulMissions: 0,
              planetsConquered: 0,
              equipmentCreated: 0,
              yearsServed: 0,
            },
          };
          pool.push(daemon);
        }

        set({ recruitmentPool: pool });
      },

      processDaemonDeath: daemon => {
        const {
          daemons,
          equipment,
          setShowMemorial,
          generateRecruitmentPool,
          generateId,
        } = get();

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
                history: [
                  ...e.history,
                  `Inherited from ${daemon.name} (Gen ${daemon.generation})`,
                ],
              };
            }
            return e;
          });
        }

        // Check if daemon qualifies for creating a successor
        const shouldCreateSuccessor =
          daemon.legacy.successfulMissions >= 3 ||
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
            const availableTraits = INHERITED_TRAITS.filter(
              trait => !inheritedTraits.includes(trait)
            );
            if (availableTraits.length > 0) {
              inheritedTraits.push(
                availableTraits[
                  Math.floor(Math.random() * availableTraits.length)
                ]
              );
            }
          }

          // Create successor daemon
          const successor: Daemon = {
            id: generateId(),
            name: successorName,
            specialization: daemon.specialization,
            health: Math.min(100, 80 + daemon.generation * 5), // Better health each generation
            morale: Math.min(100, 70 + daemon.generation * 3), // Better morale each generation
            lifespanDays: Math.min(80, 40 + daemon.generation * 2), // Slightly longer lifespan
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
              yearsServed: 0,
            },
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
          equipment: updatedEquipment,
        });

        // Trigger recruitment pool refresh to honor the fallen
        generateRecruitmentPool();

        setShowMemorial(true, daemon);
      },

      selectPlanetForMission: (planetId, missionType = 'conquest') => {
        const { setCurrentPlanet, setShowMissionModal } = get();
        setCurrentPlanet(planetId);
        setShowMissionModal(true);

        // Store selected mission type for execution
        set({ selectedMissionType: missionType });
      },

      executeMission: () => {
        try {
          const {
            selectedDaemons,
            currentPlanet,
            daemons,
            planets,
            equipment,
            setShowMissionModal,
            setShowMissionResults,
            clearDaemonSelection,
            setCurrentPlanet,
            processMissionConsequences,
            generateId,
            addResources,
            addNotification,
            addLegacyStory,
          } = get();

          const context: MissionExecutionContext = {
            selectedDaemons,
            currentPlanet,
            daemons,
            planets,
            equipment,
            selectedMissionType,
          };

          // Execute mission using extracted helper function
          const {
            success,
            result,
            updatedDaemons,
            updatedPlanets,
            missionInstance,
          } = executeMissionLogic(context, generateId);

          // Apply resource rewards
          addResources(
            result.rewards.credits || 0,
            result.rewards.soulEssence || 0,
            result.rewards.bureaucraticLeverage || 0,
            result.rewards.rawMaterials || 0
          );

          // Add legacy stories for mission events
          Array.from(selectedDaemons).forEach(daemonId => {
            const daemon = daemons.find(d => d.id === daemonId);
            const planet = planets.find(p => p.id === currentPlanet);
            if (daemon && planet) {
              if (success && !planet.conquered) {
                addLegacyStory(daemon.id, {
                  title: `Conquest of ${planet.name}`,
                  description: `${daemon.name} led the successful conquest of ${planet.name}, overcoming ${planet.resistance}`,
                  category: 'heroic'
                });
              }

              // Check for veteran status
              const updatedDaemon = updatedDaemons.find(d => d.id === daemon.id);
              if (updatedDaemon && updatedDaemon.legacy.successfulMissions === DAEMON_BALANCE.LEGACY_REQUIREMENTS.VETERAN_STATUS_MISSIONS) {
                addLegacyStory(daemon.id, {
                  title: 'Veteran Status Achieved',
                  description: `${daemon.name} has completed ${DAEMON_BALANCE.LEGACY_REQUIREMENTS.VETERAN_STATUS_MISSIONS} successful missions and earned veteran status`,
                  category: 'legendary'
                });
              }

              // Add failure stories occasionally
              if (!success && Math.random() < 0.3) {
                addLegacyStory(daemon.id, {
                  title: `The ${planet.name} Incident`,
                  description: `${daemon.name} faced overwhelming odds on ${planet.name} but lived to tell the tale`,
                  category: 'tragic'
                });
              }
            }
          });

          // Evaluate mission objectives and enhance rewards
          const selectedTeam = Array.from(selectedDaemons)
            .map(id => daemons.find(d => d.id === id))
            .filter(Boolean) as Daemon[];

          const finalResult = evaluateObjectives(missionInstance, result, selectedTeam, equipment);

          // Apply any additional rewards from objectives
          if (finalResult.rewards !== result.rewards) {
            const additionalRewards = {
              credits: (finalResult.rewards.credits || 0) - (result.rewards.credits || 0),
              soulEssence: (finalResult.rewards.soulEssence || 0) - (result.rewards.soulEssence || 0),
              bureaucraticLeverage: (finalResult.rewards.bureaucraticLeverage || 0) - (result.rewards.bureaucraticLeverage || 0),
              rawMaterials: (finalResult.rewards.rawMaterials || 0) - (result.rewards.rawMaterials || 0),
            };
            addResources(
              additionalRewards.credits,
              additionalRewards.soulEssence,
              additionalRewards.bureaucraticLeverage,
              additionalRewards.rawMaterials
            );
          }

          // Process mission consequences if mission failed
          if (!success && missionInstance.consequences) {
            processMissionConsequences(missionInstance.consequences);
          }

          // Update game state
          set({
            daemons: updatedDaemons,
            planets: updatedPlanets,
          });

          // Update UI
          setShowMissionModal(false);
          setShowMissionResults(true, finalResult);
          clearDaemonSelection();
          setCurrentPlanet(null);

          addNotification(
            success ? 'Mission successful!' : 'Mission failed',
            success ? 'success' : 'error'
          );
        } catch (error) {
          console.error('Mission execution error:', error);
          get().addNotification(
            'Mission execution failed due to an error',
            'error'
          );
        }
      },

      upgradeRoom: roomId => {
        const { rooms, spendCredits } = get();
        const room = rooms.find(r => r.id === roomId);
        if (!room || !spendCredits(room.upgrade_cost)) return;

        const updatedRooms = rooms.map(r => {
          if (r.id === roomId) {
            return {
              ...r,
              level: r.level + 1,
              upgrade_cost: Math.floor(r.upgrade_cost * 1.5),
            };
          }
          return r;
        });

        set({ rooms: updatedRooms });
        get().addNotification(`${room.name} upgraded successfully!`, 'success');

        // Recalculate synergy bonuses after upgrade
        get().calculateRoomSynergyBonuses();
      },

      assignDaemonToRoom: (daemonId: string, roomId: string) => {
        const { rooms, daemons } = get();
        const room = rooms.find(r => r.id === roomId);
        const daemon = daemons.find(d => d.id === daemonId);

        if (!room || !daemon || !room.unlocked) return;

        // Check if room has space
        if (room.assignedDaemons.length >= room.maxAssignments) {
          get().addNotification(`${room.name} is at capacity`, 'warning');
          return;
        }

        // Remove daemon from any other rooms first
        const updatedRooms = rooms.map(r => ({
          ...r,
          assignedDaemons: r.assignedDaemons.filter(id => id !== daemonId)
        }));

        // Add daemon to target room
        const finalRooms = updatedRooms.map(r =>
          r.id === roomId
            ? { ...r, assignedDaemons: [...r.assignedDaemons, daemonId] }
            : r
        );

        set({ rooms: finalRooms });
        get().addNotification(`${daemon.name} assigned to ${room.name}`, 'success');
        get().calculateRoomSynergyBonuses();
      },

      unassignDaemonFromRoom: (daemonId: string, roomId: string) => {
        const { rooms, daemons } = get();
        const daemon = daemons.find(d => d.id === daemonId);

        const updatedRooms = rooms.map(r =>
          r.id === roomId
            ? { ...r, assignedDaemons: r.assignedDaemons.filter(id => id !== daemonId) }
            : r
        );

        set({ rooms: updatedRooms });
        if (daemon) {
          get().addNotification(`${daemon.name} unassigned from room`, 'info');
        }
        get().calculateRoomSynergyBonuses();
      },

      calculateRoomSynergyBonuses: () => {
        const { rooms, gameModifiers } = get();
        const newModifiers = { ...gameModifiers };

        // Reset room-based bonuses
        newModifiers.roomSynergyBonus = 0;
        newModifiers.missionSuccessBonus = Math.max(0, newModifiers.missionSuccessBonus - (newModifiers.roomSynergyMissionBonus || 0));
        newModifiers.roomSynergyMissionBonus = 0;

        // Calculate synergy bonuses
        rooms.forEach(room => {
          if (room.synergyBonuses && room.level > 0) {
            room.synergyBonuses.forEach(synergy => {
              // Check if required rooms meet minimum level
              const requiredRoomLevels = synergy.requiredRooms.map(roomName => {
                const reqRoom = rooms.find(r => r.name === roomName);
                return reqRoom ? reqRoom.level : 0;
              });

              const totalRequiredLevel = requiredRoomLevels.reduce((sum, level) => sum + level, 0);

              if (totalRequiredLevel >= synergy.minLevel) {
                // Apply synergy bonus
                switch (synergy.effect.type) {
                  case 'mission_success_bonus':
                  case 'elite_operations_bonus':
                    newModifiers.roomSynergyMissionBonus = (newModifiers.roomSynergyMissionBonus || 0) + synergy.effect.value;
                    break;
                  case 'morale_health_bonus':
                  case 'health_recovery_bonus':
                  case 'combat_training_bonus':
                    newModifiers.roomSynergyBonus = (newModifiers.roomSynergyBonus || 0) + synergy.effect.value;
                    break;
                }
              }
            });
          }
        });

        // Apply accumulated mission bonuses
        newModifiers.missionSuccessBonus += newModifiers.roomSynergyMissionBonus || 0;

        set({ gameModifiers: newModifiers });
      },

      unlockRoom: (roomId: string) => {
        const { rooms } = get();
        const updatedRooms = rooms.map(room =>
          room.id === roomId ? { ...room, unlocked: true } : room
        );

        const room = rooms.find(r => r.id === roomId);
        if (room) {
          set({ rooms: updatedRooms });
          get().addNotification(`${room.name} is now available!`, 'success');
        }
      },

      repairEquipment: equipmentId => {
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
          get().addNotification(
            `${equip.name} repaired successfully!`,
            'success'
          );
        }
      },

      craftItem: itemType => {
        const { equipment, resources, spendCredits, addResources, generateId } =
          get();

        const recipes = {
          briefcase: {
            cost: 100,
            materials: 0,
            name: 'Standard Issue Briefcase',
            type: 'Infiltration' as const,
            ability: 'Blend In (+15 stealth)',
          },
          tie: {
            cost: 75,
            materials: 0,
            name: 'Corporate Tie of Binding',
            type: 'Combat' as const,
            ability: 'Intimidate (+10 combat)',
          },
          calculator: {
            cost: 125,
            materials: 1,
            name: 'Cursed Calculator',
            type: 'Sabotage' as const,
            ability: 'Data Corruption (+20 sabotage)',
          },
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
            history: ['Newly crafted'],
          };

          set({ equipment: [...equipment, newEquipment] });
          get().addNotification(
            `${recipe.name} crafted successfully!`,
            'success'
          );
        }
      },

      triggerRandomEvent: () => {
        const { generateId, setShowEventModal } = get();

        // Select a random event from the new corporate events
        const randomEvent =
          CORPORATE_EVENTS[Math.floor(Math.random() * CORPORATE_EVENTS.length)];

        const eventInstance: CorporateEvent = {
          id: generateId(),
          title: randomEvent.title,
          description: randomEvent.description,
          type: randomEvent.type,
          timestamp: Date.now(),
          resolved: false,
          effects:
            randomEvent.type === 'automatic' ? randomEvent.effects : undefined,
          choices:
            randomEvent.type === 'choice' ? randomEvent.choices : undefined,
          requirements: randomEvent.requirements,
        };

        // Add to events log
        set(state => ({
          corporateEvents: [...state.corporateEvents, eventInstance],
        }));

        // Show the event modal for player interaction
        setShowEventModal(true, eventInstance);

        get().addNotification(
          `Corporate Event: ${randomEvent.title}`,
          'warning'
        );
      },

      resolveEvent: (eventId, choiceIndex) => {
        const {
          corporateEvents,
          daemons,
          equipment,
          resources,
          gameModifiers,
        } = get();
        const event = corporateEvents.find(e => e.id === eventId);

        if (!event) return;

        let effectsToApply = event.effects || [];

        // If it's a choice event, get the effects from the chosen option
        if (
          event.type === 'choice' &&
          event.choices &&
          choiceIndex !== undefined
        ) {
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
                d.isActive
                  ? {
                      ...d,
                      morale: Math.max(
                        0,
                        Math.min(100, d.morale + effect.value)
                      ),
                    }
                  : d
              );
              break;
            case 'equipment_durability':
              updatedEquipment = updatedEquipment.map(e => ({
                ...e,
                durability: Math.max(
                  0,
                  Math.min(100, e.durability + effect.value)
                ),
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
                const randomDaemon =
                  activeDaemons[
                    Math.floor(Math.random() * activeDaemons.length)
                  ];
                updatedDaemons = updatedDaemons.map(d =>
                  d.id === randomDaemon.id
                    ? { ...d, isActive: false, lifespanDays: 0 }
                    : d
                );
                get().addNotification(
                  `${randomDaemon.name} has been transferred to another department`,
                  'info'
                );
              }
              break;
            }
            case 'equipment_upgrade': {
              // Upgrade random equipment
              const repairableEquipment = updatedEquipment.filter(
                e => e.durability < 100
              );
              if (repairableEquipment.length > 0) {
                const randomEquip =
                  repairableEquipment[
                    Math.floor(Math.random() * repairableEquipment.length)
                  ];
                updatedEquipment = updatedEquipment.map(e =>
                  e.id === randomEquip.id
                    ? { ...e, durability: Math.min(100, e.durability + 20) }
                    : e
                );
              }
              break;
            }

            // Hostile takeover defense mechanics
            case 'takeover_defense':
              updatedModifiers.takeoverDefense = Math.min(100, updatedModifiers.takeoverDefense + effect.value);
              break;

            case 'rival_defeat':
              // Defeat a random threatening rival
              set(state => ({
                corporateRivals: state.corporateRivals.map(rival =>
                  rival.relationshipWithPlayer < -30 && !rival.defeated
                    ? { ...rival, defeated: true }
                    : rival
                )
              }));
              break;

            case 'takeover_immunity':
              updatedModifiers.takeoverDefense = 100; // Temporary maximum protection
              break;

            case 'board_loyalty':
              updatedModifiers.boardLoyalty = Math.min(100, Math.max(0, updatedModifiers.boardLoyalty + effect.value));
              break;

            case 'corporate_control':
              updatedModifiers.corporateControl = Math.min(100, Math.max(0, updatedModifiers.corporateControl + effect.value));
              break;

            case 'espionage_immunity':
              updatedModifiers.espionageImmunity = effect.value; // Days of protection
              break;

            case 'regulatory_favor':
              updatedModifiers.regulatoryFavor = Math.min(100, Math.max(0, updatedModifiers.regulatoryFavor + effect.value));
              break;

            case 'daemon_sacrifice': {
              // Remove a daemon for regulatory/legal reasons
              const activeDaemons = updatedDaemons.filter(d => d.isActive);
              if (activeDaemons.length > 0) {
                const sacrificeDaemon = activeDaemons[Math.floor(Math.random() * activeDaemons.length)];
                updatedDaemons = updatedDaemons.filter(d => d.id !== sacrificeDaemon.id);
                get().addNotification(`${sacrificeDaemon.name} was sacrificed to authorities`, 'warning');
              }
              break;
            }

            case 'reputation':
              set(state => ({
                reputation: Math.max(0, Math.min(100, state.reputation + effect.value))
              }));
              break;
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
          corporateEvents: updatedEvents,
        });
      },

      processDailyUpdate: () => {
        const {
          daemons,
          rooms,
          gameStarted,
          daysPassed,
          gameModifiers,
          addResources,
          checkPromotion,
          processComplianceDeadlines,
          generateComplianceTask,
          corporateTier,
        } = get();

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
            newMorale = Math.min(100, newMorale + livingQuarters.level * 5);
          }

          const recoveryWard = rooms.find(r => r.name === 'Recovery Ward');
          if (recoveryWard && recoveryWard.level > 0 && daemon.health < 100) {
            let healthBonus = recoveryWard.level * 15;

            // Apply room assignment bonus
            if (recoveryWard.assignedDaemons.includes(daemon.id)) {
              healthBonus += 10; // Extra healing for assigned daemons
            }

            // Apply synergy bonus
            healthBonus += gameModifiers.roomSynergyBonus || 0;

            newHealth = Math.min(100, newHealth + healthBonus);
          }

          // Training Hall bonuses for assigned daemons
          const trainingHall = rooms.find(r => r.name === 'Training Hall');
          if (trainingHall && trainingHall.level > 0 && trainingHall.assignedDaemons.includes(daemon.id)) {
            // Gradual skill improvement for daemons in training
            if (daemon.specialization === 'Combat' || !trainingHall.specialization || trainingHall.specialization === daemon.specialization) {
              // Slight health and morale boost from training
              newHealth = Math.min(100, newHealth + 5);
              newMorale = Math.min(100, newMorale + 3);
            }
          }

          // War Room strategic planning bonuses
          const warRoom = rooms.find(r => r.name === 'War Room');
          if (warRoom && warRoom.level > 0 && warRoom.assignedDaemons.includes(daemon.id)) {
            if (daemon.specialization === 'Infiltration' || !warRoom.specialization || warRoom.specialization === daemon.specialization) {
              newMorale = Math.min(100, newMorale + 7); // Strategic planning boosts confidence
            }
          }

          return {
            ...daemon,
            lifespanDays: newLifespan,
            morale: newMorale,
            health: newHealth,
          };
        });

        // Decay temporary modifiers
        const updatedModifiers = {
          ...gameModifiers,
          productivityBonusRemainingMissions: Math.max(
            0,
            gameModifiers.productivityBonusRemainingMissions - 1
          ),
          productivityBonus:
            gameModifiers.productivityBonusRemainingMissions <= 1
              ? 0
              : gameModifiers.productivityBonus,
          hrInvestigation: Math.max(0, gameModifiers.hrInvestigation - 0.5),
        };

        set({
          daemons: updatedDaemons,
          daysPassed: newDaysPassed,
          gameModifiers: updatedModifiers,
        });

        // Check for promotion eligibility
        checkPromotion();

        // Process compliance deadlines
        processComplianceDeadlines();

        // Random compliance task generation (higher chance for higher tiers)
        if (Math.random() < (0.05 + corporateTier.level * 0.02)) {
          generateComplianceTask();
        }

        // Random corporate events (8% chance per day, increased from 5%)
        if (Math.random() < 0.08) {
          get().triggerRandomEvent();
        }

        // Random surreal events (3% chance, scales with tier)
        if (Math.random() < (0.03 + corporateTier.level * 0.01)) {
          get().triggerSurrealEvent();
        }

        // Generate procedural missions (2% base chance, increases with conquered territory)
        const conqueredCount = planets.filter(p => p.conquered).length;
        if (Math.random() < (0.02 + conqueredCount * 0.01)) {
          get().generateProceduralMissions();
        }

        // Process rival corporation AI (every day)
        get().processRivalAI();

        // Check for hostile takeover threats (based on vulnerability)
        get().checkTakeoverThreats();

        // Check for endgame triggers (only at Board Member tier or after significant milestones)
        if (corporateTier.level >= 5 || daysPassed >= 200) {
          const { calculateManagementStyle, triggerEnding, endgameState } = get();
          
          if (!endgameState.endingAchieved) {
            // Trigger ending based on various conditions
            const managementStyle = calculateManagementStyle();
            const activeDaemons = daemons.filter(d => d.isActive);
            const burnoutDaemons = activeDaemons.filter(d => d.health < 20).length;
            
            // Burnout collapse ending (high priority)
            if (burnoutDaemons >= 3 || (activeDaemons.length === 0 && daysPassed > 50)) {
              triggerEnding('collapse');
            }
            // Board Member tier with specific conditions
            else if (corporateTier.level >= 5) {
              // Random chance to trigger ending after reaching Board Member
              if (Math.random() < 0.05) { // 5% chance per day
                triggerEnding(managementStyle);
              }
            }
            // Extended play ending (200+ days)
            else if (daysPassed >= 200) {
              if (Math.random() < 0.1) { // 10% chance per day after 200 days
                triggerEnding(managementStyle);
              }
            }
          }
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
          duration: GAME_CONFIG.NOTIFICATION_DEFAULT_DURATION,
        };

        set({
          notifications: [...notifications, notification],
        });

        // Auto-remove notification after duration
        setTimeout(() => {
          set(state => ({
            notifications: state.notifications.filter(
              n => n.id !== notification.id
            ),
          }));
        }, notification.duration);
      },

      // Corporate Progression System
      checkPromotion: () => {
        const { corporateTier, meetsRequirements, promotePlayer } = get();
        const nextTier = CORPORATE_TIERS[corporateTier.level];
        
        if (nextTier && meetsRequirements(nextTier.requirements)) {
          promotePlayer(nextTier);
        }
      },

      promotePlayer: (newTier: CorporateTier) => {
        const { unlockTierFeatures, addNotification } = get();
        set({ corporateTier: newTier });
        unlockTierFeatures(newTier);
        addNotification(`Promoted to ${newTier.name}!`, 'success');
      },

      meetsRequirements: (requirements: CorporateTier['requirements']) => {
        const { planets, daysPassed, legacyBook, corporateRivals, promotionProgress } = get();
        
        const conqueredPlanets = planets.filter(p => p.conquered).length;
        const maxGeneration = Math.max(0, ...Object.values(legacyBook).map(l => l.generation));
        const defeatedRivals = corporateRivals.filter(r => r.defeated).length;
        const completedHRReviews = promotionProgress.hrReviews || 0;
        const complianceAudits = promotionProgress.complianceAudits || 0;

        return (
          (!requirements.planetsControlled || conqueredPlanets >= requirements.planetsControlled) &&
          (!requirements.daysLived || daysPassed >= requirements.daysLived) &&
          (!requirements.legacyGenerations || maxGeneration >= requirements.legacyGenerations) &&
          (!requirements.defeatedRivals || defeatedRivals >= requirements.defeatedRivals) &&
          (!requirements.complianceAudits || complianceAudits >= requirements.complianceAudits) &&
          (!requirements.completedHRReviews || completedHRReviews >= requirements.completedHRReviews)
        );
      },

      unlockTierFeatures: (tier: CorporateTier) => {
        const { addNotification, unlockRoom, rooms } = get();

        // Unlock new mechanics, rooms, resources based on tier
        tier.unlocks.mechanics?.forEach(mechanic => {
          addNotification(`New mechanic unlocked: ${mechanic}`, 'info');
        });

        // Unlock specific rooms based on tier
        if (tier.level >= 2) {
          // Manager tier unlocks War Room
          const warRoom = rooms.find(r => r.name === 'War Room');
          if (warRoom && !warRoom.unlocked) {
            unlockRoom(warRoom.id);
          }
        }

        if (tier.level >= 3) {
          // Director tier unlocks expanded facilities
          const expandedRooms = rooms.filter(r =>
            ['Training Hall', 'Recovery Ward'].includes(r.name) && !r.unlocked
          );
          expandedRooms.forEach(room => {
            if (!room.unlocked) unlockRoom(room.id);
          });
        }

        tier.unlocks.apartmentRooms?.forEach(roomName => {
          const room = rooms.find(r => r.name === roomName);
          if (room && !room.unlocked) {
            unlockRoom(room.id);
          }
        });

        tier.unlocks.resources?.forEach(resource => {
          addNotification(`New resource type unlocked: ${resource}`, 'info');
        });

        // Recalculate synergy bonuses after unlocking new rooms
        get().calculateRoomSynergyBonuses();
      },

      // Compliance System
      generateComplianceTask: () => {
        const { generateId, corporateTier } = get();
        
        // Higher tiers get more complex compliance tasks
        const availableTemplates = COMPLIANCE_TEMPLATES.filter(() => 
          Math.random() < (0.3 + corporateTier.level * 0.1)
        );
        
        if (availableTemplates.length === 0) return;
        
        const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
        const deadline = get().daysPassed + template.deadline;
        
        const task: ComplianceTask = {
          ...template,
          id: generateId(),
          deadline,
          completed: false
        };

        set(state => ({
          complianceTasks: [...state.complianceTasks, task],
          complianceDeadlines: { ...state.complianceDeadlines, [task.id]: deadline }
        }));

        get().addNotification(`New compliance task: ${task.title}`, 'warning');
      },

      processComplianceDeadlines: () => {
        const { complianceTasks, daysPassed, applyCompliancePenalties } = get();
        
        complianceTasks.forEach(task => {
          if (daysPassed >= task.deadline && !task.completed) {
            applyCompliancePenalties(task);
            // Mark as completed to avoid repeated penalties
            set(state => ({
              complianceTasks: state.complianceTasks.map(t => 
                t.id === task.id ? { ...t, completed: true } : t
              )
            }));
          }
        });
      },

      applyCompliancePenalties: (task: ComplianceTask) => {
        const { daemons, resources, addNotification } = get();
        
        // Apply morale loss
        if (task.penalties.moraleLoss) {
          const updatedDaemons = daemons.map(daemon => ({
            ...daemon,
            morale: Math.max(0, daemon.morale - task.penalties.moraleLoss!)
          }));
          set({ daemons: updatedDaemons });
        }

        // Apply resource fines
        if (task.penalties.resourceFines) {
          const updatedResources = { ...resources };
          Object.entries(task.penalties.resourceFines).forEach(([resource, amount]) => {
            const resourceKey = resource as keyof typeof updatedResources;
            if (amount && resourceKey in updatedResources) {
              updatedResources[resourceKey] = Math.max(0, updatedResources[resourceKey] - (amount as number));
            }
          });
          set({ resources: updatedResources });
        }

        // Apply daemon reassignment
        if (task.penalties.daemonReassignment && daemons.length > 0) {
          const randomDaemon = daemons[Math.floor(Math.random() * daemons.length)];
          get().processDaemonDeath(randomDaemon);
        }

        addNotification(`Compliance penalty applied for: ${task.title}`, 'error');
      },

      completeComplianceTask: (taskId: string) => {
        set(state => ({
          complianceTasks: state.complianceTasks.map(task => 
            task.id === taskId ? { ...task, completed: true } : task
          )
        }));
        
        // Update promotion progress
        set(state => ({
          promotionProgress: {
            ...state.promotionProgress,
            complianceAudits: (state.promotionProgress.complianceAudits || 0) + 1
          }
        }));

        get().addNotification('Compliance task completed successfully!', 'success');
      },

      // Legacy System
      addLegacyStory: (daemonId: string, story: Omit<LegacyStory, 'id' | 'timestamp'>) => {
        const { legacyBook, hallOfInfamy, generateId, daemons, createNewLegacy } = get();
        const daemon = daemons.find(d => d.id === daemonId);
        
        if (daemon && daemon.bloodline) {
          const newStory: LegacyStory = {
            id: generateId(),
            timestamp: Date.now(),
            ...story
          };
          
          const bloodlineLegacy = legacyBook[daemon.bloodline] || createNewLegacy(daemon);
          bloodlineLegacy.stories.push(newStory);
          
          set({
            legacyBook: { ...legacyBook, [daemon.bloodline]: bloodlineLegacy },
            hallOfInfamy: [...hallOfInfamy, newStory]
          });
        }
      },

      generateLegacyLegend: (bloodline: string) => {
        const { legacyBook } = get();
        const legacy = legacyBook[bloodline];
        
        if (legacy && legacy.stories.length >= 5) {
          // Create a legend based on the stories
          const legend = {
            name: `Legend of ${bloodline}`,
            description: `A legendary tale born from ${legacy.stories.length} epic stories`,
            effects: [
              {
                type: 'bloodline_bonus',
                value: legacy.stories.length * 2,
                applies_to: 'bloodline' as const
              }
            ]
          };
          
          legacy.legends.push(legend);
          set(state => ({
            legacyBook: { ...state.legacyBook, [bloodline]: legacy }
          }));
        }
      },

      createNewLegacy: (daemon: Daemon): DaemonLegacy => {
        return {
          daemonId: daemon.id,
          bloodline: daemon.bloodline || 'Unknown House',
          generation: daemon.generation,
          stories: [],
          legends: [],
          achievements: []
        };
      },

      // Surreal Events System
      triggerSurrealEvent: () => {
        const { corporateTier, showEventWithEscalatedAbsurdity } = get();
        const tierEvents = SURREAL_EVENTS[corporateTier.name.toUpperCase() as keyof typeof SURREAL_EVENTS] || [];
        
        if (tierEvents.length > 0) {
          const event = tierEvents[Math.floor(Math.random() * tierEvents.length)];
          showEventWithEscalatedAbsurdity(event, corporateTier.level);
        }
      },

      showEventWithEscalatedAbsurdity: (event: SurrealEvent, tierLevel: number) => {
        const { setShowEventModal, generateId } = get();
        
        // Scale absurdity based on corporate tier
        const escalatedEvent = {
          ...event,
          description: `${event.description} ${tierLevel > 2 ? '(Corporate bureaucracy intensifies...)' : ''}`,
          effects: event.effects?.map(effect => ({
            ...effect,
            value: Math.floor(effect.value * (1 + tierLevel * 0.3))
          }))
        };
        
        // Convert to CorporateEvent format for existing modal
        const corporateEvent: CorporateEvent = {
          id: generateId(),
          title: escalatedEvent.title,
          description: escalatedEvent.description,
          type: escalatedEvent.type,
          timestamp: Date.now(),
          resolved: false,
          effects: escalatedEvent.effects,
          choices: escalatedEvent.choices
        };

        set(state => ({
          corporateEvents: [...state.corporateEvents, corporateEvent]
        }));

        setShowEventModal(true, corporateEvent);
      },

      // Corporate Rivals System
      calculateRivalSuccessChance: (rivalId: string) => {
        const { corporateRivals, daemons, corporateTier, resources } = get();
        const rival = corporateRivals.find(r => r.id === rivalId);
        if (!rival || rival.defeated) return 0;

        const activeDaemons = daemons.filter(d => d.isActive);
        const teamStrength = activeDaemons.reduce((sum, d) => sum + d.health + d.morale, 0);
        const corporatePower = corporateTier.level * 20; // Tier level bonus
        const resourceAdvantage = Math.min(resources.bureaucraticLeverage * 5, 50); // Max 50 bonus
        
        const playerStrength = teamStrength + corporatePower + resourceAdvantage;
        const successChance = Math.min(Math.max(playerStrength / (rival.strength * 2), 0.1), 0.9);
        
        return successChance;
      },

      engageRival: (rivalId: string) => {
        const { 
          calculateRivalSuccessChance, 
          defeatRival, 
          addNotification,
          spendCredits,
          addResources,
          daemons
        } = get();
        
        const successChance = calculateRivalSuccessChance(rivalId);
        const success = Math.random() < successChance;
        const rival = get().corporateRivals.find(r => r.id === rivalId);
        
        if (!rival) return;

        if (success) {
          defeatRival(rivalId);
          // Rewards for victory
          const rewards = {
            credits: 500 + rival.strength * 5,
            soulEssence: 2,
            bureaucraticLeverage: 3
          };
          addResources(rewards.credits, rewards.soulEssence, rewards.bureaucraticLeverage);
          addNotification(`Victory! ${rival.name} has been absorbed into your corporate empire!`, 'success');
        } else {
          // Penalties for failure
          const penalties = {
            credits: 200,
            bureaucraticLeverage: 1
          };
          spendCredits(penalties.credits);
          if (get().resources.bureaucraticLeverage > 0) {
            addResources(0, 0, -penalties.bureaucraticLeverage);
          }
          
          // Damage active daemons
          const activeDaemons = daemons.filter(d => d.isActive);
          activeDaemons.forEach(daemon => {
            const healthLoss = Math.floor(Math.random() * 20) + 10;
            const moraleLoss = Math.floor(Math.random() * 15) + 5;
            
            set(state => ({
              daemons: state.daemons.map(d => 
                d.id === daemon.id 
                  ? { 
                      ...d, 
                      health: Math.max(d.health - healthLoss, 1),
                      morale: Math.max(d.morale - moraleLoss, 0)
                    }
                  : d
              )
            }));
          });
          
          addNotification(`Defeat! ${rival.name} has outmaneuvered your corporate strategy.`, 'error');
        }
      },

      defeatRival: (rivalId: string) => {
        set(state => ({
          corporateRivals: state.corporateRivals.map(rival =>
            rival.id === rivalId ? { ...rival, defeated: true } : rival
          )
        }));
        
        // Update promotion progress
        set(state => ({
          promotionProgress: {
            ...state.promotionProgress,
            defeatedRivals: (state.promotionProgress.defeatedRivals || 0) + 1
          }
        }));
        
        get().checkPromotion();
      },

      // Enhanced Rival AI System
      processRivalAI: () => {
        const { corporateRivals, daysPassed, planets } = get();

        corporateRivals.forEach(rival => {
          if (rival.defeated) return;

          // Update rival resources based on owned planets
          const resourceGrowth = Math.floor(rival.ownedPlanets.length * 100 + Math.random() * 200);
          rival.resources.credits += resourceGrowth;
          rival.resources.influence = Math.min(100, rival.resources.influence + Math.random() * 5);

          // Process active operations
          rival.activeOperations.forEach((operation, index) => {
            operation.duration--;

            if (operation.duration <= 0) {
              // Execute operation
              get().executeRivalOperation(rival.id, operation);

              // Remove completed operation
              rival.activeOperations.splice(index, 1);
            }
          });

          // Consider new operations if not at capacity
          if (rival.activeOperations.length < 3 && daysPassed - rival.lastActionDay >= 2) {
            const newOperation = get().generateRivalOperation(rival.id);
            if (newOperation) {
              rival.activeOperations.push(newOperation);
              rival.lastActionDay = daysPassed;
            }
          }

          // Update strategy periodically
          rival.currentStrategy.duration--;
          if (rival.currentStrategy.duration <= 0 || Math.random() < 0.1) {
            get().updateRivalStrategy(rival.id);
          }

          // React to player actions
          if (rival.aiPersonality.adaptability > 70) {
            const playerTerritoryCount = planets.filter(p => p.conquered).length;
            if (playerTerritoryCount > rival.ownedPlanets.length && rival.relationshipWithPlayer > -50) {
              rival.relationshipWithPlayer = Math.max(-100, rival.relationshipWithPlayer - 15);
              if (rival.currentStrategy.type !== 'aggressive_expansion') {
                get().updateRivalStrategy(rival.id);
              }
            }
          }
        });

        set({ corporateRivals });
      },

      generateRivalOperation: (rivalId: string): RivalOperation | null => {
        const { corporateRivals, planets, generateId } = get();
        const rival = corporateRivals.find(r => r.id === rivalId);
        if (!rival || rival.defeated) return null;

        const availableTargets = planets.filter(p => !rival.ownedPlanets.includes(p.id));
        if (availableTargets.length === 0) return null;

        // Choose operation type based on AI personality and strategy
        let operationType: RivalOperation['type'] = 'espionage';

        if (rival.currentStrategy.type === 'aggressive_expansion' && rival.aiPersonality.aggression > 60) {
          operationType = Math.random() < 0.6 ? 'planet_attack' : 'sabotage';
        } else if (rival.currentStrategy.type === 'shadow_operations' && rival.aiPersonality.cunning > 70) {
          operationType = Math.random() < 0.7 ? 'espionage' : 'sabotage';
        } else if (rival.currentStrategy.type === 'diplomatic_manipulation') {
          operationType = Math.random() < 0.5 ? 'alliance_formation' : 'trade_manipulation';
        } else if (rival.currentStrategy.targetPlayer && rival.relationshipWithPlayer < -30) {
          operationType = Math.random() < 0.4 ? 'sabotage' : 'counter_intelligence';
        }

        const targetId = rival.currentStrategy.targetPlayer ? 'player' :
                         availableTargets[Math.floor(Math.random() * availableTargets.length)].id;

        const operation: RivalOperation = {
          id: generateId(),
          type: operationType,
          targetId,
          duration: Math.floor(Math.random() * 5) + 3, // 3-7 days
          successChance: Math.min(90, rival.strength + rival.aiPersonality.cunning - Math.random() * 30),
          consequences: {
            success: get().generateOperationEffects(operationType, targetId, true),
            failure: get().generateOperationEffects(operationType, targetId, false)
          }
        };

        return operation;
      },

      generateOperationEffects: (operationType: string, targetId: string, success: boolean): RivalOperationEffect[] => {
        const effects: RivalOperationEffect[] = [];
        const magnitude = success ? 1 : -0.5;

        switch (operationType) {
          case 'espionage':
            effects.push({
              type: 'intelligence_gain',
              target: 'rival',
              value: magnitude * 20,
              description: success ? 'Gained valuable intelligence' : 'Operation compromised'
            });
            if (targetId === 'player') {
              effects.push({
                type: 'reputation_loss',
                target: 'player',
                value: magnitude * -10,
                description: success ? 'Corporate secrets leaked' : 'Espionage attempt failed'
              });
            }
            break;

          case 'sabotage':
            if (targetId === 'player') {
              effects.push({
                type: 'equipment_damage',
                target: 'player',
                value: magnitude * -15,
                description: success ? 'Equipment sabotaged' : 'Sabotage attempt detected'
              });
            } else {
              effects.push({
                type: 'planet_stability',
                target: 'planet',
                value: magnitude * -20,
                description: success ? 'Planet destabilized' : 'Sabotage operation failed'
              });
            }
            break;

          case 'planet_attack':
            effects.push({
              type: 'planet_control',
              target: 'rival',
              value: success ? 1 : 0,
              description: success ? 'Planet conquered by rival' : 'Attack repelled'
            });
            break;

          case 'trade_manipulation':
            effects.push({
              type: 'credit_loss',
              target: 'player',
              value: magnitude * -200,
              description: success ? 'Trade routes disrupted' : 'Market manipulation failed'
            });
            break;

          case 'counter_intelligence':
            effects.push({
              type: 'mission_difficulty',
              target: 'player',
              value: magnitude * 10,
              description: success ? 'Player operations compromised' : 'Counter-intelligence thwarted'
            });
            break;
        }

        return effects;
      },

      executeRivalOperation: (rivalId: string, operation: RivalOperation) => {
        const { corporateRivals, addNotification, equipment } = get();
        const rival = corporateRivals.find(r => r.id === rivalId);
        if (!rival) return;

        const success = Math.random() * 100 < operation.successChance;
        const effects = success ? operation.consequences.success : operation.consequences.failure;

        effects.forEach(effect => {
          switch (effect.type) {
            case 'intelligence_gain':
              rival.resources.intelligence = Math.min(100, rival.resources.intelligence + effect.value);
              break;

            case 'reputation_loss':
              set(state => ({
                reputation: Math.max(0, Math.min(100, state.reputation + effect.value))
              }));
              break;

            case 'equipment_damage': {
              const randomEquipment = equipment.filter(e => e.durability > 50);
              if (randomEquipment.length > 0) {
                const targetEquip = randomEquipment[Math.floor(Math.random() * randomEquipment.length)];
                set(state => ({
                  equipment: state.equipment.map(e =>
                    e.id === targetEquip.id
                      ? { ...e, durability: Math.max(10, e.durability + effect.value) }
                      : e
                  )
                }));
              }
              break;
            }

            case 'planet_stability':
              if (operation.targetId !== 'player') {
                set(state => ({
                  planets: state.planets.map(p =>
                    p.id === operation.targetId
                      ? {
                          ...p,
                          stability: Math.max(0, Math.min(100, (p.stability || 50) + effect.value))
                        }
                      : p
                  )
                }));
              }
              break;

            case 'planet_control':
              if (success && operation.targetId !== 'player') {
                rival.ownedPlanets.push(operation.targetId);
              }
              break;

            case 'credit_loss':
              set(state => ({
                resources: {
                  ...state.resources,
                  credits: Math.max(0, state.resources.credits + effect.value)
                }
              }));
              break;
          }
        });

        // Update relationship based on operation outcome
        if (operation.targetId === 'player') {
          rival.relationshipWithPlayer += success ? -5 : 3;
          rival.relationshipWithPlayer = Math.max(-100, Math.min(100, rival.relationshipWithPlayer));
        }

        addNotification(
          `${rival.name}: ${success ? 'successful' : 'failed'} ${operation.type.replace('_', ' ')} operation`,
          success ? 'warning' : 'info'
        );

        set({ corporateRivals });
      },

      updateRivalStrategy: (rivalId: string) => {
        const { corporateRivals, planets, resources } = get();
        const rival = corporateRivals.find(r => r.id === rivalId);
        if (!rival) return;

        // Choose strategy based on personality and current game state
        let preferredStrategy: RivalStrategy['type'] = 'defensive_consolidation';

        if (rival.aiPersonality.ambition > 70 && rival.resources.credits > 3000) {
          preferredStrategy = 'aggressive_expansion';
        } else if (rival.aiPersonality.cunning > 80) {
          preferredStrategy = 'shadow_operations';
        } else if (rival.resources.influence > 60) {
          preferredStrategy = 'diplomatic_manipulation';
        } else if (rival.ownedPlanets.length > 0 && rival.relationshipWithPlayer < -50) {
          preferredStrategy = 'defensive_consolidation';
        }

        const playerThreatLevel = planets.filter(p => p.conquered).length + (resources.bureaucraticLeverage / 10);

        rival.currentStrategy = {
          type: preferredStrategy,
          priority: Math.floor(rival.aiPersonality.ambition / 10) + Math.floor(Math.random() * 3),
          duration: 10 + Math.floor(Math.random() * 15),
          targetPlayer: rival.relationshipWithPlayer < -30 || playerThreatLevel > rival.ownedPlanets.length + 2,
          targetPlanets: preferredStrategy === 'aggressive_expansion' ?
            planets.filter(p => !p.conquered && !rival.ownedPlanets.includes(p.id))
              .slice(0, 2).map(p => p.id) : undefined
        };

        set({ corporateRivals });
      },

      checkTakeoverThreats: () => {
        const { corporateRivals, gameModifiers, resources, corporateTier, daysPassed } = get();

        // Calculate vulnerability score
        const activeRivals = corporateRivals.filter(r => !r.defeated);
        const hostileRivals = activeRivals.filter(r => r.relationshipWithPlayer < -40);

        let vulnerabilityScore = 0;

        // Low bureaucratic leverage increases vulnerability
        if (resources.bureaucraticLeverage < 5) vulnerabilityScore += 20;

        // Low board loyalty increases vulnerability
        if (gameModifiers.boardLoyalty < 40) vulnerabilityScore += 15;

        // Strong rivals increase threat
        vulnerabilityScore += hostileRivals.length * 10;

        // Low takeover defense increases vulnerability
        if (gameModifiers.takeoverDefense < 25) vulnerabilityScore += 15;

        // High corporate control reduces vulnerability
        if (gameModifiers.corporateControl > 70) vulnerabilityScore -= 20;

        // Directors and above face more sophisticated threats
        if (corporateTier.level >= 3) vulnerabilityScore += 10;

        // Check if takeover event should trigger
        const takoverChance = Math.min(0.08, vulnerabilityScore / 500);

        if (Math.random() < takoverChance && daysPassed > 15) {
          // Trigger hostile takeover event
          const takeoverEvents = ['hostile_takeover_threat', 'board_coup_attempt', 'corporate_espionage_discovery', 'insider_trading_allegation'];
          const selectedEvent = takeoverEvents[Math.floor(Math.random() * takeoverEvents.length)];

          // Find the event data
          const eventData = CORPORATE_EVENTS.find(e => e.id === selectedEvent);
          if (eventData) {
            get().triggerCorporateEvent(eventData);
          }
        }

        // Decay defensive bonuses over time
        if (gameModifiers.espionageImmunity > 0) {
          set(state => ({
            gameModifiers: {
              ...state.gameModifiers,
              espionageImmunity: Math.max(0, state.gameModifiers.espionageImmunity - 1)
            }
          }));
        }

        if (gameModifiers.takeoverDefense > 0) {
          set(state => ({
            gameModifiers: {
              ...state.gameModifiers,
              takeoverDefense: Math.max(0, state.gameModifiers.takeoverDefense - 2) // Slower decay
            }
          }));
        }
      },

      // HR Review System
      isHRReviewAvailable: () => {
        const { corporateTier, daysPassed, promotionProgress } = get();
        
        // Available from Manager tier onwards
        if (corporateTier.level < 2) return false;
        
        // Can only do one review every 5 days
        const lastReview = promotionProgress.lastHRReview || 0;
        return daysPassed - lastReview >= 5;
      },

      conductHRReview: (daemonId: string) => {
        const { daemons, isHRReviewAvailable, addNotification } = get();
        
        if (!isHRReviewAvailable()) {
          addNotification('HR Reviews not available yet. Wait 5 days between reviews.', 'warning');
          return;
        }

        const daemon = daemons.find(d => d.id === daemonId);
        if (!daemon || !daemon.isActive) {
          addNotification('Cannot review inactive daemon', 'error');
          return;
        }

        // HR Review outcomes
        const outcomes = [
          {
            type: 'positive',
            chance: 0.4,
            effects: { morale: 15, health: 5 },
            message: `${daemon.name} received a glowing performance review and feels motivated!`
          },
          {
            type: 'neutral',
            chance: 0.4,
            effects: { morale: 0, health: 0 },
            message: `${daemon.name} received a standard performance review. Status quo maintained.`
          },
          {
            type: 'negative', 
            chance: 0.2,
            effects: { morale: -10, health: -5, lifespan: -2 },
            message: `${daemon.name} received harsh criticism during their review and feels demoralized.`
          }
        ];

        const random = Math.random();
        let cumulativeChance = 0;
        let selectedOutcome = outcomes[0];

        for (const outcome of outcomes) {
          cumulativeChance += outcome.chance;
          if (random <= cumulativeChance) {
            selectedOutcome = outcome;
            break;
          }
        }

        // Apply effects
        set(state => ({
          daemons: state.daemons.map(d => 
            d.id === daemonId 
              ? {
                  ...d,
                  morale: Math.max(0, Math.min(100, d.morale + selectedOutcome.effects.morale)),
                  health: Math.max(1, Math.min(100, d.health + selectedOutcome.effects.health)),
                  lifespanDays: selectedOutcome.effects.lifespan 
                    ? Math.max(1, d.lifespanDays + selectedOutcome.effects.lifespan)
                    : d.lifespanDays
                }
              : d
          ),
          promotionProgress: {
            ...state.promotionProgress,
            hrReviews: (state.promotionProgress.hrReviews || 0) + 1,
            lastHRReview: state.daysPassed
          }
        }));

        // Give bureaucratic leverage reward
        get().addResources(0, 0, 1);
        
        addNotification(selectedOutcome.message, selectedOutcome.type === 'positive' ? 'success' : selectedOutcome.type === 'negative' ? 'error' : 'info');

        // Check for promotion
        get().checkPromotion();
      },

      // Enhanced Mission System Implementation
      generateProceduralMissions: () => {
        const { planets, generateId } = get();
        const conqueredPlanets = planets.filter(p => p.conquered).length;
        const availableProceduralMissions: Mission[] = [];

        // Check each procedural mission type
        Object.values(PROCEDURAL_MISSIONS).forEach(template => {
          let shouldTrigger = false;

          // Evaluate trigger conditions
          switch (template.triggerCondition) {
            case 'conquered_planets >= 1':
              shouldTrigger = conqueredPlanets >= 1;
              break;
            case 'corporate_presence >= 50':
              shouldTrigger = planets.some(p => p.corporatePresence && p.corporatePresence >= 50);
              break;
            case 'bureaucratic_leverage >= 10':
              shouldTrigger = resources.bureaucraticLeverage >= 10;
              break;
            case 'conquered_planets >= 2':
              shouldTrigger = conqueredPlanets >= 2;
              break;
          }

          // Generate mission if conditions are met and random chance succeeds
          if (shouldTrigger && Math.random() < template.frequency) {
            const mission: Mission = {
              id: generateId(),
              planetId: 'procedural', // Special identifier for procedural missions
              teamIds: [],
              startTime: Date.now(),
              duration: 60, // Default 60 minutes
              type: template.id as string,
              procedural: true,
              objectives: [{
                id: generateId(),
                type: 'primary',
                description: template.description,
                requirements: {},
                rewards: template.rewards,
                completed: false,
                failed: false
              }],
              consequences: template.consequences?.map(consId => ({
                id: generateId(),
                triggerCondition: 'failure' as const,
                type: 'immediate' as const,
                effects: MISSION_CONSEQUENCES[consId]?.effects || {},
                description: MISSION_CONSEQUENCES[consId]?.description || 'Unknown consequence'
              })) || []
            };
            availableProceduralMissions.push(mission);
          }
        });

        set({ availableProceduralMissions });
      },

      processMissionConsequences: (consequences: MissionConsequence[]) => {
        const { addNotification } = get();

        consequences.forEach(consequence => {
          // Process immediate consequences
          if (consequence.type === 'immediate') {
            // Apply reputation changes
            if (consequence.effects.reputation) {
              set(state => ({ reputation: Math.max(0, Math.min(100, state.reputation + consequence.effects.reputation)) }));
            }

            // Apply planet effects
            if (consequence.effects.planets) {
              const updatedPlanets = planets.map(planet => {
                if (consequence.effects.planets?.includes('all') || consequence.effects.planets?.includes(planet.id)) {
                  return {
                    ...planet,
                    stability: consequence.effects.stability ?
                      Math.max(0, Math.min(100, (planet.stability || 50) + consequence.effects.stability)) :
                      planet.stability
                  };
                }
                return planet;
              });
              set({ planets: updatedPlanets });
            }

            // Trigger corporate events if specified
            if (consequence.effects.corporateEvents) {
              // This would integrate with existing corporate event system
              addNotification(`Corporate consequence: ${consequence.description}`, 'warning');
            }
          }

          // Store delayed consequences for later processing
          if (consequence.type === 'delayed' || consequence.type === 'permanent') {
            set(state => ({
              missionConsequences: [...state.missionConsequences, consequence]
            }));
          }
        });
      },

      evaluateMissionObjectives: (mission: Mission, result: MissionResult) => {
        const { selectedDaemons, daemons, equipment } = get();

        if (!mission.objectives) return result;

        const team = Array.from(selectedDaemons)
          .map(id => daemons.find(d => d.id === id))
          .filter(Boolean) as Daemon[];

        let objectivesCompleted = 0;
        const bonusRewards = { credits: 0, soulEssence: 0, bureaucraticLeverage: 0, rawMaterials: 0 };

        mission.objectives.forEach(objective => {
          let canComplete = true;

          // Check objective requirements
          if (objective.requirements.minTeamSize && team.length < objective.requirements.minTeamSize) {
            canComplete = false;
          }

          if (objective.requirements.specialization &&
              !team.some(d => d.specialization === objective.requirements.specialization)) {
            canComplete = false;
          }

          if (objective.requirements.equipment &&
              !objective.requirements.equipment.some(equipName =>
                equipment.some(e => e.name === equipName && team.some(d => d.equipment === e.id)))) {
            canComplete = false;
          }

          // Complete objective if requirements are met and mission was successful
          // (or if it's a bonus objective with special conditions)
          if (canComplete && (result.success || objective.type === 'bonus')) {
            objective.completed = true;
            objectivesCompleted++;

            // Add objective rewards
            Object.entries(objective.rewards).forEach(([key, value]) => {
              if (key in bonusRewards && typeof value === 'number') {
                bonusRewards[key as keyof typeof bonusRewards] += value;
              }
            });
          } else {
            objective.failed = true;
          }
        });

        // Apply bonus rewards
        get().addResources(
          bonusRewards.credits,
          bonusRewards.soulEssence,
          bonusRewards.bureaucraticLeverage,
          bonusRewards.rawMaterials
        );

        // Enhance mission result with objective information
        return {
          ...result,
          narrative: `${result.narrative}\n\nObjectives completed: ${objectivesCompleted}/${mission.objectives.length}`,
          rewards: {
            ...result.rewards,
            credits: (result.rewards.credits || 0) + bonusRewards.credits,
            soulEssence: (result.rewards.soulEssence || 0) + bonusRewards.soulEssence,
            bureaucraticLeverage: (result.rewards.bureaucraticLeverage || 0) + bonusRewards.bureaucraticLeverage,
            rawMaterials: (result.rewards.rawMaterials || 0) + bonusRewards.rawMaterials
          }
        };
      },

      // Endgame System
      calculateManagementStyle: (): ManagementStyle => {
        const { corporateEvents, daemons, resources } = get();
        
        // Simple calculation based on player choices and game state
        const profitFocus = resources.credits / 1000; // Focus on credits
        const cultBehavior = daemons.filter(d => d.morale > 80).length; // High morale daemons
        const complianceRate = corporateEvents.filter(e => e.resolved).length; // Resolved events
        const burnoutLevel = daemons.filter(d => d.health < 30).length; // Low health daemons
        
        if (burnoutLevel > profitFocus && burnoutLevel > cultBehavior && burnoutLevel > complianceRate) {
          return 'collapse';
        } else if (profitFocus > cultBehavior && profitFocus > complianceRate) {
          return 'profit';
        } else if (cultBehavior > complianceRate) {
          return 'cult';
        } else {
          return 'compliance';
        }
      },

      triggerEnding: (style: ManagementStyle) => {
        const { endgameState, addNotification } = get();
        
        set({
          endgameState: {
            ...endgameState,
            managementStyle: style,
            endingAchieved: true,
            endingType: `ending_${style}`,
            prestigeLevel: endgameState.prestigeLevel + 1
          }
        });
        
        addNotification(`Game ended as: ${style.toUpperCase()}`, 'success');
      },

      performCorporateRestructuring: () => {
        const { endgameState, startNewGame } = get();
        
        // Reset game with prestige bonuses
        const newGameState = {
          ...initialState,
          endgameState: {
            ...endgameState,
            endingAchieved: false,
            endingType: ''
          }
        };
        
        set(newGameState);
        startNewGame();
        
        get().addNotification('Corporate restructuring complete! New game started with prestige bonuses.', 'success');
      },
    }),
    {
      name: 'daemon-directorate',
      partialize: state => ({
        resources: state.resources,
        daemons: state.daemons,
        equipment: state.equipment,
        rooms: state.rooms,
        planets: state.planets,
        recruitmentPool: state.recruitmentPool,
        corporateEvents: state.corporateEvents,
        gameModifiers: state.gameModifiers,
        daysPassed: state.daysPassed,
        gameStarted: state.gameStarted,
        tutorialCompleted: state.tutorialCompleted,
      }),
    }
  )
);
