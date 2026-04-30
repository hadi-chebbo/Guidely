"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Inbox } from "lucide-react";

import { useAuth } from "@/app/contexts/AuthContext";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";

/* ───────────────────────────── TYPES ───────────────────────────── */

type State = "loading" | "success" | "error";

/* ───────────────────────────── PAGE ───────────────────────────── */

export default function VerifyEmailPage() {
  const { verifyEmail, resendVerificationEmail, user } = useAuth();

  const params = useParams();

  const id = params?.id as string;
  const hash = params?.hash as string;

  const email = user?.email || "";

  const [state, setState] = useState<State>("loading");
  const [msg, setMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  /* ───────────────────────────── VERIFY ───────────────────────────── */

  useEffect(() => {
    const run = async () => {
      try {
        await verifyEmail(id, hash);
        setState("success");
      } catch {
        setState("error");
      }
    };

    if (id && hash) run();
    else setState("error");
  }, [id, hash]);

  /* ───────────────────────────── RESEND ───────────────────────────── */

  const handleResend = async () => {
    setResending(true);
    setMsg(null);

    try {
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
            You can now login to your account.
          </p>

          <Link
            href="/login"
            className="inline-block bg-brand-600 text-white px-6 py-3 rounded-xl"
          >
            Go to login
          </Link>
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