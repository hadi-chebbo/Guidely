"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock, Edit3, Plus, X } from "lucide-react";
import { AdminCard, AdminModalFrame, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import { EmptyState } from "@/components/mentor/MentorShell";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import Textarea from "@/components/ui/Textarea";
import {
  mentorService,
  type MentorSession,
  type MentorSessionPayload,
  type MentorSessionType,
} from "@/services/mentorService";

const defaultForm: MentorSessionPayload = {
  title: "",
  description: "",
  type: "one-on-one",
  duration_minutes: 30,
  max_capacity: 1,
  price: 0,
  currency: "USD",
  is_active: true,
};

export default function MentorSessionsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MentorSession | null>(null);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["mentor-sessions"],
    queryFn: mentorService.getSessions,
  });

  const saveSession = useMutation({
    mutationFn: ({ slug, payload }: { slug?: string; payload: MentorSessionPayload }) =>
      slug ? mentorService.updateSession(slug, payload) : mentorService.createSession(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mentor-sessions"] });
      toast.success(editing ? "Session updated." : "Session created.");
      setModalOpen(false);
      setEditing(null);
    },
    onError: () => {
      toast.error("Session could not be saved. Check the required fields.");
    },
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (session: MentorSession) => {
    setEditing(session);
    setModalOpen(true);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Mentor sessions"
        title="Sessions"
        description="Create polished session offers with clear pricing, duration, format, and active status."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </button>
        }
      />

      <AdminCard>
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="text-xs font-medium text-gray-500">
            {isLoading ? "Loading sessions..." : `Showing ${sessions.length} session${sessions.length === 1 ? "" : "s"}`}
          </div>
          <CalendarClock className="h-4 w-4 text-brand-600" />
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
            ))}
          </div>
        ) : sessions.length ? (
          <Table>
            <THead>
              <TR>
                <TH>Session</TH>
                <TH>Format</TH>
                <TH>Duration</TH>
                <TH>Price</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {sessions.map((session) => (
                <TR key={session.slug} className="hover:bg-brand-50/40">
                  <TD>
                    <div className="max-w-md">
                      <p className="font-medium text-gray-900">{session.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">{session.description}</p>
                    </div>
                  </TD>
                  <TD className="capitalize">{session.type.replaceAll("-", " ")}</TD>
                  <TD>{session.duration_minutes} min</TD>
                  <TD>
                    {session.currency} {Number(session.price).toFixed(2)}
                  </TD>
                  <TD>
                    <Badge variant={session.is_active ? "success" : "warning"}>
                      {session.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => openEdit(session)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-brand-50 hover:text-brand-700"
                        aria-label={`Edit ${session.title}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No sessions yet"
              description="Create a clear first offer so students understand what they can book with you."
              action={
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Session
                </button>
              }
            />
          </div>
        )}
      </AdminCard>

      {modalOpen && (
        <SessionModal
          session={editing}
          isSaving={saveSession.isPending}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={(payload) => saveSession.mutate({ slug: editing?.slug, payload })}
        />
      )}
    </AdminPageShell>
  );
}

function SessionModal({
  session,
  isSaving,
  onClose,
  onSubmit,
}: {
  session: MentorSession | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: MentorSessionPayload) => void;
}) {
  const [form, setForm] = useState<MentorSessionPayload>(defaultForm);

  useEffect(() => {
    if (!session) {
      setForm(defaultForm);
      return;
    }

    setForm({
      title: session.title,
      description: session.description,
      type: session.type as MentorSessionType,
      duration_minutes: Number(session.duration_minutes),
      max_capacity: Number(session.max_capacity),
      price: Number(session.price),
      currency: session.currency,
      is_active: Boolean(session.is_active),
    });
  }, [session]);

  const setField = <K extends keyof MentorSessionPayload>(key: K, value: MentorSessionPayload[K]) => {
    setForm((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "type" && value === "one-on-one") {
        next.max_capacity = 1;
      }
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      duration_minutes: Number(form.duration_minutes),
      max_capacity: form.type === "one-on-one" ? 1 : Number(form.max_capacity),
      price: Number(form.price),
      currency: form.currency.toUpperCase(),
    });
  };

  return (
    <AdminModalFrame className="max-h-[92vh] max-w-3xl overflow-hidden p-0">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{session ? "Edit Session" : "Add Session"}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Define the offer students will see in your mentor catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          aria-label="Close session modal"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-h-[calc(92vh-88px)] space-y-5 overflow-y-auto p-6">
        <Input
          label="Title"
          value={form.title}
          onChange={(event) => setField("title", event.target.value)}
          placeholder="Major selection strategy call"
          required
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={5}
          placeholder="Explain what students will get from this session."
          required
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            label="Format"
            value={form.type}
            onChange={(event) => setField("type", event.target.value as MentorSessionType)}
            options={[
              { value: "one-on-one", label: "One-on-one" },
              { value: "group", label: "Group" },
            ]}
            required
          />
          <Input
            label="Duration minutes"
            type="number"
            min={15}
            max={480}
            value={form.duration_minutes}
            onChange={(event) => setField("duration_minutes", Number(event.target.value))}
            required
          />
          <Input
            label="Max capacity"
            type="number"
            min={1}
            value={form.max_capacity}
            onChange={(event) => setField("max_capacity", Number(event.target.value))}
            disabled={form.type === "one-on-one"}
            required
          />
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <Input
              label="Price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(event) => setField("price", Number(event.target.value))}
              required
            />
            <Input
              label="Currency"
              value={form.currency}
              onChange={(event) => setField("currency", event.target.value.toUpperCase().slice(0, 3))}
              maxLength={3}
              required
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Switch
            checked={form.is_active}
            onChange={(checked) => setField("is_active", checked)}
            label="Active session"
            description="Active sessions are available for student discovery."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : session ? "Save Changes" : "Create Session"}
          </button>
        </div>
      </form>
    </AdminModalFrame>
  );
}
