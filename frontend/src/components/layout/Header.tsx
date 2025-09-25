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

  return (
    <header className="bg-slate-900 text-cream-100 py-6 border-b border-brown-600/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-cream-100 mb-1">
              Daemon Directorate
            </h1>
            <div className="text-slate-500 text-sm font-medium">
              Excellence Through Eternal Suffering™
            </div>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="text-center">
              <div className="font-semibold text-slate-300 mb-1">Credits</div>
              <div className="text-amber-400 text-lg font-bold">
                {credits}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-300 mb-1">
                Soul Essence
              </div>
              <div className="text-purple-400 text-lg font-bold">
                {soulEssence}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-300 mb-1">
                Bureaucratic Leverage
              </div>
              <div className="text-teal-400 text-lg font-bold">
                {bureaucraticLeverage}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-300 mb-1">
                Raw Materials
              </div>
              <div className="text-orange-400 text-lg font-bold">
                {rawMaterials}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
