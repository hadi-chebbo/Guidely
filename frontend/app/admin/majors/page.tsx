"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";

import { getAvailableSkills, getMajor, getMajors } from "@/services/majorsService";
import { getCategories } from "@/services/studentService";
import { AdminCard, AdminModalFrame, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import MajorForm from "@/components/admin/majors/MajorForm";
import MajorsTable from "@/components/admin/majors/MajorsTable";
import MajorsFilters, { defaultMajorFilters, type MajorFilters } from "@/components/admin/majors/MajorsFilters";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import type { Major, MajorListItem, Paginated } from "@/types/major";
import type { MajorFormData } from "@/lib/validations/major";

const PER_PAGE = 15;

export default function AdminMajorsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MajorFilters>(defaultMajorFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingMajorId, setEditingMajorId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(filters.search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-majors", page, debouncedSearch, filters.category, filters.difficulty, filters.featuredOnly],
    queryFn: () =>
      getMajors({
        page,
        per_page: PER_PAGE,
        name_en: debouncedSearch || undefined,
        category_id: filters.category ? Number(filters.category) : undefined,
        difficulty_level: filters.difficulty || undefined,
        is_featured: filters.featuredOnly ? 1 : undefined,
      }),
  });

  const handleFiltersChange = (next: MajorFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleEdit = (id: number) => {
    setEditingMajorId(id);
  };

  const refreshMajors = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-majors"] });
  };

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Content"
        title="Majors"
        description="Create, edit, and manage academic paths, skills, outcomes, and market data."
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add Major
          </button>
        }
      />

      <div>
        <MajorsFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      <AdminCard>
        <div className="border-b border-gray-200 px-4 py-3 text-xs font-medium text-gray-500">
          {meta ? `Showing ${items.length} of ${meta.total} majors` : "Loading majors..."}
        </div>

        <MajorsTable
          items={items}
          loading={isLoading}
          onEdit={handleEdit}
        />

        {meta && (
          <div className="border-t border-gray-200 p-4">
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </AdminCard>

      {createOpen && (
        <MajorFormModal
          title="Add Major"
          subtitle="Create a new academic path."
          onClose={() => setCreateOpen(false)}
        >
          <MajorForm
            mode="create"
            onCancel={() => setCreateOpen(false)}
            onSuccess={async () => {
              await refreshMajors();
              setCreateOpen(false);
            }}
          />
        </MajorFormModal>
      )}

      {editingMajorId && (
        <EditMajorModal
          majorId={editingMajorId}
          onClose={() => setEditingMajorId(null)}
          onSaved={async () => {
            await refreshMajors();
            setEditingMajorId(null);
          }}
        />
      )}
    </AdminPageShell>
  );
}

function MajorFormModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AdminModalFrame className="max-h-[92vh] max-w-4xl overflow-hidden p-0">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          aria-label="Close major modal"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[calc(92vh-88px)] overflow-y-auto p-6">{children}</div>
    </AdminModalFrame>
  );
}

