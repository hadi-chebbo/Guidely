import Link from "next/link";
import {
  ArrowRight,
  Clock,
  TrendingUp,
  Monitor,
  Briefcase,
  Wrench,
  Stethoscope,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Major } from "@/types/major";

type Props = {
  major: Major;
  view?: "grid" | "list";
};

const demandConfig: Record<string, { label: string; className: string }> = {
  very_high: { label: "Very High Demand", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  high:      { label: "High Demand",      className: "bg-brand-50 text-brand-700 ring-1 ring-brand-200" },
  medium:    { label: "Medium Demand",    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  low:       { label: "Low Demand",       className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200" },
};

const difficultyDots: Record<string, number> = {
  easy: 1, medium: 2, hard: 3, very_hard: 4,
};

const cardTheme = { bg: "bg-brand-950", text: "text-white", iconBg: "bg-white/15", iconColor: "text-white" };

const CategoryIcon: Record<string, React.ElementType> = {
  technology:        Monitor,
  business:          Briefcase,
  engineering:       Wrench,
  "health-sciences": Stethoscope,
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

export default function MajorCard({ major, view = "grid" }: Props) {
  const demand = demandConfig[major.local_demand] ?? demandConfig.medium;
  const slug = major.category?.slug ?? "";
  const theme = cardTheme;
  const Icon = CategoryIcon[slug] ?? BookOpen;
  const salaryK = major.salary_max ? `$${Math.round(major.salary_max / 1000)}k` : null;

  /* ── List view ────────────────────────────────────────────────── */
  if (view === "list") {
    return (
      <Link
        href={`/majors/${major.slug}`}
        className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-card"
      >
        {/* Icon pill */}
        <div className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl", theme.bg)}>
          <Icon className={cn("h-6 w-6", theme.iconColor)} strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">
                {major.name_en}
              </h3>
              {major.category && (
                <p className="text-xs text-gray-400 mt-0.5">{major.category.name_en}</p>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {major.is_featured && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 ring-1 ring-amber-200 px-2 py-0.5 rounded-full">
                  <GraduationCap className="h-3 w-3" />
                  Featured
                </span>
              )}
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", demand.className)}>
                {demand.label}
              </span>
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{major.overview}</p>

          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {major.duration_years}yr
            </span>
            <DifficultyBar level={major.difficulty_level} />
            {salaryK && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <TrendingUp className="h-3 w-3" />
                up to {salaryK}
              </span>
            )}
          </div>
        </div>

        <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-brand-500 transition-colors" />
      </Link>
    );
  }

  /* ── Grid card ────────────────────────────────────────────────── */
  return (
    <Link
      href={`/majors/${major.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
    >
      {/* Colored header — icon + title */}
      <div className={cn("relative px-5 pt-5 pb-4", theme.bg)}>
        {/* Subtle dot pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative flex items-start justify-between gap-3">
          {/* Icon container */}
          <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl", theme.iconBg)}>
            <Icon className={cn("h-5 w-5", theme.iconColor)} strokeWidth={1.75} />
          </div>

          {/* Featured badge */}
          {major.is_featured && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm ring-1 ring-white/30">
              <GraduationCap className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>

        {/* Major name in header */}
        <h3 className={cn("mt-3 font-bold text-base leading-snug", theme.text)}>
          {major.name_en}
        </h3>

        {/* Category label */}
        {major.category && (
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/55">
            {major.category.name_en}
          </p>
        )}
      </div>

      {/* White body — description + meta */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Overview */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {major.overview}
        </p>

        {/* Demand badge */}
        <div>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", demand.className)}>
            {demand.label}
          </span>
        </div>

        {/* Stats footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {major.duration_years} yr
            </span>
            <DifficultyBar level={major.difficulty_level} />
          </div>
          {salaryK && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {salaryK}
            </span>
          )}
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 opacity-0 transition-all group-hover:opacity-100 group-hover:bg-brand-100">
        <ArrowRight className="h-3.5 w-3.5 text-brand-600" />
      </div>
    </Link>
  );
}
