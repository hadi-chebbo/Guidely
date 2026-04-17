"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { cn }       from "@/lib/utils";
import Button       from "@/components/ui/Button";
import FormMessage  from "@/components/ui/FormMessage";

/* ── States ──────────────────────────────────────────────────── */
type PageState = "pending" | "verified" | "expired";

/* ── Verified panel ──────────────────────────────────────────── */
function VerifiedPanel() {
  return (
    <div className="text-center space-y-6 animate-fade-in py-4">
      {/* Animated success ring */}
      <div className="relative inline-flex">
        <div className="h-24 w-24 rounded-full bg-brand-100 ring-8 ring-brand-50 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-brand-600" />
        </div>
        {/* Orbit particles */}
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-brand-300 animate-float opacity-80" />
        <span className="absolute bottom-1 -left-1 h-3 w-3 rounded-full bg-brand-400 animate-float-delayed opacity-60" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Email verified!
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Your account is now active. Welcome to Guidely — let&apos;s start your
          guidance journey.
        </p>
      </div>

      {/* What's next */}
      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 sm:p-5 text-left space-y-3">
        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
          What&apos;s next
        </p>
        {[
          "Take the personality &amp; skills test",
          "Explore 300+ university majors",
          "Compare and save your favourites",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-500" />
            <span
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </div>
        ))}
      </div>

      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-brand w-full justify-center"
      >
        Go to dashboard <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/* ── Expired link panel ──────────────────────────────────────── */
function ExpiredPanel({ onResend, isResending }: { onResend: () => void; isResending: boolean }) {
  return (
    <div className="text-center space-y-5 animate-fade-in py-2">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Link expired
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Your verification link has expired. Request a new one and check
          your inbox.
        </p>
      </div>

      <Button
        type="button"
        isLoading={isResending}
        onClick={onResend}
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        {isResending ? "Sending…" : "Resend verification email"}
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function VerifyEmailPage() {
  /* In production, the page would read ?token=xxx from the URL and
     call the API. Here we simulate the three states for demo. */
  const [pageState,   setPageState]   = useState<PageState>("pending");
  const [isResending, setIsResending] = useState(false);
  const [resendMsg,   setResendMsg]   = useState<string | null>(null);
  const [resendType,  setResendType]  = useState<"success" | "error">("success");

  /* Demo email — in production comes from the URL / session */
  const userEmail = "jana@example.com";

  const handleResend = async () => {
    setIsResending(true);
    setResendMsg(null);
    try {
      /* TODO: replace with real API call
         await api.post("/auth/resend-verification", { email: userEmail })
      */
      await new Promise((r) => setTimeout(r, 1500));
      setResendType("success");
      setResendMsg("A new verification email has been sent!");
    } catch {
      setResendType("error");
      setResendMsg("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  /* ── Demo state switcher ── (remove in production) */
  const DemoSwitcher = () => (
    <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
      {(["pending", "verified", "expired"] as PageState[]).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => { setPageState(s); setResendMsg(null); }}
          className={cn(
            "flex-1 rounded-lg py-1.5 text-xs font-medium transition-all cursor-pointer",
            pageState === s
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );

  /* ── Verified ── */
  if (pageState === "verified") return <VerifiedPanel />;

  /* ── Expired ── */
  if (pageState === "expired") {
    return (
      <>
        <DemoSwitcher />
        {resendMsg && (
          <FormMessage type={resendType} message={resendMsg} className="mb-4" />
        )}
        <ExpiredPanel onResend={handleResend} isResending={isResending} />
      </>
    );
  }

  /* ── Pending (default) ── */
  return (
    <>
      <DemoSwitcher />

      {/* Icon */}
      <div className="mb-4 sm:mb-6 text-center">
        <div className="relative inline-flex">
          <div className="h-20 w-20 rounded-full bg-brand-100 ring-8 ring-brand-50 flex items-center justify-center animate-pulse-soft">
            <Inbox className="w-9 h-9 text-brand-600" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 ring-2 ring-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-5 sm:mb-7 text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Verify your email
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          We sent a verification link to{" "}
          <strong className="text-gray-800">{userEmail}</strong>
        </p>
      </div>

      {/* Resend message */}
      {resendMsg && (
        <FormMessage type={resendType} message={resendMsg} className="mb-5" />
      )}

      {/* Info card */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 space-y-3 mb-4 sm:mb-6">
        <div className="flex items-start gap-3">
          <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600 leading-relaxed">
            Click the link in the email to activate your account. If you
            don&apos;t see it, check your <strong>spam or junk folder</strong>.
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Steps */}
        {[
          { step: "1", text: "Open the email from Guidely" },
          { step: "2", text: 'Click "Verify my email"' },
          { step: "3", text: "Start exploring majors!" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {step}
            </span>
            <span className="text-sm text-gray-600">{text}</span>
          </div>
        ))}
      </div>

      {/* Resend button */}
      <Button
        type="button"
        variant="ghost"
        isLoading={isResending}
        onClick={handleResend}
        leftIcon={<RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />}
        className="mb-3"
      >
        {isResending ? "Sending…" : "Resend verification email"}
      </Button>

      <p className="text-center text-xs text-gray-400">
        The link expires in{" "}
        <strong className="text-gray-600">24 hours</strong>
      </p>

      <Link
        href="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </>
  );
}
