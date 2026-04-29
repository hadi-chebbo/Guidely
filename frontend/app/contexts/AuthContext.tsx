﻿"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "@/services/authService";

interface AuthState {
  user: authService.User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<authService.User>;

  logout: () => Promise<void>;
  register: (data: authService.RegisterData) => Promise<authService.User>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  /* ───────────────────────────── */

  const startLoading = () =>
    setState((prev) => ({ ...prev, loading: true }));

  const stopLoading = () =>
    setState((prev) => ({ ...prev, loading: false }));

  /* ─────────────────────────────
     AUTH ACTIONS
  ───────────────────────────── */

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ) => {
    startLoading();
    try {
      const user = await authService.login(email, password, rememberMe);

      setState({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return user;
    } catch (err) {
      stopLoading();
      throw err;
    }
  };

  const logout = async () => {
    startLoading();
    try {
      await authService.logout();

      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (err) {
      stopLoading();
      throw err;
    }
  };

  const register = async (data: authService.RegisterData) => {
    startLoading();
    try {
      const user = await authService.register(data);

      setState({
        user,
        isAuthenticated: false,
        loading: false,
      });

      return user;
    } catch (err) {
      stopLoading();
      throw err;
    }
  };

  const checkAuth = async () => {
    startLoading();
    try {
      const user = await authService.checkAuth();

      setState({
        user: user ?? null,
        isAuthenticated: !!user,
        loading: false,
      });
    } catch {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  };

  const forgotPassword = async (email: string) => {
    startLoading();
    try {
      await authService.forgotPassword(email);
    } finally {
      stopLoading();
    }
  };

  const verifyEmail = async (token: string) => {
    startLoading();
    try {
      await authService.verifyEmail(token);
    } finally {
      stopLoading();
    }
  };

  const resendVerificationEmail = async (email: string) => {
    startLoading();
    try {
      await authService.resendVerificationEmail(email);
    } finally {
      stopLoading();
    }
  };

  /* ───────────────────────────── */

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        checkAuth,
        forgotPassword,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};