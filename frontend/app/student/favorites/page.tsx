"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  Loader2,
  SearchX,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  getFavoriteMajors,
  getPublicMajorId,
  removeFavoriteMajor,
  type PublicMajorItem,
} from "@/services/studentService";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const [pendingFavoriteId, setPendingFavoriteId] = useState<number | null>(null);

  const {
    data: favorites = [],
    isLoading,
  } = useQuery({
    queryKey: ["student-favorite-majors"],
    queryFn: getFavoriteMajors,
  });
  const visibleFavorites = favorites.filter((major) => getPublicMajorId(major));

  const handleRemoveFavorite = async (majorId: number) => {
    if (pendingFavoriteId !== null) return;

    setPendingFavoriteId(majorId);
    await queryClient.cancelQueries({ queryKey: ["student-favorite-majors"] });

    const previousFavorites =
      queryClient.getQueryData<PublicMajorItem[]>(["student-favorite-majors"]) ??
      favorites;

    try {
      const nextFavorites = await removeFavoriteMajor(majorId);
      queryClient.setQueryData<PublicMajorItem[]>(
        ["student-favorite-majors"],
        nextFavorites,
      );
      await queryClient.invalidateQueries({
        queryKey: ["student-favorite-majors"],
      });
    } catch {
      queryClient.setQueryData(["student-favorite-majors"], previousFavorites);
    } finally {
      setPendingFavoriteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4">
        <div className="rounded-3xl border border-white/80 bg-white/85 px-10 py-8 text-center shadow-card">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand-600" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Loading favorites...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-card backdrop-blur">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your shortlist
                </span>
                <h1 className="mt-4 max-w-2xl font-heading text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Keep the majors you are seriously considering in one place.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                  Compare saved options, revisit details, and remove choices as
                  your plan gets clearer.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/student/majors"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-colors hover:bg-brand-700"
                  >
                    Explore majors
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                    <Heart className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      Saved majors
                    </p>
                    <p className="text-xs text-gray-500">
                      Your current comparison list.
                    </p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        Ready to review
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-950">
                      {visibleFavorites.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {visibleFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/85 px-6 py-16 text-center shadow-sm backdrop-blur">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <SearchX className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-gray-950">
              No favorites yet
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Save majors from the explorer and your shortlist will stay here.
            </p>
            <Link
              href="/student/majors"
              className="mt-5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Browse majors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleFavorites.map((major) => (
              <FavoriteMajorCard
                key={major.slug || getPublicMajorId(major)}
                major={major}
                isRemoving={pendingFavoriteId === getPublicMajorId(major)}
                onRemove={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoriteMajorCard({
  major,
  isRemoving,
  onRemove,
}: {
  major: PublicMajorItem;
  isRemoving: boolean;
  onRemove: (majorId: number) => void;
}) {
  const majorId = getPublicMajorId(major);
  const durationYears = major.duration_years ?? major.duration_year ?? 0;
  const salaryK = major.salary_max
    ? `$${Math.round(major.salary_max / 1000)}k`
    : null;
  const demandClass =
    {
      very_high: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      high: "bg-brand-50 text-brand-700 ring-brand-200",
      medium: "bg-amber-50 text-amber-700 ring-amber-200",
      low: "bg-gray-100 text-gray-500 ring-gray-200",
    }[major.local_demand] ?? "bg-gray-100 text-gray-500 ring-gray-200";

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      <div className="border-b border-gray-100 bg-brand-950 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/55">
              {major.category?.name_en ?? "Major"}
            </p>
            <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold leading-snug text-white">
              {major.name_en}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              if (majorId) onRemove(majorId);
            }}
            disabled={isRemoving || !majorId}
            aria-label={`Remove ${major.name_en} from favorites`}
            className={cn(
              "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200 transition-all hover:bg-white hover:text-rose-700 hover:ring-rose-300",
              (isRemoving || !majorId) && "cursor-not-allowed opacity-60",
            )}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className="h-4 w-4 fill-current" />
            )}
          </button>
        </div>
      </div>

      <div className="flex min-h-48 flex-col p-5">
        <p className="line-clamp-3 text-sm leading-6 text-gray-500">
          {major.overview ?? major.description ?? "Review this major in detail."}
        </p>

        <div className="mt-4">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1",
              demandClass,
            )}
          >
            {major.local_demand.replace("_", " ")} demand
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {durationYears} yr
            </span>
            {salaryK && (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                {salaryK}
              </span>
            )}
          </div>
          <Link
            href={`/student/majors/${major.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            View
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
