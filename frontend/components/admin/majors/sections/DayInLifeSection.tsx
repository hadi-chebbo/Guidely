"use client";

import { useFormContext } from "react-hook-form";
import type { MajorFormData } from "@/lib/validations/major";
import Textarea from "@/components/ui/Textarea";

export default function DayInLifeSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Day in the Life</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Describe a typical day for someone in this field.
        </p>
      </div>

      <Textarea
        label="Day in the Life"
        placeholder="A typical day might start with..."
        rows={12}
        error={errors.day_in_life?.message}
        {...register("day_in_life")}
      />
    </div>
  );
}
