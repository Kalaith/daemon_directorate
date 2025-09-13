// components/layout/TabNavigation.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
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
    <nav className="bg-cream-100 border-b border-brown-600/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`py-4 px-6 font-semibold text-sm transition-colors border-b-3 relative ${
                currentTab === tab.id
                  ? 'bg-cream-50 border-teal-500 text-slate-900 shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-cream-50/50'
              }`}
            >
              {tab.label}
              {currentTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
