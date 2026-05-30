"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getGoogleRedirectUrl,
  getPostLoginRedirect,
  type User,
} from "@/services/authService";

import { cn } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";

function GoogleMark() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.64v2.98h3.89c2.27-2.09 3.53-5.17 3.53-8.86Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.96-2.87l-3.89-2.98c-1.08.72-2.45 1.14-4.07 1.14-3.13 0-5.78-2.11-6.72-4.95H1.27v3.07A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.34A7.17 7.17 0 0 1 4.9 12c0-.81.14-1.6.38-2.34V6.59H1.27a12 12 0 0 0 0 10.82l4.01-3.07Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.71c1.76 0 3.34.6 4.58 1.79l3.45-3.45A11.56 11.56 0 0 0 12 0 12 12 0 0 0 1.27 6.59l4.01 3.07C6.22 6.82 8.87 4.71 12 4.71Z"
      />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((check) => check.pass).length;
  const colors = ["bg-red-400", "bg-yellow-400", "bg-brand-400", "bg-brand-600"];
  const labels = ["", "Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              index < score ? colors[score] : "bg-gray-200",
            )}
          />
        ))}
        <span className="ml-2 min-w-10 text-xs text-gray-500">
          {labels[score]}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              pass ? "text-brand-600" : "text-gray-400",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                pass ? "bg-brand-500" : "bg-gray-300",
              )}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

const getLoginErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign in. Please try again.";
};

const getRoleSafeRedirect = (user: User, redirectParam: string | null) => {
  const defaultRedirect = getPostLoginRedirect(user);

  if (!redirectParam || !redirectParam.startsWith("/") || redirectParam.startsWith("//")) {
    return defaultRedirect;
  }

  if (redirectParam.startsWith("/admin") && user.role !== "admin") {
    return defaultRedirect;
  }

  if (redirectParam.startsWith("/mentor") && user.role !== "mentor") {
    return defaultRedirect;
  }

  if (redirectParam.startsWith("/student") && user.role !== "student") {
    return defaultRedirect;
  }

  return redirectParam;
};

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });
  const password = watch("password", "");

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");

    if (!error) return;

    const messages: Record<string, string> = {
      blocked: "Your account is blocked. Please contact support.",
      google_auth_failed: "Google sign-in failed. Please try again.",
    };

    setServerError(messages[error] ?? "Google sign-in failed. Please try again.");
  }, []);

  /* ───────────────────────────── SUBMIT ───────────────────────────── */

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      const user = await login(
        data.email,
        data.password,
        data.rememberMe
      );

      setServerSuccess("Logged in successfully! Redirecting…");

      const redirectParam = new URLSearchParams(
        window.location.search
      ).get("redirect");

      const safeRedirect = getRoleSafeRedirect(user, redirectParam);

      router.replace(safeRedirect);
      router.refresh();
    } catch (error) {
      setServerError(getLoginErrorMessage(error));
    }
  };

  const handleGoogleLogin = () => {
    setServerError(null);
    setServerSuccess(null);

    try {
      window.location.href = getGoogleRedirectUrl();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google login is not available right now.";

      setServerError(message);
    }
  };

  /* ───────────────────────────── UI ───────────────────────────── */

  return (
    <>
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="hidden lg:flex mb-6 justify-start">
          <Image
            src="/logo-transparent.png"
            alt="Guidely"
            width={72}
            height={72}
            priority
          />
        </div>

        <h1 className="text-3xl sm:text-[2rem] font-bold text-gray-900 font-heading tracking-tight leading-[1.1]">
          Welcome back
        </h1>

        <p className="mt-3 text-gray-500 text-sm leading-relaxed">
          Sign in to continue your guidance journey
        </p>
      </div>

      {/* Messages */}
      {serverError && (
        <FormMessage type="error" message={serverError} className="mb-5" />
      )}

      {serverSuccess && (
        <FormMessage type="success" message={serverSuccess} className="mb-5" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* Email */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={password} />
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            {...register("rememberMe")}
          />

          <span className="text-sm text-gray-600">
            Keep me signed in for 30 days
          </span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="ghost"
        onClick={handleGoogleLogin}
        className="h-12 border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
        leftIcon={<GoogleMark />}
      >
        Continue with Google
      </Button>

      {/* Register */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
