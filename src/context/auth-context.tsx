'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { INITIAL_USERS } from '@/lib/seed-data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  quickLogin: (userId: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'pdam_fieldticket_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default to admin for initial ease of use
        const defaultAdmin = INITIAL_USERS.find((u) => u.role === 'admin') || INITIAL_USERS[0];
        setUser(defaultAdmin);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultAdmin));
      }
    } catch (e) {
      console.warn('Error reading auth from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const quickLogin = (userId: string) => {
    const found = INITIAL_USERS.find((u) => u.user_id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // admin can do all
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        quickLogin,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
