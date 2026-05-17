import api from "@/lib/api";
import { resolveAdminSkillType } from "@/lib/adminSkills";
import { mockCategories } from "@/lib/mocks/majors";
import type {
  Category,
  FAQ,
  HiringCompany,
  JobOpportunity,
  Major,
  MajorListItem,
  MajorPoint,
  MajorUniversity,
  Paginated,
  Skill,
} from "@/types/major";

export interface MajorListParams {
  page?: number;
  per_page?: number;
  name_en?: string;
  category_id?: number;
  difficulty_level?: string;
  is_featured?: 1;
}

type RawMajor = Omit<Partial<Major>, "category" | "skills" | "jobs" | "companies" | "faqs" | "points"> & {
  name?: string;
  duration_year?: number;
  category?: (Partial<Category> & { name?: string }) | null;
  skills?: Array<string | Partial<Skill>>;
  points?: Partial<MajorPoint>[];
  jobs?: Partial<JobOpportunity>[];
  companies?: Array<Partial<HiringCompany> & {
    name?: string;
    logo?: string | null;
    website?: string | null;
  }>;
  faqs?: Partial<FAQ>[];
  job_opportunities?: Partial<JobOpportunity>[];
  hiring_companies?: Array<Partial<HiringCompany> & {
    name?: string;
    logo?: string | null;
    website?: string | null;
  }>;
  universities?: Partial<MajorUniversity>[];
};

const resolveCategory = (major: RawMajor) => {
  if (major.category?.id) {
    return {
      ...major.category,
      name_en: major.category.name_en ?? major.category.name ?? "",
      name_ar: major.category.name_ar ?? "",
      slug: major.category.slug ?? "",
      description: major.category.description ?? null,
      icon: major.category.icon ?? null,
      is_active: major.category.is_active ?? true,
    } as Category;
  }

  if (major.category_id) {
    return mockCategories.find((category) => category.id === major.category_id);
  }

  return mockCategories.find((category) => {
    const rawCategory = major.category;

    return (
      category.slug === rawCategory?.slug ||
      category.name_en === rawCategory?.name_en ||
      category.name_en === rawCategory?.name ||
      category.name_ar === rawCategory?.name_ar
    );
  });
};

const normalizeMajor = (major: RawMajor): Major => {
  const category = resolveCategory(major);
  const points = (major.points ?? []).map((point) => ({
    id: point.id ?? 0,
    major_id: point.major_id ?? major.id ?? 0,
    type: point.type ?? "pro",
    content: point.content ?? "",
  }));
  const jobs = (major.jobs ?? major.job_opportunities ?? []).map((job) => ({
    id: job.id ?? 0,
    major_id: job.major_id ?? major.id ?? 0,
    title_en: job.title_en ?? "",
    title_ar: job.title_ar ?? null,
    description_en: job.description_en ?? null,
    avg_salary_usd: job.avg_salary_usd ?? null,
    scope: job.scope ?? "both",
    demand_level: job.demand_level ?? "medium",
  }));
  const companies = (major.companies ?? major.hiring_companies ?? []).map((company) => ({
      id: company.id ?? 0,
      major_id: company.major_id ?? major.id ?? 0,
      company_name: company.company_name ?? company.name ?? "",
      industry: company.industry ?? null,
      location: company.location ?? "",
      logo_url: company.logo_url ?? company.logo ?? null,
      website_url: company.website_url ?? company.website ?? null,
      is_local: company.is_local ?? true,
    }));
  const universities = (major.universities ?? []).map((university) => ({
    slug: university.slug ?? "",
    name_en: university.name_en ?? "",
    name_ar: university.name_ar ?? null,
    location: university.location ?? null,
    type: university.type ?? null,
    logo: university.logo ?? null,
    total_credits: university.total_credits ?? null,
    credit_price_usd: university.credit_price_usd ?? null,
    language_of_instruction: university.language_of_instruction ?? null,
  }));

  const overview = major.overview ?? major.description ?? "";

  return {
    ...major,
    id: major.id ?? 0,
    category_id: major.category_id ?? category?.id ?? 0,
    category,
    name_en: major.name_en ?? major.name ?? "",
    name_ar: major.name_ar ?? "",
    slug: major.slug ?? "",
    overview,
    description: major.description ?? "",
    duration_years: major.duration_years ?? major.duration_year ?? 0,
    difficulty_level: major.difficulty_level ?? "medium",
    salary_min: major.salary_min ?? 0,
    salary_max: major.salary_max ?? 0,
    local_demand: major.local_demand ?? "medium",
    international_demand: major.international_demand ?? "medium",
    is_featured: Boolean(major.is_featured),
    cover_image: major.cover_image ?? null,
    created_at: major.created_at ?? "",
    updated_at: major.updated_at ?? major.created_at ?? "",
    points: points as MajorPoint[],
    jobs: jobs as JobOpportunity[],
    companies: companies as HiringCompany[],
    universities: universities as MajorUniversity[],
    skills: major.skills?.map((skill) =>
      typeof skill === "string"
        ? {
            id: 0,
            name: skill,
            type: resolveAdminSkillType(skill),
            icon: null,
          }
        : {
            id: skill.id ?? 0,
            name: skill.name ?? "",
            type: skill.type ?? resolveAdminSkillType(skill.name),
            icon: skill.icon ?? null,
          }
    ),
    faqs: major.faqs?.map((faq) => ({
      id: faq.id ?? 0,
      major_id: faq.major_id ?? major.id ?? 0,
      question: faq.question ?? "",
      answer: faq.answer ?? "",
      sort_order: faq.sort_order ?? 0,
    })) as FAQ[] | undefined,
  } as Major;
};

