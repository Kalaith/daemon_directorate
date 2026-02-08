// src/test/components/GameControls.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameControls from '../../components/ui/GameControls';

// Mock the game store
const mockStore = {
  resetGame: vi.fn(),
};

vi.mock('../../stores/composedStore', () => ({
  useGameStore: () => mockStore,
}));

const confirmMock = vi.fn(() => true);
Object.defineProperty(window, 'confirm', {
  value: confirmMock,
  writable: true
});

describe('GameControls Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    confirmMock.mockReturnValue(true);
  });

  it('renders reset button only', () => {
    render(<GameControls />);

    expect(screen.getByText('Reset Game')).toBeDefined();
    expect(screen.queryByText('Save Progress')).toBeNull();
    expect(screen.queryByText('Load Progress')).toBeNull();
  });

  it('calls resetGame when reset button is clicked and confirmed', () => {
    render(<GameControls />);

    const resetButton = screen.getByText('Reset Game');
    fireEvent.click(resetButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to start a new corporate restructure? All progress will be lost.'
    );
    expect(mockStore.resetGame).toHaveBeenCalledOnce();
  });

  it('does not call resetGame when reset is cancelled', () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    render(<GameControls />);

    const resetButton = screen.getByText('Reset Game');
    fireEvent.click(resetButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockStore.resetGame).not.toHaveBeenCalled();
  });

  it('has correct styling classes', () => {
    render(<GameControls />);

    const resetButton = screen.getByText('Reset Game');
    expect(resetButton.className).toContain('bg-daemon-danger');
    expect(resetButton.className).toContain('text-daemon-text-bright');
    expect(resetButton.className).toContain('font-mono');
  });
});
