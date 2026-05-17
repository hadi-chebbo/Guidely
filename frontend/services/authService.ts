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
  email: string;
  role?: UserRole;
}

interface AuthResponse {
  data?: {
    user?: ApiUser;
    token?: string;
    access_token?: string;
    plainTextToken?: string;
  };
  user?: ApiUser;
  token?: string;
  access_token?: string;
  plainTextToken?: string;
}

/* ─────────────────────────────
   HELPERS
───────────────────────────── */

const normalizeUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role ?? "student",
});

/* ─────────────────────────────
   COOKIE HELPERS
───────────────────────────── */

const setAuthCookies = (
  token: string,
  role: UserRole,
  maxAge: number
): void => {
  const encodedToken = encodeURIComponent(token);
  document.cookie = `auth_token=${encodedToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_role=${role}; path=/; max-age=${maxAge}`;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", token);
  }
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

    const userData = res.data.data?.user ?? res.data.user;
    const token = extractToken(res.data);

    if (!userData || !token) {
      throw new Error("Invalid login response");
    }

    const user = normalizeUser(userData);

    const maxAge = rememberMe
      ? 60 * 60 * 24 * 30 // 30 days
      : 60 * 60 * 24;     // 1 day

    setAuthCookies(token, user.role, maxAge);
    setCachedUser(user);

    return user;
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "response" in err) {
      const error = err as {
        response?: { data?: { message?: string } };
      };

      const message = error.response?.data?.message;

      if (message?.toLowerCase().includes("verify")) {
        throw new AuthError(message, "EMAIL_NOT_VERIFIED");
      }
    }

    throw err;
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

  const cachedUser = getCachedUser();
  if (cachedUser) return cachedUser;

  const role = (getCookie("user_role") as UserRole | null) ?? "student";
  return {
    id: 0,
    name: role === "admin" ? "Admin" : "Student",
    email: "",
    role,
  };
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
  hash: string
): Promise<void> => {
  await api.get(`/email/verify/${id}/${hash}`);
};

export const resendVerificationEmail = async (
  email: string
): Promise<void> => {
  await api.post("/email/resend", { email });
};
