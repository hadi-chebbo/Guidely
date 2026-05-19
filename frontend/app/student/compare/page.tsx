"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  Award,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  Languages,
  Loader2,
  MapPin,
  SearchX,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  comparePublicMajors,
  comparePublicUniversities,
  getPublicMajors,
  getPublicUniversities,
  type MajorComparisonResponse,
  type PublicMajorItem,
  type PublicUniversityItem,
  type UniversityComparisonResponse,
} from "@/services/studentService";

type CompareMode = "majors" | "universities";

const formatText = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? "Not available"
    : String(value).replace(/_/g, " ");

const formatMoney = (value: unknown) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Not available";
  return `$${amount.toLocaleString()}`;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && value !== "";

const pickStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];

const pickObjects = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

const formatCompactMoney = (value: unknown) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: amount >= 10000 ? "compact" : "standard",
  }).format(amount);
};

const getCostTone = (
  value: unknown,
  peer?: unknown,
): "low" | "medium" | "high" | "neutral" => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "neutral";

  const peerAmount = Number(peer);
  if (Number.isFinite(peerAmount) && peerAmount > 0) {
    if (amount < peerAmount) return "low";
    if (amount > peerAmount) return "high";
    return "medium";
  }

  if (amount < 10000) return "low";
  if (amount > 30000) return "high";
  return "medium";
};

const getDemandTone = (
  value: unknown,
): "low" | "medium" | "high" | "neutral" => {
  const demand = String(value ?? "").toLowerCase();
  if (demand === "high" || demand === "very_high") return "low";
  if (demand === "medium") return "medium";
  if (demand === "low") return "high";
  return "neutral";
};

const getSalaryTone = (
  value: unknown,
  peer?: unknown,
): "low" | "medium" | "high" | "neutral" => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "neutral";

  const peerAmount = Number(peer);
  if (Number.isFinite(peerAmount) && peerAmount > 0) {
    if (amount > peerAmount) return "low";
    if (amount < peerAmount) return "high";
    return "medium";
  }

  if (amount >= 5000) return "low";
  if (amount < 1500) return "high";
  return "medium";
};

const toneStyles = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-rose-200 bg-rose-50 text-rose-800",
  neutral: "border-gray-200 bg-gray-50 text-gray-700",
};

const toneLabels = {
  low: "Low cost",
  medium: "Medium cost",
  high: "High cost",
  neutral: "Cost N/A",
};

function InfoPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
        toneStyles[tone],
      )}
    >
      {label}
    </span>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-3 shadow-sm",
        tone ? toneStyles[tone] : "border-gray-100",
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold text-gray-950">{value}</div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h3 className="text-base font-extrabold text-gray-950">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function CompareTabs({
  mode,
  onChange,
}: {
  mode: CompareMode;
  onChange: (mode: CompareMode) => void;
}) {
  const tabs = [
    { value: "majors" as const, label: "Majors", icon: GraduationCap },
    { value: "universities" as const, label: "Universities", icon: Building2 },
  ];

  return (
    <div className="inline-flex rounded-lg border border-white/20 bg-white/10 p-1 backdrop-blur">
      {tabs.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition",
            mode === value
              ? "bg-white text-brand-700 shadow-sm"
              : "text-white/70 hover:bg-white/10 hover:text-white",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

function SelectField<T extends { slug: string; name_en: string }>({
  label,
  value,
  onChange,
  options,
  exclude,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: T[];
  exclude: string;
  placeholder: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold uppercase text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.slug}
            value={option.slug}
            disabled={option.slug === exclude}
          >
            {option.name_en}
          </option>
        ))}
      </select>
    </label>
  );
}

function SwapButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-gray-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={label}
      title={label}
    >
      <ArrowRightLeft className="h-5 w-5" />
    </button>
  );
}

function StatusPanel({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
      <Icon className="mx-auto h-10 w-10 text-gray-300" />
      <h2 className="mt-3 text-lg font-bold text-gray-900">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
        {children}
      </p>
    </div>
  );
}

