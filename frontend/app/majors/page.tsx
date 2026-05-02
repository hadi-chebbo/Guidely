"use client";

import {
  useMemo,
  useState,
  useCallback,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  SearchX,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMajors, mockCategories } from "@/lib/mocks/majors";
import { useDebounce } from "@/hooks/useDebounce";
import MajorCard from "@/components/majors/MajorCard";
import MajorsFilterSidebar, {
  DEFAULT_FILTERS,
  activeFilterCount,
  filtersToParams,
  paramsToFilters,
  type MajorFilters,
} from "@/components/majors/MajorsFilterSidebar";

const PAGE_SIZE = 3;

/* ── Skeleton ── */
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
        <div className="h-px bg-gray-100 mt-1" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center transition-all">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <SearchX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">
        No majors match your filters
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        Try adjusting your search or filters to find what you&apos;re looking
        for.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}

/* ── Error state ── */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-white py-16 text-center transition-all">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">Something went wrong</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        We couldn&apos;t load the majors. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(
          "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all",
          page === 1
            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
            : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                p === page
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600",
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(
          "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all",
          page === totalPages
            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
            : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600",
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Main content ── */
function MajorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));

  const debouncedSearch = useDebounce(search, 300);

  const [filters, setFiltersState] = useState<MajorFilters>(() =>
    paramsToFilters(searchParams),
  );

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const setFilters = useCallback((next: MajorFilters) => {
    setFiltersState(next);
    setPage(1);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Single effect handles all URL updates
  useEffect(() => {
    const params = filtersToParams(filters);
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
    else params.delete("q");
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    router.replace(`/majors?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, filters, page, router]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const filtered = useMemo(() => {
    return mockMajors.filter((m) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !m.name_en.toLowerCase().includes(q) &&
          !m.name_ar.toLowerCase().includes(q) &&
          !m.overview.toLowerCase().includes(q)
        )
          return false;
      }
      if (
        filters.categories.length &&
        !filters.categories.includes(m.category?.slug ?? "")
      )
        return false;
      if (filters.demand.length && !filters.demand.includes(m.local_demand))
        return false;
      if (
        filters.difficulty.length &&
        !filters.difficulty.includes(m.difficulty_level)
      )
        return false;
      if (filters.featuredOnly && !m.is_featured) return false;
      return true;
    });
  }, [debouncedSearch, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterCount = activeFilterCount(filters);

  const renderResults = () => {
    if (isLoading) return <SkeletonGrid />;
    if (hasError) return <ErrorState onRetry={handleRetry} />;
    if (filtered.length === 0)
      return (
        <EmptyState
          onClear={() => {
            setFilters(DEFAULT_FILTERS);
            handleSearch("");
          }}
        />
      );
    if (view === "grid")
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((m) => (
            <MajorCard key={m.id} major={m} view="grid" />
          ))}
        </div>
      );
    return (
      <div className="flex flex-col gap-2.5">
        {paginated.map((m) => (
          <MajorCard key={m.id} major={m} view="list" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-600 to-indigo-700 px-6 pb-8 pt-10">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.04]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20 backdrop-blur-sm">
            <GraduationCap className="h-3.5 w-3.5" />
            Guidely — Major Explorer
          </span>

          <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Find Your Perfect Major
          </h1>
          <p className="mt-3 text-base text-white/60 sm:text-lg">
            Browse {mockMajors.length}+ programs across every field — filter by
            demand, difficulty, and more.
          </p>

          <div className="mx-auto mt-7 max-w-2xl">
            <div className="relative flex items-center rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/20">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, category, or keyword…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-14 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="absolute right-4 hidden rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-400 sm:block">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            {[
              { label: "Majors", value: mockMajors.length },
              { label: "Categories", value: mockCategories.length },
              {
                label: "High-demand fields",
                value: mockMajors.filter(
                  (m) =>
                    m.local_demand === "very_high" || m.local_demand === "high",
                ).length,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 text-white/70"
              >
                <span className="text-xl font-bold text-white">{s.value}</span>
                <span className="text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 px-6 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-sm text-gray-500 flex-shrink-0">
              <span className="font-semibold text-gray-900">
                {filtered.length}
              </span>{" "}
              major{filtered.length !== 1 ? "s" : ""}
            </span>
            {filterCount > 0 && (
              <>
                <span className="h-3 w-px bg-gray-200 flex-shrink-0" />
                {filters.categories.map((slug) => (
                  <ActiveChip
                    key={slug}
                    label={slug}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        categories: filters.categories.filter(
                          (c) => c !== slug,
                        ),
                      })
                    }
                  />
                ))}
                {filters.demand.map((d) => (
                  <ActiveChip
                    key={d}
                    label={`${d.replace("_", " ")} demand`}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        demand: filters.demand.filter((v) => v !== d),
                      })
                    }
                  />
                ))}
                {filters.difficulty.map((d) => (
                  <ActiveChip
                    key={d}
                    label={d.replace("_", " ")}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        difficulty: filters.difficulty.filter((v) => v !== d),
                      })
                    }
                  />
                ))}
                {filters.featuredOnly && (
                  <ActiveChip
                    label="Featured"
                    onRemove={() =>
                      setFilters({ ...filters, featuredOnly: false })
                    }
                  />
                )}
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex-shrink-0"
                >
                  Clear all
                </button>
              </>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all md:hidden",
                filterCount > 0
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {filterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {filterCount}
                </span>
              )}
            </button>

            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={cn(
                  "rounded-lg p-1.5 transition-all",
                  view === "grid"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="List view"
                className={cn(
                  "rounded-lg p-1.5 transition-all",
                  view === "list"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6">
          <div className="hidden w-56 flex-shrink-0 md:block">
            <div className="sticky top-[57px]">
              <MajorsFilterSidebar
                filters={filters}
                onChange={setFilters}
                totalResults={filtered.length}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1" ref={resultsRef}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {isLoading ? (
                  <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-200" />
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">
                      {filtered.length}
                    </span>{" "}
                    major{filtered.length !== 1 ? "s" : ""} found
                    {totalPages > 1 && (
                      <span className="ml-2 text-gray-400">
                        · Page {page} of {totalPages}
                      </span>
                    )}
                  </>
                )}
              </p>
              <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:hidden">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={cn(
                    "rounded-lg p-1.5",
                    view === "grid"
                      ? "bg-brand-600 text-white"
                      : "text-gray-400",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={cn(
                    "rounded-lg p-1.5",
                    view === "list"
                      ? "bg-brand-600 text-white"
                      : "text-gray-400",
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="transition-all duration-300">{renderResults()}</div>

            {!isLoading && !hasError && filtered.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:hidden">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
              <span className="font-semibold text-gray-900">Filters</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <MajorsFilterSidebar
                filters={filters}
                onChange={(f) => {
                  setFilters(f);
                  setMobileSidebarOpen(false);
                }}
                totalResults={filtered.length}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Active filter chip ── */
function ActiveChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 capitalize">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 text-brand-400 hover:text-brand-600"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

/* ── Page export with Suspense ── */
export default function MajorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50/60 p-6">
          <div className="mx-auto max-w-7xl">
            <SkeletonGrid />
          </div>
        </div>
      }
    >
      <MajorsContent />
    </Suspense>
  );
}
