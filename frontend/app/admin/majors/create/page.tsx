"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import MajorForm from "@/components/admin/majors/MajorForm";

export default function CreateMajorPage() {
  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Content"
        title="Add Major"
        description="Create a new academic path using the same admin workflow as the rest of the console."
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
        <MajorForm mode="create" />
      </AdminCard>
    </AdminPageShell>
  );
}
