import api from "@/lib/api";
import type { University, UniversityListItem, Paginated } from "@/types/university";
import type { UniversityFormData } from "@/lib/validations/university";

export interface UniversityListParams {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  accreditation_status?: string;
  country?: string;
  featured_only?: boolean;
}

// GET /api/v1/admin/universities
export const getUniversities = async (
  params: UniversityListParams = {}
): Promise<Paginated<UniversityListItem>> => {
  const res = await api.get("/api/v1/admin/universities", { params });
  return res.data.data ?? res.data;
};

// GET /api/v1/admin/universities/{id}
export const getUniversity = async (id: number): Promise<University> => {
  const res = await api.get(`/api/v1/admin/universities/${id}`);
  return res.data.data ?? res.data;
};

// POST /api/v1/admin/universities
export const createUniversity = async (
  data: UniversityFormData
): Promise<University> => {
  const res = await api.post("/api/v1/admin/universities", data);
  return res.data.data ?? res.data;
};

// PUT /api/v1/admin/universities/{id}
export const updateUniversity = async (
  id: number,
  data: Partial<UniversityFormData>
): Promise<University> => {
  const res = await api.put(`/api/v1/admin/universities/${id}`, data);
  return res.data.data ?? res.data;
};

// DELETE /api/v1/admin/universities/{id}
export const deleteUniversity = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/admin/universities/${id}`);
};
