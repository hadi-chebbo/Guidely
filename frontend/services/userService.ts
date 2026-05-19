import api from "@/lib/api";
import type { User } from "@/types/user";

export interface UsersResponse {
  data: User[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
}

export const userService = {
  getAll: async (
    page = 1,
    role?: "student" | "mentor" | "admin"
  ): Promise<UsersResponse> => {
    const res = await api.get("/admin/users", {
      params: { page, ...(role ? { role } : {}) },
    });
    const payload = res.data?.data ?? res.data;
    const items: User[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
      ? payload.items
      : [];
    const meta = payload?.meta ?? res.data?.meta ?? {};
    const links = payload?.links ?? res.data?.links ?? {};
    return {
      data: items,
      meta: {
        current_page: meta.current_page ?? meta.page ?? 1,
        per_page: meta.per_page ?? 15,
        total: meta.total ?? 0,
        last_page: meta.last_page ?? 1,
      },
      links: {
        next: links.next ?? null,
        prev: links.prev ?? null,
      },
    };
  },

  search: async (username: string): Promise<UsersResponse> => {
    const res = await api.get("/admin/users/search", {
      params: { username },
    });
    const payload = res.data?.data ?? res.data;
    const items: User[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
      ? payload.items
      : [];
    const meta = payload?.meta ?? res.data?.meta ?? {};
    return {
      data: items,
      meta: {
        current_page: 1,
        per_page: items.length,
        total: items.length,
        last_page: 1,
      },
      links: { next: null, prev: null },
    };
  },

  toggleBlock: async (id: number) => {
    const res = await api.patch(`/admin/users/${id}/toggleBlock`);
    return res.data;
  },
};
