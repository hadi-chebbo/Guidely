import { z } from "zod";

/* ── Login ───────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/* ── Register — Step 1: Account ─────────────────────────────── */
export const registerStep1Schema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

/* ── Register — Step 2: Profile ─────────────────────────────── */
export const registerStep2Schema = z.object({
  school: z.string().max(200, "School name is too long").optional(),
  grade: z.string().optional(),
  preferredLanguage: z.enum(["en", "ar", "fr"]).default("en"),
});

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;

/* ── Register — Step 3: Interests ───────────────────────────── */
export const registerStep3Schema = z.object({
  interests: z
    .array(z.string())
    .min(1, "Please select at least one interest")
    .optional()
    .default([]),
});

export type RegisterStep3Data = z.infer<typeof registerStep3Schema>;

/* ── Forgot password ─────────────────────────────────────────── */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/* ── Available interest categories ──────────────────────────── */
export const INTEREST_CATEGORIES = [
  { id: "technology",      label: "Technology",      icon: "💻" },
  { id: "business",        label: "Business",        icon: "📊" },
  { id: "health",          label: "Health Sciences", icon: "🏥" },
  { id: "engineering",     label: "Engineering",     icon: "⚙️" },
  { id: "arts",            label: "Arts & Humanities", icon: "🎨" },
  { id: "sciences",        label: "Sciences",        icon: "🔬" },
  { id: "social",          label: "Social Sciences", icon: "🤝" },
  { id: "law",             label: "Law",             icon: "⚖️" },
  { id: "education",       label: "Education",       icon: "📚" },
  { id: "agriculture",     label: "Agriculture",     icon: "🌱" },
] as const;

export const GRADE_OPTIONS = [
  { value: "grade-10",    label: "Grade 10" },
  { value: "grade-11",    label: "Grade 11" },
  { value: "grade-12",    label: "Grade 12 / Terminale" },
  { value: "bacc",        label: "Baccalaureate Holder" },
  { value: "university",  label: "Currently in University" },
  { value: "other",       label: "Other" },
] as const;
