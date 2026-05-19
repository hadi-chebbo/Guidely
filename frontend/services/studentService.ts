import api from "@/lib/api";
import type { DemandLevel, DifficultyLevel } from "@/types/major";

export interface StudentCategory {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PublicMajorItem {
  id: number;
  major_id?: number;
  major?: Partial<PublicMajorItem> | null;
  name_en: string;
  name_ar: string;
  slug: string;
  overview?: string | null;
  description?: string | null;
  duration_year?: number;
  duration_years: number;
  difficulty_level: DifficultyLevel;
  salary_min: number;
  salary_max: number;
  local_demand: DemandLevel;
  international_demand: DemandLevel;
  is_featured: boolean;
  cover_image: string | null;
  category: {
    id?: number;
    name: string;
    name_en: string;
    name_ar?: string;
    slug: string;
  } | null;
  skills: { id?: number; name: string; type?: string; icon?: string | null }[];
}

export interface PublicMajorsResponse {
  recommended: PublicMajorItem[];
  featured: PublicMajorItem[];
  others: {
    data: PublicMajorItem[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

export interface ToggleFavoriteResponse {
  is_favorite: boolean;
}

export interface PublicUniversityItem {
  id?: number;
  name_en: string;
  name_ar?: string | null;
  slug: string;
  location: string;
  type: "public" | "private" | string;
  website?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  founded_year?: number | null;
  accreditation?: string | null;
  total_credits?: number | null;
  credit_price_usd?: number | string | null;
  language_of_instruction?: string | null;
  majors?: PublicMajorItem[];
}

export interface PublicUniversitiesResponse {
  data: PublicUniversityItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface MajorComparisonResponse {
  comparison?: {
    A?: Record<string, unknown>;
    B?: Record<string, unknown>;
  };
  analysis?: Record<string, unknown>;
  major_1?: Record<string, unknown>;
  major_2?: Record<string, unknown>;
}

export interface UniversityComparisonResponse {
  university_a?: Record<string, unknown>;
  university_b?: Record<string, unknown>;
  university_1?: Record<string, unknown>;
  university_2?: Record<string, unknown>;
  comparison?: Record<string, unknown>;
}

export interface PublicMentorProfile {
  bio?: string | null;
  degree?: string | null;
  university_name?: string | null;
  graduation_year?: number | null;
  years_experience?: number | null;
  languages?: string[] | string | null;
  is_accepting_students?: boolean;
  major?: {
    name?: string | null;
    name_en?: string | null;
    slug?: string | null;
  } | null;
  social_links?: {
    linkedin?: string | null;
    website?: string | null;
  };
}

export interface PublicMentorItem {
  name: string;
  username: string;
  avatar_url?: string | null;
  school?: string | null;
  preferred_language?: string | null;
  profile?: PublicMentorProfile | null;
}

export interface PublicMentorsResponse {
  data: PublicMentorItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

const toNumberOrNull = (value: unknown): number | null => {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
};

export const getPublicMajorId = (
  major: Partial<PublicMajorItem> | null | undefined,
): number | null =>
  toNumberOrNull(major?.id) ??
  toNumberOrNull(major?.major_id) ??
  toNumberOrNull(major?.major?.id);

const unwrap = <T>(payload: { data?: T } | T): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: T }).data as T;
  }
  return payload as T;
};

const normalizeMajor = (major: PublicMajorItem): PublicMajorItem => {
  const nestedMajor = major.major ?? {};
  const mergedMajor = {
    ...nestedMajor,
    ...major,
  };

  return {
    ...mergedMajor,
    id: getPublicMajorId(major) ?? 0,
    overview: mergedMajor.overview ?? mergedMajor.description ?? "",
    description: mergedMajor.description ?? mergedMajor.overview ?? "",
    duration_years: mergedMajor.duration_years ?? mergedMajor.duration_year ?? 0,
    category: mergedMajor.category
      ? {
          ...mergedMajor.category,
          name: mergedMajor.category.name ?? mergedMajor.category.name_en,
          name_en: mergedMajor.category.name_en ?? mergedMajor.category.name,
        }
      : null,
    skills: mergedMajor.skills ?? [],
  } as PublicMajorItem;
};

const normalizeMajorList = (items: PublicMajorItem[] = []) =>
  items.map(normalizeMajor);

const normalizeUniversity = (
  university: PublicUniversityItem,
): PublicUniversityItem => ({
  ...university,
  logo: university.logo ?? university.logo_url ?? null,
  logo_url: university.logo_url ?? university.logo ?? null,
  website: university.website ?? null,
  description_en: university.description_en ?? null,
  description_ar: university.description_ar ?? null,
  founded_year: university.founded_year ?? null,
  accreditation: university.accreditation ?? null,
  total_credits: university.total_credits ?? null,
  credit_price_usd: university.credit_price_usd ?? null,
  language_of_instruction: university.language_of_instruction ?? null,
  majors: university.majors ? normalizeMajorList(university.majors) : [],
});

const normalizeUniversityList = (items: PublicUniversityItem[] = []) =>
  items.map(normalizeUniversity);

const normalizeMentor = (mentor: PublicMentorItem): PublicMentorItem => ({
  ...mentor,
  avatar_url: mentor.avatar_url ?? null,
  school: mentor.school ?? null,
  preferred_language: mentor.preferred_language ?? null,
  profile: mentor.profile
    ? {
        ...mentor.profile,
        bio: mentor.profile.bio ?? null,
        degree: mentor.profile.degree ?? null,
        university_name: mentor.profile.university_name ?? null,
        graduation_year: mentor.profile.graduation_year ?? null,
        years_experience: mentor.profile.years_experience ?? null,
        languages: mentor.profile.languages ?? null,
        is_accepting_students: Boolean(mentor.profile.is_accepting_students),
        social_links: mentor.profile.social_links ?? {},
      }
    : null,
});

const normalizeMentorList = (items: PublicMentorItem[] = []) =>
  items.map(normalizeMentor);

const PUBLIC_MAJORS_CACHE_KEY = "guidely_public_majors_cache";
const USE_PUBLIC_MAJORS_CACHE_KEY = "guidely_use_public_majors_cache";
const FAVORITE_MAJORS_CACHE_KEY = "guidely_favorite_majors_cache";

const getMajorKey = (major: PublicMajorItem) =>
  major.id ? `id:${major.id}` : `slug:${major.slug}`;

const getCachedPublicMajors = (): PublicMajorItem[] => {
  if (typeof window === "undefined") return [];

  const cachedItems = [
    window.localStorage.getItem(PUBLIC_MAJORS_CACHE_KEY),
    window.sessionStorage.getItem(PUBLIC_MAJORS_CACHE_KEY),
  ]
    .flatMap((cached) => {
      if (!cached) return [];

      try {
        return JSON.parse(cached) as PublicMajorItem[];
      } catch {
        return [];
      }
    });

  return Array.from(
    new Map(cachedItems.map((major) => [getMajorKey(major), major])).values(),
  );
};

const findCachedPublicMajorBySlug = (slug: string): PublicMajorItem | null =>
  getCachedPublicMajors().find((major) => major.slug === slug) ?? null;

const getCachedFavoriteMajors = (): PublicMajorItem[] => {
  if (typeof window === "undefined") return [];

  const cached = window.localStorage.getItem(FAVORITE_MAJORS_CACHE_KEY);
  if (!cached) return [];

  try {
    return normalizeMajorList(JSON.parse(cached) as PublicMajorItem[]).filter(
      (major) => getPublicMajorId(major) !== null,
    );
  } catch {
    return [];
  }
};

export const cacheFavoriteMajor = (
  major: Partial<PublicMajorItem>,
  isFavorite: boolean,
): PublicMajorItem[] => {
  if (typeof window === "undefined") return [];

  const majorId = getPublicMajorId(major);
  if (!majorId) return getCachedFavoriteMajors();

  const current = getCachedFavoriteMajors();
  const next = isFavorite
    ? [
        normalizeMajor({ ...major, id: majorId } as PublicMajorItem),
        ...current.filter((item) => getPublicMajorId(item) !== majorId),
      ]
    : current.filter((item) => getPublicMajorId(item) !== majorId);

  window.localStorage.setItem(FAVORITE_MAJORS_CACHE_KEY, JSON.stringify(next));
  return next;
};

const cachePublicMajors = (items: PublicMajorItem[]) => {
  if (typeof window === "undefined" || items.length === 0) return;

  const byKey = new Map<string, PublicMajorItem>();

  getCachedPublicMajors().forEach((major) => {
    byKey.set(getMajorKey(major), major);
  });
  items.forEach((major) => {
    byKey.set(getMajorKey(major), major);
  });

  try {
    const serialized = JSON.stringify(Array.from(byKey.values()));
    window.localStorage.setItem(PUBLIC_MAJORS_CACHE_KEY, serialized);
    window.sessionStorage.setItem(PUBLIC_MAJORS_CACHE_KEY, serialized);
  } catch {
    // Cache is only a frontend safety net for post-quiz navigation.
  }
};

const getCachedPublicMajorsResponse = (
  params: { per_page?: number; page?: number } = {},
): PublicMajorsResponse | null => {
  if (typeof window === "undefined") return null;
  if (
    window.localStorage.getItem(USE_PUBLIC_MAJORS_CACHE_KEY) !== "1" &&
    window.sessionStorage.getItem(USE_PUBLIC_MAJORS_CACHE_KEY) !== "1"
  ) {
    return null;
  }

  const cached = getCachedPublicMajors();
  if (cached.length === 0) return null;

  const page = params.page ?? 1;
  const perPage = params.per_page ?? cached.length;
  const start = (page - 1) * perPage;

  return {
    recommended: [],
    featured: [],
    others: {
      data: cached.slice(start, start + perPage),
      meta: {
        current_page: page,
        per_page: perPage,
        total: cached.length,
        last_page: Math.max(1, Math.ceil(cached.length / perPage)),
      },
    },
  };
};

export const keepCachedPublicMajorsForCurrentSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USE_PUBLIC_MAJORS_CACHE_KEY, "1");
  window.sessionStorage.setItem(USE_PUBLIC_MAJORS_CACHE_KEY, "1");
};

