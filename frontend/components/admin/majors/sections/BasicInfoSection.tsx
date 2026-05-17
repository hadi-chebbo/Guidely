"use client";

import { useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Textarea from "@/components/ui/Textarea";
import { getCategories } from "@/services/studentService";
import {
  DEMAND_LEVELS,
  DIFFICULTY_LEVELS,
  type MajorFormData,
} from "@/lib/validations/major";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BasicInfoSection() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const nameEn = watch("name_en");
  const previousGeneratedSlug = useRef("");
  const categoryOptions = (categories ?? []).map((category) => ({
    value: String(category.id),
    label: category.name_en,
  }));
  const difficultyOptions = DIFFICULTY_LEVELS.map((level) => ({
    value: level,
    label: level.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
  }));
  const demandOptions = DEMAND_LEVELS.map((level) => ({
    value: level,
    label: level.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
  }));

  useEffect(() => {
    const nextSlug = toSlug(nameEn ?? "");
    const currentSlug = getValues("slug");

    if (!currentSlug || currentSlug === previousGeneratedSlug.current) {
      setValue("slug", nextSlug, { shouldValidate: false });
      previousGeneratedSlug.current = nextSlug;
    }
  }, [getValues, nameEn, setValue]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Name (English)"
          placeholder="e.g. Computer Science"
          error={errors.name_en?.message}
          {...register("name_en")}
        />

        <Input
          label="Name (Arabic)"
          placeholder="علوم الحاسوب"
          error={errors.name_ar?.message}
          {...register("name_ar")}
        />
      </div>

      <Input
        label="Slug"
        placeholder="computer-science"
        hint="Auto-generated from name. Edit if needed."
        error={errors.slug?.message}
        {...register("slug")}
      />

      <Controller
        name="category_id"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
            options={categoryOptions}
            value={field.value ? String(field.value) : ""}
            onChange={(event) => field.onChange(Number(event.target.value))}
            disabled={categoriesLoading || categoryOptions.length === 0}
            error={errors.category_id?.message}
          />
        )}
      />

      <Textarea
        label="Overview"
        placeholder="Short summary shown in lists and previews"
        error={errors.overview?.message}
        {...register("overview")}
      />

      <Textarea
        label="Description"
        placeholder="Detailed description of this major"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Duration (years)"
          type="number"
          min={1}
          max={10}
          error={errors.duration_years?.message}
          {...register("duration_years", { valueAsNumber: true })}
        />

        <Controller
          name="difficulty_level"
          control={control}
          render={({ field }) => (
            <Select
              label="Difficulty"
              options={difficultyOptions}
              value={field.value ?? "medium"}
              onChange={(event) => field.onChange(event.target.value)}
              error={errors.difficulty_level?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Controller
          name="local_demand"
          control={control}
          render={({ field }) => (
            <Select
              label="Local Demand"
              options={demandOptions}
              value={field.value ?? "medium"}
              onChange={(event) => field.onChange(event.target.value)}
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
              options={demandOptions}
              value={field.value ?? "medium"}
              onChange={(event) => field.onChange(event.target.value)}
              error={errors.international_demand?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

      <Input
        label="Cover Image URL"
        placeholder="https://..."
        error={errors.cover_image?.message}
        {...register("cover_image")}
      />

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
