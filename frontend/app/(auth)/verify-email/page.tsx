"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Inbox } from "lucide-react";

import { useAuth } from "@/app/contexts/AuthContext";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";
import { getPendingVerificationEmail, type User } from "@/services/authService";

/* ───────────────────────────── TYPES ───────────────────────────── */

type State = "sent" | "loading" | "success" | "error";

/* ───────────────────────────── PAGE ───────────────────────────── */

function VerifyEmailContent() {
  const { verifyEmail, resendVerificationEmail, user } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") || "";
  const hash = searchParams.get("hash") || "";
  const expires = searchParams.get("expires") || "";
  const signature = searchParams.get("signature") || "";

  const email = user?.email || getPendingVerificationEmail();

  const [state, setState] = useState<State>("sent");
  const [msg, setMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  /* ───────────────────────────── VERIFY ───────────────────────────── */

  useEffect(() => {
    const dashboardPath = (verifiedUser: User): string =>
      verifiedUser.role === "admin"
        ? "/admin"
        : verifiedUser.role === "mentor"
          ? "/mentor"
          : "/student/dashboard";

    const run = async () => {
      try {
        setState("loading");
        const verifiedUser = await verifyEmail(id, hash, { expires, signature });
        setState("success");

        if (verifiedUser) {
          router.replace(dashboardPath(verifiedUser));
        }
      } catch {
        setState("error");
      }
    };

    if (id && hash && expires && signature) run();
    else setState("sent");
  }, [id, hash, expires, signature, verifyEmail, router]);

  /* ───────────────────────────── RESEND ───────────────────────────── */

  const handleResend = async () => {
    setResending(true);
    setMsg(null);

    try {
      if (!email) {
        setMsg("Please login and request a new verification email.");
        return;
      }

      await resendVerificationEmail(email);
      setMsg("Verification email sent!");
    } catch {
      setMsg("Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  /* ───────────────────────────── UI ───────────────────────────── */

  return (
    <div className="text-center space-y-6 py-10">

      {msg && <FormMessage type="success" message={msg} />}

      {/* SENT */}
      {state === "sent" && (
        <>
          <Inbox className="mx-auto w-10 h-10 text-brand-600" />
          <h2 className="text-xl font-bold">Check your inbox</h2>
          <p className="text-sm text-gray-500">
            We sent you a verification link. Open it from your email to continue.
          </p>
          <Button onClick={handleResend} isLoading={resending}>
            Resend verification email
          </Button>
        </>
      )}

      {/* LOADING */}
      {state === "loading" && (
        <>
          <Inbox className="mx-auto w-10 h-10 text-brand-600" />
          <h2 className="text-xl font-bold">Verifying email...</h2>
        </>
      )}

      {/* SUCCESS */}
      {state === "success" && (
        <>
          <div className="h-20 w-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold">Email verified!</h2>

          <p className="text-sm text-gray-500">
            You are signed in. Taking you to your dashboard...
          </p>
        </>
      )}

      {/* ERROR */}
      {state === "error" && (
        <>
          <AlertCircle className="mx-auto w-10 h-10 text-red-500" />

          <h2 className="text-xl font-bold">Verification failed</h2>

          <p className="text-sm text-gray-500">
            The link is invalid or expired.
          </p>

          <Button onClick={handleResend} isLoading={resending}>
            Resend email
          </Button>

          <div>
            <Link href="/login" className="text-sm text-gray-400">
              Back to login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center space-y-6 py-10">
          <Inbox className="mx-auto w-10 h-10 text-brand-600" />
          <h2 className="text-xl font-bold">Verifying email...</h2>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
