// services/CorporateProgressionService.ts - Business logic for corporate tier progression
import type {
  CorporateTier,
  Planet,
  CorporateRival,
  DaemonLegacy,
} from '../types/game';
import { uiConstants } from '../constants/gameBalance';

export interface ProgressionRequirements {
  planetsControlled: RequirementStatus;
  daysLived: RequirementStatus;
  legacyGenerations: RequirementStatus;
  defeatedRivals: RequirementStatus;
  completedHRReviews: RequirementStatus;
  complianceAudits: RequirementStatus;
}

export interface RequirementStatus {
  current: number;
  required: number;
  met: boolean;
}

export class CorporateProgressionService {
  /**
   * Calculate the status of all requirements for a given tier
   */
  static calculateRequirementStatus(
    requirements: CorporateTier['requirements'],
    planets: Planet[],
    daysPassed: number,
    legacyBook: Record<string, DaemonLegacy>,
    corporateRivals: CorporateRival[],
    promotionProgress: Record<string, number>
  ): ProgressionRequirements {
    const conqueredPlanets = (planets || []).filter(p => p.conquered).length;
    const maxGeneration = Math.max(
      0,
      ...Object.values(legacyBook || {}).map(l => l.generation)
    );
    const defeatedRivals = (corporateRivals || []).filter(r => r.defeated).length;
    const completedHRReviews = (promotionProgress || {}).hrReviews || 0;
    const complianceAudits = (promotionProgress || {}).complianceAudits || 0;

    return {
      planetsControlled: {
        current: conqueredPlanets,
        required: requirements.planetsControlled || 0,
        met:
          !requirements.planetsControlled ||
          conqueredPlanets >= requirements.planetsControlled,
      },
      daysLived: {
        current: daysPassed,
        required: requirements.daysLived || 0,
        met: !requirements.daysLived || daysPassed >= requirements.daysLived,
      },
      legacyGenerations: {
        current: maxGeneration,
        required: requirements.legacyGenerations || 0,
        met:
          !requirements.legacyGenerations ||
          maxGeneration >= requirements.legacyGenerations,
      },
      defeatedRivals: {
        current: defeatedRivals,
        required: requirements.defeatedRivals || 0,
        met:
          !requirements.defeatedRivals ||
          defeatedRivals >= requirements.defeatedRivals,
      },
      completedHRReviews: {
        current: completedHRReviews,
        required: requirements.completedHRReviews || 0,
        met:
          !requirements.completedHRReviews ||
          completedHRReviews >= requirements.completedHRReviews,
      },
      complianceAudits: {
        current: complianceAudits,
        required: requirements.complianceAudits || 0,
        met:
          !requirements.complianceAudits ||
          complianceAudits >= requirements.complianceAudits,
      },
    };
  }

  /**
   * Get the appropriate tier icon for a given level
   */
  static getTierIcon(level: number): string {
    return uiConstants.TIER_ICONS[level - 1] || uiConstants.TIER_ICONS[0];
  }

  /**
   * Check if all requirements are met for a tier
   */
  static meetsAllRequirements(
    requirementStatus: ProgressionRequirements
  ): boolean {
    return Object.values(requirementStatus).every(status => status.met);
  }

  /**
   * Format requirement key for display
   */
  static formatRequirementKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim();
  }

  /**
   * Calculate promotion progress percentage
   */
  static calculatePromotionProgress(
    requirementStatus: ProgressionRequirements
  ): number {
    const totalRequirements = Object.values(requirementStatus).filter(
      status => status.required > 0
    );
    if (totalRequirements.length === 0) return 100;

    const metRequirements = totalRequirements.filter(status => status.met);
    return Math.round(
      (metRequirements.length / totalRequirements.length) * 100
    );
  }
}
