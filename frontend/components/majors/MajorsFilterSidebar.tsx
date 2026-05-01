"use client";

import { useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCategories } from "@/lib/mocks/majors";
import type { DemandLevel, DifficultyLevel } from "@/types/major";

/* ── Filter shape ────────────────────────────────────────────────── */

export interface MajorFilters {
  categories: string[];   // category slugs
  demand: DemandLevel[];
  difficulty: DifficultyLevel[];
  featuredOnly: boolean;
}

export const DEFAULT_FILTERS: MajorFilters = {
  categories: [],
  demand: [],
  difficulty: [],
  featuredOnly: false,
};

export function filtersToParams(f: MajorFilters): URLSearchParams {
  const p = new URLSearchParams();
  f.categories.forEach((v) => p.append("category", v));
  f.demand.forEach((v) => p.append("demand", v));
  f.difficulty.forEach((v) => p.append("difficulty", v));
  if (f.featuredOnly) p.set("featured", "1");
  return p;
}

export function paramsToFilters(p: URLSearchParams): MajorFilters {
  return {
    categories: p.getAll("category"),
    demand: p.getAll("demand") as DemandLevel[],
    difficulty: p.getAll("difficulty") as DifficultyLevel[],
    featuredOnly: p.get("featured") === "1",
  };
}

export function activeFilterCount(f: MajorFilters): number {
  return (
    f.categories.length +
    f.demand.length +
    f.difficulty.length +
    (f.featuredOnly ? 1 : 0)
  );
}

/* ── Option data ─────────────────────────────────────────────────── */

const DEMAND_OPTIONS: { value: DemandLevel; label: string; color: string }[] = [
  { value: "very_high", label: "Very High",  color: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  { value: "high",      label: "High",       color: "bg-blue-100 text-blue-700 ring-blue-200" },
  { value: "medium",    label: "Medium",     color: "bg-amber-100 text-amber-700 ring-amber-200" },
  { value: "low",       label: "Low",        color: "bg-gray-100 text-gray-600 ring-gray-200" },
];

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string; dots: number }[] = [
  { value: "very_hard", label: "Very Hard", dots: 4 },
  { value: "hard",      label: "Hard",      dots: 3 },
  { value: "medium",    label: "Medium",    dots: 2 },
  { value: "easy",      label: "Easy",      dots: 1 },
];

/* ── Sub-components ──────────────────────────────────────────────── */

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {label}
    </p>
  );
}

function CheckRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-all",
        checked
          ? "bg-brand-50 text-brand-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      {/* custom checkbox */}
      <span
        className={cn(
          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
          checked
            ? "border-brand-600 bg-brand-600"
            : "border-gray-300 bg-white group-hover:border-brand-400"
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white stroke-[2]">
            <polyline points="1 4 3.5 6.5 9 1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

interface Props {
  filters: MajorFilters;
  onChange: (f: MajorFilters) => void;
  totalResults: number;
}

export default function MajorsFilterSidebar({ filters, onChange, totalResults }: Props) {
  const count = activeFilterCount(filters);

  const toggle = useCallback(
    <K extends keyof MajorFilters>(
      key: K,
      value: MajorFilters[K] extends boolean ? never : string
    ) => {
      const arr = filters[key] as string[];
      onChange({
        ...filters,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      });
    },
    [filters, onChange]
  );

  return (
    <aside className="flex h-fit flex-col gap-0 rounded-2xl border border-gray-100 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          {count > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 p-4">

        {/* ── Category ─────────────────────────────────────── */}
        <div>
          <SectionHeader label="Category" />
          <div className="flex flex-col gap-0.5">
            {mockCategories.map((cat) => (
              <CheckRow
                key={cat.slug}
                checked={filters.categories.includes(cat.slug)}
                onToggle={() => toggle("categories", cat.slug)}
              >
                <span className="flex-1 truncate font-medium">{cat.name_en}</span>
              </CheckRow>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* ── Demand Level ─────────────────────────────────── */}
        <div>
          <SectionHeader label="Local Demand" />
          <div className="flex flex-col gap-0.5">
            {DEMAND_OPTIONS.map((opt) => (
              <CheckRow
                key={opt.value}
                checked={filters.demand.includes(opt.value)}
                onToggle={() => toggle("demand", opt.value)}
              >
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", opt.color)}>
                  {opt.label}
                </span>
              </CheckRow>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* ── Difficulty ───────────────────────────────────── */}
        <div>
          <SectionHeader label="Difficulty" />
          <div className="flex flex-col gap-0.5">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <CheckRow
                key={opt.value}
                checked={filters.difficulty.includes(opt.value)}
                onToggle={() => toggle("difficulty", opt.value)}
              >
                <span className="flex-1 font-medium">{opt.label}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        i < opt.dots ? "bg-brand-500" : "bg-gray-200"
                      )}
                    />
                  ))}
                </span>
              </CheckRow>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* ── Featured toggle ───────────────────────────────── */}
        <div>
          <SectionHeader label="Special" />
          <button
            type="button"
            onClick={() => onChange({ ...filters, featuredOnly: !filters.featuredOnly })}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all",
              filters.featuredOnly
                ? "bg-amber-50 text-amber-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">⭐</span>
              Featured only
            </span>
            {/* pill toggle */}
            <span
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 transition-colors duration-200",
                filters.featuredOnly
                  ? "border-amber-400 bg-amber-400"
                  : "border-gray-200 bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 translate-y-[-1px] rounded-full bg-white shadow-sm transition-transform duration-200",
                  filters.featuredOnly ? "translate-x-3.5" : "translate-x-0"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Footer — result count */}
      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-400 text-center">
          {totalResults === 0
            ? "No majors match"
            : `${totalResults} major${totalResults !== 1 ? "s" : ""} found`}
        </p>
      </div>
    </aside>
  );
}
