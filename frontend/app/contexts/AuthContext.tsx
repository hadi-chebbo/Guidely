"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  school?: string;
  grade?: string;
  preferredLanguage?: string;
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
    // Mock login - in future, replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    // Mock validation: accept any email/password for demo
    if (!email || !password) {
      throw new Error('Invalid credentials');
    }

    const mockUser = {
      id: 1,
      name: 'Demo User',
      email: email,
      role: 'student' as const,
    };
    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem('auth_token', mockToken);
    document.cookie = `auth_token=${mockToken}; path=/; max-age=${rememberMe ? 60*60*24*30 : ''}`;
    document.cookie = `user_role=${mockUser.role}; path=/; max-age=${rememberMe ? 60*60*24*30 : ''}`;
    setState({ user: mockUser, isAuthenticated: true, loading: false });
  };

  const logout = async () => {
    // Mock logout - in future, replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const register = async (data: RegisterData) => {
    // Mock register - in future, replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    // Mock validation: accept any data
    if (!data.name || !data.email || !data.password) {
      throw new Error('Registration failed');
    }

    console.log('Mock registration successful:', data);
    // In real API, this might return user data or require email verification
  };

  const checkAuth = async () => {
    // Mock auth check - in future, replace with real API call to /api/user
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    // For mock, assume not authenticated on load
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const forgotPassword = async (email: string) => {
    // Mock forgot password - in future, replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1400)); // Simulate API delay

    if (!email) {
      throw new Error('Email is required');
    }

    // Mock: send reset email
    console.log('Mock password reset email sent to:', email);
  };

  const verifyEmail = async (token: string) => {
    // Mock email verification - in future, replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    if (!token) {
      throw new Error('Invalid verification token');
    }

    // Mock: verify email
    console.log('Mock email verified with token:', token);
  };

  const resendVerificationEmail = async (email: string) => {
    // Mock resend verification - in future, replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    if (!email) {
      throw new Error('Email is required');
    }

    // Mock: resend verification email
    console.log('Mock verification email resent to:', email);
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
