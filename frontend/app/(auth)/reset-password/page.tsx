"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { resetPassword } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormMessage from "@/components/ui/FormMessage";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    if (loading) return;

    setError(null);
    setMessage(null);

    if (!token || !email) {
      setError("Invalid or expired reset link");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: confirm,
      });

      setMessage("Your password has been updated. Redirecting...");

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err: unknown) {
      const error = err as ApiError;

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold">Reset Password</h1>

      {error && <FormMessage type="error" message={error} />}
      {message && <FormMessage type="success" message={message} />}

      <Input
        label="New password"
        type="password"
        leftIcon={<Lock className="w-4 h-4" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        label="Confirm password"
        type="password"
        leftIcon={<Lock className="w-4 h-4" />}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <Button
        onClick={handleReset}
        isLoading={loading}
        disabled={!password || !confirm || loading}
        className="w-full"
      >
        Reset password
      </Button>
    </div>
  );
}