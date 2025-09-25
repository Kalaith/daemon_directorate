// components/game/OptimizedDashboard.tsx - Performance optimized Dashboard
import React, { memo, useCallback, useMemo } from 'react';
import OptimizedCard from '../ui/OptimizedCard';
import { CorporateLadder } from './CorporateLadder';
import { ComplianceCenter } from './ComplianceCenter';
import { HallOfInfamy } from './HallOfInfamy';
import { CorporateRivals } from './CorporateRivals';
import {
  useDaemonStats,
  useComplianceStatus,
  useLegacyStats,
  useResourcesStatus
} from '../../hooks/useGameSelectors';
import { useGameStore } from '../../stores/composedStore';
import { getTierIcon } from '../../utils/gameHelpers';
import { handleGameError } from '../../utils/errorHandling';

// Memoized status card component
const StatusCard = memo<{
  title: string;
  value: string | number;
  subtitle: string;
  icon?: string;
  gradient: string;
  onClick?: () => void;
}>(({ title, value, subtitle, icon, gradient, onClick }) => (
  <OptimizedCard
    className={`bg-gradient-to-r ${gradient} text-white cursor-pointer transition-transform hover:scale-105`}
    onClick={onClick}
  >
    <div className="text-center">
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-sm opacity-90">{title}</p>
      <div className="text-xs opacity-75 mt-1">{subtitle}</div>
    </div>
  </OptimizedCard>
));

StatusCard.displayName = 'StatusCard';

// Memoized team stats component
const TeamStatsCard = memo(() => {
  const stats = useDaemonStats();

  const statusText = useMemo(() => {
    if (stats.criticalLifespans > 0) return `${stats.criticalLifespans} Critical!`;
    if (stats.lowHealthCount > 0) return `${stats.lowHealthCount} Need Care`;
    if (stats.lowMoraleCount > 0) return `${stats.lowMoraleCount} Low Morale`;
    return 'Team Status Good';
  }, [stats]);

  const gradientClass = useMemo(() => {
    if (stats.criticalLifespans > 0) return 'from-red-600 to-pink-600';
    if (stats.lowHealthCount > 0 || stats.lowMoraleCount > 0) return 'from-yellow-600 to-orange-600';
    return 'from-green-600 to-emerald-600';
  }, [stats]);

  return (
    <StatusCard
      title="Team Health"
      value={`${stats.avgHealth}% / ${stats.avgMorale}%`}
      subtitle={statusText}
      gradient={gradientClass}
    />
  );
});

TeamStatsCard.displayName = 'TeamStatsCard';

const OptimizedDashboard: React.FC = memo(() => {
  // Use optimized selectors
  const corporateTier = useGameStore(state => state.corporateTier);
  const daysPassed = useGameStore(state => state.daysPassed);
  const activeMission = useGameStore(state => state.activeMission);
  const triggerRandomEvent = useGameStore(state => state.triggerRandomEvent);
  const addNotification = useGameStore(state => state.addNotification);

  const complianceStatus = useComplianceStatus();
  const legacyStats = useLegacyStats();
  const resourcesStatus = useResourcesStatus();

  // Memoized event handler
  const handleTriggerEvent = useCallback(() => {
    try {
      triggerRandomEvent();
    } catch (error) {
      handleGameError(error, addNotification, 'Dashboard event trigger');
    }
  }, [triggerRandomEvent, addNotification]);

  // Memoized tier icon
  const tierIcon = useMemo(() => getTierIcon(corporateTier.level), [corporateTier.level]);

  // Memoized dashboard sections
  const statusCards = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatusCard
        title={corporateTier.name}
        value={tierIcon}
        subtitle={`Corporate Tier ${corporateTier.level}`}
        gradient="from-purple-600 to-indigo-600"
      />

      <StatusCard
        title="Days in Operation"
        value={daysPassed}
        subtitle="Corporate Survival Record"
        gradient="from-blue-600 to-cyan-600"
      />

      <StatusCard
        title="Active Tasks"
        value={complianceStatus.active}
        subtitle={
          complianceStatus.overdue > 0
            ? `${complianceStatus.overdue} Overdue!`
            : 'Compliance Status'
        }
        gradient={
          complianceStatus.status === 'critical'
            ? 'from-red-600 to-pink-600'
            : complianceStatus.status === 'warning'
            ? 'from-yellow-600 to-orange-600'
            : 'from-green-600 to-emerald-600'
        }
      />

      <StatusCard
        title="Bloodlines"
        value={legacyStats.totalBloodlines}
        subtitle="Corporate Dynasties"
        gradient="from-indigo-600 to-purple-600"
      />
    </div>
  ), [corporateTier, daysPassed, complianceStatus, legacyStats, tierIcon]);

  const resourceWarnings = useMemo(() => {
    const warnings = [];
    if (resourcesStatus.warnings.lowCredits) warnings.push('Low Credits');
    if (resourcesStatus.warnings.lowSoulEssence) warnings.push('Low Soul Essence');
    if (resourcesStatus.warnings.lowBureaucraticLeverage) warnings.push('Low Bureaucratic Leverage');
    if (resourcesStatus.warnings.lowRawMaterials) warnings.push('Low Raw Materials');
    return warnings;
  }, [resourcesStatus.warnings]);

  return (
    <div className="space-y-6" role="main" aria-label="Corporate Dashboard">
      {/* Resource Warnings */}
      {resourceWarnings.length > 0 && (
        <OptimizedCard className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="text-center">
            <h3 className="font-semibold mb-2">⚠️ Resource Warnings</h3>
            <p className="text-sm">{resourceWarnings.join(', ')}</p>
          </div>
        </OptimizedCard>
      )}

      {/* Corporate Status Header */}
      <section aria-labelledby="status-header">
        <h2 id="status-header" className="sr-only">Corporate Status Overview</h2>
        {statusCards}
      </section>

      {/* Team Status */}
      <section aria-labelledby="team-status">
        <h2 id="team-status" className="sr-only">Team Status</h2>
        <TeamStatsCard />
      </section>

      {/* Mission Status */}
      {activeMission && (
        <OptimizedCard className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="text-center">
            <h3 className="font-semibold mb-2">🚀 Active Mission</h3>
            <p className="text-sm">Mission in progress on planet...</p>
          </div>
        </OptimizedCard>
      )}

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleTriggerEvent}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            aria-label="Trigger random corporate event"
          >
            Trigger Corporate Event
          </button>
        </div>
      </section>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section aria-labelledby="corporate-ladder">
          <h2 id="corporate-ladder" className="text-xl font-semibold mb-4">Corporate Progression</h2>
          <CorporateLadder />
        </section>

        <section aria-labelledby="compliance-center">
          <h2 id="compliance-center" className="text-xl font-semibold mb-4">Compliance Management</h2>
          <ComplianceCenter />
        </section>

        <section aria-labelledby="hall-of-infamy">
          <h2 id="hall-of-infamy" className="text-xl font-semibold mb-4">Legacy Records</h2>
          <HallOfInfamy />
        </section>

        <section aria-labelledby="corporate-rivals">
          <h2 id="corporate-rivals" className="text-xl font-semibold mb-4">Corporate Rivals</h2>
          <CorporateRivals />
        </section>
      </div>
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export default OptimizedDashboard;