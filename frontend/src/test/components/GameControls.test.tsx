// src/test/components/GameControls.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameControls from '../../components/ui/GameControls';

// Mock the game store
const mockStore = {
  saveGame: vi.fn(),
  loadGame: vi.fn(),
  resetGame: vi.fn(),
};

vi.mock('../../stores/useGameStore', () => ({
  useGameStore: () => mockStore,
}));

describe('GameControls Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.confirm mock
    vi.mocked(window.confirm).mockReturnValue(true);
  });

  it('renders all control buttons', () => {
    render(<GameControls />);
    
    expect(screen.getByText('Save Progress')).toBeDefined();
    expect(screen.getByText('Load Game')).toBeDefined();
    expect(screen.getByText('New Corporate Restructure')).toBeDefined();
  });

  it('calls saveGame when save button is clicked', () => {
    render(<GameControls />);
    
    const saveButton = screen.getByText('Save Progress');
    fireEvent.click(saveButton);
    
    expect(mockStore.saveGame).toHaveBeenCalledOnce();
  });

  it('calls loadGame when load button is clicked', () => {
    render(<GameControls />);
    
    const loadButton = screen.getByText('Load Game');
    fireEvent.click(loadButton);
    
    expect(mockStore.loadGame).toHaveBeenCalledOnce();
  });

  it('calls resetGame when reset button is clicked and confirmed', () => {
    render(<GameControls />);
    
    const resetButton = screen.getByText('New Corporate Restructure');
    fireEvent.click(resetButton);
    
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to start a new corporate restructure? All progress will be lost.'
    );
    expect(mockStore.resetGame).toHaveBeenCalledOnce();
  });

  it('does not call resetGame when reset is cancelled', () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    render(<GameControls />);
    
    const resetButton = screen.getByText('New Corporate Restructure');
    fireEvent.click(resetButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockStore.resetGame).not.toHaveBeenCalled();
  });

  it('has correct styling classes', () => {
    render(<GameControls />);
    
    const container = screen.getByText('Save Progress').parentElement;
    expect(container?.className).toContain('fixed');
    expect(container?.className).toContain('bottom-4');
    expect(container?.className).toContain('right-4');
  });
});
