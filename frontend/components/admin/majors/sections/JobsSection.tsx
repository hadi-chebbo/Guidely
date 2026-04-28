"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { MajorFormData } from "@/lib/validations/major";
import { JOB_DEMAND_LEVELS, JOB_SCOPES } from "@/lib/validations/major";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

const DEMAND_OPTIONS = JOB_DEMAND_LEVELS.map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));
const SCOPE_OPTIONS = JOB_SCOPES.map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

export default function JobsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "jobs" });

  const addJob = () =>
    append({
      title_en: "",
      title_ar: "",
      description_en: "",
      avg_salary_usd: null,
      scope: "both",
      demand_level: "medium",
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Job Opportunities</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={addJob}
        >
          Add Job
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-400 italic">No job opportunities added yet.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Job #{index + 1}
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
                label="Title (English)"
                error={errors.jobs?.[index]?.title_en?.message}
                {...register(`jobs.${index}.title_en`)}
              />
              <Input
                label="Title (Arabic)"
                dir="rtl"
                error={errors.jobs?.[index]?.title_ar?.message}
                {...register(`jobs.${index}.title_ar`)}
              />
            </div>

            <Textarea
              label="Description"
              rows={3}
              error={errors.jobs?.[index]?.description_en?.message}
              {...register(`jobs.${index}.description_en`)}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Avg Salary (USD)"
                type="number"
                min={0}
                error={errors.jobs?.[index]?.avg_salary_usd?.message}
                {...register(`jobs.${index}.avg_salary_usd`, { valueAsNumber: true })}
              />
              <Controller
                control={control}
                name={`jobs.${index}.demand_level`}
                render={({ field }) => (
                  <Select
                    label="Demand Level"
                    options={DEMAND_OPTIONS}
                    error={errors.jobs?.[index]?.demand_level?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name={`jobs.${index}.scope`}
                render={({ field }) => (
                  <Select
                    label="Scope"
                    options={SCOPE_OPTIONS}
                    error={errors.jobs?.[index]?.scope?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
