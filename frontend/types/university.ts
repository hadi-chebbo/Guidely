export type UniversityType = "public" | "private";
export type FilterType = "all" | "public" | "private";

/**
 * University entity (API source of truth)
 */
export interface University {
  id: number;

  name_en: string;
  name_ar: string | null;

  slug: string;
  type: UniversityType;

  location: string;

  website: string | null;
  logo_url: string | null;

  description_en: string | null;
  description_ar: string | null;

  founded_year: number | null;
  accreditation: string | null;

  created_at: string;
  updated_at: string;
}

export interface UniversityMajor {
  id: number;
  name?: string;
  name_en?: string;
  name_ar?: string | null;
  slug: string;
  category_id: number;
  is_featured: boolean;
}

/**
 * Pagination link
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

/**
 * Pagination meta
 */
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;

  links: PaginationLink[];

  path: string;
  per_page: number;

  to: number;
  total: number;
}

/**
 * List universities response
 */
export interface UniversitiesApiResponse {
  data: University[];

  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };

  meta: PaginationMeta;

  message: string;
}

/**
 * Single university response
 */
export interface UniversityApiResponse {
  message: string;
  data: University;
}

/**
 * Create University DTO
 */
export type CreateUniversityDTO = {
  name_en: string;
  name_ar?: string | null;

  slug: string;
  type: UniversityType;

  location: string;

  website?: string | null;
  logo_url?: string | null;

  description_en?: string | null;
  description_ar?: string | null;

  founded_year?: number | null;
  accreditation?: string | null;
};

/**
 * Update University DTO
 */
export type UpdateUniversityDTO = Partial<CreateUniversityDTO>;

/**
 * Form state (UI only)
 */
export type FormState = {
  name_en: string;
  name_ar: string;
  slug: string;
  type: UniversityType;
  location: string;
  website: string;
  logo_url: string;
  description_en: string;
  description_ar: string;
  founded_year: string;
  accreditation: string;
};
