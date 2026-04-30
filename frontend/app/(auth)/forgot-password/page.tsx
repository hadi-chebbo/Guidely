"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  KeyRound,
} from "lucide-react";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { useAuth } from "@/app/contexts/AuthContext";
import Input       from "@/components/ui/Input";
import Button      from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";

/* ── Success panel ───────────────────────────────────────────── */
function EmailSentPanel({
  email,
  onResend,
  isResending,
}: {
  email:      string;
  onResend:   () => void;
  isResending: boolean;
}) {
  return (
    <div className="text-center space-y-6 animate-fade-in py-2">
      {/* Animated icon */}
      <div className="relative inline-flex">
        <div className="h-20 w-20 rounded-full bg-brand-100 ring-8 ring-brand-50 flex items-center justify-center animate-pulse-soft">
          <Mail className="w-9 h-9 text-brand-600" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 ring-2 ring-white">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Check your inbox
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          We&apos;ve sent a password reset link to{" "}
          <strong className="text-gray-800 break-all">{email}</strong>
        </p>
      </div>

      {/* Steps */}
      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5 text-left space-y-3">
        {[
          "Open the email from Guidely",
          "Click the \"Reset password\" button",
          "Create a new secure password",
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700">{step}</span>
          </div>
        ))}
      </div>

      {/* Expiry notice */}
      <p className="text-xs text-gray-400">
        Link expires in <strong className="text-gray-600">15 minutes</strong>.
        Check your spam folder if you don&apos;t see it.
      </p>

      {/* Resend */}
      <Button
        type="button"
        variant="ghost"
        isLoading={isResending}
        onClick={onResend}
        leftIcon={<RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />}
      >
        {isResending ? "Sending…" : "Resend email"}
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
export default function ForgotPasswordPage() {
  const [emailSent,   setEmailSent]   = useState(false);
  const [sentTo,      setSentTo]      = useState("");
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMsg,   setResendMsg]   = useState<string | null>(null);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      await forgotPassword(data.email);
      setSentTo(data.email);
      setEmailSent(true);
    } catch {
      setServerError("If this email exists, you will receive a reset link.");
    }
  };

  const onResend = async () => {
    setIsResending(true);
    setResendMsg(null);
    try {
      await forgotPassword(sentTo);
      setResendMsg("A new email has been sent!");
    } catch {
      setResendMsg("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  /* ── Success view ── */
  if (emailSent) {
    return (
      <>
        {resendMsg && (
          <FormMessage
            type={resendMsg.includes("Failed") ? "error" : "success"}
            message={resendMsg}
            className="mb-6"
          />
        )}
        <EmailSentPanel
          email={sentTo}
          onResend={onResend}
          isResending={isResending}
        />
      </>
    );
  }

  /* ── Form view ── */
  return (
    <>
      {/* Icon */}
      <div className="mb-4 sm:mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 ring-4 ring-brand-50">
        <KeyRound className="h-7 w-7 text-brand-600" />
      </div>

      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          No worries — enter your email and well send you a reset link
          within seconds.
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <FormMessage type="error" message={serverError} className="mb-5" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          hint="Enter the email associated with your Guidely account"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="mt-1"
        >
          {isSubmitting ? "Sending reset link…" : "Send reset link"}
        </Button>
      </form>

      {/* Back link */}
      <Link
        href="/login"
        className="mt-7 flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </>
  );
}

