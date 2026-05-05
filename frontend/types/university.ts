export type UniversityType = "public" | "private";
export type FilterType = "all" | "public" | "private";

export type FormState = {
  name_en: string;
  name_ar: string;
  slug: string;
  type: "public" | "private";
  location: string;
  website: string;
  logo_url: string;
  description_en: string;
  description_ar: string;
  founded_year: string;
  accreditation: string;
};
/**
 * Main University entity
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

/**
 * List API response
 */
export interface UniversitiesApiResponse {
  data: University[];
}

/**
 * Create University payload
 */
export type CreateUniversityDTO = {
  name_en: string;
  name_ar?: string | null;

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
 * Update University payload
 */
export type UpdateUniversityDTO = Partial<CreateUniversityDTO>;