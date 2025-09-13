import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import Card from './Card';
import type { EventChoice, EventEffect } from '../../types/game';

export const CorporateEventModal: React.FC = () => {
  const {
    showEventModal,
    currentEvent,
    setShowEventModal,
    resolveEvent,
    resources
  } = useGameStore();

  if (!showEventModal || !currentEvent) return null;

  const canAffordChoice = (choice: EventChoice): boolean => {
    // Check if choice has any resource costs in its effects
    const costs = choice.effects.filter(effect => effect.value < 0);
    return costs.every(cost => {
      switch (cost.type) {
        case 'credits':
          return resources.credits >= Math.abs(cost.value);
        case 'soulEssence':
          return resources.soulEssence >= Math.abs(cost.value);
        case 'bureaucraticLeverage':
          return resources.bureaucraticLeverage >= Math.abs(cost.value);
        case 'rawMaterials':
          return resources.rawMaterials >= Math.abs(cost.value);
        default:
          return true;
      }
    });
  };

  const meetsRequirements = (): boolean => {
    if (!currentEvent.requirements) return true;
    
    return Object.entries(currentEvent.requirements).every(([resource, required]) => {
      const resourceKey = resource as keyof typeof resources;
      return resources[resourceKey] >= required;
    });
  };

  const handleChoice = (choiceIndex: number) => {
    if (currentEvent.choices) {
      const choice = currentEvent.choices[choiceIndex];
      if (canAffordChoice(choice)) {
        resolveEvent(currentEvent.id, choiceIndex);
        setShowEventModal(false);
      }
    }
  };

  const handleAutoEvent = () => {
    resolveEvent(currentEvent.id);
    setShowEventModal(false);
  };

  const renderEffectDescription = (effect: EventEffect): string => {
    const value = effect.value;
    const sign = value >= 0 ? '+' : '';
    
    switch (effect.type) {
      case 'credits':
        return `${sign}${value} Credits`;
      case 'soulEssence':
        return `${sign}${value} Soul Essence`;
      case 'bureaucraticLeverage':
        return `${sign}${value} Bureaucratic Leverage`;
      case 'rawMaterials':
        return `${sign}${value} Raw Materials`;
      case 'morale':
        return `${sign}${value} Morale (all daemons)`;
      case 'equipment_durability':
        return `${sign}${value} Durability (all equipment)`;
      case 'recruitment_discount':
        return `${Math.round(value * 100)}% recruitment discount`;
      case 'equipment_discount':
        return `${Math.round(value * 100)}% repair cost reduction`;
      case 'productivity_bonus':
        return `${Math.round(value * 100)}% mission success bonus`;
      case 'passive_income':
        return `+${value} credits per day`;
      case 'daemon_retirement':
        return `${value} daemon(s) transferred`;
      default:
        return effect.description;
    }
  };

  if (!meetsRequirements()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <Card className="max-w-md mx-4 p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-4">{currentEvent.description}</p>
          <p className="text-red-300 mb-4">
            Insufficient resources or authority to participate in this event.
          </p>
          <button
            onClick={() => setShowEventModal(false)}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Acknowledge
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-orange-400">Corporate Directive</h2>
          <div className="text-sm text-gray-400">
            {currentEvent.type === 'choice' ? 'Decision Required' : 'Mandatory Compliance'}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-teal-400 mb-3">
          {currentEvent.title}
        </h3>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {currentEvent.description}
        </p>

        {currentEvent.type === 'automatic' && currentEvent.effects && (
          <div className="space-y-4">
            <h4 className="font-semibold text-yellow-400">Immediate Effects:</h4>
            <div className="bg-gray-800 p-4 rounded">
              {currentEvent.effects.map((effect, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-gray-300">{effect.description}</span>
                  <span className={`font-mono ${effect.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {renderEffectDescription(effect)}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAutoEvent}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white px-4 py-3 rounded font-semibold"
            >
              Acknowledge and Continue
            </button>
          </div>
        )}

        {currentEvent.type === 'choice' && currentEvent.choices && (
          <div className="space-y-4">
            <h4 className="font-semibold text-yellow-400">Choose Your Response:</h4>
            {currentEvent.choices.map((choice, index) => (
              <div key={index} className="border border-gray-600 rounded p-4 hover:border-teal-500 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-semibold text-white">{choice.label}</h5>
                    <p className="text-gray-400 text-sm mt-1">{choice.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Consequences:</h6>
                  {choice.effects.map((effect, effectIndex) => (
                    <div key={effectIndex} className="flex justify-between items-center py-1 text-sm">
                      <span className="text-gray-300">{effect.description}</span>
                      <span className={`font-mono ${effect.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {renderEffectDescription(effect)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleChoice(index)}
                  disabled={!canAffordChoice(choice)}
                  className={`w-full px-4 py-2 rounded font-semibold transition-colors ${
                    canAffordChoice(choice)
                      ? 'bg-teal-600 hover:bg-teal-500 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAffordChoice(choice) ? 'Select This Option' : 'Cannot Afford'}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
