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
  email: string;
  password: string;
  confirmPassword: string;
  school?: string;
  grade?: string;
  preferredLanguage?: string;
}

/* ─────────────────────────────
   API RESPONSE TYPES
───────────────────────────── */

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
  };
  user?: ApiUser;
  token?: string;
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

const setAuthCookie = (token: string): void => {
  document.cookie = `auth_token=${token}; path=/; max-age=86400`;
};

const clearAuthCookie = (): void => {
  document.cookie = `auth_token=; path=/; max-age=0`;
};

/* ─────────────────────────────
   LOGIN
───────────────────────────── */

export const login = async (
  email: string,
  password: string,
  rememberMe = false
): Promise<User> => {
  try {
    const res = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    const userData = res.data.data?.user ?? res.data.user;
    const token = res.data.data?.token ?? res.data.token;

    if (!userData) {
      throw new Error("Invalid login response");
    }

    const user = normalizeUser(userData);

    if (token) {
      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
      document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;
    }

    return user;
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "response" in err) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
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
    clearAuthCookie();
  }
};

/* ─────────────────────────────
   CHECK AUTH
───────────────────────────── */

export const checkAuth = async (): Promise<User | null> => {
  try {
    const res = await api.get("/auth/user");

    const user = res.data?.data?.user ?? res.data?.user;

    if (!user || typeof user.id !== "number") return null;

    return normalizeUser(user);
  } catch {
    return null;
  }
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
