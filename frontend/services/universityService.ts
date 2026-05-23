import api from "@/lib/api";
import type {
  University,
  CreateUniversityDTO,
  UpdateUniversityDTO,
  UniversitiesApiResponse,
  UniversityMajor,
} from "@/types/university";

export type AssignUniversityMajorDTO = {
  major_id: number;
  credit_price_usd?: number | null;
  total_credits?: number | null;
  admission_requirements?: string | null;
  language_of_instruction?: string | null;
  has_scholarship?: boolean;
  campus?: string | null;
};

export const universityService = {
  getAll: async (page = 1): Promise<UniversitiesApiResponse> => {
    const { data } = await api.get("/admin/universities", {
      params: { page },
    });

    return data;
  },

  getById: async (id: number): Promise<University> => {
    const { data } = await api.get(`/admin/universities/${id}`);
    return data.data;
  },

  create: async (payload: CreateUniversityDTO): Promise<University> => {
    const { data } = await api.post("/admin/universities", payload);
    return data.data;
  },

  update: async (
    id: number,
    payload: UpdateUniversityDTO
  ): Promise<University> => {
    const { data } = await api.put(
      `/admin/universities/${id}`,
      payload
    );

    return data.data;
  },

  getMajors: async (id: number): Promise<UniversityMajor[]> => {
    const { data } = await api.get(`/admin/universities/${id}/majors`);
    const payload = data.data;

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;

    return [];
  },

  assignMajor: async (
    id: number,
    payload: AssignUniversityMajorDTO
  ): Promise<UniversityMajor> => {
    const { data } = await api.post(`/admin/universities/${id}/majors`, payload);
    return data.data;
  },
 
};
