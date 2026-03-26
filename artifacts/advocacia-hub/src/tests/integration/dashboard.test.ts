// tests/integration/dashboard.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

// Mock do contexto de autenticação
const mockAuthContext = {
  user: { id: 1, email: 'admin@example.com', role: 'admin' },
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  loading: false,
  isAuthenticated: true,
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

// Mock do componente Layout
vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

// Mock dos componentes de dashboard
vi.mock('@/components/DashboardStats', () => ({
  DashboardStats: ({ stats }: any) => <div data-testid="dashboard-stats">{JSON.stringify(stats)}</div>,
}));

describe('Dashboard Page', () => {
  it('should render dashboard with stats', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
  });

  it('should display dashboard title', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Initially shows loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});