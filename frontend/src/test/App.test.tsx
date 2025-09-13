// src/test/App.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the game store
vi.mock('../stores/useGameStore', () => ({
  useGameStore: () => ({
    currentTab: 'dashboard',
    showTutorial: false,
    showMemorial: false,
    showMissionModal: false,
    showMissionResults: false,
    showEventModal: false,
    initializeGame: vi.fn(),
  }),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Daemon Directorate')).toBeDefined();
  });

  it('renders the header component', () => {
    render(<App />);
    expect(screen.getByText('Daemon Directorate')).toBeDefined();
  });

  it('renders the tab navigation', () => {
    render(<App />);
    expect(screen.getByText('Corporate Dashboard')).toBeDefined();
    expect(screen.getByText('Team Management')).toBeDefined();
    expect(screen.getByText('Planetary Operations')).toBeDefined();
    expect(screen.getByText('Apartment HQ')).toBeDefined();
    expect(screen.getByText('Equipment Depot')).toBeDefined();
  });

  it('renders the dashboard by default', () => {
    render(<App />);
    expect(screen.getByText('Corporate Overview')).toBeDefined();
  });

  it('renders game controls', () => {
    render(<App />);
    expect(screen.getByText('Save Progress')).toBeDefined();
  });
});
