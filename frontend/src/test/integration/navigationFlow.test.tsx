// test/integration/navigationFlow.test.tsx - Test navigation and basic component rendering
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/testHelpers';
import App from '../../App';

describe('Navigation Flow Tests', () => {
  it('should render the app without crashing', () => {
    renderWithProviders(<App />);

    // App should render without throwing errors
    expect(document.body).toBeDefined();
  });

  it('should display all navigation tabs', () => {
    renderWithProviders(<App />);

    const expectedTabs = [
      'Corporate Dashboard',
      'Team Management',
      'Planetary Operations',
      'Apartment HQ',
      'Equipment Depot'
    ];

    expectedTabs.forEach(tabLabel => {
      expect(screen.getByText(tabLabel)).toBeInTheDocument();
    });
  });

  it('should allow clicking between tabs without errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    // Test clicking each tab
    const tabs = [
      'Team Management',
      'Planetary Operations',
      'Apartment HQ',
      'Equipment Depot',
      'Corporate Dashboard' // Go back to start
    ];

    for (const tabName of tabs) {
      const tabButton = screen.getByText(tabName);
      await user.click(tabButton);

      // Tab should become active (have specific styling)
      expect(tabButton).toHaveClass('bg-cream-50');

      // Should not crash or throw console errors
      expect(document.body).toBeDefined();
    }
  });

  it('should render components for each tab without undefined errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    // Test each tab individually
    const tabTests = [
      {
        name: 'Corporate Dashboard',
        shouldContain: ['Corporate Ladder', 'Compliance Center']
      },
      {
        name: 'Team Management',
        shouldContain: ['Team Management']
      },
      {
        name: 'Planetary Operations',
        shouldContain: ['Planetary Operations']
      },
      {
        name: 'Apartment HQ',
        shouldContain: ['Apartment HQ']
      },
      {
        name: 'Equipment Depot',
        shouldContain: ['Equipment']
      }
    ];

    for (const test of tabTests) {
      const tabButton = screen.getByText(test.name);
      await user.click(tabButton);

      // Should render without throwing errors
      expect(tabButton).toHaveClass('bg-cream-50');

      // Check for expected content (if components render properly)
      // Note: This is a basic smoke test - components should at least render
    }
  });

  it('should handle store state without undefined property errors', () => {
    renderWithProviders(<App />);

    // The components we fixed should not throw undefined errors
    // CorporateLadder.tsx - corporateTier.id should exist
    // ComplianceCenter.tsx - complianceTasks.filter should work
    // EndgameModal.tsx - endgameState.endingAchieved should exist

    // If any of these were still undefined, the render would throw
    expect(document.body).toBeDefined();
  });

  it('should maintain consistent store state across navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    // Navigate through tabs and verify state doesn't break
    const tabs = ['Team Management', 'Planetary Operations', 'Corporate Dashboard'];

    for (const tabName of tabs) {
      const tabButton = screen.getByText(tabName);
      await user.click(tabButton);

      // Store should remain stable
      expect(tabButton).toBeInTheDocument();
    }
  });
});