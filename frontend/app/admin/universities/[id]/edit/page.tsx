"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UniversityForm from "@/components/admin/universities/UniversityForm";
import { getUniversity } from "@/services/universitiesService";

interface EditUniversityPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUniversityPage({ params }: EditUniversityPageProps) {
  const { id } = use(params);
  const universityId = Number(id);
  const router = useRouter();

  const { data: university, isLoading, isError } = useQuery({
    queryKey: ["university", universityId],
    queryFn: () => getUniversity(universityId),
    enabled: !isNaN(universityId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError || !university) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">University not found.</p>
        <Link
          href="/admin/universities"
          className="mt-3 inline-block text-sm text-brand-600 hover:underline"
        >
          Back to universities
        </Link>
      </div>
    );
  }

  const initialData = {
    name_en: university.name_en,
    name_ar: university.name_ar,
    slug: university.slug,
    overview: university.overview ?? "",
    description: university.description ?? "",
    location: university.location ?? "",
    country: university.country ?? "",
    type: university.type,
    accreditation_status: university.accreditation_status,
    established_year: university.established_year ?? null,
    student_count: university.student_count ?? null,
    acceptance_rate: university.acceptance_rate ?? null,
    tuition_min: university.tuition_min ?? null,
    tuition_max: university.tuition_max ?? null,
    is_featured: university.is_featured,
    logo_url: university.logo_url ?? null,
    cover_image: university.cover_image ?? null,
    website_url: university.website_url ?? null,
    email: university.email ?? "",
    phone: university.phone ?? null,
    address: university.address ?? null,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/universities"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Edit University</h1>
          <p className="text-sm text-gray-500">{university.name_en}</p>
        </div>
      </div>

      <UniversityForm
        mode="edit"
        initialData={initialData}
        universityId={universityId}
        onSuccess={() => router.push("/admin/universities")}
      />
    </div>
  );
}
