"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPageShell,
  AdminToolbar,
} from "@/components/admin/AdminPage";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { createFaq, deleteFaq, getFaqs, updateFaq } from "@/services/faqsService";
import { getMajors } from "@/services/majorsService";
import type { FAQ, MajorListItem } from "@/types/major";
import FaqModal from "@/components/admin/faqs/FaqModal";

export default function FaqsPage() {
  const queryClient = useQueryClient();
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: majorsData } = useQuery({
    queryKey: ["majors-all"],
    queryFn: () => getMajors({ per_page: 100 }),
  });

  const majors: MajorListItem[] = majorsData?.data ?? [];

  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ["faqs", selectedMajorId],
    queryFn: () => getFaqs(selectedMajorId!),
    enabled: selectedMajorId !== null,
  });

  const createMutation = useMutation({
    mutationFn: (data: { question: string; answer: string; sort_order: number }) =>
      createFaq(selectedMajorId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs", selectedMajorId] });
      toast.success("FAQ created");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to create FAQ"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { question: string; answer: string; sort_order: number } }) =>
      updateFaq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs", selectedMajorId] });
      toast.success("FAQ updated");
      setModalOpen(false);
      setEditingFaq(null);
    },
    onError: () => toast.error("Edit is not available yet. Backend route pending."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs", selectedMajorId] });
      toast.success("FAQ deleted");
      setDeletingId(null);
    },
    onError: () => toast.error("Delete is not available yet. Backend route pending."),
  });

  const handleModalSubmit = async (data: { question: string; answer: string; sort_order: number }) => {
    if (editingFaq) {
      await updateMutation.mutateAsync({ id: editingFaq.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingFaq(null);
    setModalOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setModalOpen(true);
  };

  const selectedMajor = majors.find((m) => m.id === selectedMajorId);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Support Content"
        title="FAQs"
        description="Curate student-facing questions and answers for each major."
      />

      <AdminToolbar>
        <div className="relative w-full sm:max-w-sm">
          <select
            value={selectedMajorId ?? ""}
            onChange={(e) => setSelectedMajorId(e.target.value ? Number(e.target.value) : null)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            <option value="">Select a major...</option>
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name_en}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={openCreate}
          disabled={!selectedMajorId}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </button>
      </AdminToolbar>

      <AdminCard>
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-xs font-medium text-gray-500">
            {selectedMajor
              ? `${faqs.length} FAQ${faqs.length !== 1 ? "s" : ""} for ${selectedMajor.name_en}`
              : "Select a major to view FAQs"}
          </span>
        </div>

        {!selectedMajorId ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <HelpCircle className="mb-3 h-12 w-12 opacity-30" />
            <p className="text-sm">Choose a major from the dropdown above</p>
          </div>
        ) : faqsLoading ? (
          <div className="space-y-3 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 border-b border-gray-100 p-4 animate-pulse">
                <div className="col-span-2 h-4 rounded bg-gray-200" />
                <div className="col-span-2 h-4 rounded bg-gray-200" />
                <div className="ml-auto h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <THead className="bg-gray-50 text-gray-600">
              <TR>
                <TH className="w-8">#</TH>
                <TH>Question</TH>
                <TH>Answer</TH>
                <TH className="w-24 text-center">Order</TH>
                <TH className="w-28 text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {faqs.length === 0 ? (
                <TableEmpty colSpan={5}>No FAQs yet for this major.</TableEmpty>
              ) : (
                faqs.map((faq, i) => (
                  <TR key={faq.id} className="hover:bg-brand-50/40">
                    <TD className="text-xs text-gray-400">{i + 1}</TD>
                    <TD className="max-w-xs font-medium text-gray-900">
                      <span className="line-clamp-2">{faq.question}</span>
                    </TD>
                    <TD className="max-w-sm text-gray-500">
                      <span className="line-clamp-2">{faq.answer}</span>
                    </TD>
                    <TD className="text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                        {faq.sort_order}
                      </span>
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(faq)}
                          title="Edit FAQ"
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this FAQ?")) {
                              setDeletingId(faq.id);
                              deleteMutation.mutate(faq.id);
                            }
                          }}
                          disabled={deleteMutation.isPending && deletingId === faq.id}
                          title="Delete FAQ"
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        )}
      </AdminCard>

      <FaqModal
        open={modalOpen}
        faq={editingFaq}
        onClose={() => {
          setModalOpen(false);
          setEditingFaq(null);
        }}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />
    </AdminPageShell>
  );
}
