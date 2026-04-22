"use client";

import { Search } from "lucide-react";
import Switch from "@/components/ui/Switch";
import { mockCategories } from "@/lib/mocks/majors";

export interface MajorFilters {
  search: string;
  category: string;
  difficulty: string;
  featuredOnly: boolean;
}

export const defaultMajorFilters: MajorFilters = {
  search: "",
  category: "",
  difficulty: "",
  featuredOnly: false,
};

interface MajorsFiltersProps {
  filters: MajorFilters;
  onChange: (filters: MajorFilters) => void;
}

const categoryOptions = [
  { value: "", label: "All categories" },
  ...mockCategories.map((c) => ({ value: String(c.id), label: c.name_en })),
];

const difficultyOptions = [
  { value: "", label: "All difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "very_hard", label: "Very Hard" },
];

const filterSelect =
  "rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer";

export default function MajorsFilters({ filters, onChange }: MajorsFiltersProps) {
  const set = <K extends keyof MajorFilters>(key: K, value: MajorFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search majors..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="relative">
        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className={filterSelect}
          aria-label="Filter by category"
        >
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>

      <div className="relative">
        <select
          value={filters.difficulty}
          onChange={(e) => set("difficulty", e.target.value)}
          className={filterSelect}
          aria-label="Filter by difficulty"
        >
          {difficultyOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>

      <Switch
        id="featured-filter"
        checked={filters.featuredOnly}
        onChange={(v) => set("featuredOnly", v)}
        label="Featured only"
      />
    </div>
  );
}
