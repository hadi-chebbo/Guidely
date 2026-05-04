"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UniversityForm from "@/components/admin/universities/UniversityForm";

export default function CreateUniversityPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/universities"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Universities
        </Link>
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Add University</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in the details to add a new university.</p>
      </div>
      <UniversityForm mode="create" onSuccess={() => router.push("/admin/universities")} />
    </div>
  );
}
