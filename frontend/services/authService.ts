import api from "@/lib/api";

/* ─────────────────────────────
   ERROR CLASS
───────────────────────────── */

export class AuthError extends Error {
  type?: "EMAIL_NOT_VERIFIED";

  constructor(message: string, type?: "EMAIL_NOT_VERIFIED") {
    super(message);
    this.name = "AuthError";
    this.type = type;
  }
}

/* ─────────────────────────────
   TYPES
───────────────────────────── */

export type UserRole = "student" | "mentor" | "admin";

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  school?: string;
  grade?: string;
  preferredLanguage?: string;
}

interface ApiUser {
  id: number;
  name: string;
  username?: string;
  email: string;
  role?: UserRole;
}

interface AuthResponse {
  data?: {
    user?: ApiUser;
    token?: string;
    access_token?: string;
    plainTextToken?: string;
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    role?: UserRole;
  };
  user?: ApiUser;
  token?: string;
  access_token?: string;
  plainTextToken?: string;
}

interface BackendErrorPayload {
  message?: unknown;
}

/* ─────────────────────────────
   HELPERS
───────────────────────────── */

const normalizeUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role ?? "student",
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const extractBackendErrorMessage = async (
  error: unknown
): Promise<string | null> => {
  if (isRecord(error) && isRecord(error.response)) {
    const data = error.response.data as BackendErrorPayload | undefined;
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  }

  if (typeof Response !== "undefined" && error instanceof Response) {
    try {
      const payload = (await error.clone().json()) as BackendErrorPayload;
      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }
    } catch {
      return null;
    }
  }

  return null;
};

/* ─────────────────────────────
   COOKIE HELPERS
───────────────────────────── */

const setAuthCookies = (
  token: string,
  role: UserRole,
  maxAge: number
): void => {
  const encodedToken = encodeURIComponent(token);
  document.cookie = `auth_token=; path=/; max-age=0`;
  document.cookie = `user_role=; path=/; max-age=0`;
  document.cookie = `auth_token=${encodedToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_role=${role}; path=/; max-age=${maxAge}`;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", token);
  }
};

const setRoleCookie = (role: UserRole, maxAge = 60 * 60 * 24 * 30): void => {
  document.cookie = `user_role=; path=/; max-age=0`;
  document.cookie = `user_role=${role}; path=/; max-age=${maxAge}`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? null
  );
};

const setCachedUser = (user: User): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("auth_user", JSON.stringify(user));
};

const clearCachedUser = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("auth_user");
};

const setPendingVerificationEmail = (email: string): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("pending_verification_email", email);
};

export const getPendingVerificationEmail = (): string => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("pending_verification_email") ?? "";
};

const clearPendingVerificationEmail = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("pending_verification_email");
};

const getCachedUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("auth_user");
    if (!raw) return null;

    const user = JSON.parse(raw) as User;
    if (!user || typeof user.id !== "number") return null;

    return user;
  } catch {
    return null;
  }
};

const clearAuthCookies = (): void => {
  document.cookie = `auth_token=; path=/; max-age=0`;
  document.cookie = `user_role=; path=/; max-age=0`;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("auth_user");
    window.localStorage.removeItem("auth_token");
  }
};

const extractToken = (payload: AuthResponse): string | undefined =>
  payload.data?.token ??
  payload.data?.access_token ??
  payload.data?.plainTextToken ??
  payload.token ??
  payload.access_token ??
  payload.plainTextToken;

const extractUser = (payload: AuthResponse): ApiUser | undefined => {
  if (payload.data?.user) return payload.data.user;
  if (payload.user) return payload.user;

  if (
    payload.data &&
    typeof payload.data.id === "number" &&
    typeof payload.data.name === "string" &&
    typeof payload.data.email === "string"
  ) {
    return payload.data as ApiUser;
  }

  return undefined;
};

const getAuthMaxAge = (rememberMe = false): number =>
  rememberMe
    ? 60 * 60 * 24 * 30 // 30 days
    : 60 * 60 * 24;     // 1 day

const getRoleRedirect = (role: UserRole): string =>
  role === "admin"
    ? "/admin"
    : role === "mentor"
      ? "/mentor"
      : "/student/dashboard";

export const getGoogleRedirectUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return `${baseUrl.replace(/\/$/, "")}/auth/google/redirect`;
};

