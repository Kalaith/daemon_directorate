// components/layout/TabNavigation.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import type { TabType } from '../../types/game';

const TabNavigation: React.FC = () => {
  const { currentTab, setCurrentTab } = useGameStore();

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Corporate Dashboard' },
    { id: 'team' as TabType, label: 'Team Management' },
    { id: 'missions' as TabType, label: 'Planetary Operations' },
    { id: 'apartment' as TabType, label: 'Apartment HQ' },
    { id: 'equipment' as TabType, label: 'Equipment Depot' },
  ];

  return (
    <nav className="bg-daemon-panel border-b border-daemon-secondary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex space-x-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`py-4 px-6 font-semibold text-sm uppercase tracking-wide transition-all duration-200 border-b-2 relative ${
                currentTab === tab.id
                  ? 'bg-daemon-surface border-daemon-primary text-daemon-text-bright shadow-infernal'
                  : 'border-transparent text-daemon-text hover:text-daemon-text-bright hover:bg-daemon-surface hover:border-daemon-secondary'
              }`}
            >
              {tab.label}
              {currentTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-daemon-primary shadow-infernal animate-pulseInfernal"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