const mergeCachedMissingMajors = (
  majorsData: PublicMajorsResponse,
  page: number,
): PublicMajorsResponse => {
  if (page > 1) return majorsData;

  const cached = getCachedPublicMajors();
  if (cached.length === 0) return majorsData;

  const shownKeys = new Set(
    [
      ...majorsData.recommended,
      ...majorsData.featured,
      ...majorsData.others.data,
    ].map(getMajorKey),
  );
  const missing = cached.filter((major) => !shownKeys.has(getMajorKey(major)));

  if (missing.length === 0) return majorsData;

  return {
    ...majorsData,
    others: {
      ...majorsData.others,
      data: [...majorsData.others.data, ...missing],
      meta: {
        ...majorsData.others.meta,
        total: majorsData.others.meta.total + missing.length,
        last_page: Math.max(
          majorsData.others.meta.last_page,
          Math.ceil(
            (majorsData.others.meta.total + missing.length) /
              majorsData.others.meta.per_page,
          ),
        ),
      },
    },
  };
};

export const getPublicMajorsTotal = (
  majorsData: PublicMajorsResponse | undefined,
): number => {
  if (!majorsData) return 0;

  const highlightedIds = new Set<number>();

  majorsData.recommended.forEach((major) => highlightedIds.add(major.id));
  majorsData.featured.forEach((major) => highlightedIds.add(major.id));

  return highlightedIds.size + (majorsData.others.meta.total ?? 0);
};

