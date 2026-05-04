"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  universityFormSchema,
  type UniversityFormData,
  UNIVERSITY_TYPES,
  ACCREDITATION_STATUSES,
} from "@/lib/validations/university";
import { createUniversity, updateUniversity } from "@/services/universitiesService";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Textarea from "@/components/ui/Textarea";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "details", label: "Details" },
  { id: "contact", label: "Contact & Media" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const typeOptions = UNIVERSITY_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

const accreditationOptions = ACCREDITATION_STATUSES.map((s) => ({
  value: s,
  label: s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
}));

const DEFAULT_VALUES: Partial<UniversityFormData> = {
  name_en: "",
  name_ar: "",
  slug: "",
  overview: "",
  description: "",
  location: "",
  country: "",
  type: "public",
  accreditation_status: "accredited",
  established_year: null,
  student_count: null,
  acceptance_rate: null,
  tuition_min: null,
  tuition_max: null,
  is_featured: false,
  logo_url: null,
  cover_image: null,
  website_url: null,
  email: "",
  phone: null,
  address: null,
};

// ---------------------------------------------------------------------------
// Slug helper
// ---------------------------------------------------------------------------

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ---------------------------------------------------------------------------
// Tab: Basic Info
// ---------------------------------------------------------------------------

function BasicInfoTab() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<UniversityFormData>();

  const nameEn = watch("name_en");
  const slug = watch("slug");
  const prevAutoSlug = useRef("");

  useEffect(() => {
    const auto = generateSlug(nameEn ?? "");
    // Only overwrite slug if it is empty or still matches the last auto-generated value
    if (!slug || slug === prevAutoSlug.current) {
      setValue("slug", auto, { shouldDirty: true, shouldValidate: false });
      prevAutoSlug.current = auto;
    }
  }, [nameEn, slug, setValue]);

  return (
    <div className="space-y-6">
      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name (English)"
          placeholder="e.g. American University of Beirut"
          error={errors.name_en?.message}
          {...register("name_en")}
        />
        <Input
          label="Name (Arabic)"
          placeholder="e.g. الجامعة الأمريكية في بيروت"
          dir="rtl"
          error={errors.name_ar?.message}
          {...register("name_ar")}
        />
      </div>

      {/* Slug */}
      <Input
        label="Slug"
        placeholder="american-university-of-beirut"
        hint="Auto-generated from English name. Edit if needed."
        error={errors.slug?.message}
        {...register("slug")}
      />

      {/* Overview */}
      <Textarea
        label="Overview"
        placeholder="A brief overview of the university..."
        rows={3}
        error={errors.overview?.message}
        {...register("overview")}
      />

      {/* Type & Accreditation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              options={typeOptions}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value as UniversityFormData["type"])
              }
              error={errors.type?.message}
            />
          )}
        />

        <Controller
          name="accreditation_status"
          control={control}
          render={({ field }) => (
            <Select
              label="Accreditation Status"
              options={accreditationOptions}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value as UniversityFormData["accreditation_status"]
                )
              }
              error={errors.accreditation_status?.message}
            />
          )}
        />
      </div>

      {/* Featured toggle */}
      <Controller
        name="is_featured"
        control={control}
        render={({ field }) => (
          <Switch
            checked={field.value ?? false}
            onChange={field.onChange}
            label="Featured university"
            description="Show on homepage featured section"
          />
        )}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Details
// ---------------------------------------------------------------------------

function DetailsTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UniversityFormData>();

  return (
    <div className="space-y-6">
      {/* Location & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Location"
          placeholder="e.g. Beirut"
          error={errors.location?.message}
          {...register("location")}
        />
        <Input
          label="Country"
          placeholder="e.g. Lebanon"
          error={errors.country?.message}
          {...register("country")}
        />
      </div>

      {/* Established Year & Student Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Established Year"
          type="number"
          placeholder={`e.g. 1866`}
          min={1000}
          max={new Date().getFullYear()}
          error={errors.established_year?.message}
          {...register("established_year", {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined ? null : Number(v),
          })}
        />
        <Input
          label="Student Count"
          type="number"
          placeholder="e.g. 8000"
          min={0}
          error={errors.student_count?.message}
          {...register("student_count", {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined ? null : Number(v),
          })}
        />
      </div>

      {/* Acceptance Rate */}
      <Input
        label="Acceptance Rate (%)"
        type="number"
        placeholder="e.g. 25"
        min={0}
        max={100}
        step={0.01}
        error={errors.acceptance_rate?.message}
        {...register("acceptance_rate", {
          setValueAs: (v) =>
            v === "" || v === null || v === undefined ? null : Number(v),
        })}
      />

      {/* Tuition Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tuition Min (USD)"
          type="number"
          placeholder="e.g. 10000"
          min={0}
          error={errors.tuition_min?.message}
          {...register("tuition_min", {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined ? null : Number(v),
          })}
        />
        <Input
          label="Tuition Max (USD)"
          type="number"
          placeholder="e.g. 30000"
          min={0}
          error={errors.tuition_max?.message}
          {...register("tuition_max", {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined ? null : Number(v),
          })}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Detailed description of the university..."
        rows={5}
        error={errors.description?.message}
        {...register("description")}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Contact & Media
// ---------------------------------------------------------------------------

function ContactMediaTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UniversityFormData>();

  return (
    <div className="space-y-6">
      {/* Website */}
      <Input
        label="Website URL"
        type="url"
        placeholder="https://www.university.edu"
        error={errors.website_url?.message}
        {...register("website_url")}
      />

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="info@university.edu"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="+961 1 350000"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      {/* Address */}
      <Textarea
        label="Address"
        placeholder="Full mailing address..."
        rows={3}
        error={errors.address?.message}
        {...register("address")}
      />

      {/* Logo URL & Cover Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Logo URL"
          type="url"
          placeholder="https://cdn.example.com/logo.png"
          error={errors.logo_url?.message}
          {...register("logo_url")}
        />
        <Input
          label="Cover Image URL"
          type="url"
          placeholder="https://cdn.example.com/cover.jpg"
          error={errors.cover_image?.message}
          {...register("cover_image")}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UniversityForm (main export)
// ---------------------------------------------------------------------------

interface UniversityFormProps {
  initialData?: Partial<UniversityFormData>;
  mode: "create" | "edit";
  universityId?: number;
  onSuccess?: () => void;
}

export default function UniversityForm({
  initialData,
  mode,
  universityId,
  onSuccess,
}: UniversityFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<UniversityFormData>({
    resolver: zodResolver(universityFormSchema),
    defaultValues: { ...DEFAULT_VALUES, ...initialData },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: UniversityFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (mode === "create") {
        await createUniversity(data);
      } else if (universityId) {
        await updateUniversity(universityId, data);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/universities");
      }
    } catch {
      setServerError("Failed to save university. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Tabs navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-brand-950 text-brand-950"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {/* Server error banner */}
          {serverError && (
            <div className="mb-6">
              <FormMessage type="error" message={serverError} />
            </div>
          )}

          {activeTab === "basic" && <BasicInfoTab />}
          {activeTab === "details" && <DetailsTab />}
          {activeTab === "contact" && <ContactMediaTab />}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth={false}
            onClick={() =>
              onSuccess ? onSuccess() : router.push("/admin/universities")
            }
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            fullWidth={false}
            isLoading={isSubmitting}
            disabled={isSubmitting || !isDirty}
          >
            {mode === "create" ? "Create University" : "Save Changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
