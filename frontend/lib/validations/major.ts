import { z } from "zod";

/* ── Enum tuples (re-used by form selects) ─────────────────────── */

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard", "very_hard"] as const;
export const DEMAND_LEVELS = ["low", "medium", "high", "very_high"] as const;
export const JOB_DEMAND_LEVELS = ["low", "medium", "high"] as const;
export const JOB_SCOPES = ["local", "international", "both"] as const;
export const SKILL_TYPES = ["hard", "soft"] as const;
export const MAJOR_POINT_TYPES = ["pro", "con"] as const;

/* ── Field helpers ─────────────────────────────────────────────── */

const optionalNullableText = z
  .string()
  .transform((v) => (v.trim() === "" ? null : v))
  .nullable()
  .optional();

const optionalNullableUrl = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), "Enter a valid URL")
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

/* ── Nested row schemas ────────────────────────────────────────── */

export const majorPointSchema = z.object({
  id: z.number().int().positive().optional(),
  type: z.enum(MAJOR_POINT_TYPES),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Keep it under 500 characters"),
});

export const majorSkillSchema = z.object({
  skill_id: z.number().int().positive("Pick a skill"),
});

export const jobOpportunitySchema = z.object({
  id: z.number().int().positive().optional(),
  title_en: z.string().min(1, "Job title required").max(255),
  title_ar: z.string().max(255).nullable().optional(),
  description_en: optionalNullableText,
  avg_salary_usd: z.number().int().nonnegative().nullable().optional(),
  scope: z.enum(JOB_SCOPES),
  demand_level: z.enum(JOB_DEMAND_LEVELS),
});

export const hiringCompanySchema = z.object({
  id: z.number().int().positive().optional(),
  company_name: z.string().min(1, "Company name required").max(255),
  industry: z.string().max(255).nullable().optional(),
  location: z.string().min(1, "Location required").max(255),
  logo_url: optionalNullableUrl,
  website_url: optionalNullableUrl,
  is_local: z.boolean().default(true),
});

export const faqSchema = z.object({
  id: z.number().int().positive().optional(),
  question: z.string().min(1, "Question required"),
  answer: z.string().min(1, "Answer required"),
  sort_order: z.number().int().nonnegative().default(0),
});

/* ── Major form (create + update) ──────────────────────────────── */

export const majorFormSchema = z
  .object({
    category_id: z.number().int().positive("Select a category"),
    name_en: z.string().min(1, "English name is required").max(255),
    name_ar: z.string().min(1, "Arabic name is required").max(255),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(255)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
    overview: z.string().min(1, "Overview is required"),
    description: z.string().min(1, "Description is required"),
    duration_years: z.number().int().min(1).max(10),
    difficulty_level: z.enum(DIFFICULTY_LEVELS),
    salary_min: z.number().int().nonnegative(),
    salary_max: z.number().int().nonnegative(),
    local_demand: z.enum(DEMAND_LEVELS),
    international_demand: z.enum(DEMAND_LEVELS),
    is_featured: z.boolean().default(false),
    cover_image: optionalNullableUrl,

    points: z.array(majorPointSchema).default([]),
    skills: z.array(majorSkillSchema).default([]),
    jobs: z.array(jobOpportunitySchema).default([]),
    companies: z.array(hiringCompanySchema).default([]),
    faqs: z.array(faqSchema).default([]),
  })
  .refine((d) => d.salary_min <= d.salary_max, {
    message: "Min salary must be less than or equal to max",
    path: ["salary_max"],
  });

export type MajorFormData = z.infer<typeof majorFormSchema>;
