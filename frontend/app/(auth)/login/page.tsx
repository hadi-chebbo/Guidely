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
import Input        from "@/components/ui/Input";
import Button       from "@/components/ui/Button";
import FormMessage  from "@/components/ui/FormMessage";

export default function LoginPage() {
  const [serverError,   setServerError]   = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      const user = await login(data.email, data.password, data.rememberMe);
      setServerSuccess("Logged in successfully! Redirecting…");

      const redirectParam = new URLSearchParams(window.location.search).get('redirect');
      const defaultRedirect =
        user.role === 'admin' ? '/admin' : user.role === 'mentor' ? '/mentor' : '/';
      const safeRedirect = redirectParam && redirectParam.startsWith('/') ? redirectParam : defaultRedirect;

      router.push(safeRedirect);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Invalid email or password. Please try again.';
      setServerError(message);
    }
  };

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

      {/* Server-level messages */}
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
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
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
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-brand-600 cursor-pointer
                       focus:ring-brand-500 focus:ring-offset-0 transition-colors"
            {...register("rememberMe")}
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
            Keep me signed in for 30 days
          </span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="mt-2"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium px-1">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Google SSO (placeholder) */}
      <Button
        type="button"
        variant="ghost"
        leftIcon={
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        }
      >
        Continue with Google
      </Button>

      {/* Register link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Create one — it&apos;s free
        </Link>
      </p>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-gray-400">
        By signing in you agree to our{" "}
        <Link href="#" className="underline hover:text-gray-600 transition-colors">
          Terms
        </Link>{" "}
        &amp;{" "}
        <Link href="#" className="underline hover:text-gray-600 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </>
  );
}
