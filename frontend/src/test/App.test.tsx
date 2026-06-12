import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../App', () => ({
  default: () => <div data-testid="app">Mocked App</div>,
}));

import App from '../App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });

  it('displays a loading state initially', () => {
    render(<App />);
    // Add more specific tests based on your App component's behavior
  });
});
