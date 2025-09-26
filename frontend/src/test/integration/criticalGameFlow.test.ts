// test/integration/criticalGameFlow.test.ts - Critical game flow integration tests
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGameStore } from '../../stores/composedStore';

describe('Critical Game Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage and reset store state
    localStorage.clear();
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.resetToInitialState();
    });
  });

  describe('Game Initialization Flow', () => {
    it('should initialize game with correct starting state', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const state = result.current;

      expect(state.resources.credits).toBe(500);
      expect(state.daemons.length).toBeGreaterThan(0);
      expect(state.gameStarted).toBe(false);
      expect(state.currentTab).toBe('dashboard');
    });

    it('should start new game correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.startNewGame();
      });

      const state = result.current;

      expect(state.gameStarted).toBe(true);
      expect(state.daysPassed).toBe(0);
      expect(state.corporateTier.level).toBe(1);
    });
  });

  describe('Daemon Management Flow', () => {
    it('should recruit daemon when sufficient credits available', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.generateRecruitmentPool();
      });

      const initialDaemonCount = result.current.daemons.length;
      const recruitmentCandidate = result.current.recruitmentPool[0];

      if (recruitmentCandidate && result.current.canAfford(50)) {
        act(() => {
          result.current.recruitDaemon(recruitmentCandidate.id);
        });

        expect(result.current.daemons.length).toBe(initialDaemonCount + 1);
        expect(result.current.recruitmentPool).not.toContain(
          recruitmentCandidate
        );
        expect(result.current.resources.credits).toBeLessThan(500);
      }
    });

    it('should not recruit daemon when insufficient credits', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.generateRecruitmentPool();
        // Spend all credits
        result.current.spendCredits(500);
      });

      const initialDaemonCount = result.current.daemons.length;
      const recruitmentCandidate = result.current.recruitmentPool[0];

      if (recruitmentCandidate) {
        act(() => {
          result.current.recruitDaemon(recruitmentCandidate.id);
        });

        expect(result.current.daemons.length).toBe(initialDaemonCount);
        expect(result.current.resources.credits).toBe(0);
      }
    });

    it('should handle daemon selection correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const daemon = result.current.daemons[0];

      act(() => {
        result.current.toggleDaemonSelection(daemon.id);
      });

      expect(result.current.selectedDaemons.has(daemon.id)).toBe(true);

      act(() => {
        result.current.toggleDaemonSelection(daemon.id);
      });

      expect(result.current.selectedDaemons.has(daemon.id)).toBe(false);
    });
  });

  describe('Mission Execution Flow', () => {
    it('should execute mission successfully with selected team', async () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.startNewGame();
      });

      const daemon = result.current.daemons[0];
      const planet = result.current.planets[0];

      act(() => {
        result.current.toggleDaemonSelection(daemon.id);
        result.current.selectPlanetForMission(planet.id, 'conquest');
      });

      const initialCredits = result.current.resources.credits;

      act(() => {
        result.current.executeMission('conquest');
      });

      // Mission should either succeed or fail, but resources should change
      const finalCredits = result.current.resources.credits;
      expect(finalCredits).not.toBe(initialCredits);

      // Daemon should have taken some damage
      const updatedDaemon = result.current.daemons.find(
        d => d.id === daemon.id
      );
      expect(updatedDaemon).toBeDefined();
      expect(updatedDaemon!.health).toBeLessThanOrEqual(daemon.health);
    });

    it('should not execute mission without selected team', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.startNewGame();
      });

      const planet = result.current.planets[0];

      act(() => {
        result.current.selectPlanetForMission(planet.id, 'conquest');
      });

      const initialState = { ...result.current };

      act(() => {
        result.current.executeMission('conquest');
      });

      // State should remain unchanged
      expect(result.current.resources).toEqual(initialState.resources);
    });
  });

  describe('Resource Management Flow', () => {
    it('should add resources correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const initialCredits = result.current.resources.credits;

      act(() => {
        result.current.addResources(100, 5, 3, 2);
      });

      expect(result.current.resources.credits).toBe(initialCredits + 100);
      expect(result.current.resources.soulEssence).toBe(5);
      expect(result.current.resources.bureaucraticLeverage).toBe(3);
      expect(result.current.resources.rawMaterials).toBe(2);
    });

    it('should spend credits correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const initialCredits = result.current.resources.credits;
      const spendAmount = 100;

      const canSpend = result.current.canAfford(spendAmount);

      if (canSpend) {
        act(() => {
          const success = result.current.spendCredits(spendAmount);
          expect(success).toBe(true);
        });

        expect(result.current.resources.credits).toBe(
          initialCredits - spendAmount
        );
      }
    });

    it('should not spend more credits than available', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const initialCredits = result.current.resources.credits;
      const overspendAmount = initialCredits + 100;

      act(() => {
        const success = result.current.spendCredits(overspendAmount);
        expect(success).toBe(false);
      });

      expect(result.current.resources.credits).toBe(initialCredits);
    });
  });

  describe('Room and Equipment Flow', () => {
    it('should upgrade room when affordable', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.startNewGame();
      });

      const room = result.current.rooms.find(r => r.id === 'living_quarters');

      if (room && result.current.canAfford(room.upgrade_cost)) {
        const initialLevel = room.level;
        const initialCredits = result.current.resources.credits;

        act(() => {
          result.current.upgradeRoom(room.id);
        });

        const updatedRoom = result.current.rooms.find(
          r => r.id === 'living_quarters'
        );
        expect(updatedRoom!.level).toBe(initialLevel + 1);
        expect(result.current.resources.credits).toBe(
          initialCredits - room.upgrade_cost
        );
      }
    });

    it('should assign daemon to room successfully', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const daemon = result.current.daemons[0];
      const room = result.current.rooms[0];

      act(() => {
        result.current.assignDaemonToRoom(daemon.id, room.id);
      });

      const updatedDaemon = result.current.daemons.find(
        d => d.id === daemon.id
      );
      expect(updatedDaemon!.assignments).toContain(room.id);
    });
  });

  describe('Corporate Progression Flow', () => {
    it('should check promotion requirements correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.startNewGame();
      });

      const initialTier = result.current.corporateTier.level;

      // This test depends on the specific promotion requirements
      // We can test the promotion check logic
      act(() => {
        result.current.checkPromotion();
      });

      // The tier should only change if requirements are met
      const finalTier = result.current.corporateTier.level;
      expect(finalTier).toBeGreaterThanOrEqual(initialTier);
    });
  });

  describe('Save/Load Flow', () => {
    it('should save and load game state correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
        result.current.startNewGame();
        result.current.addResources(1000);
      });

      const stateBeforeSave = {
        credits: result.current.resources.credits,
        gameStarted: result.current.gameStarted,
        daysPassed: result.current.daysPassed,
      };

      act(() => {
        result.current.saveGame();
      });

      act(() => {
        result.current.resetToInitialState();
      });

      // State should be reset
      expect(result.current.resources.credits).toBe(500);
      expect(result.current.gameStarted).toBe(false);

      act(() => {
        const loaded = result.current.loadGame();
        expect(loaded).toBe(true);
      });

      // State should be restored
      expect(result.current.resources.credits).toBe(stateBeforeSave.credits);
      expect(result.current.gameStarted).toBe(stateBeforeSave.gameStarted);
      expect(result.current.daysPassed).toBe(stateBeforeSave.daysPassed);
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle invalid daemon IDs gracefully', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const initialState = { ...result.current };

      // Try to recruit non-existent daemon
      act(() => {
        result.current.recruitDaemon('invalid-id');
      });

      // State should remain unchanged
      expect(result.current.daemons.length).toBe(initialState.daemons.length);
      expect(result.current.resources.credits).toBe(
        initialState.resources.credits
      );
    });

    it('should handle invalid room operations gracefully', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.initializeGame();
      });

      const initialCredits = result.current.resources.credits;

      // Try to upgrade non-existent room
      act(() => {
        result.current.upgradeRoom('invalid-room-id');
      });

      // Credits should remain unchanged
      expect(result.current.resources.credits).toBe(initialCredits);
    });
  });
});
