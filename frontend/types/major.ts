/**
 * Major domain types — mirrors the actual backend migrations.
 * Names (name_en/name_ar) are bilingual; content fields are English-only for now.
 */

/* ── Enums ─────────────────────────────────────────────────────── */

export type DifficultyLevel = "easy" | "medium" | "hard" | "very_hard";
export type DemandLevel = "low" | "medium" | "high" | "very_high";
export type JobDemandLevel = "low" | "medium" | "high";
export type JobScope = "local" | "international" | "both";
export type SkillType = "hard" | "soft";
export type MajorPointType = "pro" | "con";

/* ── Category ──────────────────────────────────────────────────── */

export interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
}

/* ── Nested resources ──────────────────────────────────────────── */

export interface MajorPoint {
  id: number;
  major_id: number;
  type: MajorPointType;
  content: string;
}

export interface Skill {
  id: number;
  name: string;
  type: SkillType;
  icon: string | null;
}

export interface JobOpportunity {
  id: number;
  major_id: number;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  avg_salary_usd: number | null;
  scope: JobScope;
  demand_level: JobDemandLevel;
}

export interface HiringCompany {
  id: number;
  major_id: number;
  company_name: string;
  industry: string | null;
  location: string;
  logo_url: string | null;
  website_url: string | null;
  is_local: boolean;
}

export interface FAQ {
  id: number;
  major_id: number;
  question: string;
  answer: string;
  sort_order: number;
}

/* ── Major ─────────────────────────────────────────────────────── */

export interface Major {
  id: number;
  category_id: number;
  category?: Category;
  name_en: string;
  name_ar: string;
  slug: string;
  overview: string;
  description: string;
  duration_years: number;
  difficulty_level: DifficultyLevel;
  salary_min: number;
  salary_max: number;
  local_demand: DemandLevel;
  international_demand: DemandLevel;
  is_featured: boolean;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  points?: MajorPoint[];
  skills?: Skill[];
  jobs?: JobOpportunity[];
  companies?: HiringCompany[];
  faqs?: FAQ[];
}

/** Slimmer shape returned by the admin list endpoint. */
export interface MajorListItem {
  id: number;
  category_id: number;
  category?: Pick<Category, "id" | "name_en" | "name_ar" | "icon">;
  name_en: string;
  name_ar: string;
  slug: string;
  duration_years: number;
  difficulty_level: DifficultyLevel;
  is_featured: boolean;
  updated_at: string;
}

/* ── API response shapes ───────────────────────────────────────── */

export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
