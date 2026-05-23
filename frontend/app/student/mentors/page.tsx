"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import {
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Search,
  SearchX,
  Send,
  UserPlus,
  Users,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getMajorMentors,
  getPublicMajors,
  type PublicMajorItem,
} from "@/services/studentService";
import { MentorCard } from "@/components/mentors/MentorProfileModal";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import SearchableDropdown, {
  type SearchableDropdownOption,
} from "@/components/ui/SearchableDropdown";
import Switch from "@/components/ui/Switch";
import Textarea from "@/components/ui/Textarea";
import { loadPublicMajorOptions } from "@/services/dropdownOptions";
import { mentorService, type MentorProfilePayload } from "@/services/mentorService";

const PAGE_SIZE = 9;
const currentYear = new Date().getFullYear();

const defaultApplicationForm: MentorProfilePayload = {
  major_slug: "",
  bio: "",
  years_experience: 0,
  degree: "",
  university_name: "",
  graduation_year: currentYear,
  languages: ["English"],
  linkedin_url: "",
  website_url: "",
  is_accepting_students: true,
};

export default function StudentMentorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedMajorSlug, setSelectedMajorSlug] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMajorOption, setSelectedMajorOption] =
    useState<SearchableDropdownOption<PublicMajorItem> | null>(null);
  const [applicationMajorOption, setApplicationMajorOption] =
    useState<SearchableDropdownOption<PublicMajorItem> | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationForm, setApplicationForm] =
    useState<MentorProfilePayload>(defaultApplicationForm);
  const [languageText, setLanguageText] = useState("English");
  const [applicationMessage, setApplicationMessage] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const { data: majorsData, isLoading: majorsLoading } = useQuery({
    queryKey: ["mentor-page-majors", debouncedSearch],
    queryFn: () =>
      getPublicMajors({
        per_page: debouncedSearch ? 10 : 10,
        page: 1,
        search: debouncedSearch || undefined,
        name_en: debouncedSearch || undefined,
      }),
  });

  const majors = useMemo(() => {
    if (!majorsData) return [];
    return [...majorsData.recommended, ...majorsData.featured, ...majorsData.others.data]
      .filter(
        (major, index, all) =>
          all.findIndex((item) => item.slug === major.slug) === index,
      )
      .sort((a, b) => a.name_en.localeCompare(b.name_en));
  }, [majorsData]);

  const filteredMajors = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return majors;

    return majors.filter((major) =>
      [major.name_en, major.name_ar, major.category?.name_en, major.category?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [debouncedSearch, majors]);

  const selectedMajor =
    selectedMajorOption?.item ??
    majors.find((major) => major.slug === selectedMajorSlug) ??
    null;

  const {
    data: mentorsData,
    isFetching: mentorsLoading,
    isError: mentorsError,
  } = useQuery({
    queryKey: ["major-mentors", selectedMajorSlug, page],
    queryFn: () =>
      getMajorMentors(selectedMajorSlug, {
        page,
        per_page: PAGE_SIZE,
      }),
    enabled: Boolean(selectedMajorSlug),
    retry: false,
  });

  const handleSelectMajor = (major: PublicMajorItem) => {
    setSelectedMajorSlug(major.slug);
    const nextOption = {
      value: major.slug,
      label: major.name_en,
      item: major,
    };
    setSelectedMajorOption(nextOption);
    setApplicationMajorOption((current) => current ?? nextOption);
    setApplicationForm((previous) => ({
      ...previous,
      major_slug: previous.major_slug || major.slug,
    }));
    setPage(1);
  };

  const openApplicationForm = () => {
    setApplicationMessage("");
    setApplicationForm((previous) => ({
      ...previous,
      major_slug: previous.major_slug || selectedMajorSlug,
    }));
    setIsApplicationOpen(true);
  };

  const closeApplicationForm = useCallback(() => {
    setIsApplicationOpen(false);
  }, []);

  const applyMutation = useMutation({
    mutationFn: (payload: MentorProfilePayload) => mentorService.createProfile(payload),
    onSuccess: (application) => {
      setApplicationMessage(
        application.status === "pending"
          ? "Your mentor application was submitted and is pending review."
          : "Your mentor application was submitted.",
      );
      toast.success("Mentor application submitted.");
    },
    onError: (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
      const errors = error.response?.data?.errors;
      const firstValidationError = errors
        ? Object.values(errors).flat().find(Boolean)
        : undefined;
      const message =
        firstValidationError ??
        error.response?.data?.message ??
        "Mentor application could not be submitted.";

      setApplicationMessage(message);
      toast.error(message);
    },
  });

  const setApplicationField = <K extends keyof MentorProfilePayload>(
    key: K,
    value: MentorProfilePayload[K],
  ) => {
    setApplicationForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleApplicationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApplicationMessage("");

    const languages = languageText
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);

    applyMutation.mutate({
      ...applicationForm,
      years_experience: Number(applicationForm.years_experience),
      graduation_year: Number(applicationForm.graduation_year),
      languages,
      linkedin_url: applicationForm.linkedin_url || null,
      website_url: applicationForm.website_url || null,
      is_accepting_students: Boolean(applicationForm.is_accepting_students),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-700 to-indigo-700 px-4 py-10 sm:px-6 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20">
            <Users className="h-3.5 w-3.5" />
            Student mentors
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Meet mentors by major
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Choose a major to find approved mentors who can explain the path,
            university experience, and career direction.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openApplicationForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand-800 shadow-sm transition hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-white/25"
            >
              <UserPlus className="h-4 w-4" />
              Apply as mentor
            </button>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white/75">
              <Award className="h-4 w-4" />
              Reviewed before becoming public
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <UserPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-950">
                Want to help students choose better?
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Submit your mentor profile once. The team reviews it before it
                appears publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-20 lg:self-start">
          <h2 className="text-lg font-bold text-gray-900">Choose a major</h2>
          <p className="mt-1 text-sm text-gray-500">
            Mentors are listed according to their approved major profile.
          </p>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search majors"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {majorsLoading ? (
              <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-600" />
                Loading majors...
              </div>
            ) : filteredMajors.length ? (
              filteredMajors.map((major) => (
                <button
                  key={major.slug}
                  type="button"
                  onClick={() => handleSelectMajor(major)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedMajorSlug === major.slug
                      ? "border-brand-200 bg-brand-50"
                      : "border-gray-100 bg-white hover:border-brand-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-950 text-white">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-1 text-sm font-bold text-gray-900">
                        {major.name_en}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-400">
                        {major.category?.name_en ?? major.category?.name ?? "General"}
                      </span>
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">
                No majors found.
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0">
          {!selectedMajor ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
              <SearchX className="mx-auto h-10 w-10 text-gray-300" />
              <h2 className="mt-3 text-lg font-bold text-gray-900">
                Select a major to view mentors
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
                Mentor availability depends on approved mentor profiles for each
                major.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase text-brand-600">
                  Mentors for
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
                  {selectedMajor.name_en}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {mentorsData?.meta.total ?? 0} approved mentor
                  {(mentorsData?.meta.total ?? 0) === 1 ? "" : "s"} found
                </p>
              </div>

              {mentorsError ? (
                <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
                  Mentors could not be loaded for this major.
                </div>
              ) : mentorsLoading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-64 animate-pulse rounded-lg border border-gray-100 bg-white shadow-sm"
                    />
                  ))}
                </div>
              ) : mentorsData?.data.length ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {mentorsData.data.map((mentor) => (
                      <MentorCard
                        key={mentor.username}
                        mentor={mentor}
                        onView={(username) => router.push(`/student/mentors/${username}`)}
                      />
                    ))}
                  </div>

                  {mentorsData.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="inline h-4 w-4" />
                        Previous
                      </button>
                      <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-600">
                        Page {mentorsData.meta.current_page} of {mentorsData.meta.last_page}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) =>
                            Math.min(mentorsData.meta.last_page, current + 1),
                          )
                        }
                        disabled={page === mentorsData.meta.last_page}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="inline h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                  <Users className="mx-auto h-10 w-10 text-gray-300" />
                  <h2 className="mt-3 text-lg font-bold text-gray-900">
                    No mentors yet
                  </h2>
                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
                    This major does not have approved mentors available right now.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Modal
        open={isApplicationOpen}
        onClose={closeApplicationForm}
        title="Apply as mentor"
        description="Complete the details the review team needs to evaluate your mentor profile."
        size="xl"
      >
        <form onSubmit={handleApplicationSubmit} className="space-y-6">
          {applicationMessage && (
            <div
              className={`flex gap-2 rounded-lg px-3 py-2 text-sm ${
                applyMutation.isSuccess
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {applyMutation.isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{applicationMessage}</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <SearchableDropdown<PublicMajorItem>
                label="Major"
                placeholder="Select a major"
                searchPlaceholder="Search majors..."
                emptyMessage="No majors found."
                value={applicationForm.major_slug}
                selectedOption={
                  applicationMajorOption ??
                  (applicationForm.major_slug
                    ? {
                        value: applicationForm.major_slug,
                        label: selectedMajor?.name_en ?? applicationForm.major_slug,
                        item: selectedMajor ?? undefined,
                      }
                    : null)
                }
                loadOptions={loadPublicMajorOptions}
                onChange={(value, option) => {
                  setApplicationMajorOption(option ?? null);
                  setApplicationField("major_slug", value);
                }}
              />
            </div>

            <Input
              label="Degree"
              value={applicationForm.degree}
              onChange={(event) => setApplicationField("degree", event.target.value)}
              required
              maxLength={100}
              placeholder="BS Computer Science"
            />

            <Input
              label="University"
              value={applicationForm.university_name}
              onChange={(event) => setApplicationField("university_name", event.target.value)}
              required
              maxLength={150}
              placeholder="American University of Beirut"
            />

            <Input
              label="Graduation year"
              type="number"
              min={1970}
              max={currentYear}
              value={applicationForm.graduation_year}
              onChange={(event) => setApplicationField("graduation_year", Number(event.target.value))}
              required
            />

            <Input
              label="Years of experience"
              type="number"
              min={0}
              max={50}
              value={applicationForm.years_experience}
              onChange={(event) => setApplicationField("years_experience", Number(event.target.value))}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Languages"
                value={languageText}
                onChange={(event) => setLanguageText(event.target.value)}
                required
                hint="Separate languages with commas."
                placeholder="English, Arabic, French"
              />
            </div>

            <Input
              label="LinkedIn URL"
              type="url"
              value={applicationForm.linkedin_url ?? ""}
              onChange={(event) => setApplicationField("linkedin_url", event.target.value)}
              placeholder="https://linkedin.com/in/..."
            />

            <Input
              label="Website URL"
              type="url"
              value={applicationForm.website_url ?? ""}
              onChange={(event) => setApplicationField("website_url", event.target.value)}
              placeholder="https://your-site.com"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Bio"
                value={applicationForm.bio}
                onChange={(event) => setApplicationField("bio", event.target.value)}
                required
                minLength={100}
                maxLength={1000}
                rows={6}
                hint={`${applicationForm.bio.length}/1000 characters. Minimum 100.`}
                placeholder="Share what you studied, what experience you bring, and how you can help students make clearer decisions."
                className="min-h-40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Switch
              checked={applicationForm.is_accepting_students}
              onChange={(checked) => setApplicationField("is_accepting_students", checked)}
              label="Accepting students"
              description="Show that you are available after approval."
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={closeApplicationForm}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applyMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {applyMutation.isPending ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
