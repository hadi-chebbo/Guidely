﻿"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import * as authService from "@/services/authService";
import { useRouter } from "next/navigation";

/* ───────────────────────────── TYPES ───────────────────────────── */

interface AuthState {
  user: authService.User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<authService.User>;
  logout: () => Promise<void>;
  register: (data: authService.RegisterFormData) => Promise<void>;
  refreshAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (id: string, hash: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

/* ───────────────────────────── CONTEXT ───────────────────────────── */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/* ───────────────────────────── PROVIDER ───────────────────────────── */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  /* ───────────────────────────── SET AUTH ───────────────────────────── */

  const setAuth = (user: authService.User | null) => {
    setState({
      user,
      isAuthenticated: !!user,
      loading: false,
    });
  };

  /* ───────────────────────────── INIT ───────────────────────────── */

  useEffect(() => {
    const init = async () => {
      try {
        const user = await authService.checkAuth();
        setAuth(user);
      } catch {
        setAuth(null);
      }
    };

    init();
  }, []);

  /* ───────────────────────────── LOGIN ───────────────────────────── */

  const login = async (email: string, password: string) => {
    setState((p) => ({ ...p, loading: true }));

    try {
      const user = await authService.login(email, password);

      setAuth(user);

      router.push("/dashboard");

      return user;
    } catch (err) {
      setAuth(null);
      throw err;
    }
  };

  /* ───────────────────────────── LOGOUT ───────────────────────────── */

  const logout = async () => {
    setState((p) => ({ ...p, loading: true }));

    try {
      await authService.logout();
    } finally {
      setAuth(null);
      router.push("/login");
    }
  };

  /* ───────────────────────────── REGISTER ───────────────────────────── */

  const register = async (data: authService.RegisterFormData) => {
    setState((p) => ({ ...p, loading: true }));

    await authService.register(data);

    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    router.push("/verify-email");
  };

  /* ───────────────────────────── REFRESH ───────────────────────────── */

  const refreshAuth = async () => {
    setState((p) => ({ ...p, loading: true }));

    try {
      const user = await authService.checkAuth();
      setAuth(user);
    } catch {
      setAuth(null);
    }
  };

  /* ───────────────────────────── PASSWORD ───────────────────────────── */

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  /* ───────────────────────────── EMAIL ───────────────────────────── */

  const verifyEmail = async (id: string, hash: string) => {
    await authService.verifyEmail(id, hash);
  };

  const resendVerificationEmail = async (email: string) => {
    await authService.resendVerificationEmail(email);
  };

  /* ───────────────────────────── PROVIDER ───────────────────────────── */

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        refreshAuth,
        forgotPassword,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};