// GET /majors
export const getPublicMajors = async (params: { per_page?: number; page?: number } = {}): Promise<PublicMajorsResponse> => {
  const cachedResponse = getCachedPublicMajorsResponse(params);
  if (cachedResponse) return cachedResponse;

  const res = await api.get("/majors", { params });
  const data = unwrap<PublicMajorsResponse>(res.data);
  const others = data.others as PublicMajorsResponse["others"] & {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };

  const normalizedData = {
    recommended: normalizeMajorList(data.recommended),
    featured: normalizeMajorList(data.featured),
    others: {
      ...others,
      data: normalizeMajorList(others?.data),
      meta: others?.meta ?? {
        current_page: others?.current_page ?? 1,
        per_page: others?.per_page ?? params.per_page ?? 10,
        total: others?.total ?? others?.data?.length ?? 0,
        last_page: others?.last_page ?? 1,
      },
    },
  };

  const mergedData = mergeCachedMissingMajors(
    normalizedData,
    params.page ?? normalizedData.others.meta.current_page,
  );

  cachePublicMajors([
    ...mergedData.recommended,
    ...mergedData.featured,
    ...mergedData.others.data,
  ]);

  return getCachedPublicMajorsResponse(params) ?? mergedData;
};

// POST /majors/compare
export const comparePublicMajors = async (
  slugs: [string, string],
): Promise<MajorComparisonResponse> => {
  const res = await api.post("/majors/compare", { slugs });
  return unwrap<MajorComparisonResponse>(res.data);
};

