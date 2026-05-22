"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { QuizResult } from "@/services/quizService";
import { getPublicMajors } from "@/services/studentService";
import Link from "next/link";

const getRecommendationName = (major: NonNullable<QuizResult["recommendations"]>[number]) =>
  major.name_en ?? major.major_name ?? major.en_major_name ?? "Recommended major";

const getRecommendationArabicName = (major: NonNullable<QuizResult["recommendations"]>[number]) => {
  if (major.name_ar || major.ar_major_name) return major.name_ar ?? major.ar_major_name;

  const knownKeys = new Set([
    "id",
    "major_id",
    "slug",
    "major_name",
    "en_major_name",
    "ar_major_name",
    "name_en",
    "name_ar",
    "match_percentage",
    "overview",
  ]);

  return Object.entries(major).find(
    ([key, value]) => !knownKeys.has(key) && typeof value === "string",
  )?.[1] as string | undefined;
};

export default function QuizResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const { data: majorsData, isLoading: majorsLoading } = useQuery({
    queryKey: ["quiz-results-all-majors"],
    queryFn: () => getPublicMajors({ per_page: 100, page: 1 }),
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    if (!stored) {
      router.push("/student/quiz");
      return;
    }
    try {
      setResult(JSON.parse(stored));
    } catch {
      sessionStorage.removeItem("quizResult");
      router.push("/student/quiz");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100">
        <div className="rounded-3xl border border-white/80 bg-white/85 px-6 py-8 shadow-card sm:px-10">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  const recommendations =
    result.recommended_majors ?? result.recommendations ?? [];
  const allMajors = [
    ...(majorsData?.recommended ?? []),
    ...(majorsData?.featured ?? []),
    ...(majorsData?.others.data ?? []),
  ];
  const shownNames = new Set(
    recommendations.map((major) => getRecommendationName(major).toLowerCase()),
  );
  const enrichedRecommendations = recommendations.map((recommendation) => {
    const name = getRecommendationName(recommendation);
    const match = allMajors.find(
      (major) =>
        major.id === recommendation.id ||
        major.id === recommendation.major_id ||
        major.slug === recommendation.slug ||
        major.name_en.toLowerCase() === name.toLowerCase(),
    );

    return {
      ...recommendation,
      id: recommendation.id ?? recommendation.major_id ?? match?.id,
      slug: recommendation.slug ?? match?.slug,
      name_en: recommendation.name_en ?? recommendation.major_name ?? recommendation.en_major_name ?? match?.name_en,
      name_ar: recommendation.name_ar ?? recommendation.ar_major_name ?? getRecommendationArabicName(recommendation) ?? match?.name_ar,
      overview: recommendation.overview ?? match?.overview ?? match?.description ?? undefined,
    };
  });
  const moreMajors = allMajors
    .filter((major) => !shownNames.has(major.name_en.toLowerCase()))
    .slice(0, Math.max(0, 5 - enrichedRecommendations.length));
  const hasResults = enrichedRecommendations.length > 0 || moreMajors.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-card backdrop-blur">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.75fr] lg:p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                <Sparkles className="h-3.5 w-3.5" />
                Your results
              </span>
              <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Quiz complete
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                {result.message ??
                  "Here are your recommended majors based on your answers."}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-950">
                    Recommendations
                  </p>
                  <p className="text-xs text-gray-500">
                    Built from your latest quiz.
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
                      Majors shown
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-950">
                    {enrichedRecommendations.length + moreMajors.length}
                  </p>
                </div>
              </div>
              {result.score !== undefined && (
                <div className="mt-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                    Score
                  </p>
                  <p className="mt-1 text-xl font-bold text-brand-800">
                    {result.score}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
        {enrichedRecommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Recommended Majors
            </h3>
            {enrichedRecommendations.map((major, index) => {
              const name = major.name_en ?? major.major_name ?? "Recommended major";
              const href = major.slug
                ? `/student/majors/${major.slug}`
                : `/student/majors?q=${encodeURIComponent(name)}`;

              return (
              <div
                key={major.id ?? `${name}-${index}`}
                className="rounded-3xl border border-white/80 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                    <h4 className="font-semibold text-gray-950">{name}</h4>
                    {major.name_ar && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {major.name_ar}
                      </p>
                    )}
                    {major.overview && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {major.overview}
                      </p>
                    )}
                    {major.match_percentage !== undefined && (
                      <span className="mt-2 inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        {major.match_percentage}% match
                      </span>
                    )}
                    </div>
                  </div>
                  <Link
                    href={href}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    {major.slug ? "View" : "Explore"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {!majorsLoading && moreMajors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              More Majors To Explore
            </h3>
            {moreMajors.map((major) => (
              <div
                key={major.id}
                className="rounded-3xl border border-white/80 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                    <h4 className="font-semibold text-gray-950">{major.name_en}</h4>
                    {major.name_ar && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {major.name_ar}
                      </p>
                    )}
                    {(major.overview ?? major.description) && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {major.overview ?? major.description}
                      </p>
                    )}
                    </div>
                  </div>
                  <Link
                    href={`/student/majors/${major.slug}`}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!majorsLoading && !hasResults && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white/85 p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No recommendations were returned yet. You can still explore all
              majors manually.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("quizResult");
              router.push("/student/quiz");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-brand-300 hover:text-brand-600"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </button>
          <Link
            href="/student/majors"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-colors hover:bg-brand-700"
          >
            Explore All Majors
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
