// hooks/useGameSelectors.ts - Optimized selectors to prevent unnecessary re-renders
import { useMemo } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { DAEMON_BALANCE } from '../constants/gameBalance';

// Memoized selectors to prevent unnecessary re-renders
export const useActiveDaemons = () => {
  const daemons = useGameStore(state => state.daemons);

  return useMemo(() =>
    daemons.filter(d => d.isActive),
    [daemons]
  );
};

export const useDaemonStats = () => {
  const activeDaemons = useActiveDaemons();

  return useMemo(() => {
    if (activeDaemons.length === 0) {
      return {
        avgHealth: 0,
        avgMorale: 0,
        criticalLifespans: 0,
        lowHealthCount: 0,
        lowMoraleCount: 0,
      };
    }

    const avgHealth = Math.round(
      activeDaemons.reduce((sum, d) => sum + d.health, 0) / activeDaemons.length
    );
    const avgMorale = Math.round(
      activeDaemons.reduce((sum, d) => sum + d.morale, 0) / activeDaemons.length
    );
    const criticalLifespans = activeDaemons.filter(
      d => d.lifespanDays <= DAEMON_BALANCE.THRESHOLDS.CRITICAL_LIFESPAN
    ).length;
    const lowHealthCount = activeDaemons.filter(
      d => d.health < DAEMON_BALANCE.THRESHOLDS.LOW_HEALTH
    ).length;
    const lowMoraleCount = activeDaemons.filter(
      d => d.morale < DAEMON_BALANCE.THRESHOLDS.LOW_MORALE
    ).length;

    return {
      avgHealth,
      avgMorale,
      criticalLifespans,
      lowHealthCount,
      lowMoraleCount,
    };
  }, [activeDaemons]);
};

export const useComplianceStatus = () => {
  const complianceTasks = useGameStore(state => state.complianceTasks);
  const daysPassed = useGameStore(state => state.daysPassed);

  return useMemo(() => {
    const activeComplianceTasks = complianceTasks.filter(task => !task.completed);
    const overdueComplianceTasks = activeComplianceTasks.filter(task => daysPassed >= task.deadline);

    return {
      active: activeComplianceTasks.length,
      overdue: overdueComplianceTasks.length,
      status: overdueComplianceTasks.length > 0 ? 'critical' :
              activeComplianceTasks.length > 0 ? 'warning' : 'good',
    };
  }, [complianceTasks, daysPassed]);
};

export const useLegacyStats = () => {
  const legacyBook = useGameStore(state => state.legacyBook);
  const hallOfInfamy = useGameStore(state => state.hallOfInfamy);

  return useMemo(() => {
    const totalBloodlines = Object.keys(legacyBook).length;
    const recentStories = hallOfInfamy.slice(-3);

    return {
      totalBloodlines,
      recentStories,
      totalStories: hallOfInfamy.length,
    };
  }, [legacyBook, hallOfInfamy]);
};

export const useResourcesStatus = () => {
  const resources = useGameStore(state => state.resources);

  return useMemo(() => {
    const isResourceLow = (amount: number, threshold: number) => amount < threshold;

    return {
      resources,
      warnings: {
        lowCredits: isResourceLow(resources.credits, 100),
        lowSoulEssence: isResourceLow(resources.soulEssence, 5),
        lowBureaucraticLeverage: isResourceLow(resources.bureaucraticLeverage, 3),
        lowRawMaterials: isResourceLow(resources.rawMaterials, 2),
      },
    };
  }, [resources]);
};

// Selector for mission-ready daemons
export const useMissionReadyDaemons = () => {
  const activeDaemons = useActiveDaemons();

  return useMemo(() =>
    activeDaemons.filter(daemon =>
      daemon.health > DAEMON_BALANCE.THRESHOLDS.LOW_HEALTH &&
      daemon.morale > DAEMON_BALANCE.THRESHOLDS.LOW_MORALE &&
      daemon.lifespanDays > DAEMON_BALANCE.THRESHOLDS.CRITICAL_LIFESPAN
    ),
    [activeDaemons]
  );
};

// Selector for daemons needing attention
export const useDaemonsNeedingAttention = () => {
  const activeDaemons = useActiveDaemons();

  return useMemo(() =>
    activeDaemons.filter(daemon =>
      daemon.health < DAEMON_BALANCE.THRESHOLDS.LOW_HEALTH ||
      daemon.morale < DAEMON_BALANCE.THRESHOLDS.LOW_MORALE ||
      daemon.lifespanDays <= DAEMON_BALANCE.THRESHOLDS.WARNING_LIFESPAN
    ),
    [activeDaemons]
  );
};

// Selector for equipment status
export const useEquipmentStatus = () => {
  const equipment = useGameStore(state => state.equipment);

  return useMemo(() => {
    const assignedEquipment = equipment.filter(e => e.assignedTo);
    const unassignedEquipment = equipment.filter(e => !e.assignedTo);
    const damagedEquipment = equipment.filter(e => e.durability < 50);

    return {
      total: equipment.length,
      assigned: assignedEquipment.length,
      unassigned: unassignedEquipment.length,
      damaged: damagedEquipment.length,
      needsRepair: damagedEquipment,
    };
  }, [equipment]);
};