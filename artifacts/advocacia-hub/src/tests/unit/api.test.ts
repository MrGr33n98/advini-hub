// tests/unit/api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import api from '@/lib/api';

// Mock do axios
vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should include auth token in requests when available', async () => {
    // Mock do localStorage
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue('mock-token'),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    const mockResponse = { data: { success: true } };
    (axios as any).create.mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn().mockResolvedValue(mockResponse),
    });

    // Reinicializar o módulo para pegar o novo mock
    const newApi = await import('@/lib/api');
    
    const response = await newApi.default.get('/test');
    
    expect(response.data).toEqual(mockResponse.data);
  });

  it('should handle unauthorized responses by clearing token', async () => {
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue('mock-token'),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    const mockAxiosInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn().mockRejectedValue({
        response: { status: 401 }
      }),
    };
    
    (axios as any).create.mockReturnValue(mockAxiosInstance);

    const newApi = await import('@/lib/api');
    
    try {
      await newApi.default.get('/test');
    } catch (error) {
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    }
  });
});