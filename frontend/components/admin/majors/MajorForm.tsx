"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  DEMAND_LEVELS,
  DIFFICULTY_LEVELS,
  type MajorFormData,
} from "@/lib/validations/major";
import { createMajor, updateMajor } from "@/services/majorsService";
import { getCategories } from "@/services/studentService";
import type { Major } from "@/types/major";
import SkillsSection from "./sections/SkillsSection";

const DEFAULT_VALUES: Partial<MajorFormData> = {
  name_en: "",
  name_ar: "",
  slug: "",
  overview: "",
  description: "",
  cover_image: "",
  duration_years: 4,
  difficulty_level: "medium",
  salary_min: 0,
  salary_max: 0,
  local_demand: "medium",
  international_demand: "medium",
  is_featured: false,
  points: [],
  skills: [],
  jobs: [],
  companies: [],
  faqs: [],
  day_in_life: "",
  challenges: [],
};

const LS_KEY = "major_form_draft";

const FIELD_TABS: Array<[keyof MajorFormData, string]> = [
  ["name_en", "basic"],
  ["name_ar", "basic"],
  ["slug", "basic"],
  ["category_id", "basic"],
  ["overview", "basic"],
  ["description", "basic"],
  ["duration_years", "basic"],
  ["difficulty_level", "basic"],
  ["salary_min", "basic"],
  ["salary_max", "basic"],
  ["skills", "skills"],
];

const FORM_STEPS = [
  {
    id: "basic",
    title: "Basic information",
    description: "Names, category, demand, salary, and overview.",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Required skills linked to this major.",
  },
] as const;

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const apiSubmitSchema = z
  .object({
    category_id: z.number().int().positive("Select a category"),
    name_en: z.string().min(1, "Name is required").max(255),
    name_ar: z.string().min(1, "Arabic name is required").max(255),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(255)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
    overview: z.string().min(1, "Overview is required"),
    description: z.string().min(1, "Description is required"),
    duration_years: z.number().int().min(1, "Duration is required").max(10),
    difficulty_level: z.enum(DIFFICULTY_LEVELS),
    salary_min: z.number().int().nonnegative(),
    salary_max: z.number().int().nonnegative(),
    local_demand: z.enum(DEMAND_LEVELS),
    international_demand: z.enum(DEMAND_LEVELS),
    is_featured: z.boolean().default(false),
    cover_image: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value))
      .nullable()
      .optional(),
    skills: z
      .array(z.object({ skill_id: z.number().int().positive("Pick a skill") }))
      .min(1, "Select at least one skill"),
  })
  .refine((data) => data.salary_min <= data.salary_max, {
    message: "Min salary must be less than or equal to max",
    path: ["salary_max"],
  });

const getUniqueSkillIds = (skills: Array<{ skill_id: number }> = []) =>
  Array.from(new Set(skills.map((skill) => skill.skill_id))).sort((a, b) => a - b);

const areSkillIdsEqual = (left: number[], right: number[]) =>
  left.length === right.length && left.every((id, index) => id === right[index]);

const hasBasicChanges = (
  data: z.infer<typeof apiSubmitSchema>,
  initialData?: Partial<MajorFormData>
) =>
  data.name_en !== initialData?.name_en ||
  data.name_ar !== initialData?.name_ar ||
  data.slug !== initialData?.slug ||
  data.category_id !== initialData?.category_id ||
  data.overview !== initialData?.overview ||
  data.description !== initialData?.description ||
  data.duration_years !== initialData?.duration_years ||
  data.difficulty_level !== initialData?.difficulty_level ||
  data.salary_min !== initialData?.salary_min ||
  data.salary_max !== initialData?.salary_max ||
  data.local_demand !== initialData?.local_demand ||
  data.international_demand !== initialData?.international_demand ||
  data.is_featured !== initialData?.is_featured ||
  data.cover_image !== initialData?.cover_image;

interface MajorFormProps {
  initialData?: Partial<MajorFormData>;
  mode: "create" | "edit";
  majorId?: number;
  majorDetails?: Major;
  onSuccess?: (major?: Major, submittedData?: z.infer<typeof apiSubmitSchema>) => void | Promise<void>;
  onCancel?: () => void;
}

