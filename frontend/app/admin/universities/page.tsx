"use client";

import { useEffect, useState } from "react";
import { universityService } from "@/services/universityService";

import type { University } from "@/types/university";
import { Search, X } from "lucide-react";
import UniversitiesTable from "@/components/admin/universities/UniversitiesTable";
import UniversityForm from "@/components/admin/universities/UniversityForm";

type FilterType = "all" | "public" | "private";

type FormState = {
  name_en: string;
  name_ar: string;
  slug: string;
  type: "public" | "private";
  location: string;
  website: string;
  logo_url: string;
  description_en: string;
  description_ar: string;
  founded_year: string;
  accreditation: string;
};

export default function UniversitiesPage() {
  const [data, setData] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<University | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await universityService.getAll();
      setData(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (form: FormState) => {
    const payload = {
      ...form,
      founded_year: form.founded_year ? Number(form.founded_year) : null,
    };

    if (selected) {
      const res = await universityService.update(selected.id, payload);
      const updated = res;

      setData((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
    } else {
      const res = await universityService.create(payload);
      const created = res;

      setData((prev) => [created, ...prev]);
    }

    setOpen(false);
    setSelected(null);
  };

  const filteredData = data.filter((u) => {
    const matchesSearch =
      u.name_en.toLowerCase().includes(search.toLowerCase()) ||
      u.name_ar?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "all" || u.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 relative overflow-hidden p-6">

      {/* BACKGROUND */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-300 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h1 className="text-4xl font-heading text-gray-900">
            Universities Management
          </h1>
          <p className="text-gray-500 text-sm">
            Create, edit, and manage all universities
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl shadow-brand transition hover:scale-[1.03]"
        >
          + Add University
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

        {/* SEARCH */}
        <div className="relative w-full md:max-w-sm">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="relative z-10 w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-100 bg-white/70 backdrop-blur text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-200 hover:border-brand-200"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

        </div>

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap">

          {(["all", "public", "private"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filterType === type
                  ? "bg-brand-600 text-white shadow-brand"
                  : "bg-white/70 border border-brand-100 text-gray-600 hover:bg-brand-50"
              }`}
            >
              {type}
            </button>
          ))}

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-card p-5 border border-brand-100 relative z-10">

        <div className="mb-3 text-xs text-gray-400">
          Showing {filteredData.length} results
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center text-brand-600">
            Loading...
          </div>
        ) : (
          <UniversitiesTable
            data={filteredData}
            onEdit={(u) => {
              setSelected(u);
              setOpen(true);
            }}
            onView={(id) => console.log(id)}
          />
        )}

      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-card p-6 animate-slide-up border border-brand-100">

            <h2 className="text-xl font-heading mb-4 text-gray-900">
              {selected ? "Edit University Details" : "Create New University"}
            </h2>

            <UniversityForm
              initialData={selected}
              onSubmit={handleSubmit}
              onClose={() => {
                setOpen(false);
                setSelected(null);
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}