function TokenList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      {items.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">No matching items returned.</p>
      )}
    </div>
  );
}

function MajorProfileCard({
  major,
  comparison,
  peerComparison,
  sideLabel,
}: {
  major: PublicMajorItem;
  comparison: Record<string, unknown>;
  peerComparison: Record<string, unknown>;
  sideLabel: string;
}) {
  const skills = pickStrings(comparison.skills).length
    ? pickStrings(comparison.skills)
    : major.skills?.map((skill) => skill.name).filter(Boolean) ?? [];
  const universities = pickStrings(comparison.universities);
  const overview = major.overview ?? major.description;
  const salaryMin = comparison.salary_min ?? major.salary_min;
  const salaryMax = comparison.salary_max ?? major.salary_max;
  const peerSalaryMin = peerComparison.salary_min;
  const peerSalaryMax = peerComparison.salary_max;
  const difficulty = comparison.difficulty ?? major.difficulty_level;

  return (
    <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-br from-white via-white to-brand-50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-brand-700">
                {sideLabel}
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-gray-950">
                {major.name_en}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {formatText(comparison.category ?? major.category?.name_en)}
              </p>
            </div>
          </div>
          <InfoPill label={formatText(difficulty)} />
        </div>

        {overview && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
            {overview}
          </p>
        )}
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailTile
            icon={CircleDollarSign}
            label="Salary minimum"
            value={formatCompactMoney(salaryMin)}
            tone={getSalaryTone(salaryMin, peerSalaryMin)}
          />
          <DetailTile
            icon={TrendingUp}
            label="Salary maximum"
            value={formatCompactMoney(salaryMax)}
            tone={getSalaryTone(salaryMax, peerSalaryMax)}
          />
          <DetailTile
            icon={Clock3}
            label="Duration"
            value={`${major.duration_years || "N/A"} years`}
          />
          <DetailTile
            icon={TrendingUp}
            label="Local demand"
            value={formatText(major.local_demand)}
            tone={getDemandTone(major.local_demand)}
          />
          <DetailTile
            icon={Sparkles}
            label="International"
            value={formatText(major.international_demand)}
            tone={getDemandTone(major.international_demand)}
          />
        </div>

        <div>
          <h4 className="text-sm font-extrabold text-gray-950">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.length ? (
              skills.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-100"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No skills listed.</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-extrabold text-gray-950">
            Universities offering this major
          </h4>
          <div className="mt-2 grid gap-2">
            {universities.length ? (
              universities.slice(0, 6).map((university) => (
                <div
                  key={university}
                  className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700"
                >
                  <Building2 className="h-4 w-4 text-brand-600" />
                  {university}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No university list returned for this major.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function MajorResult({
  data,
  selected,
}: {
  data: MajorComparisonResponse;
  selected: PublicMajorItem[];
}) {
  const sideA = data.comparison?.A ?? {};
  const sideB = data.comparison?.B ?? {};
  const analysis = data.analysis ?? {};
  const skills = (analysis.skills ?? {}) as Record<string, unknown>;
  const universities = (analysis.universities ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {selected[0] && (
          <MajorProfileCard
            major={selected[0]}
            comparison={sideA}
            peerComparison={sideB}
            sideLabel="First major"
          />
        )}
        {selected[1] && (
          <MajorProfileCard
            major={selected[1]}
            comparison={sideB}
            peerComparison={sideA}
            sideLabel="Second major"
          />
        )}
      </div>

      <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={Sparkles}
          title="Skills and university overlap"
          subtitle="Shared items show common ground, while unique items highlight what makes each major different."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <TokenList title="Shared skills" items={pickStrings(skills.shared)} />
          <TokenList
            title={`Only ${selected[0]?.name_en ?? "first"}`}
            items={pickStrings(skills.only_A)}
          />
          <TokenList
            title={`Only ${selected[1]?.name_en ?? "second"}`}
            items={pickStrings(skills.only_B)}
          />
        </div>
        <div className="mt-4">
          <TokenList
            title="Universities offering both"
            items={pickStrings(universities.shared)}
          />
        </div>
      </section>
    </div>
  );
}

function UniversityLogo({ university }: { university: PublicUniversityItem }) {
  if (university.logo || university.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={university.logo ?? university.logo_url ?? ""}
        alt={university.name_en}
        className="h-11 w-11 rounded-lg border border-gray-100 bg-white object-contain p-1"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
      <Building2 className="h-5 w-5" />
    </div>
  );
}

function ComparisonRow({
  label,
  first,
  second,
}: {
  label: string;
  first: unknown;
  second: unknown;
}) {
  return (
    <div className="grid min-w-[620px] grid-cols-[150px_1fr_1fr] overflow-hidden rounded-lg border border-gray-100 bg-white text-sm shadow-sm">
      <div className="bg-gray-50 p-3 font-semibold text-gray-600">{label}</div>
      <div className="border-l border-gray-100 p-3 text-gray-900">
        {formatText(first)}
      </div>
      <div className="border-l border-gray-100 p-3 text-gray-900">
        {formatText(second)}
      </div>
    </div>
  );
}

function OptionalDetailTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  tone?: keyof typeof toneStyles;
}) {
  if (!hasValue(value)) return null;

  return <DetailTile icon={icon} label={label} value={value} tone={tone} />;
}

function CostBadge({
  value,
  peer,
}: {
  value: unknown;
  peer?: unknown;
}) {
  const tone = getCostTone(value, peer);

  return (
    <div
      className={cn(
        "inline-flex flex-col rounded-lg border px-3 py-2",
        toneStyles[tone],
      )}
    >
      <span className="text-[10px] font-black uppercase tracking-wide">
        {toneLabels[tone]}
      </span>
      <span className="text-sm font-extrabold">{formatMoney(value)}</span>
    </div>
  );
}

function UniversityProfileCard({
  university,
  details,
  sideLabel,
}: {
  university: PublicUniversityItem;
  details?: Record<string, unknown>;
  sideLabel: string;
}) {
  const description =
    (details?.description_en as string | null | undefined) ??
    university.description_en ??
    (details?.description_ar as string | null | undefined) ??
    university.description_ar;
  const foundedYear = details?.founded_year ?? university.founded_year;
  const accreditation = details?.accreditation ?? university.accreditation;
  const website = details?.website ?? university.website;
  const facts = [
    {
      icon: Award,
      label: "Founded",
      value: foundedYear,
    },
    {
      icon: ShieldCheck,
      label: "Accreditation",
      value: accreditation,
    },
    {
      icon: Building2,
      label: "Website",
      value: website,
    },
  ].filter((fact) => hasValue(fact.value));

  return (
    <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-br from-white via-white to-sky-50 p-5">
        <div className="flex items-start gap-3">
          <UniversityLogo university={university} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase text-brand-700">
              {sideLabel}
            </p>
            <h2 className="mt-1 line-clamp-2 text-xl font-extrabold text-gray-950">
              {university.name_en}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {formatText(details?.location ?? university.location)}
            </p>
          </div>
          <InfoPill label={formatText(details?.type ?? university.type)} />
        </div>

        {description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
            {description}
          </p>
        )}
      </div>

      {facts.length > 0 && (
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {facts.map(({ icon, label, value }) => (
            <DetailTile
              key={label}
              icon={icon}
              label={label}
              value={formatText(value)}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function CommonMajorCard({
  item,
  firstName,
  secondName,
}: {
  item: Record<string, unknown>;
  firstName: string;
  secondName: string;
}) {
  const major = (item.major ?? {}) as Record<string, unknown>;
  const uniA = (item.university_a ?? {}) as Record<string, unknown>;
  const uniB = (item.university_b ?? {}) as Record<string, unknown>;
  const itemComparison = (item.comparison ?? {}) as Record<string, unknown>;
  const firstTotalCost = uniA.estimated_total_cost;
  const secondTotalCost = uniB.estimated_total_cost;

  return (
    <article className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg font-extrabold text-gray-950">
            {formatText(major.name)}
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Cost, credits, campus, scholarship, and language by university.
          </p>
        </div>
        <InfoPill
          label={`Difference ${formatMoney(itemComparison.total_cost_difference)}`}
          tone="medium"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {[
          {
            name: firstName,
            data: uniA,
            peer: secondTotalCost,
          },
          {
            name: secondName,
            data: uniB,
            peer: firstTotalCost,
          },
        ].map(({ name, data, peer }, index) => {
          const totalCost = data.estimated_total_cost;
          const isLower =
            Number(totalCost) > 0 &&
            Number(peer) > 0 &&
            Number(totalCost) < Number(peer);

          return (
            <div
              key={`${name}-${index}`}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h5 className="font-extrabold text-gray-950">{name}</h5>
                {isLower && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    <Check className="h-3.5 w-3.5" />
                    Lower cost
                  </span>
                )}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase text-gray-500">
                    Estimated total
                  </p>
                  <div className="mt-1">
                    <CostBadge value={totalCost} peer={peer} />
                  </div>
                </div>
                <OptionalDetailTile
                  icon={CircleDollarSign}
                  label="Credit price"
                  value={
                    hasValue(data.credit_price_usd)
                      ? formatMoney(data.credit_price_usd)
                      : null
                  }
                  tone={getCostTone(data.credit_price_usd)}
                />
                <OptionalDetailTile
                  icon={BookOpen}
                  label="Credits"
                  value={
                    hasValue(data.total_credits)
                      ? formatText(data.total_credits)
                      : null
                  }
                />
                <OptionalDetailTile
                  icon={Languages}
                  label="Language"
                  value={
                    hasValue(data.language_of_instruction)
                      ? formatText(data.language_of_instruction)
                      : null
                  }
                />
                <OptionalDetailTile
                  icon={MapPin}
                  label="Campus"
                  value={hasValue(data.campus) ? formatText(data.campus) : null}
                />
                <DetailTile
                  icon={Award}
                  label="Scholarship"
                  value={data.has_scholarship ? "Available" : "Not listed"}
                  tone={data.has_scholarship ? "low" : "neutral"}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function UniqueMajorsPanel({
  title,
  items,
}: {
  title: string;
  items: Record<string, unknown>[];
}) {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <SectionHeader
        icon={Sparkles}
        title={title}
        subtitle="Programs available only at this university in the selected pair."
      />
      {items.length ? (
        <div className="grid gap-3">
          {items.map((major, index) => {
            const creditPrice = major.credit_price_usd;
            const totalCredits = major.total_credits;
            const totalCost =
              Number(creditPrice) > 0 && Number(totalCredits) > 0
                ? Number(creditPrice) * Number(totalCredits)
                : null;

            return (
              <div
                key={`${formatText(major.slug ?? major.name)}-${index}`}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <h4 className="font-extrabold text-gray-950">
                  {formatText(major.name)}
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <OptionalDetailTile
                    icon={CircleDollarSign}
                    label="Credit price"
                    value={hasValue(creditPrice) ? formatMoney(creditPrice) : null}
                    tone={getCostTone(creditPrice)}
                  />
                  <OptionalDetailTile
                    icon={BookOpen}
                    label="Credits"
                    value={hasValue(totalCredits) ? formatText(totalCredits) : null}
                  />
                  <OptionalDetailTile
                    icon={TrendingUp}
                    label="Estimated total"
                    value={hasValue(totalCost) ? formatMoney(totalCost) : null}
                    tone={getCostTone(totalCost)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No unique majors were returned for this university.
        </p>
      )}
    </section>
  );
}

function UniversityResult({
  data,
  selected,
}: {
  data: UniversityComparisonResponse;
  selected: PublicUniversityItem[];
}) {
  const comparison = data.comparison ?? {};
  const basicInfo = (comparison.basic_info ?? {}) as Record<
    string,
    Record<string, unknown>
  >;
  const commonMajors = pickObjects(comparison.common_majors);
  const uniqueMajors = (comparison.unique_majors ?? {}) as Record<
    string,
    unknown
  >;
  const firstUniversity = (data.university_a ?? data.university_1 ?? {}) as Record<
    string,
    unknown
  >;
  const secondUniversity = (data.university_b ?? data.university_2 ?? {}) as Record<
    string,
    unknown
  >;
  const profileRows = [
    {
      label: "Type",
      first: basicInfo.type?.a,
      second: basicInfo.type?.b,
    },
    {
      label: "Location",
      first: basicInfo.location?.a,
      second: basicInfo.location?.b,
    },
    {
      label: "Founded",
      first: basicInfo.founded_year?.a,
      second: basicInfo.founded_year?.b,
    },
    {
      label: "Accreditation",
      first: basicInfo.accreditation?.a,
      second: basicInfo.accreditation?.b,
    },
  ].filter((row) => hasValue(row.first) || hasValue(row.second));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {selected[0] && (
          <UniversityProfileCard
            university={selected[0]}
            details={firstUniversity}
            sideLabel="First university"
          />
        )}
        {selected[1] && (
          <UniversityProfileCard
            university={selected[1]}
            details={secondUniversity}
            sideLabel="Second university"
          />
        )}
      </div>

      <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={Building2}
          title="University profile comparison"
          subtitle="Core institutional details shown side by side."
        />
        <div className="overflow-x-auto">
          {profileRows.length ? (
            <div className="space-y-2">
              {profileRows.map((row) => (
                <ComparisonRow
                  key={row.label}
                  label={row.label}
                  first={row.first}
                  second={row.second}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No extra profile fields were returned for this pair.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={GraduationCap}
          title="Common majors with full cost signals"
          subtitle="Green means lower cost, red means higher cost, and amber means similar or medium cost."
        />
        {commonMajors.length ? (
          <div className="space-y-4">
            {commonMajors.map((item, index) => (
              <CommonMajorCard
                key={`${formatText((item.major as Record<string, unknown>)?.name)}-${index}`}
                item={item}
                firstName={selected[0]?.name_en ?? "First university"}
                secondName={selected[1]?.name_en ?? "Second university"}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No common majors were returned for these universities.
          </p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <UniqueMajorsPanel
          title={`Unique to ${selected[0]?.name_en ?? "first"}`}
          items={pickObjects(uniqueMajors.university_a)}
        />
        <UniqueMajorsPanel
          title={`Unique to ${selected[1]?.name_en ?? "second"}`}
          items={pickObjects(uniqueMajors.university_b)}
        />
      </div>
    </div>
  );
}

function MajorComparePanel() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["compare-majors-source"],
    queryFn: () => getPublicMajors({ per_page: 100, page: 1 }),
  });

  const majors = useMemo(() => {
    if (!data) return [];
    return [...data.recommended, ...data.featured, ...data.others.data]
      .filter(
        (major, index, all) =>
          all.findIndex((item) => item.slug === major.slug) === index,
      )
      .sort((a, b) => a.name_en.localeCompare(b.name_en));
  }, [data]);

  const selected = [first, second]
    .map((slug) => majors.find((major) => major.slug === slug))
    .filter((major): major is PublicMajorItem => Boolean(major));
  const canCompare = Boolean(first && second && first !== second);

  const {
    data: comparison,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["major-comparison", first, second],
    queryFn: () => comparePublicMajors([first, second]),
    enabled: canCompare,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Compare majors</h2>
            <p className="text-sm text-gray-500">
              Review career fit, salary range, skills, and university overlap.
            </p>
          </div>
          {isFetching && <Loader2 className="h-5 w-5 animate-spin text-brand-600" />}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
          <SelectField
            label="First major"
            value={first}
            onChange={setFirst}
            options={majors}
            exclude={second}
            placeholder="Choose a major"
          />
          <SwapButton
            label="Swap majors"
            disabled={!first && !second}
            onClick={() => {
              setFirst(second);
              setSecond(first);
            }}
          />
          <SelectField
            label="Second major"
            value={second}
            onChange={setSecond}
            options={majors}
            exclude={first}
            placeholder="Choose a major"
          />
        </div>
      </section>

      {isLoading ? (
        <StatusPanel icon={Loader2} title="Loading majors">
          Preparing the comparison options.
        </StatusPanel>
      ) : !canCompare ? (
        <StatusPanel icon={SearchX} title="Select two majors">
          Pick two different majors to compare salary range, difficulty, shared
          skills, and university availability.
        </StatusPanel>
      ) : isError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          Comparison could not be loaded. Make sure both majors are available
          and try again.
        </div>
      ) : isFetching ? (
        <StatusPanel icon={Loader2} title="Building comparison">
          Pulling together the latest major data.
        </StatusPanel>
      ) : comparison ? (
        <MajorResult data={comparison} selected={selected} />
      ) : null}

      {comparison && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Use the shared skills and university overlap to shortlist paths
              that fit both your interests and realistic study options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function UniversityComparePanel() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["compare-universities-source"],
    queryFn: () => getPublicUniversities({ per_page: 50, page: 1 }),
  });

  const universities = useMemo(
    () => [...(data?.data ?? [])].sort((a, b) => a.name_en.localeCompare(b.name_en)),
    [data?.data],
  );
  const selected = [first, second]
    .map((slug) => universities.find((university) => university.slug === slug))
    .filter((university): university is PublicUniversityItem => Boolean(university));
  const canCompare = Boolean(first && second && first !== second);

  const {
    data: comparison,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["university-comparison", first, second],
    queryFn: () => comparePublicUniversities([first, second]),
    enabled: canCompare,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Compare universities
            </h2>
            <p className="text-sm text-gray-500">
              Inspect program overlap, estimated cost differences, location, and
              accreditation.
            </p>
          </div>
          {isFetching && <Loader2 className="h-5 w-5 animate-spin text-brand-600" />}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
          <SelectField
            label="First university"
            value={first}
            onChange={setFirst}
            options={universities}
            exclude={second}
            placeholder="Choose a university"
          />
          <SwapButton
            label="Swap universities"
            disabled={!first && !second}
            onClick={() => {
              setFirst(second);
              setSecond(first);
            }}
          />
          <SelectField
            label="Second university"
            value={second}
            onChange={setSecond}
            options={universities}
            exclude={first}
            placeholder="Choose a university"
          />
        </div>
      </section>

      {isLoading ? (
        <StatusPanel icon={Loader2} title="Loading universities">
          Preparing the comparison options.
        </StatusPanel>
      ) : !canCompare ? (
        <StatusPanel icon={SearchX} title="Select two universities">
          Choose two different universities to compare program overlap, tuition
          signals, and academic profile.
        </StatusPanel>
      ) : isError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          Comparison could not be loaded. Try another university pair.
        </div>
      ) : isFetching ? (
        <StatusPanel icon={Loader2} title="Building comparison">
          Pulling together university and program cost data.
        </StatusPanel>
      ) : comparison ? (
        <UniversityResult data={comparison} selected={selected} />
      ) : null}

      {comparison && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Compare common majors first, then use total cost, credit price,
              language, and campus details to narrow your shortlist.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentComparePage() {
  const [mode, setMode] = useState<CompareMode>("majors");

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-700 to-indigo-700 px-6 py-12">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.05]" />
        <div className="relative mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 ring-1 ring-white/20">
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Student comparison
          </span>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Compare your strongest options
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
                Evaluate majors and universities side by side using Guidely data
                before you commit to a shortlist.
              </p>
            </div>
            <CompareTabs mode={mode} onChange={setMode} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {mode === "majors" ? <MajorComparePanel /> : <UniversityComparePanel />}
      </main>
    </div>
  );
}
