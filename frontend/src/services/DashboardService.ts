// services/DashboardService.ts - Dashboard business logic
import type {
  Daemon,
  CorporateEvent,
  ComplianceTask,
  Story,
  LegacyBook,
} from '../types/game';
import { DAEMON_BALANCE } from '../constants/gameBalance';

export interface DashboardStats {
  activeDaemons: Daemon[];
  avgHealth: number;
  avgMorale: number;
  criticalLifespans: number;
  latestEvent: CorporateEvent | null;
  activeComplianceTasks: ComplianceTask[];
  overdueComplianceTasks: ComplianceTask[];
  totalBloodlines: number;
  recentStories: Story[];
}

export class DashboardService {
  static calculateDashboardStats(
    daemons: Daemon[],
    corporateEvents: CorporateEvent[],
    complianceTasks: ComplianceTask[],
    daysPassed: number,
    legacyBook: LegacyBook,
    hallOfInfamy: Story[]
  ): DashboardStats {
    const activeDaemons = daemons.filter(d => d.isActive);

    const avgHealth = this.calculateAverageHealth(activeDaemons);
    const avgMorale = this.calculateAverageMorale(activeDaemons);
    const criticalLifespans = this.calculateCriticalLifespans(activeDaemons);

    const latestEvent =
      corporateEvents.length > 0
        ? corporateEvents[corporateEvents.length - 1]
        : null;

    const activeComplianceTasks = complianceTasks.filter(
      task => !task.completed
    );
    const overdueComplianceTasks = activeComplianceTasks.filter(
      task => daysPassed >= task.deadline
    );

    const totalBloodlines = Object.keys(legacyBook).length;
    const recentStories = hallOfInfamy.slice(
      -DAEMON_BALANCE.MAX_RECENT_STORIES
    );

    return {
      activeDaemons,
      avgHealth,
      avgMorale,
      criticalLifespans,
      latestEvent,
      activeComplianceTasks,
      overdueComplianceTasks,
      totalBloodlines,
      recentStories,
    };
  }

  private static calculateAverageHealth(activeDaemons: Daemon[]): number {
    if (activeDaemons.length === 0) return 0;

    const totalHealth = activeDaemons.reduce((sum, d) => sum + d.health, 0);
    return Math.round(totalHealth / activeDaemons.length);
  }

  private static calculateAverageMorale(activeDaemons: Daemon[]): number {
    if (activeDaemons.length === 0) return 0;

    const totalMorale = activeDaemons.reduce((sum, d) => sum + d.morale, 0);
    return Math.round(totalMorale / activeDaemons.length);
  }

  private static calculateCriticalLifespans(activeDaemons: Daemon[]): number {
    return activeDaemons.filter(
      d => d.lifespanDays <= DAEMON_BALANCE.CRITICAL_LIFESPAN_THRESHOLD
    ).length;
  }

  static getHealthStatusClass(health: number): string {
    if (health >= DAEMON_BALANCE.HEALTH_THRESHOLDS.GOOD)
      return 'text-green-600';
    if (health >= DAEMON_BALANCE.HEALTH_THRESHOLDS.WARNING)
      return 'text-orange-600';
    return 'text-red-600';
  }

  static getMoraleStatusClass(morale: number): string {
    if (morale >= DAEMON_BALANCE.MORALE_THRESHOLDS.GOOD) return 'text-teal-600';
    if (morale >= DAEMON_BALANCE.MORALE_THRESHOLDS.WARNING)
      return 'text-orange-600';
    return 'text-red-600';
  }

  static getComplianceStatusClass(
    overdueCount: number,
    activeCount: number
  ): string {
    if (overdueCount > 0) return 'from-red-600 to-pink-600';
    if (activeCount > 0) return 'from-yellow-600 to-orange-600';
    return 'from-green-600 to-emerald-600';
  }

  static getComplianceStatusText(overdueCount: number): string {
    return overdueCount > 0 ? `${overdueCount} Overdue!` : 'Compliance Status';
  }
}
