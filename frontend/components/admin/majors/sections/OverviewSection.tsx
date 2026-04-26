"use client";

import { useFormContext } from "react-hook-form";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { MajorFormData } from "@/lib/validations/major";

export default function OverviewSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  return (
    <div className="space-y-6">
      <Textarea
        label="Short Description"
        placeholder="Brief overview shown in cards and search results (1–2 sentences)"
        rows={3}
        error={errors.overview?.message}
        {...register("overview")}
      />

      <Textarea
        label="Full Description"
        placeholder="Detailed description of the major, what students learn, career outlook..."
        rows={8}
        error={errors.description?.message}
        {...register("description")}
      />

      <Input
        label="Cover Image URL"
        type="url"
        placeholder="https://example.com/image.jpg"
        hint="Recommended: 1200×630px. Leave blank to use category default."
        error={errors.cover_image?.message}
        {...register("cover_image")}
      />
    </div>
  );
}
