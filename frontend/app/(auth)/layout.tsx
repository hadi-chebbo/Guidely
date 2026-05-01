import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

/* ── Branded left panel ──────────────────────────────────────── */
function BrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col justify-between overflow-hidden bg-brand-950 p-10 xl:p-14">

      {/* Single atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl animate-float"
      />

      {/* ── TOP: Logo ── */}
      <div className="relative z-10">
        <Link href="/" aria-label="Guidely home" className="inline-flex items-center gap-3">
          <Image
            src="/logo-transparent.png"
            alt="Guidely"
            width={56}
            height={56}
            priority
            className="brightness-0 invert"
          />
          <span className="text-2xl font-bold text-white font-heading tracking-tight">Guidely</span>
        </Link>
      </div>

      {/* ── MIDDLE: Tagline ── */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          <Star className="h-3 w-3 text-yellow-300 fill-yellow-400" />
          Trusted by 10,000+ Lebanese students
        </div>

        <h2 className="text-5xl xl:text-6xl font-bold text-white font-heading leading-tight">
          Guide Your
          <br />
          <span className="text-brand-300">Academic</span> Journey
        </h2>

        <p className="text-base text-white/65 leading-relaxed max-w-xs">
          Lebanon&apos;s first intelligent major guidance platform. Discover
          the path that fits <em>you</em>.
        </p>
      </div>

      {/* ── BOTTOM: spacer so justify-between keeps middle block anchored ── */}
      <div className="relative z-10" />
    </div>
  );
}

/* ── Right panel wrapper ─────────────────────────────────────── */
function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-16 xl:px-20 overflow-y-auto">

      {/* Mobile-only logo */}
      <div className="mb-6 sm:mb-8 flex lg:hidden items-center justify-center gap-2.5">
        <Image
          src="/logo-transparent.png"
          alt="Guidely"
          width={40}
          height={40}
          priority
        />
        <span className="text-xl font-bold text-gray-900 font-heading tracking-tight">Guidely</span>
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
