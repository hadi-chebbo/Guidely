"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MajorForm from "@/components/admin/majors/MajorForm";

export default function CreateMajorPage() {
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
          <h1 className="font-heading text-2xl font-bold text-gray-900">Add Major</h1>
          <p className="text-sm text-gray-500">Fill in the details to create a new major</p>
        </div>
      </div>

      <MajorForm mode="create" />
    </div>
  );
}
