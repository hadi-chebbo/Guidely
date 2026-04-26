"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { majorFormSchema, type MajorFormData } from "@/lib/validations/major";
import BasicInfoSection from "./sections/BasicInfoSection";
import OverviewSection from "./sections/OverviewSection";
import Button from "@/components/ui/Button";

const TABS: { id: string; label: string; disabled?: boolean }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "overview", label: "Overview" },
  { id: "pros-cons", label: "Pros & Cons", disabled: true },
  { id: "skills", label: "Skills", disabled: true },
  { id: "jobs", label: "Jobs", disabled: true },
  { id: "companies", label: "Companies", disabled: true },
  { id: "faqs", label: "FAQs", disabled: true },
  { id: "day-in-life", label: "Day in Life", disabled: true },
  { id: "challenges", label: "Challenges", disabled: true },
];

type TabId = string;

const DEFAULT_VALUES: Partial<MajorFormData> = {
  name_en: "",
  name_ar: "",
  slug: "",
  overview: "",
  description: "",
  cover_image: "",
  duration_years: 4,
  salary_min: 0,
  salary_max: 0,
  is_featured: false,
  points: [],
  skills: [],
  jobs: [],
  companies: [],
  faqs: [],
};

interface MajorFormProps {
  initialData?: Partial<MajorFormData>;
  mode: "create" | "edit";
}

export default function MajorForm({ initialData, mode }: MajorFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<"draft" | "publish" | null>(null);

  const methods = useForm<MajorFormData>({
    resolver: zodResolver(majorFormSchema),
    defaultValues: { ...DEFAULT_VALUES, ...initialData },
    mode: "onBlur",
  });

  const { handleSubmit, formState: { isDirty } } = methods;

  const onSubmit = async (data: MajorFormData, action: "draft" | "publish") => {
    setIsSubmitting(true);
    setSubmitAction(action);
    try {
      // TI-43: replace with api.post('/admin/majors', { ...data, status: action })
      await new Promise((r) => setTimeout(r, 800));
      console.log(`[TI-43] ${mode} major as ${action}:`, data);
    } finally {
      setIsSubmitting(false);
      setSubmitAction(null);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => !tab.disabled && setActiveTab(tab.id as TabId)}
                className={[
                  "whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  tab.disabled
                    ? "border-transparent text-gray-300 cursor-not-allowed"
                    : activeTab === tab.id
                    ? "border-brand-950 text-brand-950"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                ].join(" ")}
              >
                {tab.label}
                {tab.disabled && (
                  <span className="ml-1.5 text-xs text-gray-300">TI-42</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Section content */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {activeTab === "basic" && <BasicInfoSection />}
          {activeTab === "overview" && <OverviewSection />}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting || !isDirty}
            isLoading={isSubmitting && submitAction === "draft"}
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || !isDirty}
            isLoading={isSubmitting && submitAction === "publish"}
            onClick={handleSubmit((data) => onSubmit(data, "publish"))}
          >
            Publish
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
