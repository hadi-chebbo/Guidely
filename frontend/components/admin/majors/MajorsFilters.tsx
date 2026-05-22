"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import Switch from "@/components/ui/Switch";
import Select from "@/components/ui/Select";
import SearchableDropdown, {
  type SearchableDropdownOption,
} from "@/components/ui/SearchableDropdown";
import { AdminToolbar } from "@/components/admin/AdminPage";
import type { StudentCategory } from "@/services/studentService";
import { loadCategoryOptions } from "@/services/dropdownOptions";

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

export default function MajorsFilters({ filters, onChange }: MajorsFiltersProps) {
  const [categoryOption, setCategoryOption] =
    useState<SearchableDropdownOption<StudentCategory> | null>(null);

  const set = <K extends keyof MajorFilters>(key: K, value: MajorFilters[K]) =>
    onChange({ ...filters, [key]: value });

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
        <div className="w-full sm:w-48">
          <SearchableDropdown<StudentCategory>
            value={filters.category}
            onChange={(value, option) => {
              setCategoryOption(option ?? null);
              set("category", value);
            }}
            placeholder="All categories"
            searchPlaceholder="Search categories..."
            emptyMessage="No categories found."
            clearable
            selectedOption={
              categoryOption ??
              (filters.category
                ? { value: filters.category, label: `Category #${filters.category}` }
                : null)
            }
            loadOptions={loadCategoryOptions}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={filters.difficulty}
            onChange={(event) => set("difficulty", event.target.value)}
            aria-label="Filter by difficulty"
            options={difficultyOptions}
          />
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
