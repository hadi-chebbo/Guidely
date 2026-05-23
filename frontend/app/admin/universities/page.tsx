"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen, Loader2, Plus, Search, Star, X } from "lucide-react";
import { universityService } from "@/services/universityService";
import type { University, UniversityMajor } from "@/types/university";
import { getMajors } from "@/services/majorsService";
import type { MajorListItem } from "@/types/major";
import {
  AdminCard,
  AdminModalFrame,
  AdminPageHeader,
  AdminPageShell,
  AdminToolbar,
} from "@/components/admin/AdminPage";
import UniversitiesTable from "@/components/admin/universities/UniversitiesTable";
import UniversityForm from "@/components/admin/universities/UniversityForm";
import Select from "@/components/ui/Select";

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

type AssignFormState = {
  major_id: string;
  credit_price_usd: string;
  total_credits: string;
  admission_requirements: string;
  language_of_instruction: string;
  has_scholarship: boolean;
  campus: string;
};

const emptyAssignForm: AssignFormState = {
  major_id: "",
  credit_price_usd: "",
  total_credits: "",
  admission_requirements: "",
  language_of_instruction: "English",
  has_scholarship: false,
  campus: "",
};

export default function UniversitiesPage() {
  const [data, setData] = useState<University[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<University | null>(null);
  const [open, setOpen] = useState(false);
  const [viewUniversity, setViewUniversity] = useState<University | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [majorsLoading, setMajorsLoading] = useState(false);
  const [universityMajors, setUniversityMajors] = useState<UniversityMajor[]>([]);
  const [availableMajors, setAvailableMajors] = useState<MajorListItem[]>([]);
  const [assignForm, setAssignForm] = useState<AssignFormState>(emptyAssignForm);
  const [assigningMajor, setAssigningMajor] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const fetchData = async (pageNum = 1) => {
    setPageLoading(true);
    try {
      const res = await universityService.getAll(pageNum);
      setData(Array.isArray(res.data) ? res.data : []);
      setPage(res.meta?.current_page ?? pageNum);
      setLastPage(res.meta?.last_page ?? 1);
      setTotal(res.meta?.total ?? 0);
    } finally {
      setPageLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleView = async (university: University) => {
    setViewUniversity(university);
    setViewOpen(true);
    setMajorsLoading(true);
    setUniversityMajors([]);
    setAssignForm(emptyAssignForm);

    try {
      const [majors, adminMajors] = await Promise.all([
        universityService.getMajors(university.id),
        getMajors({ page: 1, per_page: 100 }),
      ]);
      setUniversityMajors(majors);
      setAvailableMajors(adminMajors.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load university majors");
    } finally {
      setMajorsLoading(false);
    }
  };

  const handleAssignMajor = async () => {
    if (!viewUniversity || !assignForm.major_id) {
      toast.error("Choose a major first");
      return;
    }

    setAssigningMajor(true);
    try {
      const assigned = await universityService.assignMajor(viewUniversity.id, {
        major_id: Number(assignForm.major_id),
        credit_price_usd: assignForm.credit_price_usd
          ? Number(assignForm.credit_price_usd)
          : null,
        total_credits: assignForm.total_credits
          ? Number(assignForm.total_credits)
          : null,
        admission_requirements: assignForm.admission_requirements || null,
        language_of_instruction: assignForm.language_of_instruction || null,
        has_scholarship: assignForm.has_scholarship,
        campus: assignForm.campus || null,
      });

      setUniversityMajors((prev) => [
        assigned,
        ...prev.filter((major) => major.id !== assigned.id),
      ]);
      setAssignForm(emptyAssignForm);
      toast.success("Major assigned to university successfully");
    } catch (error: unknown) {
      console.error(error);
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to assign major to university";

      toast.error(
        message
      );
    } finally {
      setAssigningMajor(false);
    }
  };

  const handleSubmit = async (form: FormState) => {
    try {
      const payload = {
        ...form,
        founded_year: form.founded_year ? Number(form.founded_year) : null,
      };

      if (selected) {
        const updated = await universityService.update(selected.id, payload);
        setData((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        toast.success("University updated successfully");
      } else {
        const created = await universityService.create(payload);
        setData((prev) => [created, ...prev]);
        toast.success("University created successfully");
      }

      setOpen(false);
      setSelected(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    }
  };

  const filteredData = data.filter((u) => {
    const normalizedSearch = search.toLowerCase();
    const matchesSearch =
      u.name_en.toLowerCase().includes(normalizedSearch) ||
      u.name_ar?.toLowerCase().includes(normalizedSearch) ||
      u.location?.toLowerCase().includes(normalizedSearch);

    return matchesSearch && (filterType === "all" || u.type === filterType);
  });

  const isEmpty = hasLoaded && !pageLoading && filteredData.length === 0;
  const hasLocalFilters = search.trim().length > 0 || filterType !== "all";

  const handlePrev = async () => {
    if (pageLoading || page <= 1 || hasLocalFilters) return;
    await fetchData(page - 1);
  };

  const handleNext = async () => {
    if (pageLoading || page >= lastPage || hasLocalFilters) return;
    await fetchData(page + 1);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Institutions"
        title="Universities"
        description="Create, edit, and review institution records and their offered majors."
        actions={
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add University
          </button>
        }
      />

      <AdminToolbar>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "public", "private"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                filterType === type
                  ? "bg-brand-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </AdminToolbar>

      <AdminCard>
        <div className="border-b border-gray-200 px-4 py-3 text-xs font-medium text-gray-500">
          {hasLocalFilters
            ? `Showing ${filteredData.length} filtered result${filteredData.length === 1 ? "" : "s"} on this page`
            : `Showing ${filteredData.length} of ${total} universities`}
        </div>

        {pageLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 border-b border-gray-100 p-4 animate-pulse">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-8 rounded bg-gray-200" />
            </div>
          ))
        ) : isEmpty ? (
          <div className="p-10 text-center text-sm text-gray-500">No universities found</div>
        ) : (
          <UniversitiesTable
            data={filteredData}
            onEdit={(u) => {
              setSelected(u);
              setOpen(true);
            }}
            onView={(id) => {
              const university = data.find((item) => item.id === id);
              if (university) handleView(university);
            }}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-4">
          <button
            onClick={handlePrev}
            disabled={pageLoading || page <= 1 || hasLocalFilters}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={handleNext}
            disabled={pageLoading || page >= lastPage || hasLocalFilters}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </AdminCard>

      {open && (
        <AdminModalFrame className="max-w-xl p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
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
        </AdminModalFrame>
      )}

      {viewOpen && viewUniversity && (
        <AdminModalFrame className="max-w-2xl p-4 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <BookOpen className="h-3.5 w-3.5" />
                University majors
              </p>
              <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">{viewUniversity.name_en}</h2>
              <p className="mt-1 text-sm text-gray-500">{viewUniversity.location}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setViewOpen(false);
                setViewUniversity(null);
                setUniversityMajors([]);
              }}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
              aria-label="Close majors modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Assign major
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Add a major to this university with its university-specific details.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                value={assignForm.major_id}
                onChange={(event) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    major_id: event.target.value,
                  }))
                }
                placeholder="Choose major"
                searchPlaceholder="Search majors..."
                options={availableMajors.map((major) => ({
                  value: String(major.id),
                  label: major.name_en,
                }))}
              />

              <input
                value={assignForm.campus}
                onChange={(event) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    campus: event.target.value,
                  }))
                }
                placeholder="Campus"
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />

              <input
                value={assignForm.credit_price_usd}
                onChange={(event) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    credit_price_usd: event.target.value,
                  }))
                }
                type="number"
                min="0"
                placeholder="Credit price USD"
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />

              <input
                value={assignForm.total_credits}
                onChange={(event) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    total_credits: event.target.value,
                  }))
                }
                type="number"
                min="0"
                placeholder="Total credits"
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />

              <input
                value={assignForm.language_of_instruction}
                onChange={(event) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    language_of_instruction: event.target.value,
                  }))
                }
                placeholder="Language of instruction"
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />

              <label className="flex min-h-[42px] items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={assignForm.has_scholarship}
                  onChange={(event) =>
                    setAssignForm((prev) => ({
                      ...prev,
                      has_scholarship: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Has scholarship
              </label>

              <textarea
                value={assignForm.admission_requirements}
                onChange={(event) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    admission_requirements: event.target.value,
                  }))
                }
                placeholder="Admission requirements"
                className="min-h-20 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100 sm:col-span-2"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAssignMajor}
                disabled={!assignForm.major_id || assigningMajor}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assigningMajor ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Assign major
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
            {majorsLoading ? (
              <div className="space-y-3 p-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-lg bg-white" />
                ))}
              </div>
            ) : universityMajors.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No majors found for this university.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {universityMajors.map((major) => (
                  <div key={major.id} className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{major.name ?? major.name_en ?? "-"}</p>
                      <p className="mt-1 text-xs text-gray-400">{major.slug}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {major.university_data?.total_credits
                          ? `${major.university_data.total_credits} credits`
                          : `Category #${major.category_id ?? "-"}`
                        }
                      </span>
                      {major.university_data?.campus && (
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">
                          {major.university_data.campus}
                        </span>
                      )}
                      {major.is_featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <Star className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminModalFrame>
      )}
    </AdminPageShell>
  );
}
