import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { showSuccess } from '@/utils/toast';

interface User {
  id: string;
  phone_number: string;
  real_name: string | null;
  id_number: string | null;
  balance: number;
  created_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        const userData = await api.get<User>('/api/user/me');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
        setToken(null);
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    showSuccess("您已成功退出登录。");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token && !!user, user, login, logout, isLoading }}>
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