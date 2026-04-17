import Link from "next/link";
import {
  BookOpen,
  GitCompare,
  Lightbulb,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

/* ── Branded left panel ──────────────────────────────────────── */
function BrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-950 via-brand-950 to-brand-950 p-10 xl:p-14">

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-white opacity-100"
      />

      {/* Decorative glowing blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-16 left-1/4 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl animate-float-slow" />
      </div>

      {/* ── TOP: Logo ── */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white font-heading tracking-tight">
            Guidely
          </span>
        </Link>
      </div>

      {/* ── MIDDLE: Tagline + Features ── */}
      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" />
            Trusted by 10,000+ Lebanese students
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-white font-heading leading-tight">
            Guide Your
            <br />
            <span className="text-brand-300">Academic</span> Journey
          </h2>

          <p className="text-base text-white/65 leading-relaxed max-w-xs">
            Lebanon&apos;s first intelligent major guidance platform. Discover
            the path that fits <em>you</em>.
          </p>
        </div>

        {/* Feature list */}
        <ul className="space-y-4">
          {[
            {
              icon:  <BookOpen   className="h-4 w-4" />,
              title: "Explore 300+ majors",
              desc:  "In-depth profiles with real salary & market data",
            },
            {
              icon:  <GitCompare className="h-4 w-4" />,
              title: "Side-by-side comparison",
              desc:  "Compare majors with radar charts & smart suggestions",
            },
            {
              icon:  <Lightbulb  className="h-4 w-4" />,
              title: "Personality-match test",
              desc:  "Discover which major suits your unique strengths",
            },
            {
              icon:  <TrendingUp className="h-4 w-4" />,
              title: "Lebanon job market insights",
              desc:  "Up-to-date demand, salaries & hiring companies",
            },
          ].map(({ icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-300 ring-1 ring-white/15">
                {icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── BOTTOM: Testimonial ── */}
      <div className="relative z-10">
        <blockquote className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
          <p className="text-sm text-white/80 leading-relaxed italic">
            &ldquo;Guidely helped me realize that Architecture was my true calling
            — not Medicine, which my family was pushing. I graduated with honours.&rdquo;
          </p>
          <footer className="mt-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/40 text-xs font-bold text-white ring-1 ring-white/20">
              S
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Sara K.</p>
              <p className="text-xs text-white/50">Architecture, LAU &apos;24</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
          </footer>
        </blockquote>

        <div className="mt-5 flex items-center gap-2 text-white/40 text-xs">
          <Users className="h-3.5 w-3.5" />
          <span>Join 10,000+ students already guided by Guidely</span>
        </div>
      </div>
    </div>
  );
}

/* ── Right panel wrapper ─────────────────────────────────────── */
function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-16 xl:px-20 overflow-y-auto">

      {/* Mobile-only logo */}
      <div className="mb-5 sm:mb-8 flex lg:hidden items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
          <BookOpen className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 font-heading">Guidely</span>
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {children}
      </div>
    </div>
  );
}

/* ── Root auth layout ────────────────────────────────────────── */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <FormPanel>{children}</FormPanel>
    </div>
  );
}
