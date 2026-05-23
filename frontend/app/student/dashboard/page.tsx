"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  Loader2,
  Sparkles,
  Tags,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getCategories,
  getFavoriteMajors,
  getPublicMajorId,
  getPublicMajorsTotal,
  getPublicMajors,
} from "@/services/studentService";
import MajorCard from "@/components/majors/MajorCard";

export default function StudentDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  const { data: majorsData, isLoading: majorsLoading } = useQuery({
    queryKey: ["student-dashboard-majors"],
    queryFn: () => getPublicMajors({ per_page: 6, page: 1 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["student-categories"],
    queryFn: getCategories,
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["student-favorite-majors"],
    queryFn: getFavoriteMajors,
    enabled: isAuthenticated,
  });

  const recommended = majorsData?.recommended ?? [];
  const featured = majorsData?.featured ?? [];
  const others = majorsData?.others.data ?? [];
  const totalMajors = getPublicMajorsTotal(majorsData);
  const topMajors = [...recommended, ...featured, ...others].slice(0, 3);

  const stats = [
    {
      label: "Saved majors",
      value: isAuthenticated
        ? favoritesLoading
          ? "-"
          : favorites.filter((major) => getPublicMajorId(major)).length
        : 0,
      icon: Heart,
      tone: "text-rose-600 bg-rose-50 ring-rose-100",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Tags,
      tone: "text-brand-700 bg-brand-50 ring-brand-100",
    },
    {
      label: "Majors to explore",
      value: totalMajors,
      icon: BookOpen,
      tone: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-card backdrop-blur">
            <div className="grid gap-8 p-6 lg:grid-cols-[1.5fr_0.8fr] lg:p-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Student dashboard
                </span>
                <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Welcome{user?.name ? `, ${user.name}` : ""}. Find the major
                  that fits how you think and where you want to go.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                  Keep your saved options close, browse updated programs, and
                  use the quiz when you want a guided recommendation.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/student/quiz"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-colors hover:bg-brand-700"
                  >
                    Take quiz
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/student/majors"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    Explore majors
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      Quick path
                    </p>
                    <p className="text-xs text-gray-500">
                      Start with the quiz, then compare options.
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${stat.tone}`}
                        >
                          <stat.icon className="h-4 w-4" />
                        </div>
                        <p className="min-w-0 text-sm font-medium text-gray-600">
                          {stat.label}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-gray-950">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-gray-950">
              Suggested majors
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A clean starting point from the latest major list.
            </p>
          </div>
          <Link
            href="/student/majors"
            className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
          >
            View all
          </Link>
        </div>

        {majorsLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-3xl border border-white/80 bg-white/80 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : topMajors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topMajors.map((major) => (
              <MajorCard key={major.slug} major={major as never} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white/80 p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No majors are available yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
