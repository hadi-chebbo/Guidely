// University list item (from GET /api/v1/admin/universities paginated list)
export interface UniversityListItem {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  location: string;
  country: string;
  type: UniversityType;
  accreditation_status: AccreditationStatus;
  is_featured: boolean;
  logo_url: string | null;
  website_url: string | null;
  updated_at: string;
}

// Full university (from GET /api/v1/admin/universities/{id})
export interface University {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  overview: string;
  description: string;
  location: string;
  country: string;
  type: UniversityType;
  accreditation_status: AccreditationStatus;
  established_year: number | null;
  student_count: number | null;
  acceptance_rate: number | null;
  tuition_min: number | null;
  tuition_max: number | null;
  is_featured: boolean;
  logo_url: string | null;
  cover_image: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export type UniversityType = "public" | "private";
export type AccreditationStatus = "accredited" | "pending" | "not_accredited";

export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
