import api from "@/lib/api";

/* ─────────────────────────────
   TYPES
───────────────────────────── */

export type UserRole = "student" | "mentor" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type BackendUser = Omit<User, "role"> & {
  role?: UserRole | null;
};

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  school?: string;
  grade?: string;
  preferredLanguage?: string;
}

/* ─────────────────────────────
   STORAGE KEYS
───────────────────────────── */

const authCookieName = "auth_token";
const roleCookieName = "user_role";
const localStorageTokenKey = "token";
const localStorageRoleKey = "role";

/* ─────────────────────────────
   HELPERS
───────────────────────────── */

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; sameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const setLocalStorageValue = (name: string, value: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(name, value);
};

const removeLocalStorageValue = (name: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(name);
};

const normalizeUser = (user: BackendUser): User => ({
  ...user,
  role: user.role ?? "student",
});

const transformToBackendRequest = (data: RegisterData) => ({
  name: `${data.firstName} ${data.lastName}`.trim(),
  email: data.email,
  password: data.password,
  password_confirmation: data.password,
  school: data.school,
  grade: data.grade,
  preferred_language: data.preferredLanguage,
});

/* ─────────────────────────────
   AUTH API
───────────────────────────── */

export const login = async (
  email: string,
  password: string,
  rememberMe = false
): Promise<User> => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const { user: backendUser, token } = response.data.data;

  const user = normalizeUser(backendUser as BackendUser);
  const cookieMaxAge = rememberMe
    ? 60 * 60 * 24 * 30
    : 60 * 60 * 24;

  setCookie(authCookieName, token, cookieMaxAge);
  setCookie(roleCookieName, user.role, cookieMaxAge);

  setLocalStorageValue(localStorageTokenKey, token);
  setLocalStorageValue(localStorageRoleKey, user.role);

  return user;
};

/* ───────────────────────────── */

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    deleteCookie(authCookieName);
    deleteCookie(roleCookieName);
    removeLocalStorageValue(localStorageTokenKey);
    removeLocalStorageValue(localStorageRoleKey);
  }
};

/* ───────────────────────────── */

export const register = async (data: RegisterData): Promise<User> => {
  const backendData = transformToBackendRequest(data);
  const response = await api.post("/auth/register", backendData);

  const payload = response.data.data;
  const rawUser = payload?.user ?? payload;

  return normalizeUser(rawUser as BackendUser);
};

/* ───────────────────────────── */

export const checkAuth = async (): Promise<User | null> => {
  let token = getCookieValue(authCookieName);

  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem(localStorageTokenKey);
  }

  if (!token) return null;

  if (typeof window !== "undefined") {
    setLocalStorageValue(localStorageTokenKey, token);
  }

  try {
    const response = await api.get("/auth/user");

    const user = normalizeUser(response.data.data as BackendUser);

    setCookie(roleCookieName, user.role, 60 * 60 * 24);
    setLocalStorageValue(localStorageRoleKey, user.role);

    return user;
  } catch {
    deleteCookie(authCookieName);
    deleteCookie(roleCookieName);
    removeLocalStorageValue(localStorageTokenKey);
    removeLocalStorageValue(localStorageRoleKey);
    return null;
  }
};

/* ─────────────────────────────
   PASSWORD RESET FLOW
───────────────────────────── */

export const forgotPassword = async (email: string) => {
  return await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (data: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  return await api.post("/auth/reset-password", data);
};

/* ─────────────────────────────
   EMAIL VERIFICATION
───────────────────────────── */

export const verifyEmail = async (token: string) => {
  return await api.post("/auth/verify-email", { token });
};

export const resendVerificationEmail = async (email: string) => {
  return await api.post("/auth/resend-verification-email", { email });
};