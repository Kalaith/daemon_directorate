// components/game/EventChainTracker.tsx
import React from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';

const EventChainTracker: React.FC = () => {
  const { activeEventChains } = useGameStore();

  const activeChains = Object.values(activeEventChains || {});

  if (activeChains.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-header font-semibold text-daemon-text-bright uppercase tracking-wide">
        Active Storylines
      </h3>
      
      {activeChains.map(chain => (
        <Card
          key={chain.chainId}
          className="bg-daemon-panel border-daemon-secondary hover:border-daemon-primary transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-header font-semibold text-daemon-text-bright text-lg">
              {chain.chainId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h4>
            <div className="text-xs">
              <span className="bg-daemon-primary text-daemon-text-bright px-2 py-1 rounded-lg font-mono">
                Phase {chain.currentPosition + 1}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-daemon-text-muted font-mono uppercase tracking-wide">
                Progress:
              </span>
              <div className="flex-1 bg-daemon-dark rounded-lg h-2">
                <div
                  className="bg-daemon-primary h-2 rounded-lg transition-all duration-300"
                  style={{ width: `${Math.min(100, (chain.currentPosition + 1) * 33)}%` }}
                />
              </div>
            </div>
          </div>

          {chain.pendingEvents.length > 0 && (
            <div className="bg-daemon-surface p-3 rounded-lg border border-daemon-secondary">
              <h5 className="text-sm font-semibold text-daemon-text-bright mb-2 uppercase tracking-wide">
                Upcoming Events:
              </h5>
              {chain.pendingEvents.map((event, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-daemon-text">
                    {event.eventId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-daemon-text-muted font-mono">
                    Day {event.triggerDay}
                  </span>
                </div>
              ))}
            </div>
          )}

          {Object.keys(chain.storylineData).length > 0 && (
            <div className="mt-4 text-xs text-daemon-text-muted">
              <div className="bg-daemon-dark p-2 rounded-lg">
                <span className="font-mono uppercase tracking-wide">Storyline Data:</span>
                <div className="mt-1">
                  {Object.entries(chain.storylineData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default EventChainTracker;