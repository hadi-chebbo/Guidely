"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMajorMentors, getPublicMajor } from "@/services/studentService";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  RefreshCw,
  Heart,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFavoriteMajors,
  getPublicMajorId,
  syncFavoriteMajorFromToggle,
  toggleFavoriteMajor,
} from "@/services/studentService";
import { useAuth } from "@/app/contexts/AuthContext";
import { MentorCard } from "@/components/mentors/MentorProfileModal";

/* ── Types ── */
interface MajorPoint { type: string; content: string }
interface MajorSkill { name: string; type?: string }
interface JobOpportunity { id: number; title_en: string; description_en?: string; demand_level?: string; scope?: string }
interface HiringCompany { slug: string; name: string; industry?: string; logo?: string }
interface University { slug: string; name_en: string; location?: string; logo?: string }
interface Faq { question: string; answer: string; sort_order: number }

const difficultyLabel: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard", very_hard: "Very Hard",
};

const demandConfig: Record<string, { label: string; className: string }> = {
  very_high: { label: "Very High Demand", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  high:      { label: "High Demand",      className: "bg-brand-50 text-brand-700 ring-1 ring-brand-200" },
  medium:    { label: "Medium Demand",    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  low:       { label: "Low Demand",       className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200" },
};

const demandPct: Record<string, number>   = { low: 25, medium: 50, high: 75, very_high: 100 };
const demandColor: Record<string, string> = { low: "bg-gray-300", medium: "bg-amber-400", high: "bg-brand-500", very_high: "bg-emerald-500" };

/* ── Sub-components ── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-brand-700"
      >
        {question}
        {open
          ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" />
          : <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />}
      </button>
      {open && <p className="pb-4 text-sm text-gray-500 leading-relaxed">{answer}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-heading text-lg font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function MajorMentorsSection({
  slug,
  onViewMentor,
}: {
  slug: string;
  onViewMentor: (username: string) => void;
}) {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["major-detail-mentors", slug],
    queryFn: () => getMajorMentors(slug, { per_page: 3 }),
    retry: false,
  });

  if (isFetching) {
    return (
      <Section title="Mentors">
        <div className="flex items-center justify-center py-8 text-sm text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-600" />
          Loading mentors...
        </div>
      </Section>
    );
  }

  if (isError || !data?.data.length) {
    return (
      <Section title="Mentors">
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <Users className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm font-semibold text-gray-900">
            No mentors available yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Approved mentors for this major will appear here.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Mentors">
      <div className="grid gap-4 sm:grid-cols-2">
        {data.data.map((mentor) => (
          <MentorCard
            key={mentor.username}
            mentor={mentor}
            onView={onViewMentor}
          />
        ))}
      </div>
    </Section>
  );
}

/* ── Skeleton — mirrors real layout ── */
function SkeletonDetail() {
  return (
    <div className="min-h-screen animate-pulse bg-gradient-to-br from-brand-50 via-white to-slate-100">
      {/* Hero skeleton */}
      <div className="bg-brand-950 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-3">
          <div className="h-5 w-24 rounded-full bg-white/20" />
          <div className="h-10 w-2/3 rounded-xl bg-white/20" />
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-4 w-full max-w-xl rounded bg-white/10" />
          <div className="h-4 w-4/5 max-w-xl rounded bg-white/10" />
          <div className="mt-4 flex gap-2">
            {[80, 100, 70, 90].map((w, i) => (
              <div key={i} className="h-6 rounded-full bg-white/20" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
      {/* Body skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {[160, 120, 200, 140].map((h, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 rounded bg-gray-100" style={{ width: "100%" }} />
                  <div className="h-4 rounded bg-gray-100" style={{ width: "80%" }} />
                  <div className="h-4 rounded bg-gray-100" style={{ width: "90%" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[100, 80, 120].map((h, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 h-5 w-24 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 rounded bg-gray-100 w-full" />
                  <div className="h-4 rounded bg-gray-100 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Error state ── */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <GraduationCap className="h-12 w-12 text-gray-300 mb-3" />
      <h2 className="font-heading text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-1 text-sm text-gray-500">Failed to load major details. Please try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

/* ── Main component ── */
interface Props {
  slug: string;
  initialData: Record<string, unknown> | null;
  error: boolean;
}

export default function MajorDetail({ slug, initialData, error: initialError }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [pendingFavorite, setPendingFavorite] = useState(false);
  const [coverImageFailed, setCoverImageFailed] = useState(false);

  const { data: major, isLoading, isError, refetch } = useQuery({
    queryKey: ["public-major", slug],
    queryFn: () => getPublicMajor(slug),
    initialData: (initialData ?? undefined) as never,
    enabled: !initialData && !initialError,
    retry: false,
  });

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ["student-favorite-majors"],
    queryFn: getFavoriteMajors,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    setCoverImageFailed(false);
  }, [major?.cover_image]);

  if (isLoading) return <SkeletonDetail />;
  if (isError || initialError) return <ErrorState onRetry={() => refetch()} />;
  if (!major) return <SkeletonDetail />;

  const pros = (major.points as MajorPoint[] ?? []).filter((p) => p.type === "pro");
  const cons = (major.points as MajorPoint[] ?? []).filter((p) => p.type === "con");
  const demand = demandConfig[major.local_demand as string] ?? demandConfig.medium;
  const salaryRange = (major.salary_min || major.salary_max)
    ? `$${Number(major.salary_min).toLocaleString()} – $${Number(major.salary_max).toLocaleString()}`
    : null;
  const category = major.category as { name_en?: string; name?: string; slug?: string; icon?: string } | null;
  const skills = major.skills as MajorSkill[] ?? [];
  const jobs = major.job_opportunities as JobOpportunity[] ?? [];
  const faqs = (major.faqs as Faq[] ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const universities = major.universities as University[] ?? [];
  const companies = major.hiring_companies as HiringCompany[] ?? [];
  const majorId = typeof major.id === "number" ? major.id : null;
  const coverImage = typeof major.cover_image === "string" && !coverImageFailed
    ? major.cover_image
    : null;
  const isFavorite = majorId
    ? favorites.some((favorite) => getPublicMajorId(favorite) === majorId)
    : false;

  const handleToggleFavorite = async () => {
    if (!majorId) return;

    setPendingFavorite(true);
    await queryClient.cancelQueries({ queryKey: ["student-favorite-majors"] });

    const previousFavorites =
      queryClient.getQueryData<typeof favorites>(["student-favorite-majors"]) ??
      favorites;

    try {
      const result = await toggleFavoriteMajor(majorId);
      const nextFavorites = await syncFavoriteMajorFromToggle(
        major,
        result.is_favorite,
      );

      queryClient.setQueryData<typeof favorites>(
        ["student-favorite-majors"],
        nextFavorites,
      );

      await queryClient.invalidateQueries({
        queryKey: ["student-favorite-majors"],
      });
      await refetchFavorites();
    } catch {
      queryClient.setQueryData(
        ["student-favorite-majors"],
        previousFavorites,
      );
    } finally {
      setPendingFavorite(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-700 to-indigo-700 px-4 py-10 sm:px-6 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />
        <Link
          href="/student/majors"
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to majors</span>
        </Link>
        <div className="relative mx-auto grid max-w-5xl gap-7 pr-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:pr-0">
          <div className="min-w-0">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20">
                {category.icon && <span>{category.icon}</span>}
                {category.name_en ?? category.name}
              </span>
            )}
            <h1 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">{String(major.name_en)}</h1>
            {major.name_ar && <p className="mt-1 text-white/50 text-sm">{String(major.name_ar)}</p>}
            {major.description && (
              <p className="mt-3 max-w-2xl text-white/70 text-base leading-relaxed">{String(major.description)}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {majorId && (
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  disabled={pendingFavorite}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-all",
                    isFavorite
                      ? "bg-rose-50 text-rose-600 ring-rose-200"
                      : "bg-white/10 text-white/75 ring-white/20 hover:bg-white/15",
                    pendingFavorite && "cursor-not-allowed opacity-60",
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} />
                  {isFavorite ? "Favorited" : "Save"}
                </button>
              )}
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", demand.className)}>
                {demand.label}
              </span>
              {major.is_featured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
                  <Star className="h-3 w-3" /> Featured
                </span>
              )}
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                <Clock className="h-3 w-3" /> {String(major.duration_years)} years
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                {difficultyLabel[String(major.difficulty_level)] ?? String(major.difficulty_level)}
              </span>
              {salaryRange && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <TrendingUp className="h-3 w-3" /> {salaryRange}
                </span>
              )}
            </div>
          </div>
          {coverImage && (
            <div className="max-w-[220px] rounded-3xl border border-white/25 bg-white/95 p-5 shadow-2xl ring-1 ring-black/5 lg:justify-self-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={String(major.name_en)}
                referrerPolicy="no-referrer"
                onError={() => setCoverImageFailed(true)}
                className="aspect-square w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main column */}
          <div className="md:col-span-2 space-y-6">
            {major.overview && (
              <Section title="Overview">
                <p className="text-sm text-gray-600 leading-relaxed">{String(major.overview)}</p>
              </Section>
            )}

            <MajorMentorsSection
              slug={slug}
              onViewMentor={(username) => router.push(`/student/mentors/${username}`)}
            />

            {(pros.length > 0 || cons.length > 0) && (
              <Section title="Pros & Cons">
                <div className="grid gap-4 sm:grid-cols-2">
                  {pros.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Pros</p>
                      {pros.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                          {p.content}
                        </div>
                      ))}
                    </div>
                  )}
                  {cons.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-red-500">Cons</p>
                      {cons.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <XCircle className="h-4 w-4 flex-shrink-0 text-red-400 mt-0.5" />
                          {p.content}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>
            )}

            {jobs.length > 0 && (
              <Section title="Job Opportunities">
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Demand</th>
                        <th className="px-4 py-3 text-left">Scope</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jobs.map((job) => {
                        const pct = demandPct[job.demand_level ?? "medium"] ?? 50;
                        const color = demandColor[job.demand_level ?? "medium"] ?? "bg-brand-500";
                        return (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 flex-shrink-0 text-brand-400" />
                                <span className="font-medium text-gray-900">{job.title_en}</span>
                              </div>
                              {job.description_en && (
                                <p className="mt-0.5 pl-5 text-xs text-gray-400 line-clamp-1">{job.description_en}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-20 rounded-full bg-gray-100">
                                  <div className={cn("h-1.5 rounded-full", color)} style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-gray-500 capitalize">
                                  {(job.demand_level ?? "medium").replace("_", " ")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 capitalize">{job.scope ?? "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {faqs.length > 0 && (
              <Section title="FAQs">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </Section>
            )}
          </div>

          {/* Side column */}
          <div className="space-y-6">
            {skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                      {s.name}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {universities.length > 0 && (
              <Section title="Universities">
                <div className="space-y-3">
                  {universities.map((u) => (
                    <div key={u.slug} className="flex items-center gap-3">
                      {u.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.logo} alt={u.name_en} className="h-8 w-8 rounded-lg object-contain border border-gray-100" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                          <Building2 className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{u.name_en}</p>
                        {u.location && (
                          <p className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" /> {u.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {companies.length > 0 && (
              <Section title="Top Hiring Companies">
                <div className="space-y-3">
                  {companies.map((c) => (
                    <div key={c.slug} className="flex items-center gap-3">
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.logo} alt={c.name} className="h-8 w-8 rounded-lg object-contain border border-gray-100" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                          <Building2 className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        {c.industry && <p className="text-xs text-gray-400">{c.industry}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
