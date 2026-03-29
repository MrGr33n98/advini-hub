// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import api from '@/lib/api';
import { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const response = await api.get('/profile');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      setLocation('/');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLocation('/login');
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      setLocation('/');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  return {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };
};