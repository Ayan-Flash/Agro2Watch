import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { User, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  // Load persisted auth on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agro_auth');
      if (stored) {
        const parsed = JSON.parse(stored) as AuthState;
        if (parsed && parsed.user && parsed.isAuthenticated) {
          setAuthState(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (user: User) => {
    const nextState: AuthState = { user, isAuthenticated: true };
    setAuthState(nextState);
    try {
      localStorage.setItem('agro_auth', JSON.stringify(nextState));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    try {
      localStorage.removeItem('agro_auth');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};