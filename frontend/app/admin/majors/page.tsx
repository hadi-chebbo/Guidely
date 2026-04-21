"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import MajorsTable from "@/components/admin/majors/MajorsTable";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { mockMajorListPaginated } from "@/lib/mocks/majors";

export default function AdminMajorsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);

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

  // TI-40: replace with useQuery({ queryFn: () => api.get('/admin/majors', { params: { page } }) })
  const { data: items, meta } = mockMajorListPaginated;

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
          <p className="mt-1 text-sm text-gray-500">{meta.total} majors total</p>
        </div>
        <Button
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Major
        </Button>
      </div>

      <MajorsTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        lastPage={meta.last_page}
        total={meta.total}
        perPage={meta.per_page}
        onPageChange={setPage}
      />
    </div>
  );
}
