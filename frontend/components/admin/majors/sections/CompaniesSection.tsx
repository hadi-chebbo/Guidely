"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { MajorFormData } from "@/lib/validations/major";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";

export default function CompaniesSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "companies" });

  const addCompany = () =>
    append({
      company_name: "",
      industry: "",
      location: "",
      logo_url: null,
      website_url: null,
      is_local: true,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Hiring Companies</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={addCompany}
        >
          Add Company
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-400 italic">No companies added yet.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Company #{index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company Name"
                error={errors.companies?.[index]?.company_name?.message}
                {...register(`companies.${index}.company_name`)}
              />
              <Input
                label="Industry"
                error={errors.companies?.[index]?.industry?.message}
                {...register(`companies.${index}.industry`)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Location"
                error={errors.companies?.[index]?.location?.message}
                {...register(`companies.${index}.location`)}
              />
              <Input
                label="Logo URL"
                type="url"
                placeholder="https://..."
                error={errors.companies?.[index]?.logo_url?.message}
                {...register(`companies.${index}.logo_url`)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <Input
                label="Website URL"
                type="url"
                placeholder="https://..."
                error={errors.companies?.[index]?.website_url?.message}
                {...register(`companies.${index}.website_url`)}
              />
              <div className="pb-2">
                <Controller
                  control={control}
                  name={`companies.${index}.is_local`}
                  render={({ field }) => (
                    <Switch
                      label="Local Company"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
