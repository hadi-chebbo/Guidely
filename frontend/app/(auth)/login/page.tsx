"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/app/contexts/AuthContext";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";

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
      const message =
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again.";

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
      <Button type="button" variant="ghost">
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
