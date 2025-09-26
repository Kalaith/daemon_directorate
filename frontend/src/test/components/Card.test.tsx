// src/test/components/Card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../components/ui/Card';

describe('Card Component', () => {
  it('renders children content', () => {
    render(
      <Card>
        <h2>Test Card</h2>
        <p>This is test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Card')).toBeDefined();
    expect(screen.getByText('This is test content')).toBeDefined();
  });

  it('applies default CSS classes', () => {
    render(
      <Card>
        <div data-testid="card-content">Content</div>
      </Card>
    );
    
    const cardContent = screen.getByTestId('card-content');
    const cardElement = cardContent.parentElement;
    
    expect(cardElement?.className).toContain('bg-daemon-panel');
    expect(cardElement?.className).toContain('border-daemon-secondary');
    expect(cardElement?.className).toContain('rounded-lg');
    expect(cardElement?.className).toContain('p-6');
    expect(cardElement?.className).toContain('shadow-lg');
  });

  it('merges custom className with default classes', () => {
    render(
      <Card className="custom-class">
        <div data-testid="card-content">Content</div>
      </Card>
    );
    
    const cardContent = screen.getByTestId('card-content');
    const cardElement = cardContent.parentElement;
    
    expect(cardElement?.className).toContain('custom-class');
    expect(cardElement?.className).toContain('bg-surface'); // Default class still present
  });

  it('passes through additional props', () => {
    render(
      <Card data-testid="test-card" aria-label="Test card">
        <div>Content</div>
      </Card>
    );
    
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement).toBeDefined();
    expect(cardElement.getAttribute('aria-label')).toBe('Test card');
  });

  it('renders as a div element by default', () => {
    render(
      <Card data-testid="test-card">
        <div>Content</div>
      </Card>
    );
    
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement.tagName.toLowerCase()).toBe('div');
  });
});
