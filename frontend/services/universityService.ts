import api from "@/lib/api";
import type {
  University,
  CreateUniversityDTO,
  UpdateUniversityDTO,
  UniversitiesApiResponse,
} from "@/types/university";

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

 
};