// tests/unit/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock do localStorage
const mockLocalStorage = (() => {
  let store: any = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: any) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock do API
const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
};

vi.mock('@/lib/api', () => ({
  default: mockApi,
}));

describe('Auth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(true);
  });

  it('should login successfully', async () => {
    mockApi.post.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com', role: 'client' }
      }
    });

    const { result } = renderHook(() => useAuth());
    
    const loginResult = await result.current.login({
      email: 'test@example.com',
      password: 'password'
    });

    expect(loginResult.success).toBe(true);
    expect(mockLocalStorage.getItem('token')).toBe('mock-token');
  });

  it('should handle login failure', async () => {
    mockApi.post.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });

    const { result } = renderHook(() => useAuth());
    
    const loginResult = await result.current.login({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid credentials');
  });

  it('should logout successfully', () => {
    mockLocalStorage.setItem('token', 'mock-token');
    
    const { result } = renderHook(() => useAuth());
    
    result.current.logout();
    
    expect(mockLocalStorage.getItem('token')).toBeNull();
    expect(result.current.user).toBeNull();
  });
});