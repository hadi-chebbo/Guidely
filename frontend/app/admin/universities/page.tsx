"use client";
import { toast } from "sonner";
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
  const [pageLoading, setPageLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [selected, setSelected] = useState<University | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const fetchData = async () => {
    setPageLoading(true);
    try {
      const res = await universityService.getAll();
      setData(Array.isArray(res.data) ? res.data : []);
    } finally {
      setPageLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (form: FormState) => {
  try {
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

      toast.success("University updated successfully ✅");
    } else {
      const res = await universityService.create(payload);
      const created = res;

      setData((prev) => [created, ...prev]);

      toast.success("University created successfully 🎉");
    }

    setOpen(false);
    setSelected(null);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again ❌");
  }
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

  const isEmpty =
    hasLoaded && !pageLoading && filteredData.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 relative overflow-hidden p-6">

      {/* background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-300 rounded-full blur-3xl opacity-30" />

      {/* header */}
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

      {/* search + filter */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

        <div className="relative w-full md:max-w-sm">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none z-10" />

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search universities..."
    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-100 bg-white/80 backdrop-blur text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
  />

  {search && (
    <button
      onClick={() => setSearch("")}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
    >
      <X className="h-4 w-4" />
    </button>
  )}
</div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "public", "private"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filterType === type
                  ? "bg-brand-600 text-white"
                  : "bg-white/70 border border-brand-100 text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-card border border-brand-100 overflow-hidden relative z-10">

        <div className="p-4 text-xs text-gray-400">
          Showing {filteredData.length} results
        </div>

        {pageLoading ? (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 p-4 border-b animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-8 ml-auto" />
            </div>
          ))
        ) : isEmpty ? (
          <div className="p-6 text-center text-gray-500">
            No universities found
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

      {/* modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-card p-6 border border-brand-100">

            <h2 className="text-xl font-heading mb-4">
              {selected ? "Edit University" : "Create University"}
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