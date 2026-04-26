"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import MajorForm from "@/components/admin/majors/MajorForm";
import { mockMajors } from "@/lib/mocks/majors";

interface EditMajorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMajorPage({ params }: EditMajorPageProps) {
  const { id } = use(params);

  // TI-43: replace with useQuery({ queryFn: () => api.get(`/admin/majors/${id}`) })
  const major = mockMajors.find((m) => String(m.id) === id);

  if (!major) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Major not found.</p>
        <Link href="/admin/majors" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
          Back to majors
        </Link>
      </div>
    );
  }

  const initialData = {
    name_en: major.name_en,
    name_ar: major.name_ar,
    slug: major.slug,
    category_id: major.category_id,
    difficulty_level: major.difficulty_level,
    duration_years: major.duration_years,
    is_featured: major.is_featured,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/majors"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Edit Major</h1>
          <p className="text-sm text-gray-500">{major.name_en}</p>
        </div>
      </div>

      <MajorForm mode="edit" initialData={initialData} />
    </div>
  );
}
