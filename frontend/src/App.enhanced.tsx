// App.enhanced.tsx - Enhanced App component with all improvements
import React, { useEffect, Suspense } from 'react';
import { useGameStore } from './stores/composedStore';
import { NotificationProvider } from './contexts/NotificationContext';
import {
  AppErrorBoundary,
  FeatureErrorBoundary,
} from './components/ui/ErrorBoundary';
import { PerformanceProfiler, PerformanceDashboard } from './utils/performance';
import { Container } from './components/ui/DesignSystem';

// Lazy load components for better performance
const Header = React.lazy(() => import('./components/layout/Header'));
const TabNavigation = React.lazy(
  () => import('./components/layout/TabNavigation')
);
const Dashboard = React.lazy(() => import('./components/game/Dashboard'));
const TeamManagement = React.lazy(
  () => import('./components/game/TeamManagement')
);
const Missions = React.lazy(() => import('./components/game/Missions'));
const Apartment = React.lazy(() => import('./components/game/Apartment'));
const Equipment = React.lazy(() => import('./components/game/Equipment'));
const GameControls = React.lazy(() => import('./components/ui/GameControls'));
const Tutorial = React.lazy(() => import('./components/ui/Tutorial'));
const MemorialModal = React.lazy(() => import('./components/ui/MemorialModal'));
const MissionModal = React.lazy(() => import('./components/ui/MissionModal'));
const MissionResults = React.lazy(
  () => import('./components/ui/MissionResults')
);
const CorporateEventModal = React.lazy(() =>
  import('./components/ui/CorporateEventModal').then(m => ({
    default: m.CorporateEventModal,
  }))
);
const EndgameModal = React.lazy(() =>
  import('./components/ui/EndgameModal').then(m => ({
    default: m.EndgameModal,
  }))
);

// Loading component
const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent" />
      <span className="text-neutral-600">{message}</span>
    </div>
  </div>
);

// Main app content component
const AppContent: React.FC = () => {
  const {
    currentTab,
    showTutorial,
    showMemorial,
    showMissionModal,
    showMissionResults,
    showEventModal,
    initializeGame,
  } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <FeatureErrorBoundary feature="Dashboard">
            <PerformanceProfiler id="Dashboard">
              <Suspense
                fallback={<LoadingSpinner message="Loading dashboard..." />}
              >
                <Dashboard />
              </Suspense>
            </PerformanceProfiler>
          </FeatureErrorBoundary>
        );
      case 'team':
        return (
          <FeatureErrorBoundary feature="Team Management">
            <PerformanceProfiler id="TeamManagement">
              <Suspense
                fallback={
                  <LoadingSpinner message="Loading team management..." />
                }
              >
                <TeamManagement />
              </Suspense>
            </PerformanceProfiler>
          </FeatureErrorBoundary>
        );
      case 'missions':
        return (
          <FeatureErrorBoundary feature="Missions">
            <PerformanceProfiler id="Missions">
              <Suspense
                fallback={<LoadingSpinner message="Loading missions..." />}
              >
                <Missions />
              </Suspense>
            </PerformanceProfiler>
          </FeatureErrorBoundary>
        );
      case 'apartment':
        return (
          <FeatureErrorBoundary feature="Apartment">
            <PerformanceProfiler id="Apartment">
              <Suspense
                fallback={<LoadingSpinner message="Loading apartment..." />}
              >
                <Apartment />
              </Suspense>
            </PerformanceProfiler>
          </FeatureErrorBoundary>
        );
      case 'equipment':
        return (
          <FeatureErrorBoundary feature="Equipment">
            <PerformanceProfiler id="Equipment">
              <Suspense
                fallback={<LoadingSpinner message="Loading equipment..." />}
              >
                <Equipment />
              </Suspense>
            </PerformanceProfiler>
          </FeatureErrorBoundary>
        );
      default:
        return (
          <FeatureErrorBoundary feature="Dashboard">
            <PerformanceProfiler id="Dashboard">
              <Suspense
                fallback={<LoadingSpinner message="Loading dashboard..." />}
              >
                <Dashboard />
              </Suspense>
            </PerformanceProfiler>
          </FeatureErrorBoundary>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <FeatureErrorBoundary feature="Header">
        <Suspense
          fallback={
            <div className="h-16 bg-white border-b border-neutral-200" />
          }
        >
          <Header />
        </Suspense>
      </FeatureErrorBoundary>

      {/* Navigation */}
      <FeatureErrorBoundary feature="Navigation">
        <Suspense
          fallback={
            <div className="h-12 bg-neutral-100 border-b border-neutral-200" />
          }
        >
          <TabNavigation />
        </Suspense>
      </FeatureErrorBoundary>

      {/* Main Content */}
      <main role="main">
        <Container className="py-6">
          <PerformanceProfiler id="MainContent">
            {renderCurrentTab()}
          </PerformanceProfiler>
        </Container>
      </main>

      {/* Game Controls */}
      <FeatureErrorBoundary feature="Game Controls">
        <Suspense fallback={null}>
          <GameControls />
        </Suspense>
      </FeatureErrorBoundary>

      {/* Modals */}
      {showTutorial && (
        <FeatureErrorBoundary feature="Tutorial">
          <Suspense fallback={<LoadingSpinner message="Loading tutorial..." />}>
            <Tutorial />
          </Suspense>
        </FeatureErrorBoundary>
      )}

      {showMemorial && (
        <FeatureErrorBoundary feature="Memorial">
          <Suspense fallback={<LoadingSpinner message="Loading memorial..." />}>
            <MemorialModal />
          </Suspense>
        </FeatureErrorBoundary>
      )}

      {showMissionModal && (
        <FeatureErrorBoundary feature="Mission Modal">
          <Suspense fallback={<LoadingSpinner message="Loading mission..." />}>
            <MissionModal />
          </Suspense>
        </FeatureErrorBoundary>
      )}

      {showMissionResults && (
        <FeatureErrorBoundary feature="Mission Results">
          <Suspense fallback={<LoadingSpinner message="Loading results..." />}>
            <MissionResults />
          </Suspense>
        </FeatureErrorBoundary>
      )}

      {showEventModal && (
        <FeatureErrorBoundary feature="Corporate Event">
          <Suspense fallback={<LoadingSpinner message="Loading event..." />}>
            <CorporateEventModal />
          </Suspense>
        </FeatureErrorBoundary>
      )}

      {/* Endgame Modal - only show if conditions are met */}
      <FeatureErrorBoundary feature="Endgame">
        <Suspense fallback={null}>
          <EndgameModal />
        </Suspense>
      </FeatureErrorBoundary>

      {/* Performance Dashboard (development only) */}
      {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
    </div>
  );
};

// Enhanced App component with all providers and error boundaries
const EnhancedApp: React.FC = () => {
  return (
    <AppErrorBoundary>
      <NotificationProvider>
        <PerformanceProfiler
          id="App"
          enableLogging={process.env.NODE_ENV === 'development'}
        >
          <AppContent />
        </PerformanceProfiler>
      </NotificationProvider>
    </AppErrorBoundary>
  );
};

export default EnhancedApp;
