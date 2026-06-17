import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authApi, setToken, removeToken } from '../lib/api';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Normalize user fields for backward compatibility with UI
function normalizeUser(u: any): User {
  return {
    ...u,
    full_name: u.fullName || u.full_name,
    fullName: u.fullName || u.full_name,
    avatar_url: u.avatarUrl || u.avatar_url,
    avatarUrl: u.avatarUrl || u.avatar_url,
    created_at: u.createdAt || u.created_at,
    addresses: u.addresses || [],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('shopeezz_token');
        if (token) {
          const res = await authApi.getProfile();
          if (mounted && res.data) {
            setUser(normalizeUser(res.data));
          }
        }
      } catch {
        // Token invalid/expired — clear it
        removeToken();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const res = await authApi.register(fullName, email, password);
      if (res.data) {
        setToken(res.data.token);
        setUser(normalizeUser(res.data.user));
      }
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      if (res.data) {
        setToken(res.data.token);
        setUser(normalizeUser(res.data.user));
      }
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    removeToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const res = await authApi.updateProfile(updates as Record<string, unknown>);
      if (res.data) {
        setUser(normalizeUser(res.data));
      }
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
