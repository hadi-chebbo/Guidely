"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  Building2,
  CalendarDays,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Languages,
  Loader2,
  MapPin,
  Search,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import Modal from "@/components/ui/Modal";
import {
  getPublicUniversity,
  getPublicUniversities,
  type PublicUniversityItem,
} from "@/services/studentService";

const PAGE_SIZE = 12;

const getLogoSrc = (university: PublicUniversityItem) => {
  const rawLogo = university.logo ?? university.logo_url;
  if (!rawLogo) return null;
  if (/^https?:\/\//i.test(rawLogo)) return rawLogo;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiOrigin = apiUrl?.replace(/\/api\/?.*$/i, "").replace(/\/$/, "");
  const normalizedPath = rawLogo.startsWith("/") ? rawLogo : `/${rawLogo}`;

  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath;
};

const formatMoney = (value: unknown) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return `$${amount.toLocaleString()}`;
};

function UniversityLogo({ university }: { university: PublicUniversityItem }) {
  const logoSrc = getLogoSrc(university);

  if (logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoSrc}
        alt={university.name_en}
        className="h-12 w-12 rounded-lg border border-gray-100 bg-white object-contain p-1"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
      <Building2 className="h-6 w-6" />
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function UniversityDetailsModal({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const { data: university, isFetching, isError } = useQuery({
    queryKey: ["public-university-detail", slug],
    queryFn: () => getPublicUniversity(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });

  const logoSrc = university ? getLogoSrc(university) : null;
  const totalCost =
    university?.total_credits && university?.credit_price_usd
      ? formatMoney(Number(university.total_credits) * Number(university.credit_price_usd))
      : null;

  return (
    <Modal
      open={Boolean(slug)}
      onClose={onClose}
      size="xl"
      title={university?.name_en ?? "University details"}
      description={university?.location}
    >
      {isFetching ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-gray-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-brand-600" />
          Loading university details...
        </div>
      ) : isError || !university ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          University details could not be loaded. Please try again.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-5 rounded-lg bg-gradient-to-br from-brand-50 to-white p-5 sm:flex-row sm:items-center">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={university.name_en}
                className="h-24 w-24 rounded-lg border border-white bg-white object-contain p-2 shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                <Building2 className="h-10 w-10" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-brand-700 ring-1 ring-brand-100">
                  {university.type}
                </span>
                {university.language_of_instruction && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 ring-1 ring-gray-100">
                    {university.language_of_instruction}
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                {university.name_en}
              </h2>
              {university.name_ar && (
                <p className="mt-1 text-sm text-gray-500">{university.name_ar}</p>
              )}
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-600">
                <MapPin className="h-4 w-4 text-brand-500" />
                {university.location}
              </p>
            </div>
          </div>

          {university.description_en && (
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400">Overview</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {university.description_en}
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem icon={CalendarDays} label="Founded" value={university.founded_year} />
            <DetailItem icon={CreditCard} label="Credit price" value={formatMoney(university.credit_price_usd)} />
            <DetailItem icon={GraduationCap} label="Total credits" value={university.total_credits} />
            <DetailItem icon={Languages} label="Language" value={university.language_of_instruction} />
          </div>

          {(university.accreditation || totalCost || university.website) && (
            <div className="grid gap-3 md:grid-cols-3">
              <DetailItem icon={ShieldCheck} label="Accreditation" value={university.accreditation} />
              <DetailItem icon={CreditCard} label="Estimated cost" value={totalCost} />
              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-brand-700 transition hover:border-brand-200 hover:bg-brand-50"
                >
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-gray-400">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Website
                  </span>
                  Visit official site
                </a>
              )}
            </div>
          )}

          {university.majors?.length ? (
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400">Available majors</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {university.majors.map((major) => (
                  <span
                    key={major.slug}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
                  >
                    {major.name_en}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <Link
              href="/student/compare"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-950 px-4 text-sm font-bold text-white shadow-brand transition hover:bg-brand-700"
              onClick={onClose}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Compare universities
            </Link>
            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function UniversityCard({
  university,
  onViewDetails,
}: {
  university: PublicUniversityItem;
  onViewDetails: (slug: string) => void;
}) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      <div className="flex items-start gap-3">
        <UniversityLogo university={university} />
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-base font-bold text-gray-900">
            {university.name_en}
          </h2>
          {university.name_ar && (
            <p className="mt-0.5 text-xs text-gray-400">
              {university.name_ar}
            </p>
          )}
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase text-gray-600">
          {university.type}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-500">
        {university.description_en ||
          "Explore programs, location, tuition signals, and academic details for this university."}
      </p>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-brand-500" />
          <span className="line-clamp-1">{university.location}</span>
        </div>
        {university.founded_year && (
          <div className="flex items-center gap-2 text-gray-600">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Founded {university.founded_year}</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {university.language_of_instruction && (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {university.language_of_instruction}
          </span>
        )}
        {university.majors?.length ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {university.majors.length} majors
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        <button
          type="button"
          onClick={() => onViewDetails(university.slug)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View details
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <Link
          href="/student/compare"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          Compare
          <ArrowRightLeft className="h-3.5 w-3.5" />
        </Link>
        {university.website && (
          <a
            href={university.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function StudentUniversitiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | "public" | "private">("all");
  const [detailsSlug, setDetailsSlug] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-universities", page, debouncedSearch, type],
    queryFn: () =>
      getPublicUniversities({
        page,
        per_page: PAGE_SIZE,
        search: debouncedSearch || undefined,
        type: type === "all" ? undefined : type,
      }),
  });

  const universities = useMemo(() => data?.data ?? [], [data?.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-700 to-indigo-700 px-6 py-12">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20">
              <Building2 className="h-3.5 w-3.5" />
              University explorer
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Find universities that fit your plans
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
              Browse university profiles by location and type, then compare
              shortlisted options from the Compare page.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or location"
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value as "all" | "public" | "private");
                setPage(1);
              }}
              className="h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="all">All types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <div className="flex h-12 items-center gap-2 rounded-lg bg-gray-50 px-4 text-sm font-semibold text-gray-600">
              <SlidersHorizontal className="h-4 w-4" />
              {data?.meta.total ?? 0} results
            </div>
          </div>
        </section>

        {isError ? (
          <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
            Universities could not be loaded. Please check your session and try
            again.
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-lg border border-gray-100 bg-white shadow-sm"
              />
            ))}
          </div>
        ) : universities.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {universities.map((university) => (
              <UniversityCard
                key={university.slug}
                university={university}
                onViewDetails={setDetailsSlug}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <SearchX className="mx-auto h-10 w-10 text-gray-300" />
            <h2 className="mt-3 text-lg font-bold text-gray-900">
              No universities found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Adjust your search or type filter.
            </p>
          </div>
        )}

        {data && data.meta.last_page > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-600">
              Page {data.meta.current_page} of {data.meta.last_page}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(data.meta.last_page, current + 1))
              }
              disabled={page === data.meta.last_page}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <UniversityDetailsModal
        slug={detailsSlug}
        onClose={() => setDetailsSlug(null)}
      />
    </div>
  );
}
