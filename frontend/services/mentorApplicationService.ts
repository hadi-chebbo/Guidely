import api from "@/lib/api";

export interface MentorApplicationUser {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface MentorApplicationProfile {
  id: number;
  major_id: number;
  status: string;
  is_accepting_students: boolean;
  bio: string;
  years_experience: number;
  degree: string;
  university_name: string;
  graduation_year: number;
  languages: string[] | string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
}

export interface MentorApplication {
  user: MentorApplicationUser;
  mentor_profile: MentorApplicationProfile;
}

export interface MentorApplicationsResponse {
  data: MentorApplication[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

type ApiResponse<T> = {
  data?: T;
  meta?: MentorApplicationsResponse["meta"];
  message?: string;
};

const defaultMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

const normalizeLanguages = (languages: MentorApplicationProfile["languages"]) => {
  if (Array.isArray(languages)) return languages.map(String).filter(Boolean);
  if (typeof languages === "string") {
    return languages
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);
  }
  return [];
};

export const mentorApplicationService = {
  async getPending(page = 1): Promise<MentorApplicationsResponse> {
    const res = await api.get<ApiResponse<MentorApplication[]>>(
      "/admin/mentor-applications",
      { params: { page } }
    );

    return {
      data: Array.isArray(res.data.data) ? res.data.data : [],
      meta: res.data.meta ?? defaultMeta,
    };
  },

  async getByUsername(username: string): Promise<MentorApplication> {
    const res = await api.get<ApiResponse<MentorApplication>>(
      `/admin/mentor-applications/${username}`
    );

    if (!res.data.data) {
      throw new Error("Mentor application not found.");
    }

    return res.data.data;
  },

  async approve(username: string): Promise<MentorApplication> {
    const res = await api.patch<ApiResponse<MentorApplication>>(
      `/admin/mentor-applications/${username}/approve`
    );

    if (!res.data.data) {
      throw new Error("Mentor application could not be approved.");
    }

    return res.data.data;
  },

  async reject(username: string): Promise<MentorApplication> {
    const res = await api.patch<ApiResponse<MentorApplication>>(
      `/admin/mentor-applications/${username}/reject`
    );

    if (!res.data.data) {
      throw new Error("Mentor application could not be rejected.");
    }

    return res.data.data;
  },

  formatLanguages: normalizeLanguages,
};
