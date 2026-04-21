"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  School,
  GraduationCap,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import {
  registerStep1Schema,
  registerStep2Schema,
  type RegisterStep1Data,
  type RegisterStep2Data,
  INTEREST_CATEGORIES,
  GRADE_OPTIONS,
} from "@/lib/validations/auth";
import { useAuth } from "@/app/contexts/AuthContext";
import { cn }        from "@/lib/utils";
import Input         from "@/components/ui/Input";
import Button        from "@/components/ui/Button";
import FormMessage   from "@/components/ui/FormMessage";

/* ── Types ───────────────────────────────────────────────────── */
type AllFormData = RegisterStep1Data & Partial<RegisterStep2Data> & { interests?: string[] };

/* ── Step indicator ──────────────────────────────────────────── */
const STEPS = [
  { number: 1, label: "Account",   desc: "Your credentials" },
  { number: 2, label: "Profile",   desc: "Tell us about you" },
  { number: 3, label: "Interests", desc: "What excites you?" },
] as const;

function StepBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-5 sm:mb-7">
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 -z-10" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-brand-500 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map(({ number, label }) => {
          const isDone    = number < currentStep;
          const isCurrent = number === currentStep;

          return (
            <div key={number} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ring-2",
                  isDone    && "bg-brand-600 text-white ring-brand-600",
                  isCurrent && "bg-brand-600 text-white ring-brand-200 scale-110",
                  !isDone && !isCurrent && "bg-white text-gray-400 ring-gray-200"
                )}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : number}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent ? "text-brand-600" : isDone ? "text-brand-500" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Password strength indicator ────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",  pass: password.length >= 8 },
    { label: "Uppercase",      pass: /[A-Z]/.test(password) },
    { label: "Number",         pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-red-400", "bg-yellow-400", "bg-brand-400", "bg-brand-600"];
  const labels = ["", "Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score] : "bg-gray-200"
            )}
          />
        ))}
        <span className="ml-2 text-xs text-gray-500 min-w-10">{labels[score]}</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              pass ? "text-brand-600" : "text-gray-400"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                pass ? "bg-brand-500" : "bg-gray-300"
              )}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── STEP 1 ─ Account credentials ────────────────────────────── */
function Step1({
  onNext,
}: {
  onNext: (data: RegisterStep1Data) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStep1Data>({
    resolver: zodResolver(registerStep1Schema),
  });

  const password = watch("password", "");

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <Input
        label="Full name"
        type="text"
        placeholder="Jana Khalil"
        autoComplete="name"
        leftIcon={<User className="w-4 h-4" />}
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordStrength password={password} />
      </div>

      <Input
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        autoComplete="new-password"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-2"
      >
        Continue
      </Button>
    </form>
  );
}

