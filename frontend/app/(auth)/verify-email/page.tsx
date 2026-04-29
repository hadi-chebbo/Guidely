"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { useAuth }  from "@/app/contexts/AuthContext";
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

      {/* What''s next */}
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

/* ── Pending panel ───────────────────────────────────────────── */
function PendingPanel({ onVerify, isVerifying, userEmail }: { onVerify: () => void; isVerifying: boolean; userEmail: string }) {
  return (
    <div className="text-center space-y-6 animate-fade-in py-4">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 ring-8 ring-brand-50/60">
        <Inbox className="w-10 h-10 text-brand-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Verify your email
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          We&apos;ve sent a verification link to{" "}
          <strong className="text-gray-800 break-all">{userEmail}</strong>
        </p>
      </div>

      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5 text-left space-y-3">
        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
          What to do next
        </p>
        {[
          "Check your email inbox",
          "Click the verification link",
          "Return here to continue",
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700">{step}</span>
          </div>
        ))}
      </div>

      <Button
        type="button"
        isLoading={isVerifying}
        onClick={onVerify}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        {isVerifying ? "Verifying…" : "I''ve verified my email"}
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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}

function VerifyEmailPageContent() {
  const [pageState,   setPageState]   = useState<PageState>("pending");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMsg,   setResendMsg]   = useState<string | null>(null);
  const [resendType,  setResendType]  = useState<"success" | "error">("success");
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const userEmail = user?.email || searchParams.get('email') || '';

  const handleVerify = async () => {
    if (!token) {
      setPageState("expired");
      return;
    }
    setIsVerifying(true);
    try {
      await verifyEmail(token);
      setPageState("verified");
    } catch {
      setPageState("expired");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) return;
    setIsResending(true);
    setResendMsg(null);
    try {
      await resendVerificationEmail(userEmail);
      setResendType("success");
      setResendMsg("A new verification email has been sent!");
    } catch {
      setResendType("error");
      setResendMsg("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-8">
      {pageState === "pending" && (
        <>
          {resendMsg && (
            <FormMessage
              type={resendType}
              message={resendMsg}
              className="mb-6"
            />
          )}
          <PendingPanel
            onVerify={handleVerify}
            isVerifying={isVerifying}
            userEmail={userEmail}
          />
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-sm text-brand-600 hover:text-brand-700 disabled:opacity-50"
          >
            {isResending ? "Resending…" : "Didn''t receive an email? Resend"}
          </button>
        </>
      )}

      {pageState === "verified" && <VerifiedPanel />}

      {pageState === "expired" && (
        <ExpiredPanel onResend={handleResend} isResending={isResending} />
      )}
    </div>
  );
}
