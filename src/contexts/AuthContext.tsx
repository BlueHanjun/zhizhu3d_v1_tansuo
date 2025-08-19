import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiService } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  // 修改login函数中的响应处理
  const login = async (phone: string, code: string) => {
    setLoading(true);
    try {
      const response = await apiService.auth.login(phone, code);
      debugger;
      // API文档中返回的是token字段
      if (response.data.token) {
        localStorage.setItem('api_key', response.data.token);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
    } catch (error) {
      // 即使API调用失败，也要清除本地状态
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('api_key');
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
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