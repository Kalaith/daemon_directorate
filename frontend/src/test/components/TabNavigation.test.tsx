// src/test/components/TabNavigation.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabNavigation from '../../components/layout/TabNavigation';

// Mock the game store
const mockStore = {
  currentTab: 'dashboard',
  setCurrentTab: vi.fn(),
};

vi.mock('../../stores/useGameStore', () => ({
  useGameStore: () => mockStore,
}));

describe('TabNavigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.currentTab = 'dashboard';
  });

  it('renders all tab buttons', () => {
    render(<TabNavigation />);

    expect(screen.getByText('Corporate Dashboard')).toBeDefined();
    expect(screen.getByText('Team Management')).toBeDefined();
    expect(screen.getByText('Planetary Operations')).toBeDefined();
    expect(screen.getByText('Apartment HQ')).toBeDefined();
    expect(screen.getByText('Equipment Depot')).toBeDefined();
  });

  it('calls setCurrentTab when a tab is clicked', () => {
    render(<TabNavigation />);

    const teamTab = screen.getByText('Team Management');
    fireEvent.click(teamTab);

    expect(mockStore.setCurrentTab).toHaveBeenCalledWith('team');
  });

  it('highlights the current active tab', () => {
    mockStore.currentTab = 'team';
    render(<TabNavigation />);

    const activeTab = screen.getByText('Team Management');
    expect(activeTab.className).toContain('bg-daemon-surface');
  });

  it('shows correct button states for inactive tabs', () => {
    mockStore.currentTab = 'dashboard';
    render(<TabNavigation />);

    const inactiveTab = screen.getByText('Team Management');
    expect(inactiveTab.className).toContain('border-transparent');
    expect(inactiveTab.className).toContain('hover:bg-cream-50/50');
  });

  it('has correct navigation structure', () => {
    render(<TabNavigation />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeDefined();
  });
});
