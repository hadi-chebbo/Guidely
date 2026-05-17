"use client";

import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Switch from "@/components/ui/Switch";
import { AdminToolbar } from "@/components/admin/AdminPage";
import { mockCategories } from "@/lib/mocks/majors";
import { getCategories } from "@/services/studentService";

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

const difficultyOptions = [
  { value: "", label: "All difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "very_hard", label: "Very Hard" },
];

const filterSelect =
  "rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-300";

export default function MajorsFilters({ filters, onChange }: MajorsFiltersProps) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const set = <K extends keyof MajorFilters>(key: K, value: MajorFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...(categories?.length ? categories : mockCategories).map((category) => ({
      value: String(category.id),
      label: category.name_en,
    })),
  ];

  return (
    <AdminToolbar>
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search majors..."
          value={filters.search}
          onChange={(event) => set("search", event.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => set("search", "")}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <select
            value={filters.category}
            onChange={(event) => set("category", event.target.value)}
            className={filterSelect}
            aria-label="Filter by category"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            v
          </span>
        </div>

        <div className="relative">
          <select
            value={filters.difficulty}
            onChange={(event) => set("difficulty", event.target.value)}
            className={filterSelect}
            aria-label="Filter by difficulty"
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            v
          </span>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <Switch
            id="featured-filter"
            checked={filters.featuredOnly}
            onChange={(value) => set("featuredOnly", value)}
            label="Featured only"
          />
        </div>
      </div>
    </AdminToolbar>
  );
}