/* ── STEP 2 ─ Profile details ────────────────────────────────── */
function Step2({
  onNext,
  onBack,
}: {
  onNext: (data: RegisterStep2Data) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStep2Data>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { preferredLanguage: "en" },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <Input
        label="School / University"
        type="text"
        placeholder="e.g. American University of Beirut"
        leftIcon={<School className="w-4 h-4" />}
        hint="Optional — helps us personalise your experience"
        error={errors.school?.message}
        {...register("school")}
      />

      {/* Grade select */}
      <div>
        <label className="form-label" htmlFor="grade">
          Current grade / level
        </label>
        <div className="relative">
          <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            id="grade"
            className="auth-input pl-10 appearance-none pr-10 cursor-pointer"
            {...register("grade")}
          >
            <option value="">Select your grade…</option>
            {GRADE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {errors.grade && <p className="field-error">{errors.grade.message}</p>}
      </div>

      {/* Language */}
      <div>
        <label className="form-label">Preferred language</label>
        <div className="flex gap-2 sm:gap-3">
          {(
            [
              { value: "en", label: "English", flag: "🇬🇧" },
              { value: "ar", label: "العربية", flag: "🇱🇧" },
              { value: "fr", label: "Français", flag: "🇫🇷" },
            ] as const
          ).map(({ value, label, flag }) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl border p-2 sm:p-3 text-xs sm:text-sm font-medium transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                {...register("preferredLanguage")}
              />
              <span>{flag}</span>
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 -mt-1">
        This step is optional — you can update these any time in settings.
      </p>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" fullWidth onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button type="submit" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Continue
        </Button>
      </div>

      <button
        type="button"
        onClick={() => onNext({ preferredLanguage: "en" })}
        className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer py-1"
      >
        Skip this step
      </button>
    </form>
  );
}

/* ── STEP 3 ─ Interests ──────────────────────────────────────── */
function Step3({
  onSubmit,
  onBack,
  isLoading,
  serverError,
}: {
  onSubmit:    (interests: string[]) => void;
  onBack:      () => void;
  isLoading:   boolean;
  serverError: string | null;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [touched,  setTouched]  = useState(false);
  const hasError = touched && selected.length === 0;

  const toggle = (id: string) => {
    setTouched(true);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setTouched(true);
    onSubmit(selected);
  };

  return (
    <div className="space-y-5">
      {serverError && <FormMessage type="error" message={serverError} />}

      <div className="flex flex-wrap gap-2.5">
        {INTEREST_CATEGORIES.map(({ id, label }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={cn(
                "interest-chip",
                active ? "interest-chip-active" : "interest-chip-inactive"
              )}
              aria-pressed={active}
            >
              {active && <Check className="w-3 h-3" />}
              {label}
            </button>
          );
        })}
      </div>

      {hasError && (
        <p className="text-xs text-red-500">
          Please select at least one interest to continue.
        </p>
      )}

      <p className="text-xs text-gray-400">
        {selected.length} selected · You can update this any time in your profile.
      </p>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" fullWidth onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button
          type="button"
          isLoading={isLoading}
          onClick={handleContinue}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          {isLoading ? "Creating account…" : "Create my account"}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => onSubmit([])}
        className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer py-1"
      >
        Skip &amp; create account
      </button>
    </div>
  );
}

/* ── SUCCESS STATE ───────────────────────────────────────────── */
function SuccessState({ email }: { email: string }) {
  return (
    <div className="text-center space-y-4 animate-fade-in py-4">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 ring-8 ring-brand-50">
        <Check className="w-8 h-8 text-brand-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 font-heading">Account created!</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          We&apos;ve sent a verification email to{" "}
          <strong className="text-gray-800">{email}</strong>.<br />
          Please check your inbox to activate your account.
        </p>
      </div>
      <Link
        href="/verify-email"
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-brand"
      >
        Go to verification <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="text-xs text-gray-400">
        Already verified?{" "}
        <Link href="/login" className="text-brand-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

/* ── Main page component ─────────────────────────────────────── */
export default function RegisterPage() {
  const [step,        setStep]        = useState(1);
  const [accumulated, setAccumulated] = useState<AllFormData>({} as AllFormData);
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success,     setSuccess]     = useState(false);
  const { register } = useAuth();

  const headings = [
    { title: "Create your account",     subtitle: "Start your guided academic journey today" },
    { title: "Tell us about yourself",  subtitle: "Help us personalise your experience" },
    { title: "What are you into?",      subtitle: "Choose the fields that spark your curiosity" },
  ];

  const handleStep1 = (data: RegisterStep1Data) => {
    setAccumulated((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (data: RegisterStep2Data) => {
    setAccumulated((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3 = async (interests: string[]) => {
    const finalData: AllFormData = { ...accumulated, interests };
    setIsSubmitting(true);
    setServerError(null);

    try {
      await register({
        name: finalData.name,
        email: finalData.email,
        password: finalData.password,
        school: finalData.school,
        grade: finalData.grade,
        preferredLanguage: finalData.preferredLanguage,
      });
      setSuccess(true);
      // Optionally redirect to verify email or login
      // router.push('/verify-email');
    } catch {
      setServerError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return <SuccessState email={accumulated.email ?? ""} />;
  }

  const { title, subtitle } = headings[step - 1];

  return (
    <>
      {/* Header */}
      <div className="mb-4 sm:mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">{title}</h1>
        <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Progress steps */}
      <StepBar currentStep={step} />

      {/* Step content */}
      <div key={step} className="step-enter">
        {step === 1 && <Step1 onNext={handleStep1} />}
        {step === 2 && (
          <Step2 onNext={handleStep2} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <Step3
            onSubmit={handleStep3}
            onBack={() => setStep(2)}
            isLoading={isSubmitting}
            serverError={serverError}
          />
        )}
      </div>

      {/* Login link */}
      <p className="mt-7 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
