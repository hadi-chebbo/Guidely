"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import MajorForm from "@/components/admin/majors/MajorForm";
import { getAvailableSkills, getMajor } from "@/services/majorsService";
import { getCategories } from "@/services/studentService";
import type { MajorFormData } from "@/lib/validations/major";
import type { Major, MajorListItem, Paginated } from "@/types/major";

interface EditMajorClientProps {
  majorId: number;
}

export default function EditMajorClient({ majorId }: EditMajorClientProps) {
  const router = useRouter();
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
      <AdminPageShell>
        <div className="h-24 w-full animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm" />
        <div className="h-[620px] w-full animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm" />
      </AdminPageShell>
    );
  }

  if (isError || !major) {
    return (
      <AdminPageShell>
        <AdminCard className="p-12 text-center">
          <p className="text-gray-500">Major not found.</p>
          <Link href="/admin/majors" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
            Back to majors
          </Link>
        </AdminCard>
      </AdminPageShell>
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
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Content"
        title="Edit Major"
        description={major.name_en}
        actions={
          <Link
            href="/admin/majors"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Majors
          </Link>
        }
      />
      <AdminCard className="p-6">
        <MajorForm
          mode="edit"
          initialData={initialData}
          majorId={majorId}
          majorDetails={major}
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
              queryClient.invalidateQueries({ queryKey: ["admin-majors"] }),
            ]);
            router.push("/admin/majors");
          }}
        />
      </AdminCard>
    </AdminPageShell>
  );
}
