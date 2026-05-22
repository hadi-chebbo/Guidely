import api from "@/lib/api";

type ApiResponse<T> = {
  data?: T;
  message?: string;
  application?: T;
};

export type MentorSessionType = "one-on-one" | "group";

export interface MentorProfile {
  id?: number;
  user_id?: number;
  major_slug: string;
  status?: string;
  is_accepting_students: boolean;
  bio: string;
  years_experience: number;
  degree: string;
  university_name: string;
  graduation_year: number;
  languages: string[];
  linkedin_url?: string | null;
  website_url?: string | null;
  major?: {
    name_en?: string;
    name_ar?: string;
    slug?: string;
  } | null;
  updated_at?: string | null;
}

type PublicMentorProfilePayload = {
  user?: {
    name?: string;
    username?: string;
    avatar_url?: string | null;
    school?: string | null;
    preferred_language?: string | null;
  };
  mentor?: Partial<MentorProfile> & {
    major?: MentorProfile["major"] | { name?: string | null; slug?: string | null } | null;
    social_links?: {
      linkedin?: string | null;
      website?: string | null;
    };
  };
  name?: string;
  username?: string;
  avatar_url?: string | null;
  school?: string | null;
  preferred_language?: string | null;
  id?: number;
  user_id?: number;
  status?: string;
  is_accepting_students?: boolean;
  bio?: string | null;
  years_experience?: number | null;
  degree?: string | null;
  university_name?: string | null;
  graduation_year?: number | null;
  languages?: string[] | string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  major_slug?: string | null;
  major?: { name?: string | null; name_en?: string | null; name_ar?: string | null; slug?: string | null } | null;
  profile?: {
    id?: number;
    user_id?: number;
    status?: string;
    bio?: string | null;
    degree?: string | null;
    university_name?: string | null;
    graduation_year?: number | null;
    years_experience?: number | null;
    languages?: string[] | string | null;
    is_accepting_students?: boolean;
    major?: { name?: string | null; name_en?: string | null; slug?: string | null } | null;
    social_links?: {
      linkedin?: string | null;
      website?: string | null;
    };
  } | null;
};

export interface MentorSession {
  slug: string;
  title: string;
  description: string;
  type: MentorSessionType;
  duration_minutes: number;
  max_capacity: number;
  price: string | number;
  currency: string;
  is_active: boolean;
  status: "active" | "inactive" | string;
  availabilities_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type MentorAvailabilityStatus = "open" | "full" | "cancelled" | "completed";

export interface MentorAvailability {
  uuid: string;
  id?: number | string;
  scheduled_at: string;
  ends_at: string;
  status: MentorAvailabilityStatus | string;
  timezone?: string | null;
  meeting_platform: string;
  meeting_link: string;
}

export interface MentorSessionPayload {
  title: string;
  description: string;
  type: MentorSessionType;
  duration_minutes: number;
  max_capacity: number;
  price: number;
  currency: string;
  is_active: boolean;
}

export interface MentorAvailabilityPayload {
  scheduled_at: string;
  ends_at: string;
  timezone?: string;
  status?: MentorAvailabilityStatus;
  meeting_platform: string;
  meeting_link: string;
}

export type MentorProfilePayload = Omit<MentorProfile, "id" | "user_id" | "status" | "major" | "updated_at">;

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponse<T>).data as T;
  }

  if (payload && typeof payload === "object" && "application" in payload) {
    return (payload as ApiResponse<T>).application as T;
  }

  return payload as T;
};