const getPublicMajorDetails = async (slug: string): Promise<RawMajor | null> => {
  try {
    const res = await api.get(`/majors/${slug}/show`);
    return res.data.data ?? res.data;
  } catch {
    return null;
  }
};

const unwrap = <T>(payload: { data?: T } | T): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: T }).data as T;
  }

  return payload as T;
};

type PublicMajorsPayload = {
  recommended?: RawMajor[];
  featured?: RawMajor[];
  others?: {
    data?: RawMajor[];
  };
};

const getPublicMajorListItems = async (): Promise<RawMajor[]> => {
  try {
    const res = await api.get("/majors", { params: { per_page: 100, page: 1 } });
    const data = unwrap<PublicMajorsPayload>(res.data);

    return [
      ...(data.recommended ?? []),
      ...(data.featured ?? []),
      ...(data.others?.data ?? []),
    ];
  } catch {
    return [];
  }
};

const hydrateSkillIdsByName = (
  skills: RawMajor["skills"],
  availableSkills: RawMajor["skills"] = []
): RawMajor["skills"] => {
  const skillIdsByName = new Map<string, number>();

  availableSkills.forEach((skill) => {
    if (typeof skill === "string" || !skill.id || !skill.name) return;
    skillIdsByName.set(skill.name.trim().toLowerCase(), skill.id);
  });

  return skills?.map((skill) => {
    if (typeof skill !== "string") {
      if (skill.id || !skill.name) return skill;

      return {
        ...skill,
        id: skillIdsByName.get(skill.name.trim().toLowerCase()) ?? 0,
      };
    }

    return {
      id: skillIdsByName.get(skill.trim().toLowerCase()) ?? 0,
      name: skill,
      type: resolveAdminSkillType(skill),
      icon: null,
    };
  });
};

