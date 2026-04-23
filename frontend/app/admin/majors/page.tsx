"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import MajorsTable from "@/components/admin/majors/MajorsTable";
import MajorsFilters, { defaultMajorFilters, type MajorFilters } from "@/components/admin/majors/MajorsFilters";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { mockMajorListPaginated } from "@/lib/mocks/majors";
import { useDebounce } from "@/hooks/useDebounce";

const PER_PAGE = 20;

export default function AdminMajorsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MajorFilters>(defaultMajorFilters);
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push("/login?redirect=/admin/majors");
        return;
      }
      if (user.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // TI-40: replace with useQuery({ queryFn: () => api.get('/admin/majors', { params: { page, ...filters } }) })
  const allItems = mockMajorListPaginated.data;

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!item.name_en.toLowerCase().includes(q) && !item.name_ar.includes(debouncedSearch)) return false;
      }
      if (filters.category && String(item.category_id) !== filters.category) return false;
      if (filters.difficulty && item.difficulty_level !== filters.difficulty) return false;
      if (filters.featuredOnly && !item.is_featured) return false;
      return true;
    });
  }, [allItems, debouncedSearch, filters.category, filters.difficulty, filters.featuredOnly]);

  const handleFiltersChange = (next: MajorFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleEdit = (id: number) => {
    // TI-41: navigate to edit form
    void id;
  };

  const handleDelete = (id: number) => {
    // TI-40: open confirm modal then call api.delete('/admin/majors/' + id)
    void id;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Majors</h1>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} majors</p>
        </div>
        <Button
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Major
        </Button>
      </div>

      <MajorsFilters filters={filters} onChange={handleFiltersChange} />

      <MajorsTable
        items={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        lastPage={Math.max(1, Math.ceil(filtered.length / PER_PAGE))}
        total={filtered.length}
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
}