// GET /universities
export const getPublicUniversities = async (
  params: {
    page?: number;
    per_page?: number;
    search?: string;
    type?: "public" | "private";
    location?: string;
  } = {},
): Promise<PublicUniversitiesResponse> => {
  const res = await api.get("/universities", { params });
  const payload = res.data;
  const collection = payload.data;
  const items = Array.isArray(collection)
    ? collection
    : collection?.data ?? [];
  const meta = payload.meta ?? collection?.meta ?? {};
  const perPage = meta.per_page ?? params.per_page ?? 10;
  const total = meta.total ?? items.length;

  return {
    data: normalizeUniversityList(items),
    meta: {
      current_page: meta.current_page ?? params.page ?? 1,
      per_page: perPage,
      total,
      last_page: meta.last_page ?? Math.max(1, Math.ceil(total / perPage)),
    },
  };
};

// GET /universities/{slug}
export const getPublicUniversity = async (
  slug: string,
): Promise<PublicUniversityItem> => {
  const res = await api.get(`/universities/${slug}`);
  return normalizeUniversity(unwrap<PublicUniversityItem>(res.data));
};

// POST /universities/compare
export const comparePublicUniversities = async (
  slugs: [string, string],
): Promise<UniversityComparisonResponse> => {
  const res = await api.post("/universities/compare", { universities: slugs });
  return unwrap<UniversityComparisonResponse>(res.data);
};

// GET /majors/{slug}/mentors
export const getMajorMentors = async (
  slug: string,
  params: { page?: number; per_page?: number } = {},
): Promise<PublicMentorsResponse> => {
  const res = await api.get(`/majors/${slug}/mentors`, { params });
  const payload = res.data;
  const collection = payload.data;
  const items = Array.isArray(collection)
    ? collection
    : collection?.data ?? [];
  const meta = payload.meta ?? collection?.meta ?? {};
  const perPage = meta.per_page ?? params.per_page ?? 10;
  const total = meta.total ?? items.length;

  return {
    data: normalizeMentorList(items),
    meta: {
      current_page: meta.current_page ?? params.page ?? 1,
      per_page: perPage,
      total,
      last_page: meta.last_page ?? Math.max(1, Math.ceil(total / perPage)),
    },
  };
};

// GET /mentors/{username}
export const getPublicMentor = async (
  username: string,
): Promise<PublicMentorItem> => {
  const res = await api.get(`/mentors/${username}`);
  return normalizeMentor(unwrap<PublicMentorItem>(res.data));
};