export const getAvailableSkills = async (): Promise<Skill[]> => {
  const majors = await getPublicMajorListItems();
  const byId = new Map<number, Skill>();

  majors.forEach((major) => {
    major.skills?.forEach((skill) => {
      if (typeof skill === "string" || !skill.id) return;

      byId.set(skill.id, {
        id: skill.id,
        name: skill.name ?? "",
        type: skill.type ?? resolveAdminSkillType(skill.name),
        icon: skill.icon ?? null,
      });
    });
  });

  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeMajorListItem = (major: RawMajor): MajorListItem => {
  const normalized = normalizeMajor(major);

  return {
    id: normalized.id,
    category_id: normalized.category_id,
    category: normalized.category
      ? {
          id: normalized.category.id,
          name_en: normalized.category.name_en,
          name_ar: normalized.category.name_ar,
          icon: normalized.category.icon,
        }
      : undefined,
    name_en: normalized.name_en,
    name_ar: normalized.name_ar,
    slug: normalized.slug,
    duration_years: normalized.duration_years,
    difficulty_level: normalized.difficulty_level,
    is_featured: normalized.is_featured,
    updated_at: normalized.updated_at,
  };
};

// GET /admin/majors
export const getMajors = async (
  params: MajorListParams = {}
): Promise<Paginated<MajorListItem>> => {
  const res = await api.get("/admin/majors", { params });
  const payload = res.data;
  const collection = payload.data;
  const meta = payload.meta ?? collection?.meta ?? {};
  const items = Array.isArray(collection)
    ? collection
    : collection?.items ?? collection?.data ?? [];

  const perPage = meta.per_page ?? params.per_page ?? 15;
  const total = meta.total ?? items.length;

  return {
    data: items.map(normalizeMajorListItem),
    meta: {
      current_page: meta.current_page ?? meta.page ?? params.page ?? 1,
      per_page: perPage,
      total,
      last_page: meta.last_page ?? Math.max(1, Math.ceil(total / perPage)),
    },
  };
};

// GET /admin/majors/{id}
export const getMajor = async (id: number): Promise<Major> => {
  const res = await api.get(`/admin/majors/${id}`);
  const adminMajor = res.data.data ?? res.data;
  const publicDetails = adminMajor?.slug
    ? await getPublicMajorDetails(adminMajor.slug)
    : null;
  const publicListItems = adminMajor?.slug ? await getPublicMajorListItems() : [];
  const publicListItem = publicListItems.find((major) => major.slug === adminMajor.slug) ?? null;
  const availableSkills = publicListItems.flatMap((major) => major.skills ?? []);

  return normalizeMajor({
    ...publicDetails,
    ...publicListItem,
    ...adminMajor,
    category: adminMajor?.category ?? publicListItem?.category ?? publicDetails?.category,
    skills: hydrateSkillIdsByName(
      adminMajor?.skills ?? publicListItem?.skills ?? publicDetails?.skills,
      availableSkills
    ),
    points: adminMajor?.points ?? publicDetails?.points,
    jobs: adminMajor?.jobs ?? publicDetails?.jobs ?? publicDetails?.job_opportunities,
    companies: adminMajor?.companies ?? publicDetails?.companies ?? publicDetails?.hiring_companies,
    faqs: adminMajor?.faqs ?? publicDetails?.faqs,
    universities: adminMajor?.universities ?? publicDetails?.universities,
  });
};

export const getMajorForEdit = async (item: MajorListItem): Promise<Major> => {
  const major = await getMajor(item.id);
  const publicDetails = major.slug
    ? await getPublicMajorDetails(major.slug)
    : null;

  return normalizeMajor({
    ...item,
    ...publicDetails,
    ...major,
    category_id: major.category_id || item.category_id,
    category: major.category ?? item.category,
    points: (major.points?.length ? major.points : publicDetails?.points) as RawMajor["points"],
    jobs: (major.jobs?.length
      ? major.jobs
      : publicDetails?.jobs ?? publicDetails?.job_opportunities) as RawMajor["jobs"],
    companies: (major.companies?.length
      ? major.companies
      : publicDetails?.companies ?? publicDetails?.hiring_companies) as RawMajor["companies"],
    faqs: (major.faqs?.length ? major.faqs : publicDetails?.faqs) as RawMajor["faqs"],
    universities: (major.universities?.length
      ? major.universities
      : publicDetails?.universities) as RawMajor["universities"],
  });
};

// POST /admin/majors
export const createMajor = async (data: Record<string, unknown>): Promise<Major> => {
  const res = await api.post("/admin/majors", data);
  return normalizeMajor(res.data.data ?? res.data);
};

// PUT /admin/majors/{id}
export const updateMajor = async (id: number, data: Record<string, unknown>): Promise<Major> => {
  const res = await api.put(`/admin/majors/${id}`, data);
  return normalizeMajor(res.data.data ?? res.data);
};

