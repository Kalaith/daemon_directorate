// src/test/useGameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGameStore } from '../stores/useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    // Clear localStorage to ensure clean state
    localStorage.clear();
    
    // Clear any existing zustand state
    const { result } = renderHook(() => useGameStore());
    act(() => {
      // Use resetToInitialState for tests to avoid startNewGame
      result.current.resetToInitialState();
    });
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useGameStore());
    
    expect(result.current.resources.credits).toBe(500);
    expect(result.current.resources.soulEssence).toBe(0);
    expect(result.current.resources.bureaucraticLeverage).toBe(0);
    expect(result.current.resources.rawMaterials).toBe(0);
    expect(result.current.currentTab).toBe('dashboard');
    expect(result.current.gameStarted).toBe(false);
  });

  it('can afford items when credits are sufficient', () => {
    const { result } = renderHook(() => useGameStore());
    
    expect(result.current.canAfford(100)).toBe(true);
    expect(result.current.canAfford(600)).toBe(false);
  });

  it('spends credits correctly', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      const success = result.current.spendCredits(100);
      expect(success).toBe(true);
    });
    
    expect(result.current.resources.credits).toBe(400);
  });

  it('prevents spending more credits than available', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      const success = result.current.spendCredits(600);
      expect(success).toBe(false);
    });
    
    expect(result.current.resources.credits).toBe(500);
  });

  it('adds resources correctly', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.addResources(100, 50, 25, 10);
    });
    
    expect(result.current.resources.credits).toBe(600);
    expect(result.current.resources.soulEssence).toBe(50);
    expect(result.current.resources.bureaucraticLeverage).toBe(25);
    expect(result.current.resources.rawMaterials).toBe(10);
  });

  it('changes current tab', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.setCurrentTab('team');
    });
    
    expect(result.current.currentTab).toBe('team');
  });

  it('toggles daemon selection', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.toggleDaemonSelection('daemon-1');
    });
    
    expect(result.current.selectedDaemons.has('daemon-1')).toBe(true);
    
    act(() => {
      result.current.toggleDaemonSelection('daemon-1');
    });
    
    expect(result.current.selectedDaemons.has('daemon-1')).toBe(false);
  });

  it('clears daemon selection', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.toggleDaemonSelection('daemon-1');
      result.current.toggleDaemonSelection('daemon-2');
      result.current.clearDaemonSelection();
    });
    
    expect(result.current.selectedDaemons.size).toBe(0);
  });

  it('starts a new game with initial daemons and equipment', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.startNewGame();
    });
    
    expect(result.current.gameStarted).toBe(true);
    expect(result.current.daemons.length).toBeGreaterThan(0);
    expect(result.current.equipment.length).toBeGreaterThan(0);
    expect(result.current.rooms.length).toBeGreaterThan(0);
    expect(result.current.planets.length).toBeGreaterThan(0);
  });

  it('generates unique IDs', () => {
    const { result } = renderHook(() => useGameStore());
    
    const id1 = result.current.generateId();
    const id2 = result.current.generateId();
    
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });
});
