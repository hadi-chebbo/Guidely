"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Search,
  SearchX,
  Users,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getMajorMentors,
  getPublicMajors,
  type PublicMajorItem,
} from "@/services/studentService";
import MentorProfileModal, {
  MentorCard,
} from "@/components/mentors/MentorProfileModal";

const PAGE_SIZE = 9;

export default function StudentMentorsPage() {
  const [search, setSearch] = useState("");
  const [selectedMajorSlug, setSelectedMajorSlug] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: majorsData, isLoading: majorsLoading } = useQuery({
    queryKey: ["mentor-page-majors"],
    queryFn: () => getPublicMajors({ per_page: 100, page: 1 }),
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

  const selectedMajor = majors.find((major) => major.slug === selectedMajorSlug) ?? null;

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
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-700 to-indigo-700 px-6 py-12">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20">
            <Users className="h-3.5 w-3.5" />
            Student mentors
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Meet mentors by major
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Choose a major to find approved mentors who can explain the path,
            university experience, and career direction.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[320px_1fr]">
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
                        onView={setSelectedMentor}
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

      <MentorProfileModal
        username={selectedMentor}
        onClose={() => setSelectedMentor(null)}
      />
    </div>
  );
}
