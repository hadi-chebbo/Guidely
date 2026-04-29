"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { MajorFormData } from "@/lib/validations/major";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export default function ProsConsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "points" });

  const pros = fields.map((f, i) => ({ ...f, originalIndex: i })).filter((f) => f.type === "pro");
  const cons = fields.map((f, i) => ({ ...f, originalIndex: i })).filter((f) => f.type === "con");

  return (
    <div className="space-y-8">
      <PointGroup
        title="Pros"
        type="pro"
        fields={fields}
        register={register}
        errors={errors}
        append={append}
        remove={remove}
        move={move}
        filteredFields={pros}
      />
      <PointGroup
        title="Cons"
        type="con"
        fields={fields}
        register={register}
        errors={errors}
        append={append}
        remove={remove}
        move={move}
        filteredFields={cons}
      />
    </div>
  );
}

interface PointGroupProps {
  title: string;
  type: "pro" | "con";
  fields: ReturnType<typeof useFieldArray<MajorFormData, "points">>["fields"];
  register: ReturnType<typeof useFormContext<MajorFormData>>["register"];
  errors: ReturnType<typeof useFormContext<MajorFormData>>["formState"]["errors"];
  append: ReturnType<typeof useFieldArray<MajorFormData, "points">>["append"];
  remove: ReturnType<typeof useFieldArray<MajorFormData, "points">>["remove"];
  move: ReturnType<typeof useFieldArray<MajorFormData, "points">>["move"];
  filteredFields: Array<{ id: string; originalIndex: number; type: string }>;
}

function PointGroup({ title, type, fields, register, errors, append, remove, move, filteredFields }: PointGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => append({ type, content: "" })}
        >
          Add {title.slice(0, -1)}
        </Button>
      </div>

      {filteredFields.length === 0 && (
        <p className="text-sm text-gray-400 italic">No {title.toLowerCase()} added yet.</p>
      )}

      <div className="space-y-2">
        {filteredFields.map(({ id, originalIndex }, i) => (
          <div key={id} className="flex items-start gap-2">
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => {
                  const prev = filteredFields[i - 1];
                  if (prev) move(originalIndex, prev.originalIndex);
                }}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={i === filteredFields.length - 1}
                onClick={() => {
                  const next = filteredFields[i + 1];
                  if (next) move(originalIndex, next.originalIndex);
                }}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1">
              <Textarea
                rows={2}
                placeholder={`${title.slice(0, -1)} description...`}
                error={errors.points?.[originalIndex]?.content?.message}
                {...register(`points.${originalIndex}.content`)}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(originalIndex)}
              className="mt-1 text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
