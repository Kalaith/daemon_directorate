// Example showing conversion from custom CSS to Tailwind utilities
import React from 'react';

const TailwindConversionExample: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-semibold text-text mb-4">
        Tailwind CSS Conversion Examples
      </h2>

      {/* Daemon Card Example - converted from .daemon-card CSS class */}
      <div className="bg-surface border border-border rounded-lg p-4 transition-all duration-normal hover:border-primary hover:shadow-md">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-text m-0">Daemon Name</h3>
          <span className="bg-primary text-primary-hover px-2 py-0.5 rounded-full text-xs font-medium">
            Specialization
          </span>
        </div>
        
        {/* Progress bars example */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary font-medium">Health</span>
            <div className="progress-bar">
              <div className="progress-fill health" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary font-medium">Morale</span>
            <div className="progress-bar">
              <div className="progress-fill morale" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Quirks section - converted from .daemon-quirks */}
        <div className="mt-3">
          <span className="inline-block bg-bg-3 text-text-secondary px-2 py-0.5 rounded-full text-xs mr-0.5 mt-0.5">
            Quirk 1
          </span>
          <span className="inline-block bg-bg-3 text-text-secondary px-2 py-0.5 rounded-full text-xs mr-0.5 mt-0.5">
            Quirk 2
          </span>
        </div>

        {/* Actions section - converted from .daemon-actions */}
        <div className="mt-3 flex gap-2">
          <button className="w-full px-4 py-2 bg-primary text-primary-hover rounded-base font-medium transition-colors hover:bg-primary-hover">
            Recruit
          </button>
        </div>
      </div>

      {/* Status indicators example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Status Indicators</h3>
        <div className="flex items-center gap-1 text-xs font-medium">
          <div className="status-dot status-active"></div>
          <span>Active Status</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium">
          <div className="status-dot status-warning"></div>
          <span>Warning Status</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium lifespan-critical">
          Critical Lifespan
        </div>
      </div>

      {/* Grid examples - using Tailwind grid utilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Grid Layouts (Tailwind)</h3>
        
        {/* Instead of .daemon-grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-6">
          <div className="bg-bg-1 p-4 rounded-base">Daemon Card 1</div>
          <div className="bg-bg-2 p-4 rounded-base">Daemon Card 2</div>
          <div className="bg-bg-3 p-4 rounded-base">Daemon Card 3</div>
        </div>

        {/* Instead of .planet-grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          <div className="bg-bg-4 p-5 rounded-lg">Planet Card 1</div>
          <div className="bg-bg-5 p-5 rounded-lg">Planet Card 2</div>
        </div>
      </div>

      {/* Button examples using Tailwind instead of .btn classes */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Button Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {/* Primary button */}
          <button className="inline-flex items-center justify-center px-4 py-2 rounded-base text-base font-medium leading-normal cursor-pointer transition-all duration-normal border-none bg-primary text-primary-hover hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            Primary Button
          </button>
          
          {/* Secondary button */}
          <button className="inline-flex items-center justify-center px-4 py-2 rounded-base text-base font-medium leading-normal cursor-pointer transition-all duration-normal border-none bg-secondary text-text hover:bg-secondary-hover active:bg-secondary-active">
            Secondary Button
          </button>

          {/* Outline button */}
          <button className="inline-flex items-center justify-center px-4 py-2 rounded-base text-base font-medium leading-normal cursor-pointer transition-all duration-normal bg-transparent border border-border text-text hover:bg-secondary">
            Outline Button
          </button>
        </div>
      </div>

      {/* Conversion notes */}
      <div className="bg-bg-7 p-4 rounded-base border border-border">
        <h4 className="font-semibold mb-2">Conversion Strategy:</h4>
        <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
          <li>Replace layout utilities (flex, grid, spacing) with Tailwind classes</li>
          <li>Convert simple component styles to Tailwind utilities</li>
          <li>Keep complex components (.progress-bar, .status-dot) as custom CSS</li>
          <li>Use CSS custom properties with Tailwind's color system</li>
          <li>Maintain game-specific styling in custom CSS where needed</li>
        </ul>
      </div>
    </div>
  );
};

export default TailwindConversionExample;
