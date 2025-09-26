// App.tsx
import React, { useEffect } from 'react';
import { useGameStore } from './stores/composedStore';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import Dashboard from './components/game/Dashboard';
import TeamManagement from './components/game/TeamManagement';
import Missions from './components/game/Missions';
import Apartment from './components/game/Apartment';
import Equipment from './components/game/Equipment';
import GameControls from './components/ui/GameControls';
import Tutorial from './components/ui/Tutorial';
import MemorialModal from './components/ui/MemorialModal';
import MissionModal from './components/ui/MissionModal';
import MissionResults from './components/ui/MissionResults';
import { CorporateEventModal } from './components/ui/CorporateEventModal';
import { EndgameModal } from './components/ui/EndgameModal';
import NotificationSystem from './components/ui/NotificationSystem';

const App: React.FC = () => {
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
        return <Dashboard />;
      case 'team':
        return <TeamManagement />;
      case 'missions':
        return <Missions />;
      case 'apartment':
        return <Apartment />;
      case 'equipment':
        return <Equipment />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-daemon-dark text-daemon-text font-sans">
      <Header />
      <TabNavigation />
      <main className="container mx-auto px-4 py-6">{renderCurrentTab()}</main>
      <GameControls />

      {/* Modals */}
      {showTutorial && <Tutorial />}
      {showMemorial && <MemorialModal />}
      {showMissionModal && <MissionModal />}
      {showMissionResults && <MissionResults />}
      {showEventModal && <CorporateEventModal />}
      <EndgameModal />

      {/* Notifications */}
      <NotificationSystem />
    </div>
  );
};

export default App;
