"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock, CalendarDays, Edit3, ExternalLink, Plus, Trash2, X } from "lucide-react";
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
  type MentorAvailability,
  type MentorAvailabilityPayload,
  type MentorAvailabilityStatus,
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

const defaultAvailabilityForm: MentorAvailabilityPayload = {
  scheduled_at: "",
  ends_at: "",
  timezone: "UTC",
  status: "open",
  meeting_platform: "",
  meeting_link: "",
};

const availabilityStatusOptions: { value: MentorAvailabilityStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "full", label: "Full" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const browserTimezone = () => {
  if (typeof window === "undefined") return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
};

const toApiDateTime = (value: string) => {
  if (!value) return "";
  return `${value.replace("T", " ").slice(0, 16)}:00`;
};

const toInputDateTime = (value?: string | null) => {
  if (!value) return "";
  return value.replace(" ", "T").slice(0, 16);
};

const parseWallClockDateTime = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
};

const formatDateTime = (value: string) => {
  if (!value) return "-";

  const parsed = parseWallClockDateTime(value);
  if (!parsed || Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export default function MentorSessionsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MentorSession | null>(null);
  const [availabilitySession, setAvailabilitySession] = useState<MentorSession | null>(null);

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
                <TH>Slots</TH>
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
                  <TD>{session.availabilities_count ?? 0}</TD>
                  <TD>
                    <Badge variant={session.is_active ? "success" : "warning"}>
                      {session.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setAvailabilitySession(session)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-brand-50 hover:text-brand-700"
                        aria-label={`Manage availability for ${session.title}`}
                      >
                        <CalendarDays className="h-4 w-4" />
                      </button>
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

      {availabilitySession && (
        <AvailabilityModal
          session={availabilitySession}
          onClose={() => setAvailabilitySession(null)}
          onChanged={async () => {
            await queryClient.invalidateQueries({ queryKey: ["mentor-sessions"] });
          }}
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

function AvailabilityModal({
  session,
  onClose,
  onChanged,
}: {
  session: MentorSession;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["mentor-session-availabilities", session.slug], [session.slug]);
  const [editing, setEditing] = useState<MentorAvailability | null>(null);
  const [form, setForm] = useState<MentorAvailabilityPayload>(() => ({
    ...defaultAvailabilityForm,
    timezone: browserTimezone(),
  }));

  const { data: availabilities = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => mentorService.getAvailabilities(session.slug),
  });

  const resetForm = () => {
    setEditing(null);
    setForm({
      ...defaultAvailabilityForm,
      timezone: browserTimezone(),
    });
  };

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey });
    await onChanged();
  };

  const saveAvailability = useMutation({
    mutationFn: async (payload: MentorAvailabilityPayload) => {
      if (editing) {
        await mentorService.updateAvailability(session.slug, editing.uuid || String(editing.id), payload);
        return;
      }

      await mentorService.createAvailability(session.slug, payload);
    },
    onSuccess: async () => {
      await refresh();
      toast.success(editing ? "Availability updated." : "Availability created.");
      resetForm();
    },
    onError: () => {
      toast.error("Availability could not be saved. Check the date range and required fields.");
    },
  });

  const deleteAvailability = useMutation({
    mutationFn: (availability: MentorAvailability) =>
      mentorService.deleteAvailability(session.slug, availability.uuid || String(availability.id)),
    onSuccess: async () => {
      await refresh();
      toast.success("Availability deleted.");
      resetForm();
    },
    onError: () => {
      toast.error("Availability could not be deleted.");
    },
  });

  const startEdit = (availability: MentorAvailability) => {
    setEditing(availability);
    setForm({
      scheduled_at: toInputDateTime(availability.scheduled_at),
      ends_at: toInputDateTime(availability.ends_at),
      timezone: availability.timezone ?? browserTimezone(),
      status: availability.status as MentorAvailabilityStatus,
      meeting_platform: availability.meeting_platform,
      meeting_link: availability.meeting_link,
    });
  };

  const setField = <K extends keyof MentorAvailabilityPayload>(key: K, value: MentorAvailabilityPayload[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveAvailability.mutate({
      ...form,
      scheduled_at: toApiDateTime(form.scheduled_at),
      ends_at: toApiDateTime(form.ends_at),
      timezone: form.timezone || browserTimezone(),
    });
  };

  return (
    <AdminModalFrame className="max-h-[92vh] max-w-5xl overflow-hidden p-0">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Session Availability</h2>
          <p className="mt-1 text-sm text-gray-500">{session.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          aria-label="Close availability modal"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid max-h-[calc(92vh-88px)] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_360px]">
        <div className="border-b border-gray-200 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-sm font-semibold text-gray-900">Available slots</p>
            <span className="text-xs font-medium text-gray-500">
              {isLoading ? "Loading..." : `${availabilities.length} slot${availabilities.length === 1 ? "" : "s"}`}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 px-6 pb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
              ))}
            </div>
          ) : availabilities.length ? (
            <Table>
              <THead>
                <TR>
                  <TH>Start</TH>
                  <TH>End</TH>
                  <TH>Meeting</TH>
                  <TH>Status</TH>
                  <TH>Timezone</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {availabilities.map((availability) => (
                  <TR key={availability.uuid || availability.id} className="hover:bg-brand-50/40">
                    <TD>{formatDateTime(availability.scheduled_at)}</TD>
                    <TD>{formatDateTime(availability.ends_at)}</TD>
                    <TD>
                      <div className="max-w-[220px]">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {availability.meeting_platform || "-"}
                        </p>
                        {availability.meeting_link ? (
                          <a
                            href={availability.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-brand-700 hover:text-brand-800"
                          >
                            <span className="truncate">{availability.meeting_link}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="mt-1 text-xs text-gray-400">No link</p>
                        )}
                      </div>
                    </TD>
                    <TD>
                      <Badge variant={availability.status === "open" ? "success" : "warning"}>
                        {availability.status}
                      </Badge>
                    </TD>
                    <TD>{availability.timezone ?? "UTC"}</TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(availability)}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-brand-50 hover:text-brand-700"
                          aria-label="Edit availability"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAvailability.mutate(availability)}
                          disabled={deleteAvailability.isPending}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Delete availability"
                        >
                          <Trash2 className="h-4 w-4" />
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
                title="No availability yet"
                description="Add a future slot students can book for this session."
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{editing ? "Edit slot" : "Add slot"}</h3>
            <p className="mt-1 text-xs text-gray-500">Create or update a bookable time window for this session.</p>
          </div>

          <Input
            label="Starts at"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={(event) => setField("scheduled_at", event.target.value)}
            required
          />
          <Input
            label="Ends at"
            type="datetime-local"
            value={form.ends_at}
            onChange={(event) => setField("ends_at", event.target.value)}
            required
          />
          <Input
            label="Timezone"
            value={form.timezone ?? ""}
            onChange={(event) => setField("timezone", event.target.value)}
            placeholder="Asia/Beirut"
          />
          <Input
            label="Meeting platform"
            value={form.meeting_platform}
            onChange={(event) => setField("meeting_platform", event.target.value)}
            placeholder="Google Meet"
            required
          />
          <Input
            label="Meeting link"
            type="url"
            value={form.meeting_link}
            onChange={(event) => setField("meeting_link", event.target.value)}
            placeholder="https://meet.google.com/..."
            required
          />
          {editing && (
            <Select
              label="Status"
              value={form.status}
              onChange={(event) => setField("status", event.target.value as MentorAvailabilityStatus)}
              options={availabilityStatusOptions}
            />
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={saveAvailability.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveAvailability.isPending ? "Saving..." : editing ? "Save Slot" : "Add Slot"}
            </button>
          </div>
        </form>
      </div>
    </AdminModalFrame>
  );
}
