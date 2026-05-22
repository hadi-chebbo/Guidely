﻿"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  completeGoogleLogin: (token: string) => Promise<authService.User>;
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
  const authRequestRef = useRef(0);

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
      const requestId = ++authRequestRef.current;

      try {
        const user = await authService.checkAuth();
        if (requestId !== authRequestRef.current) return;
        setAuth(user);
      } catch {
        if (requestId !== authRequestRef.current) return;
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
    const requestId = ++authRequestRef.current;
    setState((p) => ({ ...p, loading: true }));

    try {
      const user = await authService.login({
        email,
        password,
        rememberMe,
      });

      if (requestId === authRequestRef.current) {
        setAuth(user);
      }

      return user;
    } catch (err) {
      if (requestId === authRequestRef.current) {
        setAuth(null);
      }
      throw err;
    } finally {
      if (requestId === authRequestRef.current) {
        setState((p) => ({ ...p, loading: false }));
      }
    }
  };

  /* ───────────────────────────── GOOGLE LOGIN ───────────────────────────── */

  const completeGoogleLogin = useCallback(async (token: string) => {
    const requestId = ++authRequestRef.current;
    setState((p) => ({ ...p, loading: true }));

    try {
      const user = await authService.completeGoogleLogin(token);

      if (requestId === authRequestRef.current) {
        setAuth(user);
      }

      return user;
    } catch (err) {
      if (requestId === authRequestRef.current) {
        setAuth(null);
      }
      throw err;
    } finally {
      if (requestId === authRequestRef.current) {
        setState((p) => ({ ...p, loading: false }));
      }
    }
  }, [setAuth]);

  /* ───────────────────────────── LOGOUT ───────────────────────────── */

  const logout = async () => {
    const requestId = ++authRequestRef.current;
    setState((p) => ({ ...p, loading: true }));

    try {
      await authService.logout();
    } finally {
      if (requestId === authRequestRef.current) {
        setAuth(null);
      }
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
    const requestId = ++authRequestRef.current;
    setState((p) => ({ ...p, loading: true }));

    try {
      const user = await authService.checkAuth();
      if (requestId !== authRequestRef.current) return;
      setAuth(user);
    } catch {
      if (requestId !== authRequestRef.current) return;
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
        completeGoogleLogin,
        forgotPassword,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
