// Mission-specific helper functions - extracted from the massive executeMission function
import type {
  Daemon,
  Planet,
  Mission,
  MissionResult,
  Equipment,
} from '../types/game';
import {
  MISSION_TEMPLATES,
  MISSION_CONSEQUENCES,
  DAEMON_NAMES,
  DAEMON_QUIRKS,
} from '../constants/gameData';
import {
  calculateMissionSuccessChance,
  calculateMissionRewards,
  calculateMissionDamage,
  getDifficultyMultiplier,
  shouldCreateSuccessor,
  calculateSuccessorStats,
} from './gameHelpers';

export interface MissionExecutionContext {
  selectedDaemons: Set<string>;
  currentPlanet: string | null;
  daemons: Daemon[];
  planets: Planet[];
  equipment: Equipment[];
  selectedMissionType: string;
}

export interface MissionExecutionResult {
  success: boolean;
  result: MissionResult;
  updatedDaemons: Daemon[];
  updatedPlanets: Planet[];
  missionInstance: Mission;
}

/**
 * Creates a mission instance from template
 */
export const createMissionInstance = (
  missionType: string,
  currentPlanet: string,
  selectedDaemons: Set<string>,
  generateId: () => string
): Mission => {
  const missionTemplate =
    MISSION_TEMPLATES[missionType as keyof typeof MISSION_TEMPLATES];

  if (!missionTemplate) {
    throw new Error(`Mission template not found for type: ${missionType}`);
  }

  return {
    id: generateId(),
    planetId: currentPlanet,
    teamIds: Array.from(selectedDaemons),
    startTime: Date.now(),
    duration: missionTemplate.baseDuration,
    type: missionType as Mission['type'],
    objectives: [
      {
        id: generateId(),
        ...missionTemplate.primaryObjective,
      },
      ...missionTemplate.secondaryObjectives.map(obj => ({
        id: generateId(),
        ...obj,
      })),
    ],
    consequences: missionTemplate.failureConsequences.map(consId => {
      const consequence =
        MISSION_CONSEQUENCES[consId as keyof typeof MISSION_CONSEQUENCES];
      return {
        id: generateId(),
        triggerCondition: 'failure' as const,
        type: consequence?.type || ('immediate' as const),
        effects: consequence?.effects || {},
        description: consequence?.description || 'Unknown consequence',
      };
    }),
  };
};

/**
 * Executes mission logic and calculates results
 */
export const executeMissionLogic = (
  context: MissionExecutionContext,
  generateId: () => string
): MissionExecutionResult => {
  const {
    selectedDaemons,
    currentPlanet,
    daemons,
    planets,
    selectedMissionType,
  } = context;

  if (selectedDaemons.size === 0 || !currentPlanet) {
    throw new Error(
      'Invalid mission parameters: no team selected or planet specified'
    );
  }

  const planet = planets.find(p => p.id === currentPlanet);
  if (!planet) {
    throw new Error(`Planet not found: ${currentPlanet}`);
  }

  const selectedTeam = Array.from(selectedDaemons)
    .map(id => daemons.find(d => d.id === id))
    .filter(Boolean) as Daemon[];

  if (selectedTeam.length === 0) {
    throw new Error('No valid team members found');
  }

  // Create mission instance
  const missionInstance = createMissionInstance(
    selectedMissionType,
    currentPlanet,
    selectedDaemons,
    generateId
  );

  // Calculate success
  const successChance = calculateMissionSuccessChance(selectedTeam, planet);
  const success = Math.random() * 100 < successChance;

  // Calculate rewards
  const rewards = calculateMissionRewards(planet.difficulty, success);

  // Create base result
  const result: MissionResult = {
    success,
    successChance: Math.round(successChance),
    narrative: generateMissionNarrative(missionInstance, planet, success),
    rewards,
    casualties: [],
    equipmentDamage: [],
  };

  // Update daemons with mission effects
  const updatedDaemons = updateDaemonsAfterMission(
    daemons,
    selectedTeam,
    success,
    planet
  );

  // Update planet state
  const updatedPlanets = updatePlanetAfterMission(
    planets,
    planet,
    selectedMissionType,
    success,
    missionInstance.id
  );

  return {
    success,
    result,
    updatedDaemons,
    updatedPlanets,
    missionInstance,
  };
};

/**
 * Generates mission narrative text
 */
export const generateMissionNarrative = (
  mission: Mission,
  planet: Planet,
  success: boolean
): string => {
  const missionTemplate =
    MISSION_TEMPLATES[mission.type as keyof typeof MISSION_TEMPLATES];

  if (success) {
    return `Mission accomplished! Your team successfully ${missionTemplate?.description.toLowerCase()} on ${planet.name}.`;
  } else {
    return `Mission failed. Your team encountered unexpected resistance from ${planet.resistance}.`;
  }
};

/**
 * Updates daemon states after mission completion
 */