export default function MajorForm({ initialData, mode, majorId, majorDetails, onSuccess, onCancel }: MajorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [activeStep, setActiveStep] = useState<(typeof FORM_STEPS)[number]["id"]>("basic");
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousGeneratedSlug = useRef("");
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const methods = useForm<MajorFormData>({
    defaultValues: { ...DEFAULT_VALUES, ...initialData },
    mode: "onBlur",
  });

  const {
    clearErrors,
    getValues,
    register,
    setError,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = methods;
  const initialSkillIds = getUniqueSkillIds(initialData?.skills ?? []);
  const nameEn = watch("name_en");

  // On create: check localStorage for saved draft and prompt resume
  useEffect(() => {
    if (mode !== "create") return;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<MajorFormData>;
      toast("Unsaved draft found", {
        description: "You can resume it or keep the current form.",
        action: {
          label: "Resume",
          onClick: () => methods.reset({ ...DEFAULT_VALUES, ...parsed }),
        },
      });
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !initialData) return;
    methods.reset({ ...DEFAULT_VALUES, ...initialData });
  }, [initialData, methods, mode]);

  useEffect(() => {
    const nextSlug = toSlug(nameEn ?? "");
    const currentSlug = getValues("slug");

    if (!currentSlug || currentSlug === previousGeneratedSlug.current) {
      setValue("slug", nextSlug, { shouldValidate: false });
      previousGeneratedSlug.current = nextSlug;
    }
  }, [getValues, nameEn, setValue]);

  // Auto-save to localStorage every 10s (both modes)
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(methods.getValues()));
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 800);
      } catch {
        // storage quota exceeded — ignore
      }
    }, 10000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [methods]);

  const clearDraft = () => {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  };

  const handleCancel = () => {
    const leave = () => {
      clearDraft();
      if (onCancel) {
        onCancel();
      } else {
        router.push("/admin/majors");
      }
    };

    if (isDirty) {
      toast("You have unsaved changes", {
        description: "Use Leave to close this form without saving.",
        action: {
          label: "Leave",
          onClick: leave,
        },
      });
      return;
    }

    leave();
  };

  const onSubmit = async (data: z.infer<typeof apiSubmitSchema>) => {
    setIsSubmitting(true);
    try {
      const skillIds = getUniqueSkillIds(data.skills);
      const payload: Record<string, unknown> = {
        name_en: data.name_en,
        name_ar: data.name_ar,
        slug: data.slug,
        overview: data.overview,
        description: data.description,
        duration_years: data.duration_years,
        difficulty_level: data.difficulty_level,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        local_demand: data.local_demand,
        international_demand: data.international_demand,
        is_featured: data.is_featured,
        category_id: data.category_id,
        cover_image: data.cover_image,
      };

      if (mode === "create") {
        payload.skills = skillIds;
        const savedMajor = await createMajor(payload);
        toast.success("Major created successfully");
        clearDraft();
        if (onSuccess) {
          await onSuccess(savedMajor, data);
        } else {
          router.push("/admin/majors");
        }
      } else if (majorId) {
        const hasUnresolvedCurrentSkills = (majorDetails?.skills ?? []).some((skill) => skill.id <= 0);
        if (hasUnresolvedCurrentSkills && !areSkillIdsEqual(skillIds, initialSkillIds)) {
          setError("skills", {
            message: "Current backend skill IDs are still loading. Reopen this major and try again.",
          });
          toast.error("Could not safely update skills because current skill IDs were not loaded.");
          return;
        }

        const nextSkillIds = Array.from(new Set([...initialSkillIds, ...skillIds])).sort((a, b) => a - b);
        let savedMajor = majorDetails;

        if (hasBasicChanges(data, initialData)) {
          savedMajor = await updateMajor(majorId, payload);
        }

        if (!areSkillIdsEqual(nextSkillIds, initialSkillIds)) {
          savedMajor = await updateMajor(majorId, { skills: nextSkillIds });
        }

        methods.reset({ ...methods.getValues(), ...data });
        toast.success("Major updated successfully");
        clearDraft();
        if (onSuccess) {
          await onSuccess(savedMajor, data);
        } else {
          router.push("/admin/majors");
        }
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
      const apiErrors = axiosErr?.response?.data?.errors;
      if (apiErrors) {
        // Set inline field errors from API 422 response
        Object.entries(apiErrors).forEach(([field, messages]) => {
          const formField = field === "name" ? "name_en" : field;
          setError(formField as keyof MajorFormData, { message: messages[0] });
        });
        toast.error("Please fix the highlighted fields");
      } else {
        toast.error(axiosErr?.response?.data?.message ?? "Failed to save major");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiSubmit = async () => {
    const data = methods.getValues();
    const result = apiSubmitSchema.safeParse({
      category_id: data.category_id,
      name_en: data.name_en,
      name_ar: data.name_ar,
      slug: data.slug,
      overview: data.overview,
      description: data.description,
      duration_years: data.duration_years,
      difficulty_level: data.difficulty_level,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      local_demand: data.local_demand,
      international_demand: data.international_demand,
      is_featured: data.is_featured,
      cover_image: data.cover_image,
      skills: data.skills,
    });

    if (!result.success) {
      clearErrors();

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof MajorFormData | undefined;

        if (field) {
          setError(field, { message: issue.message });
        }
      });

      const firstField = result.error.issues[0]?.path[0] as keyof MajorFormData | undefined;
      const firstErroredTab = FIELD_TABS.find(([field]) => field === firstField)?.[1];

      if (firstErroredTab) {
        setActiveStep(firstErroredTab as (typeof FORM_STEPS)[number]["id"]);
        document.getElementById(firstErroredTab)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    await onSubmit(result.data);
  };

  const activeStepIndex = FORM_STEPS.findIndex((step) => step.id === activeStep);
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === FORM_STEPS.length - 1;

  const goToPreviousStep = () => {
    if (isFirstStep) return;
    const nextStep = FORM_STEPS[activeStepIndex - 1].id;
    setActiveStep(nextStep);
    document.getElementById(nextStep)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToNextStep = () => {
    if (isLastStep) return;
    const nextStep = FORM_STEPS[activeStepIndex + 1].id;
    setActiveStep(nextStep);
    document.getElementById(nextStep)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-5">
        <div className="grid gap-3 border-b border-gray-200 pb-5 md:grid-cols-2">
          {FORM_STEPS.map((step, index) => {
            const active = activeStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveStep(step.id);
                  document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-brand-200 bg-brand-50 text-brand-800"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{step.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">{step.description}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div id="basic" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <input
              {...register("name_en")}
              placeholder="Major Name (English) *"
              className={`input ${errors.name_en ? "input-error" : ""}`}
            />
            {errors.name_en && <p className="error">{errors.name_en.message}</p>}
          </div>

          <div>
            <input
              {...register("name_ar")}
              placeholder="اسم الاختصاص *"
              className={`input ${errors.name_ar ? "input-error" : ""}`}
            />
            {errors.name_ar && <p className="error">{errors.name_ar.message}</p>}
          </div>

          <div>
            <input
              {...register("slug")}
              placeholder="major-slug *"
              className={`input ${errors.slug ? "input-error" : ""}`}
            />
            {errors.slug && <p className="error">{errors.slug.message}</p>}
          </div>

          <div>
            <select
              {...register("category_id", { valueAsNumber: true })}
              disabled={categoriesLoading}
              className={`input ${errors.category_id ? "input-error" : ""}`}
            >
              <option value="">
                {categoriesLoading ? "Loading categories..." : "Select category *"}
              </option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_en}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="error">{errors.category_id.message}</p>}
          </div>

          <div>
            <input
              {...register("duration_years", { valueAsNumber: true })}
              type="number"
              min={1}
              max={10}
              placeholder="Duration years *"
              className={`input ${errors.duration_years ? "input-error" : ""}`}
            />
            {errors.duration_years && <p className="error">{errors.duration_years.message}</p>}
          </div>

          <select {...register("difficulty_level")} className="input">
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
              </option>
            ))}
          </select>

          <select {...register("local_demand")} className="input">
            {DEMAND_LEVELS.map((level) => (
              <option key={level} value={level}>
                Local: {level.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
              </option>
            ))}
          </select>

          <select {...register("international_demand")} className="input">
            {DEMAND_LEVELS.map((level) => (
              <option key={level} value={level}>
                International: {level.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
              </option>
            ))}
          </select>

          <div>
            <input
              {...register("salary_min", { valueAsNumber: true })}
              type="number"
              min={0}
              placeholder="Min Salary (USD)"
              className={`input ${errors.salary_min ? "input-error" : ""}`}
            />
            {errors.salary_min && <p className="error">{errors.salary_min.message}</p>}
          </div>

          <div>
            <input
              {...register("salary_max", { valueAsNumber: true })}
              type="number"
              min={0}
              placeholder="Max Salary (USD)"
              className={`input ${errors.salary_max ? "input-error" : ""}`}
            />
            {errors.salary_max && <p className="error">{errors.salary_max.message}</p>}
          </div>

          <input
            {...register("cover_image")}
            placeholder="Cover Image URL"
            className={`input md:col-span-2 ${errors.cover_image ? "input-error" : ""}`}
          />
        </div>

        <textarea
          {...register("overview")}
          placeholder="Overview *"
          className={`input h-24 ${errors.overview ? "input-error" : ""}`}
        />
        {errors.overview && <p className="error">{errors.overview.message}</p>}

        <textarea
          {...register("description")}
          placeholder="Description *"
          className={`input h-24 ${errors.description ? "input-error" : ""}`}
        />
        {errors.description && <p className="error">{errors.description.message}</p>}

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            {...register("is_featured")}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          Featured major
        </label>

        <div id="skills" className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
          <SkillsSection lockedSkillIds={mode === "edit" ? initialSkillIds : []} />
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 bg-white/80 py-2 backdrop-blur">
          <span className="text-xs text-gray-400 sm:mr-auto">
            {autoSaving ? "Draft saved" : ""}
          </span>
          <button
            type="button"
            className="rounded-xl border px-4 py-2"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || isFirstStep}
            onClick={goToPreviousStep}
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || isLastStep}
            onClick={goToNextStep}
          >
            Next
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleApiSubmit}
            className={`rounded-xl px-5 py-2 text-white transition ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400 opacity-70"
                : "bg-brand-600 hover:bg-brand-700 active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Save" : "Update"}
          </button>
        </div>

        <style jsx>{`
          .input {
            width: 100%;
            padding: 10px 12px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            background: #fff;
            font-size: 14px;
            outline: none;
          }

          .input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          }

          .input-error {
            border: 1px solid #ef4444 !important;
            background: #fff5f5;
          }

          .error {
            font-size: 12px;
            color: #ef4444;
            margin-top: 4px;
          }
        `}</style>
      </div>
    </FormProvider>
  );
}
