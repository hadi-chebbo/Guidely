"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { MajorFormData } from "@/lib/validations/major";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

export default function FaqsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MajorFormData>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "faqs" });

  const addFaq = () => append({ question: "", answer: "", sort_order: fields.length });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">FAQs</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={addFaq}
        >
          Add FAQ
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-400 italic">No FAQs added yet.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                FAQ #{index + 1}
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

            <Input
              label="Question"
              placeholder="What is...?"
              error={errors.faqs?.[index]?.question?.message}
              {...register(`faqs.${index}.question`)}
            />

            <Textarea
              label="Answer"
              rows={4}
              placeholder="Answer..."
              error={errors.faqs?.[index]?.answer?.message}
              {...register(`faqs.${index}.answer`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
