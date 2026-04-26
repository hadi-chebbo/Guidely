export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  school?: string;
  grade?: string;
  preferredLanguage?: string;
}

const simulateNetworkDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const authCookieName = 'auth_token';
const roleCookieName = 'user_role';

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; sameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

const buildMockUser = (email: string, role: UserRole): User => ({
  id: 1,
  name: role === 'admin' ? 'Admin User' : role === 'mentor' ? 'Mentor User' : 'Student User',
  email,
  role,
});

// MOCK ONLY: role inferred from email substring — remove before real API integration
const getRoleFromEmail = (email: string): UserRole => {
  if (email.toLowerCase().includes('admin')) return 'admin';
  if (email.toLowerCase().includes('mentor')) return 'mentor';
  return 'student';
};

// MOCK DATA (to be replaced with cloud API later)
export const login = async (
  email: string,
  password: string,
  rememberMe = false,
): Promise<User> => {
  await simulateNetworkDelay(1000);

  if (!email || !password) {
    throw new Error('Invalid credentials');
  }

  const role = getRoleFromEmail(email);
  const mockUser = buildMockUser(email, role);
  const cookieMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

  setCookie(authCookieName, `mock-token-${Date.now()}`, cookieMaxAge);
  setCookie(roleCookieName, role, cookieMaxAge);

  return mockUser;
};

export const logout = async (): Promise<void> => {
  await simulateNetworkDelay(500);
  deleteCookie(authCookieName);
  deleteCookie(roleCookieName);
};

export const register = async (data: RegisterData): Promise<void> => {
  await simulateNetworkDelay(1500);

  if (!data.firstName || !data.lastName || !data.email || !data.password) {
    throw new Error('Registration failed: Missing required fields');
  }

  const fullName = `${data.firstName} ${data.lastName}`.trim();
  console.log('Mock registration successful:', { ...data, name: fullName });
};

export const checkAuth = async (): Promise<User | null> => {
  await simulateNetworkDelay(500);

  const token = getCookieValue(authCookieName);
  const role = getCookieValue(roleCookieName) as UserRole | null;

  if (!token || !role) {
    return null;
  }

  return buildMockUser('demo@mock.local', role);
};

export const forgotPassword = async (email: string): Promise<void> => {
  await simulateNetworkDelay(1400);

  if (!email) {
    throw new Error('Email is required');
  }

  console.log('Mock password reset email sent to:', email);
};

export const verifyEmail = async (token: string): Promise<void> => {
  await simulateNetworkDelay(1000);

  if (!token) {
    throw new Error('Invalid verification token');
  }

  console.log('Mock email verified with token:', token);
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  await simulateNetworkDelay(1500);

  if (!email) {
    throw new Error('Email is required');
  }

  console.log('Mock verification email resent to:', email);
};
