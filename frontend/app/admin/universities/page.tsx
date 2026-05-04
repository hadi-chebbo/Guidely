"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import UniversitiesTable from "@/components/admin/universities/UniversitiesTable";
import UniversitiesFilters, {
  defaultUniversityFilters,
  type UniversityFilters,
} from "@/components/admin/universities/UniversitiesFilters";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { getUniversities, deleteUniversity } from "@/services/universitiesService";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminUniversitiesPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UniversityFilters>(defaultUniversityFilters);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push("/login?redirect=/admin/universities");
        return;
      }
      if (user.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-universities",
      page,
      debouncedSearch,
      filters.type,
      filters.accreditation,
      filters.country,
      filters.featuredOnly,
    ],
    queryFn: () =>
      getUniversities({
        page,
        per_page: 20,
        search: debouncedSearch || undefined,
        type: filters.type || undefined,
        accreditation_status: filters.accreditation || undefined,
        country: filters.country || undefined,
        featured_only: filters.featuredOnly || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
      setDeleteTarget(null);
    },
  });

  const handleEdit = (id: number) => router.push(`/admin/universities/${id}/edit`);

  const handleDelete = (id: number) => {
    const item = data?.data.find((u) => u.id === id);
    setDeleteTarget({ id, name: item?.name_en ?? "this university" });
  };

  const handleFiltersChange = (next: UniversityFilters) => {
    setFilters(next);
    setPage(1);
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
          <h1 className="font-heading text-2xl font-bold text-gray-900">Universities</h1>
          <p className="mt-1 text-sm text-gray-500">{data?.meta.total ?? 0} universities</p>
        </div>
        <Button
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => router.push("/admin/universities/create")}
        >
          Add University
        </Button>
      </div>

      <UniversitiesFilters filters={filters} onChange={handleFiltersChange} />

      <UniversitiesTable
        items={data?.data ?? []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {data && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          perPage={data.meta.per_page}
          onPageChange={setPage}
        />
      )}

      {deleteTarget !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900">Delete University</h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete &ldquo;{deleteTarget.name}&rdquo;? This action
                  cannot be undone.
                </p>
              </div>

              <div className="flex w-full justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth={false}
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(deleteTarget.id)}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
