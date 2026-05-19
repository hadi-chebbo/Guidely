"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { AdminModalFrame } from "@/components/admin/AdminPage";
import type { FAQ } from "@/types/major";

const schema = z.object({
  question: z.string().min(3, "Question required"),
  answer: z.string().min(3, "Answer required"),
  sort_order: z.coerce.number().int().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface FaqModalProps {
  open: boolean;
  faq?: FAQ | null;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function FaqModal({ open, faq, onClose, onSubmit, isSubmitting }: FaqModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { question: "", answer: "", sort_order: 0 },
  });

  useEffect(() => {
    if (open) {
      reset(
        faq
          ? { question: faq.question, answer: faq.answer, sort_order: faq.sort_order }
          : { question: "", answer: "", sort_order: 0 }
      );
    }
  }, [open, faq, reset]);

  if (!open) return null;

  return (
    <AdminModalFrame className="max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {faq ? "Edit FAQ" : "Add FAQ"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Close FAQ modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              {...register("question")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="What is this major about?"
            />
            {errors.question && (
              <p className="mt-1 text-xs text-red-500">{errors.question.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              {...register("answer")}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
              placeholder="This major covers..."
            />
            {errors.answer && (
              <p className="mt-1 text-xs text-red-500">{errors.answer.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              {...register("sort_order")}
              type="number"
              min={0}
              className="w-32 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            {errors.sort_order && (
              <p className="mt-1 text-xs text-red-500">{errors.sort_order.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium disabled:opacity-60 hover:bg-brand-700 transition-colors"
            >
              {isSubmitting ? "Saving..." : faq ? "Update" : "Create"}
            </button>
          </div>
        </form>
    </AdminModalFrame>
  );
}
