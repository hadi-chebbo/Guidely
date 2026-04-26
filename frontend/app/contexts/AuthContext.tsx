"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';

interface AuthState {
  user: authService.User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<authService.User>;
  logout: () => Promise<void>;
  register: (data: authService.RegisterData) => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const login = async (email: string, password: string, rememberMe = false) => {
    const user = await authService.login(email, password, rememberMe);
    setState({ user, isAuthenticated: true, loading: false });
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const register = async (data: authService.RegisterData) => {
    await authService.register(data);
  };

  const checkAuth = async () => {
    const user = await authService.checkAuth();

    if (user) {
      setState({ user, isAuthenticated: true, loading: false });
      return;
    }

    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const verifyEmail = async (token: string) => {
    await authService.verifyEmail(token);
  };

  const resendVerificationEmail = async (email: string) => {
    await authService.resendVerificationEmail(email);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, checkAuth, forgotPassword, verifyEmail, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
