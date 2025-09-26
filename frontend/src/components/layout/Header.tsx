// components/layout/Header.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';

const Header: React.FC = () => {
  const { resources } = useGameStore();

  // Handle case where resources might be undefined during initialization
  const credits = resources?.credits ?? 0;
  const soulEssence = resources?.soulEssence ?? 0;
  const bureaucraticLeverage = resources?.bureaucraticLeverage ?? 0;
  const rawMaterials = resources?.rawMaterials ?? 0;

  // Format large numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <header className="bg-gradient-to-r from-black to-daemon-dark border-b-2 border-daemon-secondary">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-header text-2xl text-daemon-text-bright tracking-wide">
            Daemon Directorate
          </h1>
          <div className="text-daemon-text-muted text-sm font-medium mt-1">
            Excellence Through Eternal Suffering™
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Credits */}
          <div className="bg-daemon-panel border border-daemon-secondary rounded-lg p-3 min-w-[100px]">
            <div className="text-daemon-text-muted text-xs uppercase tracking-wide mb-1">
              Credits
            </div>
            <div className="font-mono text-lg text-daemon-text-bright font-semibold">
              {formatNumber(credits)}
            </div>
          </div>

          {/* Soul Essence - Executive tier color */}
          <div className="bg-daemon-panel border border-daemon-secondary rounded-lg p-3 min-w-[100px]">
            <div className="text-daemon-text-muted text-xs uppercase tracking-wide mb-1">
              Soul Essence
            </div>
            <div className="font-mono text-lg text-daemon-gold font-semibold">
              {formatNumber(soulEssence)}
            </div>
          </div>

          {/* Bureaucratic Leverage */}
          <div className="bg-daemon-panel border border-daemon-secondary rounded-lg p-3 min-w-[120px]">
            <div className="text-daemon-text-muted text-xs uppercase tracking-wide mb-1">
              Leverage
            </div>
            <div className="font-mono text-lg text-daemon-text-bright font-semibold">
              {formatNumber(bureaucraticLeverage)}
            </div>
          </div>

          {/* Raw Materials */}
          <div className="bg-daemon-panel border border-daemon-secondary rounded-lg p-3 min-w-[100px]">
            <div className="text-daemon-text-muted text-xs uppercase tracking-wide mb-1">
              Materials
            </div>
            <div className="font-mono text-lg text-daemon-bronze font-semibold">
              {formatNumber(rawMaterials)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
