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
import { getGoogleRedirectUrl } from "@/services/authService";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";

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

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

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

      const defaultRedirect =
        user.role === "admin"
          ? "/admin"
          : user.role === "mentor"
          ? "/mentor"
          : "/student/dashboard";

      const safeRedirect =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : defaultRedirect;

      router.push(safeRedirect);
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
      >
        <span className="font-semibold text-gray-700">Continue with</span>
        <span className="font-bold">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#DB4437]">o</span>
          <span className="text-[#F4B400]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#0F9D58]">l</span>
          <span className="text-[#DB4437]">e</span>
        </span>
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
