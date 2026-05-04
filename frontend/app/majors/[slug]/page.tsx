"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  GraduationCap,
  Globe,
  MapPin,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMajors } from "@/lib/mocks/majors";
import type { DifficultyLevel, DemandLevel } from "@/types/major";
import ProsConsSection from "@/components/majors/detail/ProsConsSection";
import JobsSection from "@/components/majors/detail/JobsSection";
import { SkillsSection, FAQSection } from "@/components/majors/detail/ContentSections";
import CompaniesSection from "@/components/majors/detail/CompaniesSection";

/* ── Difficulty bar ─────────────────────────────────────────────────── */

const difficultyDots: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  very_hard: 4,
};

function DifficultyBar({ level }: { level: string }) {
  const filled = difficultyDots[level] ?? 2;
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty: ${level}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i < filled ? "w-3 bg-brand-500" : "w-2 bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

/* ── Demand badge ───────────────────────────────────────────────────── */

const demandConfig: Record<DemandLevel, { label: string; className: string }> = {
  very_high: {
    label: "Very High",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  high: {
    label: "High",
    className: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
  },
};

function DemandBadge({ level }: { level: DemandLevel }) {
  const cfg = demandConfig[level] ?? demandConfig.medium;
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        cfg.className
      )}
    >
      {cfg.label}
    </span>
  );
}

/* ── Difficulty label helper ────────────────────────────────────────── */

const difficultyLabel: Record<DifficultyLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  very_hard: "Very Hard",
};

/* ── Page ───────────────────────────────────────────────────────────── */

export default function MajorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // TODO TI-36: replace with real API call
  const major = mockMajors.find((m) => m.slug === params.slug) ?? null;

  /* ── Not found ──────────────────────────────────────────────────── */
  if (!major) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f5f7] px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <BookOpen className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Major not found
        </h1>
        <p className="max-w-xs text-sm text-gray-500">
          We couldn&apos;t find a major matching &quot;{params.slug}&quot;. It may
          have been moved or removed.
        </p>
        <Link
          href="/majors"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Majors
        </Link>
      </div>
    );
  }

  const salaryRange = `$${(major.salary_min / 1000).toFixed(0)}k – $${(major.salary_max / 1000).toFixed(0)}k`;
  const previewSkills = major.skills?.slice(0, 4) ?? [];

  /* ── Page shell ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      {/* ════════════════════════════════════════════════════════════
          HERO — full-width dark header
          ════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-brand-950">
        {/* Dot-pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            opacity: 0.07,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-6">

          {/* Back link */}
          <Link
            href="/majors"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Majors
          </Link>

          {/* Category chip */}
          {major.category && (
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20 backdrop-blur-sm">
                {major.category.name_en}
              </span>
            </div>
          )}

          {/* Major name */}
          <div className="mt-3 flex flex-wrap items-start gap-3">
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              {major.name_en}
            </h1>
            {major.is_featured && (
              <span className="mt-1 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/30">
                <GraduationCap className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          {/* Arabic name */}
          <p className="mt-1 text-sm text-white/50" dir="rtl" lang="ar">
            {major.name_ar}
          </p>

          {/* Overview */}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            {major.overview}
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap items-center gap-6">

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-white/40">
                Duration
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <Clock className="h-4 w-4 text-white/50" />
                {major.duration_years} year{major.duration_years !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Difficulty */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-white/40">
                Difficulty
              </span>
              <div className="flex items-center gap-2">
                <DifficultyBar level={major.difficulty_level} />
                <span className="text-sm font-semibold text-white">
                  {difficultyLabel[major.difficulty_level]}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Local demand */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-white/40">
                Local Demand
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <MapPin className="h-4 w-4 text-white/50" />
                {demandConfig[major.local_demand]?.label ?? major.local_demand}
              </span>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Salary */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-white/40">
                Salary Range
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <TrendingUp className="h-4 w-4 text-white/50" />
                {salaryRange}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          BODY — main content + sidebar
          ════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

          {/* ── Main column ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Overview card */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About this Major
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {major.description}
              </p>
            </section>

            <ProsConsSection points={major.points ?? []} />
            <JobsSection jobs={major.jobs ?? []} />
            <SkillsSection skills={major.skills ?? []} />
            <FAQSection faqs={major.faqs ?? []} />
            <CompaniesSection companies={major.companies ?? []} />

          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="flex flex-col gap-4">

            {/* Quick facts card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Facts
              </h2>

              <dl className="flex flex-col gap-4">

                {/* Duration */}
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">
                    Duration
                  </dt>
                  <dd className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {major.duration_years} year{major.duration_years !== 1 ? "s" : ""}
                  </dd>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">
                    Difficulty
                  </dt>
                  <dd className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <DifficultyBar level={major.difficulty_level} />
                    {difficultyLabel[major.difficulty_level]}
                  </dd>
                </div>

                {/* Salary range */}
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">
                    Salary Range (USD/yr)
                  </dt>
                  <dd className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    {salaryRange}
                  </dd>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Local demand */}
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5" />
                    Local Demand
                  </dt>
                  <dd>
                    <DemandBadge level={major.local_demand} />
                  </dd>
                </div>

                {/* International demand */}
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wide">
                    <Globe className="h-3.5 w-3.5" />
                    International
                  </dt>
                  <dd>
                    <DemandBadge level={major.international_demand} />
                  </dd>
                </div>

              </dl>
            </div>

            {/* Skills preview card */}
            {previewSkills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Skills
                </h2>
                <ul className="flex flex-col gap-2">
                  {previewSkills.map((skill) => (
                    <li
                      key={skill.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">{skill.name}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          skill.type === "hard"
                            ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                            : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                        )}
                      >
                        {skill.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <GraduationCap className="h-6 w-6 text-brand-950" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Ready to apply?
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Browse universities that offer this major.
                </p>
              </div>
              {/* TODO: update href once university detail routes exist */}
              <Link
                href="/admin/universities"
                className="w-full rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-90"
              >
                Explore Universities
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
