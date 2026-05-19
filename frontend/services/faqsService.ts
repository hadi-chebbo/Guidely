import api from "@/lib/api";
import type { FAQ } from "@/types/major";

// GET /admin/majors/{majorId}/faqs
export const getFaqs = async (majorId: number): Promise<FAQ[]> => {
  const res = await api.get(`/admin/majors/${majorId}/faqs`);
  return res.data.data ?? res.data;
};

// POST /admin/majors/{majorId}/faqs
export const createFaq = async (
  majorId: number,
  data: { question: string; answer: string; sort_order?: number }
): Promise<FAQ> => {
  const res = await api.post(`/admin/majors/${majorId}/faqs`, data);
  return res.data.data ?? res.data;
};

// PUT /admin/faqs/{id}
export const updateFaq = async (
  id: number,
  data: { question?: string; answer?: string; sort_order?: number }
): Promise<FAQ> => {
  const res = await api.put(`/admin/faqs/${id}`, data);
  return res.data.data ?? res.data;
};

// DELETE /admin/faqs/{id}
export const deleteFaq = async (id: number): Promise<void> => {
  await api.delete(`/admin/faqs/${id}`);
};
