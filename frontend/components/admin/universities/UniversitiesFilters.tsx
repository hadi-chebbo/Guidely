"use client";

import { Search } from "lucide-react";
import Switch from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

export interface UniversityFilters {
  search: string;
  type: string;
  accreditation: string;
  country: string;
  featuredOnly: boolean;
}

export const defaultUniversityFilters: UniversityFilters = {
  search: "",
  type: "",
  accreditation: "",
  country: "",
  featuredOnly: false,
};

interface UniversitiesFiltersProps {
  filters: UniversityFilters;
  onChange: (filters: UniversityFilters) => void;
}

const typeOptions = [
  { value: "", label: "All types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const accreditationOptions = [
  { value: "", label: "All statuses" },
  { value: "accredited", label: "Accredited" },
  { value: "pending", label: "Pending" },
  { value: "not_accredited", label: "Not Accredited" },
];

const filterSelect =
  "rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer";

export default function UniversitiesFilters({ filters, onChange }: UniversitiesFiltersProps) {
  const set = <K extends keyof UniversityFilters>(key: K, value: UniversityFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search universities..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="relative">
        <select
          value={filters.type}
          onChange={(e) => set("type", e.target.value)}
          className={filterSelect}
          aria-label="Filter by type"
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>

      <div className="relative">
        <select
          value={filters.accreditation}
          onChange={(e) => set("accreditation", e.target.value)}
          className={filterSelect}
          aria-label="Filter by accreditation"
        >
          {accreditationOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>

      <input
        type="text"
        placeholder="Country..."
        value={filters.country}
        onChange={(e) => set("country", e.target.value)}
        className={cn(
          "w-36 rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-3 text-sm text-gray-700 placeholder-gray-400",
          "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        )}
        aria-label="Filter by country"
      />

      <Switch
        id="featured-filter"
        checked={filters.featuredOnly}
        onChange={(v) => set("featuredOnly", v)}
        label="Featured only"
      />
    </div>
  );
}
