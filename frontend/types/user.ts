export type User = {
  id: number;

  name: string;

  username: string;

  email: string;

  role: "admin" | "student" | "mentor";

  avatar_url?: string;

  phone?: string;

  school?: string;

  grade?: string;

  preferred_language?: string;

  is_premium: boolean;

  is_blocked: boolean;

  premium_expires_at?: string | null;

  onboarding_data?: {
    step: number;
    completed: boolean;
  };

  created_at: string;
};