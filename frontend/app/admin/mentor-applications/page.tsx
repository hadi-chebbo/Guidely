"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  Eye,
  GraduationCap,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  AdminCard,
  AdminModalFrame,
  AdminPageHeader,
  AdminPageShell,
} from "@/components/admin/AdminPage";
import Badge from "@/components/ui/Badge";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import {
  mentorApplicationService,
  type MentorApplication,
} from "@/services/mentorApplicationService";
import { cn } from "@/lib/utils";

function ApplicationSummary({ application }: { application: MentorApplication }) {
  const profile = application.mentor_profile;

  return (
    <div className="min-w-0">
      <p className="break-words font-semibold text-gray-950">{application.user.name}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <span className="inline-flex min-w-0 items-center gap-1">
          <UserRound className="h-3.5 w-3.5" />
          <span className="break-all">@{application.user.username}</span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          <span className="break-all">{application.user.email}</span>
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
        {profile.bio}
      </p>
    </div>
  );
}

function ApproveButton({
  username,
  isApproving,
  onApprove,
  className,
}: {
  username: string;
  isApproving: boolean;
  onApprove: (username: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onApprove(username)}
      disabled={isApproving}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      aria-label={`Approve ${username}`}
      title={`Approve ${username}`}
    >
      {isApproving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
    </button>
  );
}

function RejectButton({
  username,
  isRejecting,
  onReject,
  className,
}: {
  username: string;
  isRejecting: boolean;
  onReject: (username: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onReject(username)}
      disabled={isRejecting}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      aria-label={`Reject ${username}`}
      title={`Reject ${username}`}
    >
      {isRejecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}

function ActionIconButton({
  label,
  children,
  onClick,
  disabled,
  variant = "neutral",
  className,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "neutral" | "brand";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        variant === "brand"
          ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white shadow-sm transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

function DetailsModal({
  application,
  isLoading,
  onClose,
}: {
  application: MentorApplication | null;
  isLoading: boolean;
  onClose: () => void;
}) {
  if (!application && !isLoading) return null;

  const profile = application?.mentor_profile;
  const languages = profile
    ? mentorApplicationService.formatLanguages(profile.languages)
    : [];

  return (
    <AdminModalFrame className="max-w-3xl overflow-hidden p-0">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            Mentor application
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">
            {application?.user.name ?? "Loading details..."}
          </h2>
          {application && (
            <p className="mt-1 text-sm text-gray-500">
              @{application.user.username} - {application.user.email}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          aria-label="Close mentor application details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading || !application || !profile ? (
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="max-h-[calc(92vh-96px)] space-y-5 overflow-y-auto p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Degree", profile.degree],
              ["University", profile.university_name],
              ["Experience", `${profile.years_experience} years`],
              ["Graduation", String(profile.graduation_year)],
              ["Major ID", String(profile.major_id)],
              ["Status", profile.status],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-gray-900">{value || "-"}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Bio
            </p>
            <p className="mt-2 text-sm leading-7 text-gray-700">{profile.bio}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Languages
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {languages.length ? (
                  languages.map((language) => (
                    <Badge key={language} variant="outline" size="md">
                      {language}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No languages listed.</span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Links
              </p>
              <div className="mt-2 space-y-2 text-sm">
                {profile.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate font-medium text-brand-700 hover:text-brand-800"
                  >
                    {profile.linkedin_url}
                  </a>
                ) : null}
                {profile.website_url ? (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate font-medium text-brand-700 hover:text-brand-800"
                  >
                    {profile.website_url}
                  </a>
                ) : null}
                {!profile.linkedin_url && !profile.website_url && (
                  <span className="text-gray-500">No links provided.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminModalFrame>
  );
}

function RejectConfirmModal({
  username,
  isRejecting,
  onCancel,
  onConfirm,
}: {
  username: string | null;
  isRejecting: boolean;
  onCancel: () => void;
  onConfirm: (username: string) => void;
}) {
  if (!username) return null;

  return (
    <AdminModalFrame className="max-w-md overflow-hidden p-0">
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Trash2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
              Reject application
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-950">
              Reject @{username}?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              This will mark the mentor application as rejected and remove it
              from the pending review list.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isRejecting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(username)}
          disabled={isRejecting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRejecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Reject
        </button>
      </div>
    </AdminModalFrame>
  );
}

export default function AdminMentorApplicationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [pendingRejectUsername, setPendingRejectUsername] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-mentor-applications", page],
    queryFn: () => mentorApplicationService.getPending(page),
  });

  const {
    data: selectedApplication,
    isFetching: detailsLoading,
  } = useQuery({
    queryKey: ["admin-mentor-application", selectedUsername],
    queryFn: () => mentorApplicationService.getByUsername(selectedUsername ?? ""),
    enabled: Boolean(selectedUsername),
  });

  const approveMutation = useMutation({
    mutationFn: (username: string) => mentorApplicationService.approve(username),
    onSuccess: async (_, username) => {
      toast.success("Mentor application approved.");
      if (selectedUsername === username) {
        setSelectedUsername(null);
      }
      await queryClient.invalidateQueries({
        queryKey: ["admin-mentor-applications"],
      });
    },
    onError: () => {
      toast.error("Mentor application could not be approved.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (username: string) => mentorApplicationService.reject(username),
    onSuccess: async (_, username) => {
      toast.success("Mentor application rejected.");
      setPendingRejectUsername(null);
      if (selectedUsername === username) {
        setSelectedUsername(null);
      }
      await queryClient.invalidateQueries({
        queryKey: ["admin-mentor-applications"],
      });
    },
    onError: () => {
      toast.error("Mentor application could not be rejected.");
    },
  });

  const handleReject = (username: string) => {
    setPendingRejectUsername(username);
  };

  const applications = data?.data ?? [];
  const searchTerm = search.trim().toLowerCase();
  const filteredApplications = searchTerm
    ? applications.filter((application) => {
        const profile = application.mentor_profile;
        return [
          application.user.name,
          application.user.email,
          application.user.username,
          profile.bio,
          profile.degree,
          profile.university_name,
          profile.status,
          String(profile.years_experience),
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));
      })
    : applications;
  const meta = data?.meta ?? {
    current_page: page,
    last_page: 1,
    per_page: 10,
    total: applications.length,
  };
  const approvingUsername = approveMutation.variables;
  const rejectingUsername = rejectMutation.variables;
  const hasLocalFilters = searchTerm.length > 0;

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-brand-50 via-white to-slate-100 p-4 sm:-m-6 sm:p-6 lg:-m-8 lg:p-8">
      <AdminPageShell className="gap-5">
        <div className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5 lg:p-6">
          <AdminPageHeader
            eyebrow="People"
            title="Mentor Applications"
            description="Review pending mentor applications, inspect profile details, and approve qualified mentors."
            className="border-b-0 pb-0"
            actions={
              <ActionIconButton
                label="Refresh applications"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </ActionIconButton>
            }
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-brand-100 bg-brand-50/70 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-gray-950">
                    {isLoading ? "-" : meta.total}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Pending
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-gray-950">
                    {meta.per_page}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Per page
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700 shadow-sm">
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-gray-950">
                    {meta.current_page}/{meta.last_page}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Pages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {isError ? (
        <AdminCard className="border-red-100 bg-white/90 p-8 text-center backdrop-blur">
          <Award className="mx-auto h-10 w-10 text-red-300" />
          <h2 className="mt-3 text-lg font-bold text-gray-950">
            Applications could not be loaded
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Check your admin session and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white transition hover:bg-brand-800"
            aria-label="Try again"
            title="Try again"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </AdminCard>
      ) : (
        <AdminCard className="border-white/70 bg-white/90 shadow-md shadow-slate-200/60 backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-gray-200/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Pending applications
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {isLoading
                  ? "Loading..."
                  : searchTerm
                    ? `${filteredApplications.length} matching on this page`
                    : `${meta.total} total pending`}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[320px] sm:flex-row sm:items-center sm:justify-end">
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applications"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm font-medium text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  aria-label="Search mentor applications"
                />
              </div>
              <Badge variant="warning" size="md">
                Admin review required
              </Badge>
            </div>
          </div>

          <div className="hidden lg:block">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Applicant</TH>
                    <TH>Profile</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {!filteredApplications.length ? (
                    <TableEmpty colSpan={4}>
                      {searchTerm
                        ? "No applications match your search."
                        : "No pending mentor applications."}
                    </TableEmpty>
                  ) : (
                    filteredApplications.map((application) => (
                      <TR key={application.user.username} className="hover:bg-brand-50/40">
                        <TD>
                          <ApplicationSummary application={application} />
                        </TD>
                        <TD>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-gray-900">
                              {application.mentor_profile.degree}
                            </p>
                            <p className="text-gray-500">
                              {application.mentor_profile.university_name}
                            </p>
                            <p className="text-gray-500">
                              {application.mentor_profile.years_experience} years experience
                            </p>
                          </div>
                        </TD>
                        <TD>
                          <Badge variant="warning">
                            {application.mentor_profile.status}
                          </Badge>
                        </TD>
                        <TD>
                          <div className="flex justify-end gap-2">
                            <ActionIconButton
                              label={`View ${application.user.username}`}
                              onClick={() => setSelectedUsername(application.user.username)}
                            >
                              <Eye className="h-4 w-4" />
                            </ActionIconButton>
                            <ApproveButton
                              username={application.user.username}
                              isApproving={
                                approveMutation.isPending &&
                                approvingUsername === application.user.username
                              }
                              onApprove={(username) => approveMutation.mutate(username)}
                            />
                            <RejectButton
                              username={application.user.username}
                              isRejecting={
                                rejectMutation.isPending &&
                                rejectingUsername === application.user.username
                              }
                              onReject={handleReject}
                            />
                          </div>
                        </TD>
                      </TR>
                    ))
                  )}
                </TBody>
              </Table>
            )}
          </div>

          <div className="grid gap-3 p-4 lg:hidden">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-48 animate-pulse rounded-xl bg-gray-100" />
              ))
            ) : filteredApplications.length ? (
              filteredApplications.map((application) => (
                <article
                  key={application.user.username}
                  className="min-w-0 overflow-hidden rounded-lg border border-white/80 bg-white p-4 shadow-sm shadow-slate-200/60"
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <ApplicationSummary application={application} />
                    <div className="shrink-0">
                      <Badge variant="warning">
                        {application.mentor_profile.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Degree
                      </p>
                      <p className="font-semibold text-gray-900">
                        {application.mentor_profile.degree}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        University
                      </p>
                      <p className="font-semibold text-gray-900">
                        {application.mentor_profile.university_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Experience
                      </p>
                      <p className="font-semibold text-gray-900">
                        {application.mentor_profile.years_experience} years
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:justify-end">
                    <ActionIconButton
                      label={`View ${application.user.username}`}
                      onClick={() => setSelectedUsername(application.user.username)}
                      className="w-full sm:w-10"
                    >
                      <Eye className="h-4 w-4" />
                    </ActionIconButton>
                    <ApproveButton
                      username={application.user.username}
                      isApproving={
                        approveMutation.isPending &&
                        approvingUsername === application.user.username
                      }
                      onApprove={(username) => approveMutation.mutate(username)}
                      className="w-full sm:w-10"
                    />
                    <RejectButton
                      username={application.user.username}
                      isRejecting={
                        rejectMutation.isPending &&
                        rejectingUsername === application.user.username
                      }
                      onReject={handleReject}
                      className="w-full sm:w-10"
                    />
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <GraduationCap className="mx-auto h-10 w-10 text-gray-300" />
                <h2 className="mt-3 text-base font-bold text-gray-950">
                  {searchTerm ? "No matching applications" : "No pending applications"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try another name, email, username, or university."
                    : "New mentor applications will appear here for review."}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={isLoading || meta.current_page <= 1 || hasLocalFilters}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(meta.last_page, current + 1))}
              disabled={isLoading || meta.current_page >= meta.last_page || hasLocalFilters}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </AdminCard>
      )}

      <DetailsModal
        application={selectedApplication ?? null}
        isLoading={detailsLoading}
        onClose={() => setSelectedUsername(null)}
      />
      <RejectConfirmModal
        username={pendingRejectUsername}
        isRejecting={rejectMutation.isPending}
        onCancel={() => setPendingRejectUsername(null)}
        onConfirm={(username) => rejectMutation.mutate(username)}
      />
      </AdminPageShell>
    </div>
  );
}
