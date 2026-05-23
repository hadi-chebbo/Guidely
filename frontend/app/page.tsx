import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

const outcomes = [
  "Compare universities with structured, student-friendly data.",
  "Understand majors through skills, interests, and career direction.",
  "Move from uncertainty to a focused academic plan.",
];

const metrics = [
  { label: "Major match", value: "92%" },
  { label: "Career fit", value: "88%" },
  { label: "Mentor ready", value: "24+" },
];

const quickStats = [
  { label: "Majors", value: "24+" },
  { label: "Universities", value: "12+" },
  { label: "Mentors", value: "30+" },
];

const pillars = [
  {
    icon: GraduationCap,
    title: "University Clarity",
    description:
      "See programs, locations, and academic options in one calm decision space.",
  },
  {
    icon: BookOpen,
    title: "Major Direction",
    description:
      "Connect interests and strengths to majors that make sense long term.",
  },
  {
    icon: Users,
    title: "Guided Support",
    description:
      "Give students a clearer next step before they commit to a path.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-brand-50 via-white to-slate-100 text-[#111827]">
      <nav className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
        <Link
          href="/"
          aria-label="Guidely home"
          className="inline-flex items-center gap-3.5 rounded-xl px-1 py-1"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 sm:h-14 sm:w-14">
            <Image
              src="/logo-transparent.png"
              alt="Guidely logo"
              width={64}
              height={64}
              priority
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-heading text-2xl font-bold leading-none tracking-normal text-[#0e1733] sm:text-[1.7rem]">
              Guidely
            </span>
            <span className="mt-1 hidden text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 sm:block">
              Academic Guidance
            </span>
          </span>
        </Link>
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 rounded-xl border border-white/70 bg-white/75 px-4 py-2 shadow-sm backdrop-blur sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
              Student-first platform
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-600">
              Majors, universities, mentors
            </p>
          </div>
          <Link
            href="/login"
            className="hidden h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 sm:inline-flex"
          >
            Login
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-7xl min-w-0 items-center gap-8 px-5 pb-12 pt-5 sm:px-8 sm:pb-14 sm:pt-7 lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,0.9fr)] lg:gap-14 lg:px-10 lg:pb-16 lg:pt-8">
        <div className="min-w-0 max-w-3xl animate-slide-up">
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-brand-700" />
            <span className="truncate">Academic guidance for Lebanese students</span>
          </div>

          <h1 className="max-w-3xl font-heading text-[2.25rem] font-bold leading-[1.08] tracking-normal text-[#0e1733] sm:text-5xl lg:text-[4.15rem]">
            Make the right university decision with confidence.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg lg:text-[1.15rem] lg:leading-8">
            Guidely brings university comparison, major discovery, and student
            guidance into one focused platform, helping students choose a path
            that fits their abilities, ambitions, and future opportunities.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-950 px-6 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-700 sm:w-auto"
            >
              Go to login
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm sm:justify-start">
              <CalendarCheck className="h-4 w-4 text-brand-700" />
              Find majors, mentors, and sessions
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-xl">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center shadow-sm"
              >
                <p className="text-xl font-bold text-[#0e1733]">{stat.value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:max-w-2xl">
            {outcomes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white/70 px-4 py-3 text-sm leading-6 text-gray-700 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 animate-fade-in lg:pt-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
                  Guidance overview
                </p>
                <h2 className="mt-1 font-heading text-xl font-bold tracking-normal text-[#0e1733] sm:text-2xl">
                  Student decision profile
                </h2>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-0 divide-y divide-gray-100">
              {[
                ["Computer Science", "Strong analytical and technology fit", "92%"],
                ["Business Analytics", "Balanced business and data pathway", "86%"],
                ["Graphic Design", "Creative direction with portfolio focus", "78%"],
              ].map(([major, detail, score]) => (
                <div
                  key={major}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:gap-4 sm:px-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-brand-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-950">{major}</p>
                    <p className="mt-1 flex min-w-0 items-center gap-1 text-xs leading-5 text-gray-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{detail}</span>
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 sm:px-3">
                    {score}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-100 border-t border-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {metrics.map((metric) => (
                <div key={metric.label} className="px-5 py-4 sm:px-6 sm:py-5">
                  <p className="text-2xl font-bold text-[#0e1733]">{metric.value}</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-3 lg:px-10">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold tracking-normal text-gray-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