export const getGoogleCallbackUrl = (search = ""): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const callbackUrl = `${baseUrl.replace(/\/$/, "")}/auth/google/callback`;
  return search ? `${callbackUrl}?${search.replace(/^\?/, "")}` : callbackUrl;
};

export const getPostLoginRedirect = (user: User): string =>
  getRoleRedirect(user.role);

/* ─────────────────────────────
   LOGIN
───────────────────────────── */

export const login = async ({
  email,
  password,
  rememberMe = false,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<User> => {
  try {
    const res = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    const responseUserData = extractUser(res.data);
    const token = extractToken(res.data);

    if (!responseUserData || !token) {
      throw new Error("Invalid login response");
    }

    const maxAge = getAuthMaxAge(rememberMe);
    const responseUser = normalizeUser(responseUserData);

    clearCachedUser();
    setAuthCookies(token, responseUser.role, maxAge);

    const currentUser = await fetchCurrentUser();
    const user = currentUser ?? responseUser;

    setAuthCookies(token, user.role, maxAge);
    setCachedUser(user);

    return user;
  } catch (err: unknown) {
    const backendMessage = await extractBackendErrorMessage(err);

    if (backendMessage) {
      if (backendMessage.toLowerCase().includes("verify")) {
        throw new AuthError(backendMessage, "EMAIL_NOT_VERIFIED");
      }

      throw new Error(backendMessage);
    }

    throw err;
  }
};

export const completeGoogleLogin = async (token: string): Promise<User> => {
  const maxAge = getAuthMaxAge(true);

  setAuthCookies(token, "student", maxAge);

  try {
    const res = await api.get<AuthResponse>("/auth/user");
    const userData = extractUser(res.data);

    if (!userData) {
      throw new Error("Invalid Google login response");
    }

    const user = normalizeUser(userData);

    setAuthCookies(token, user.role, maxAge);
    setCachedUser(user);
    clearPendingVerificationEmail();

    return user;
  } catch (error) {
    clearAuthCookies();
    throw error;
  }
};

/* ─────────────────────────────
   REGISTER
───────────────────────────── */

export const register = async (data: RegisterFormData): Promise<void> => {
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  await api.post("/auth/register", {
    name: `${data.firstName} ${data.lastName}`,
    username: data.username,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
    school: data.school,
    grade: data.grade,
    preferred_language: data.preferredLanguage,
  });

  setPendingVerificationEmail(data.email);
};

/* ─────────────────────────────
   LOGOUT
───────────────────────────── */

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAuthCookies();
  }
};

/* ─────────────────────────────
   CHECK AUTH
───────────────────────────── */

export const checkAuth = async (): Promise<User | null> => {
  const token = getCookie("auth_token") ?? (
    typeof window !== "undefined" ? window.localStorage.getItem("auth_token") : null
  );
  if (!token) return null;

  try {
    const user = await fetchCurrentUser();
    if (!user) {
      clearAuthCookies();
      return null;
    }

    setRoleCookie(user.role);
    setCachedUser(user);

    return user;
  } catch {
    clearAuthCookies();
    return null;
  }
};

const fetchCurrentUser = async (): Promise<User | null> => {
  const res = await api.get<AuthResponse>("/auth/user", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  const userData = extractUser(res.data);

  if (!userData) return null;

  return normalizeUser(userData);
};

/* ─────────────────────────────
   PASSWORD RESET
───────────────────────────── */

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (data: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<void> => {
  await api.post("/auth/reset-password", data);
};

/* ─────────────────────────────
   EMAIL VERIFICATION
───────────────────────────── */

export const verifyEmail = async (
  id: string,
  hash: string,
  signatureParams: { expires: string; signature: string }
): Promise<User | null> => {
  const res = await api.get<AuthResponse>(`/auth/v1/email/verify/${id}/${hash}`, {
    params: signatureParams,
  });

  const userData = extractUser(res.data);
  const token = extractToken(res.data);

  if (!userData || !token) return null;

  const user = normalizeUser(userData);
  setAuthCookies(token, user.role, 60 * 60 * 24);
  setCachedUser(user);
  clearPendingVerificationEmail();

  return user;
};

export const resendVerificationEmail = async (
  email: string
): Promise<void> => {
  await api.post("/auth/v1/email/resend", { email });
};