// GET /majors/{slug}/show
export const getPublicMajor = async (
  slug: string,
): Promise<PublicMajorItem & Record<string, unknown>> => {
  const res = await api.get(`/majors/${slug}/show`);
  const major = unwrap<PublicMajorItem>(res.data);
  const cachedMajor = findCachedPublicMajorBySlug(slug);

  if (getPublicMajorId(major) ?? getPublicMajorId(cachedMajor)) {
    return normalizeMajor({
      ...cachedMajor,
      ...major,
      id: getPublicMajorId(major) ?? getPublicMajorId(cachedMajor) ?? 0,
      overview: major.overview ?? cachedMajor?.overview ?? major.description,
      category: major.category ?? cachedMajor?.category ?? null,
      skills: major.skills?.length ? major.skills : cachedMajor?.skills ?? [],
    } as PublicMajorItem) as PublicMajorItem & Record<string, unknown>;
  }

  const majors = await getPublicMajors({ per_page: 100, page: 1 });
  const listMajor = [
    ...majors.recommended,
    ...majors.featured,
    ...majors.others.data,
  ].find((item) => item.slug === slug);

  return normalizeMajor({
    ...listMajor,
    ...major,
    id: getPublicMajorId(major) ?? getPublicMajorId(listMajor) ?? 0,
    overview: major.overview ?? listMajor?.overview ?? major.description,
    category: major.category ?? listMajor?.category ?? null,
    skills: major.skills?.length ? major.skills : listMajor?.skills ?? [],
  } as PublicMajorItem) as PublicMajorItem &
    Record<string, unknown>;
};

// GET /categories
export const getCategories = async () => {
  const res = await api.get("/categories");
  return unwrap<StudentCategory[]>(res.data);
};

// PATCH /majors/{major}/favorite
export const toggleFavoriteMajor = async (
  majorId: number,
): Promise<ToggleFavoriteResponse> => {
  if (!Number.isFinite(majorId) || majorId <= 0) {
    throw new Error("Cannot toggle favorite without a valid major id.");
  }

  const res = await api.patch(`/majors/${majorId}/favorite`);
  return unwrap<ToggleFavoriteResponse>(res.data);
};

// GET /user/favorites
export const getFavoriteMajors = async (): Promise<PublicMajorItem[]> => {
  const cachedFavorites = getCachedFavoriteMajors();

  try {
    const res = await api.get("/user/favorites");
    const serverFavorites = normalizeMajorList(
      unwrap<PublicMajorItem[]>(res.data),
    ).filter((major) => getPublicMajorId(major) !== null);

    const mergedFavorites = Array.from(
      new Map(
        [...serverFavorites, ...cachedFavorites].map((major) => [
          getPublicMajorId(major),
          major,
        ]),
      ).values(),
    );

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        FAVORITE_MAJORS_CACHE_KEY,
        JSON.stringify(mergedFavorites),
      );
    }

    return mergedFavorites;
  } catch {
    return cachedFavorites;
  }
};

export const syncFavoriteMajorFromToggle = async (
  major: Partial<PublicMajorItem>,
  isFavorite: boolean,
): Promise<PublicMajorItem[]> => {
  cacheFavoriteMajor(major, isFavorite);

  return getFavoriteMajors();
};

export const getFavoriteMajorsCount = async (): Promise<number> => {
  const favorites = await getFavoriteMajors();
  return favorites.filter((major) => getPublicMajorId(major)).length;
};

export const isMajorFavorite = async (majorId: number): Promise<boolean> => {
  const favorites = await getFavoriteMajors();
  return favorites.some(
    (major) => getPublicMajorId(major) === majorId,
  );
};

export const removeFavoriteMajor = async (
  majorId: number,
): Promise<PublicMajorItem[]> => {
  let result = await toggleFavoriteMajor(majorId);

  if (result.is_favorite) {
    result = await toggleFavoriteMajor(majorId);
  }

  cacheFavoriteMajor({ id: majorId }, result.is_favorite);

  return getFavoriteMajors();
};
