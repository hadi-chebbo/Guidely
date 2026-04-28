"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { MajorFormData } from "@/lib/validations/major";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ChallengesSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "challenges" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Challenges</h3>
          <p className="mt-0.5 text-xs text-gray-400">Common difficulties students face in this major.</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => append({ content: "" })}
        >
          Add Challenge
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-400 italic">No challenges added yet.</p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={index === fields.length - 1}
                onClick={() => move(index, index + 1)}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1">
              <Input
                placeholder="e.g. Heavy math curriculum in first two years..."
                error={errors.challenges?.[index]?.content?.message}
                {...register(`challenges.${index}.content`)}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
