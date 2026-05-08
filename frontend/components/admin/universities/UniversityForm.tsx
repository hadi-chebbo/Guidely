"use client";

import { useEffect, useState } from "react";
import type { University } from "@/types/university";

type FormState = {
  name_en: string;
  name_ar: string;
  slug: string;
  type: "public" | "private";
  location: string;
  website: string;
  logo_url: string;
  description_en: string;
  description_ar: string;
  founded_year: string;
  accreditation: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function UniversityForm({
  onSubmit,
  onClose,
  initialData,
}: {
  onSubmit: (data: FormState) => void;
  onClose: () => void;
  initialData: University | null;
}) {
  const [form, setForm] = useState<FormState>({
    name_en: "",
    name_ar: "",
    slug: "",
    type: "private",
    location: "",
    website: "",
    logo_url: "",
    description_en: "",
    description_ar: "",
    founded_year: "",
    accreditation: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [originalForm, setOriginalForm] = useState<FormState | null>(null);

  const isEdit = !!initialData;

  useEffect(() => {
    if (!initialData) return;

    const mapped: FormState = {
      name_en: initialData.name_en || "",
      name_ar: initialData.name_ar || "",
      slug: initialData.slug || "",
      type: initialData.type || "private",
      location: initialData.location || "",
      website: initialData.website || "",
      logo_url: initialData.logo_url || "",
      description_en: initialData.description_en || "",
      description_ar: initialData.description_ar || "",
      founded_year: initialData.founded_year
        ? String(initialData.founded_year)
        : "",
      accreditation: initialData.accreditation || "",
    };

    setForm(mapped);
    setOriginalForm(mapped);
  }, [initialData]);

  const handle = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const isValidImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return (
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        /\.(png|jpg|jpeg|webp|svg)$/i.test(parsed.pathname)
      );
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!form.name_en.trim()) newErrors.name_en = "Required";
    if (!form.name_ar.trim()) newErrors.name_ar = "Required";
    if (!form.slug.trim()) newErrors.slug = "Required";
    if (!form.location.trim()) newErrors.location = "Required";

    if (form.logo_url && !isValidImageUrl(form.logo_url)) {
      newErrors.logo_url = "Invalid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormChanged = () => {
    if (!originalForm) return false;

    return Object.keys(form).some(
      (key) =>
        form[key as keyof FormState] !==
        originalForm[key as keyof FormState]
    );
  };

  const isFormValid =
    !!form.name_en.trim() &&
    !!form.name_ar.trim() &&
    !!form.slug.trim() &&
    !!form.location.trim();

  const isDisabled =
    !isFormValid || (isEdit && !isFormChanged());

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && !isFormChanged()) return;

    onSubmit(form);
    onClose();
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto pr-2 space-y-5">

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div>
          <input
            value={form.name_en}
            onChange={(e) => handle("name_en", e.target.value)}
            placeholder="University Name (English) *"
            className="input"
          />
          {errors.name_en && <p className="error">{errors.name_en}</p>}
        </div>

        <div>
          <input
            value={form.name_ar}
            onChange={(e) => handle("name_ar", e.target.value)}
            placeholder="اسم الجامعة *"
            className="input"
          />
          {errors.name_ar && <p className="error">{errors.name_ar}</p>}
        </div>

        <div>
          <input
            value={form.slug}
            onChange={(e) => handle("slug", e.target.value)}
            placeholder="slug-example *"
            className="input"
          />
          {errors.slug && <p className="error">{errors.slug}</p>}
        </div>

        <div>
          <input
            value={form.location}
            onChange={(e) => handle("location", e.target.value)}
            placeholder="Location *"
            className="input"
          />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>

        <input
          value={form.website}
          onChange={(e) => handle("website", e.target.value)}
          placeholder="Website (https://...)"
          className="input"
        />

        <div className="space-y-1">
          <input
            value={form.logo_url}
            onChange={(e) => handle("logo_url", e.target.value)}
            placeholder="Logo URL"
            className={`input ${errors.logo_url ? "input-error" : ""}`}
          />

          {errors.logo_url && (
            <p className="text-xs text-red-500">{errors.logo_url}</p>
          )}
        </div>

        <input
          value={form.founded_year}
          onChange={(e) => handle("founded_year", e.target.value)}
          placeholder="Founded Year"
          className="input"
        />

        <input
          value={form.accreditation}
          onChange={(e) => handle("accreditation", e.target.value)}
          placeholder="Accreditation"
          className="input"
        />
      </div>

      {/* TYPE */}
      <select
        value={form.type}
        onChange={(e) =>
          handle("type", e.target.value as "public" | "private")
        }
        className="input"
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>

      {/* DESCRIPTION */}
      <textarea
        value={form.description_en}
        onChange={(e) => handle("description_en", e.target.value)}
        placeholder="Description EN"
        className="input h-24"
      />

      <textarea
        value={form.description_ar}
        onChange={(e) => handle("description_ar", e.target.value)}
        placeholder="Description AR"
        className="input h-24"
      />

      {/* LOGO PREVIEW */}
      {form.logo_url && (
        <img
          src={form.logo_url}
          alt="logo preview"
          className="h-20 object-contain border rounded bg-white p-2"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-logo.png";
          }}
        />
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white/80 backdrop-blur py-2">

        <button onClick={onClose} className="px-4 py-2 rounded-xl border">
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`px-5 py-2 rounded-xl text-white transition ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-brand-600 hover:bg-brand-700 active:scale-[0.98]"
          }`}
        >
          {isEdit ? "Update" : "Save"}
        </button>

      </div>

      {/* STYLE */}
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
  );
}