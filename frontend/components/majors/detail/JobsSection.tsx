import { Briefcase, MapPin, Globe, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobOpportunity, JobScope, JobDemandLevel } from "@/types/major";

/* ── Badge configs ──────────────────────────────────────────────── */

const scopeConfig: Record<
  JobScope,
  { label: string; className: string; Icon: React.ElementType }
> = {
  local: {
    label: "Local",
    className: "bg-blue-50 text-blue-600",
    Icon: MapPin,
  },
  international: {
    label: "International",
    className: "bg-purple-50 text-purple-600",
    Icon: Globe,
  },
  both: {
    label: "Local & International",
    className: "bg-indigo-50 text-indigo-600",
    Icon: Globe,
  },
};

const demandConfig: Record<JobDemandLevel, { label: string; className: string }> = {
  high:   { label: "High Demand",   className: "bg-emerald-50 text-emerald-700" },
  medium: { label: "Medium Demand", className: "bg-amber-50 text-amber-700" },
  low:    { label: "Low Demand",    className: "bg-gray-100 text-gray-500" },
};

/* ── Sub-components ─────────────────────────────────────────────── */

function ScopeBadge({ scope }: { scope: JobScope }) {
  const { label, className, Icon } = scopeConfig[scope];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      {label}
    </span>
  );
}

function DemandBadge({ level }: { level: JobDemandLevel }) {
  const { label, className } = demandConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

function JobCard({ job }: { job: JobOpportunity }) {
  const salaryK =
    job.avg_salary_usd !== null
      ? `$${Math.round(job.avg_salary_usd / 1000)}k/yr`
      : null;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm p-5",
        "hover:border-brand-200 hover:shadow-card transition-all"
      )}
    >
      {/* Top row: title block + salary */}
      <div className="flex items-start justify-between gap-3">
        {/* Title block */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm">{job.title_en}</p>
          {job.title_ar && (
            <p className="text-xs text-gray-400 mt-0.5">{job.title_ar}</p>
          )}
          {job.description_en && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {job.description_en}
            </p>
          )}
        </div>

        {/* Salary */}
        {salaryK && (
          <div className="flex-shrink-0 flex items-center gap-1 text-emerald-600 font-semibold text-sm">
            <TrendingUp className="h-4 w-4" />
            {salaryK}
          </div>
        )}
      </div>

      {/* Bottom row: scope + demand badges */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ScopeBadge scope={job.scope} />
        <DemandBadge level={job.demand_level} />
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

export default function JobsSection({ jobs }: { jobs: JobOpportunity[] }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 font-heading">
        <Briefcase className="h-5 w-5 text-brand-600" />
        Job Opportunities
      </h2>

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </section>
  );
}
