'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('sahideal_admin_token');
    if (stored) setToken(stored);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return { error: 'Invalid credentials. Please try again.' };
      const data = await res.json();
      localStorage.setItem('sahideal_admin_token', data.access);
      localStorage.setItem('sahideal_admin_refresh', data.refresh);
      setToken(data.access);
      return {};
    } catch {
      return { error: 'Network error. Please check if the backend is running.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('sahideal_admin_token');
    localStorage.removeItem('sahideal_admin_refresh');
    setToken(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('sahideal_admin_token');
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
