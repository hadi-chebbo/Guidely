﻿"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<authService.User>;

  logout: () => Promise<void>;
  register: (data: authService.RegisterFormData) => Promise<void>;
  refreshAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (
    id: string,
    hash: string,
    signatureParams: { expires: string; signature: string }
  ) => Promise<authService.User | null>;
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

  const setAuth = useCallback((user: authService.User | null) => {
    setState({
      user,
      isAuthenticated: !!user,
      loading: false,
    });
  }, []);

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
  }, [setAuth]);

  /* ───────────────────────────── LOGIN ───────────────────────────── */

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    setState((p) => ({ ...p, loading: true }));

    try {
      const user = await authService.login({
        email,
        password,
        rememberMe,
      });

      setAuth(user);

      router.push(
        user.role === "admin"
          ? "/admin"
          : user.role === "mentor"
            ? "/mentor"
            : "/student/dashboard"
      );

      return user;
    } catch (err) {
      setAuth(null);
      throw err;
    } finally {
      setState((p) => ({ ...p, loading: false }));
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

    try {
      await authService.register(data);

      setAuth(null);
    } finally {
      setState((p) => ({ ...p, loading: false }));
    }
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
    return authService.forgotPassword(email);
  };

  /* ───────────────────────────── EMAIL ───────────────────────────── */

  const verifyEmail = useCallback(async (
    id: string,
    hash: string,
    signatureParams: { expires: string; signature: string }
  ) => {
    const verifiedUser = await authService.verifyEmail(id, hash, signatureParams);
    if (verifiedUser) setAuth(verifiedUser);
    return verifiedUser;
  }, [setAuth]);

  const resendVerificationEmail = async (email: string) => {
    return authService.resendVerificationEmail(email);
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