function EditMajorModal({
  majorId,
  onClose,
  onSaved,
}: {
  majorId: number;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const queryClient = useQueryClient();

  const { data: major, isLoading, isError } = useQuery({
    queryKey: ["major", majorId],
    queryFn: () => getMajor(majorId),
    enabled: Number.isFinite(majorId),
  });
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: availableSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ["admin-major-skill-options"],
    queryFn: getAvailableSkills,
  });

  if (isLoading || categoriesLoading || skillsLoading) {
    return (
      <MajorFormModal title="Edit Major" subtitle="Loading major details..." onClose={onClose}>
        <div className="h-[560px] animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
      </MajorFormModal>
    );
  }

  if (isError || !major) {
    return (
      <MajorFormModal title="Edit Major" subtitle="Major could not be loaded." onClose={onClose}>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-500">
          Major not found.
        </div>
      </MajorFormModal>
    );
  }

  const resolvedCategoryId = major.category_id || categories?.find((category) => (
    category.slug === major.category?.slug ||
    category.name_en === major.category?.name_en ||
    category.name_ar === major.category?.name_ar
  ))?.id || 0;
  const skillIdByName = new Map(
    (availableSkills ?? []).map((skill) => [skill.name.trim().toLowerCase(), skill.id])
  );
  const initialSkills = major.skills
    ?.map((skill) => ({
      skill_id: skill.id > 0
        ? skill.id
        : skillIdByName.get(skill.name.trim().toLowerCase()) ?? 0,
    }))
    .filter((skill) => skill.skill_id > 0) ?? [];

  const initialData = {
    name_en: major.name_en,
    name_ar: major.name_ar,
    slug: major.slug,
    category_id: resolvedCategoryId,
    difficulty_level: major.difficulty_level,
    duration_years: major.duration_years,
    salary_min: major.salary_min,
    salary_max: major.salary_max,
    local_demand: major.local_demand,
    international_demand: major.international_demand,
    is_featured: major.is_featured,
    cover_image: major.cover_image ?? "",
    overview: major.overview ?? "",
    description: major.description ?? "",
    points: major.points ?? [],
    skills: initialSkills,
    jobs: major.jobs ?? [],
    companies: major.companies ?? [],
    faqs: major.faqs ?? [],
  };

  return (
    <MajorFormModal title="Edit Major" subtitle={major.name_en} onClose={onClose}>
      <MajorForm
        mode="edit"
        initialData={initialData}
        majorId={majorId}
        majorDetails={major}
        onCancel={onClose}
        onSuccess={async (updatedMajor?: Major, submittedData?: Partial<MajorFormData>) => {
          const selectedCategory = categories?.find(
            (category) => category.id === submittedData?.category_id
          );
          const mergedMajor = updatedMajor
            ? {
                ...updatedMajor,
                category_id: submittedData?.category_id ?? updatedMajor.category_id,
                category: selectedCategory
                  ? {
                      id: selectedCategory.id,
                      name_en: selectedCategory.name_en,
                      name_ar: selectedCategory.name_ar,
                      slug: selectedCategory.slug,
                      description: selectedCategory.description,
                      icon: selectedCategory.icon,
                      is_active: true,
                    }
                  : updatedMajor.category,
                name_en: submittedData?.name_en ?? updatedMajor.name_en,
                name_ar: submittedData?.name_ar ?? updatedMajor.name_ar,
                slug: submittedData?.slug ?? updatedMajor.slug,
                salary_min: submittedData?.salary_min ?? updatedMajor.salary_min,
                salary_max: submittedData?.salary_max ?? updatedMajor.salary_max,
                overview: submittedData?.overview ?? updatedMajor.overview,
                description: submittedData?.description ?? updatedMajor.description,
                duration_years: submittedData?.duration_years ?? updatedMajor.duration_years,
                difficulty_level: submittedData?.difficulty_level ?? updatedMajor.difficulty_level,
                local_demand: submittedData?.local_demand ?? updatedMajor.local_demand,
                international_demand: submittedData?.international_demand ?? updatedMajor.international_demand,
                is_featured: submittedData?.is_featured ?? updatedMajor.is_featured,
                cover_image: submittedData?.cover_image ?? updatedMajor.cover_image,
                updated_at: new Date().toISOString(),
              }
            : undefined;

          if (mergedMajor) {
            queryClient.setQueryData(["major", majorId], mergedMajor);
            queryClient.setQueriesData<Paginated<MajorListItem>>(
              { queryKey: ["admin-majors"] },
              (previous) => {
                if (!previous) return previous;

                return {
                  ...previous,
                  data: previous.data.map((item) =>
                    item.id === mergedMajor.id
                      ? {
                          ...item,
                          category_id: mergedMajor.category_id,
                          category: mergedMajor.category
                            ? {
                                id: mergedMajor.category.id,
                                name_en: mergedMajor.category.name_en,
                                name_ar: mergedMajor.category.name_ar,
                                icon: mergedMajor.category.icon,
                              }
                            : item.category,
                          name_en: mergedMajor.name_en,
                          name_ar: mergedMajor.name_ar,
                          slug: mergedMajor.slug,
                          duration_years: mergedMajor.duration_years || item.duration_years,
                          difficulty_level: mergedMajor.difficulty_level,
                          is_featured: mergedMajor.is_featured,
                          updated_at: mergedMajor.updated_at,
                        }
                      : item
                  ),
                };
              }
            );
          }
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["major", majorId] }),
            onSaved(),
          ]);
        }}
      />
    </MajorFormModal>
  );
}