const normalizeLanguages = (languages: unknown): string[] => {
  if (Array.isArray(languages)) {
    return languages.map(String).filter(Boolean);
  }

  if (typeof languages === "string") {
    return languages
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeProfile = (profile: Partial<MentorProfile>): MentorProfile => ({
  major_slug: profile.major_slug ?? profile.major?.slug ?? "",
  status: profile.status,
  is_accepting_students: Boolean(profile.is_accepting_students),
  bio: profile.bio ?? "",
  years_experience: Number(profile.years_experience ?? 0),
  degree: profile.degree ?? "",
  university_name: profile.university_name ?? "",
  graduation_year: Number(profile.graduation_year ?? new Date().getFullYear()),
  languages: normalizeLanguages(profile.languages),
  linkedin_url: profile.linkedin_url ?? null,
  website_url: profile.website_url ?? null,
  id: profile.id,
  user_id: profile.user_id,
  major: profile.major ?? null,
  updated_at: profile.updated_at ?? null,
});

const normalizePublicProfile = (payload: PublicMentorProfilePayload): MentorProfile => {
  const profile = (payload.mentor ?? payload.profile ?? payload) as Partial<MentorProfile> & {
    major?: { name?: string | null; name_en?: string | null; slug?: string | null } | null;
    social_links?: {
      linkedin?: string | null;
      website?: string | null;
    };
  };
  const socialLinks =
    "social_links" in profile && profile.social_links
      ? profile.social_links
      : undefined;

  return normalizeProfile({
    id: profile.id,
    user_id: profile.user_id,
    status: profile.status,
    major_slug: profile.major_slug ?? profile.major?.slug ?? "",
    is_accepting_students: Boolean(profile.is_accepting_students),
    bio: profile.bio ?? "",
    years_experience: Number(profile.years_experience ?? 0),
    degree: profile.degree ?? "",
    university_name: profile.university_name ?? "",
    graduation_year: Number(profile.graduation_year ?? new Date().getFullYear()),
    languages: normalizeLanguages(profile.languages),
    linkedin_url: profile.linkedin_url ?? socialLinks?.linkedin ?? null,
    website_url: profile.website_url ?? socialLinks?.website ?? null,
    major: profile.major
      ? {
          name_en: profile.major.name_en ?? profile.major.name ?? "",
          slug: profile.major.slug ?? "",
        }
      : null,
  });
};

const normalizeSession = (session: Partial<MentorSession>): MentorSession => ({
  slug: session.slug ?? "",
  title: session.title ?? "",
  description: session.description ?? "",
  type: session.type ?? "one-on-one",
  duration_minutes: Number(session.duration_minutes ?? 30),
  max_capacity: Number(session.max_capacity ?? 1),
  price: session.price ?? 0,
  currency: session.currency ?? "USD",
  is_active: Boolean(session.is_active),
  status: session.status ?? (session.is_active ? "active" : "inactive"),
  availabilities_count: session.availabilities_count,
  created_at: session.created_at,
  updated_at: session.updated_at,
});

const normalizeAvailability = (availability: Partial<MentorAvailability>): MentorAvailability => ({
  uuid: availability.uuid ?? String(availability.id ?? ""),
  id: availability.id,
  scheduled_at: availability.scheduled_at ?? "",
  ends_at: availability.ends_at ?? "",
  status: availability.status ?? "open",
  timezone: availability.timezone ?? "UTC",
  meeting_platform: availability.meeting_platform ?? "",
  meeting_link: availability.meeting_link ?? "",
});

const normalizeCreatedAvailability = (payload: unknown): MentorAvailability => {
  const data = unwrap(payload as ApiResponse<unknown> | unknown);

  if (data && typeof data === "object" && "availability" in data) {
    return normalizeAvailability((data as { availability?: Partial<MentorAvailability> }).availability ?? {});
  }

  if (data && typeof data === "object" && "availabilities" in data) {
    const created = (data as { availabilities?: Partial<MentorAvailability>[] }).availabilities;
    return normalizeAvailability(Array.isArray(created) ? created[0] ?? {} : {});
  }

  return normalizeAvailability((data ?? {}) as Partial<MentorAvailability>);
};

export const mentorService = {
  async getProfileByUsername(username: string): Promise<MentorProfile> {
    const res = await api.get<ApiResponse<PublicMentorProfilePayload>>(`/mentors/${username}`);
    return normalizePublicProfile(unwrap(res.data));
  },

  async updateProfile(payload: MentorProfilePayload): Promise<MentorProfile> {
    const res = await api.patch<ApiResponse<MentorProfile>>("/mentor/profile", payload);
    return normalizeProfile(unwrap(res.data));
  },

  async createProfile(payload: MentorProfilePayload): Promise<MentorProfile> {
    const res = await api.post<ApiResponse<MentorProfile>>("/mentors/apply", payload);
    return normalizeProfile(unwrap(res.data));
  },

  async getSessions(): Promise<MentorSession[]> {
    const res = await api.get<ApiResponse<MentorSession[]> | MentorSession[]>("/mentor/sessions");
    const data = unwrap<MentorSession[]>(res.data);
    return Array.isArray(data) ? data.map(normalizeSession) : [];
  },

  async createSession(payload: MentorSessionPayload): Promise<MentorSession> {
    const res = await api.post<ApiResponse<MentorSession>>("/mentor/sessions", payload);
    return normalizeSession(unwrap(res.data));
  },

  async updateSession(slug: string, payload: Partial<MentorSessionPayload>): Promise<MentorSession> {
    const res = await api.put<ApiResponse<MentorSession>>(`/mentor/sessions/${slug}`, payload);
    return normalizeSession(unwrap(res.data));
  },

  async getAvailabilities(sessionSlug: string): Promise<MentorAvailability[]> {
    const res = await api.get<ApiResponse<MentorAvailability[]> | MentorAvailability[]>(
      `/mentor/sessions/${sessionSlug}/availabilities`
    );
    const data = unwrap<MentorAvailability[]>(res.data);
    return Array.isArray(data) ? data.map(normalizeAvailability) : [];
  },

  async createAvailability(
    sessionSlug: string,
    payload: MentorAvailabilityPayload
  ): Promise<MentorAvailability> {
    const res = await api.post<ApiResponse<{ availabilities?: MentorAvailability[] }> | MentorAvailability>(
      `/mentor/sessions/${sessionSlug}/availabilities`,
      { slots: [payload] }
    );

    return normalizeCreatedAvailability(res.data);
  },

  async updateAvailability(
    sessionSlug: string,
    availability: string | number,
    payload: Partial<MentorAvailabilityPayload>
  ): Promise<MentorAvailability> {
    const res = await api.patch<ApiResponse<MentorAvailability>>(
      `/mentor/sessions/${sessionSlug}/availabilities/${availability}`,
      payload
    );

    return normalizeAvailability(unwrap(res.data));
  },

  async deleteAvailability(sessionSlug: string, availability: string | number): Promise<void> {
    await api.delete(`/mentor/sessions/${sessionSlug}/availabilities/${availability}`);
  },
};
