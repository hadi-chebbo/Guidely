"use client";

import { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import { DIFFICULTY_LEVELS, DEMAND_LEVELS, type MajorFormData } from "@/lib/validations/major";
import { mockCategories } from "@/lib/mocks/majors";

const categoryOptions = mockCategories.map((c) => ({
  value: String(c.id),
  label: c.name_en,
}));

const difficultyOptions = DIFFICULTY_LEVELS.map((d) => ({
  value: d,
  label: d.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const demandOptions = DEMAND_LEVELS.map((d) => ({
  value: d,
  label: d.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BasicInfoSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const nameEn = watch("name_en");

  useEffect(() => {
    setValue("slug", toSlug(nameEn ?? ""), { shouldValidate: false });
  }, [nameEn, setValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Name (English)"
          placeholder="e.g. Computer Science"
          error={errors.name_en?.message}
          {...register("name_en")}
        />
        <Input
          label="Name (Arabic)"
          placeholder="e.g. علوم الحاسوب"
          dir="rtl"
          error={errors.name_ar?.message}
          {...register("name_ar")}
        />
      </div>

      <Input
        label="Slug"
        placeholder="computer-science"
        hint="Auto-generated from English name. Edit if needed."
        error={errors.slug?.message}
        {...register("slug")}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              value={field.value ? String(field.value) : ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={errors.category_id?.message}
            />
          )}
        />

        <Controller
          name="difficulty_level"
          control={control}
          render={({ field }) => (
            <Select
              label="Difficulty"
              placeholder="Select difficulty"
              options={difficultyOptions}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.difficulty_level?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Controller
          name="local_demand"
          control={control}
          render={({ field }) => (
            <Select
              label="Local Demand"
              placeholder="Select demand"
              options={demandOptions}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.local_demand?.message}
            />
          )}
        />

        <Controller
          name="international_demand"
          control={control}
          render={({ field }) => (
            <Select
              label="International Demand"
              placeholder="Select demand"
              options={demandOptions}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.international_demand?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Input
          label="Duration (years)"
          type="number"
          min={1}
          max={10}
          error={errors.duration_years?.message}
          {...register("duration_years", { valueAsNumber: true })}
        />
        <Input
          label="Min Salary (USD)"
          type="number"
          min={0}
          error={errors.salary_min?.message}
          {...register("salary_min", { valueAsNumber: true })}
        />
        <Input
          label="Max Salary (USD)"
          type="number"
          min={0}
          error={errors.salary_max?.message}
          {...register("salary_max", { valueAsNumber: true })}
        />
      </div>

      <Controller
        name="is_featured"
        control={control}
        render={({ field }) => (
          <Switch
            checked={field.value ?? false}
            onChange={field.onChange}
            label="Featured major"
            description="Show on homepage featured section"
          />
        )}
      />
    </div>
  );
}