export const updateDaemonsAfterMission = (
  allDaemons: Daemon[],
  missionTeam: Daemon[],
  success: boolean,
  planet: Planet
): Daemon[] => {
  return allDaemons.map(daemon => {
    const isOnMission = missionTeam.some(
      teamMember => teamMember.id === daemon.id
    );

    if (!isOnMission) {
      return daemon;
    }

    // Calculate damage based on daemon stats and planet difficulty
    const damage = calculateMissionDamage(
      daemon,
      getDifficultyMultiplier(planet.difficulty)
    );

    // Update legacy statistics
    const updatedLegacy = { ...daemon.legacy };
    if (success) {
      updatedLegacy.successfulMissions += 1;
      if (!planet.conquered) {
        updatedLegacy.planetsConquered += 1;
      }
    }

    return {
      ...daemon,
      health: Math.max(0, daemon.health - damage.healthLoss),
      morale: Math.max(0, daemon.morale - damage.moraleLoss),
      lifespanDays: Math.max(0, daemon.lifespanDays - damage.lifespanLoss),
      legacy: updatedLegacy,
    };
  });
};

/**
 * Updates planet state after mission
 */
export const updatePlanetAfterMission = (
  allPlanets: Planet[],
  targetPlanet: Planet,
  missionType: string,
  success: boolean,
  missionId: string
): Planet[] => {
  return allPlanets.map(planet => {
    if (planet.id !== targetPlanet.id) {
      return planet;
    }

    let stabilityChange = 0;
    let presenceChange = 0;

    if (success) {
      stabilityChange =
        missionType === 'diplomacy'
          ? 10
          : missionType === 'sabotage'
            ? -15
            : -5;
      presenceChange = 15;
    } else {
      stabilityChange =
        missionType === 'conquest' ? -10 : missionType === 'sabotage' ? 5 : 0;
      presenceChange = -5;
    }

    return {
      ...planet,
      conquered:
        success && missionType === 'conquest' ? true : planet.conquered,
      stability: Math.max(
        0,
        Math.min(100, (planet.stability || 50) + stabilityChange)
      ),
      corporatePresence: Math.max(
        0,
        Math.min(100, (planet.corporatePresence || 0) + presenceChange)
      ),
      missionHistory: [...(planet.missionHistory || []), missionId],
      lastMission: missionId,
    };
  });
};

/**
 * Evaluates mission objectives and calculates bonus rewards
 */
export const evaluateMissionObjectives = (
  mission: Mission,
  result: MissionResult,
  selectedTeam: Daemon[],
  equipment: Equipment[]
): MissionResult => {
  if (!mission.objectives) return result;

  let objectivesCompleted = 0;
  const bonusRewards = {
    credits: 0,
    soulEssence: 0,
    bureaucraticLeverage: 0,
    rawMaterials: 0,
  };

  mission.objectives.forEach(objective => {
    let canComplete = true;

    // Check objective requirements
    if (
      objective.requirements.minTeamSize &&
      selectedTeam.length < objective.requirements.minTeamSize
    ) {
      canComplete = false;
    }

    if (
      objective.requirements.specialization &&
      !selectedTeam.some(
        d => d.specialization === objective.requirements.specialization
      )
    ) {
      canComplete = false;
    }

    if (
      objective.requirements.equipment &&
      !objective.requirements.equipment.some(equipName =>
        equipment.some(
          e =>
            e.name === equipName && selectedTeam.some(d => d.equipment === e.id)
        )
      )
    ) {
      canComplete = false;
    }

    // Complete objective if requirements are met and mission was successful
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

  // Enhance mission result with objective information
  return {
    ...result,
    narrative: `${result.narrative}\n\nObjectives completed: ${objectivesCompleted}/${mission.objectives.length}`,
    rewards: {
      ...result.rewards,
      credits: (result.rewards.credits || 0) + bonusRewards.credits,
      soulEssence: (result.rewards.soulEssence || 0) + bonusRewards.soulEssence,
      bureaucraticLeverage:
        (result.rewards.bureaucraticLeverage || 0) +
        bonusRewards.bureaucraticLeverage,
      rawMaterials:
        (result.rewards.rawMaterials || 0) + bonusRewards.rawMaterials,
    },
  };
};

/**
 * Creates successor daemon when a daemon dies with legacy
 */
export const createSuccessorDaemon = (
  originalDaemon: Daemon,
  generateId: () => string
): Daemon => {
  if (!shouldCreateSuccessor(originalDaemon)) {
    throw new Error('Daemon does not qualify for successor creation');
  }

  const successorName = `${DAEMON_NAMES[Math.floor(Math.random() * DAEMON_NAMES.length)]}-${Math.floor(Math.random() * 9999) + 1000}`;
  const inheritedTraits = [...originalDaemon.inheritedTraits];
  const stats = calculateSuccessorStats(originalDaemon);

  // Chance to gain new inherited trait based on accomplishments
  if (originalDaemon.legacy.successfulMissions >= 5 && Math.random() < 0.3) {
    // Implementation would add new traits
  }

  return {
    id: generateId(),
    name: successorName,
    specialization: originalDaemon.specialization,
    health: stats.health,
    morale: stats.morale,
    lifespanDays: stats.lifespanDays,
    quirks: DAEMON_QUIRKS.sort(() => 0.5 - Math.random()).slice(0, 2),
    assignments: [],
    equipment: null,
    isActive: true,
    generation: originalDaemon.generation + 1,
    bloodline: originalDaemon.bloodline,
    mentor: originalDaemon.id,
    inheritedTraits,
    legacy: {
      successfulMissions: 0,
      planetsConquered: 0,
      equipmentCreated: 0,
      yearsServed: 0,
    },
  };
};
