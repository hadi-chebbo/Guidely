"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getGoogleCallbackUrl,
  getPostLoginRedirect,
} from "@/services/authService";
import { useAuth } from "@/app/contexts/AuthContext";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeGoogleLogin } = useAuth();
  const didFinishRef = useRef(false);
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const code = searchParams.get("code");

    if (didFinishRef.current) return;

    if (error) {
      didFinishRef.current = true;
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!token) {
      if (!code) {
        didFinishRef.current = true;
        router.replace("/login?error=google_auth_failed");
        return;
      }

      try {
        didFinishRef.current = true;
        window.location.replace(getGoogleCallbackUrl(searchParams.toString()));
      } catch {
        router.replace("/login?error=google_auth_failed");
      }

      return;
    }

    const finishLogin = async () => {
      try {
        didFinishRef.current = true;
        const user = await completeGoogleLogin(token);
        router.replace(getPostLoginRedirect(user));
        router.refresh();
      } catch {
        setMessage("Google sign-in failed. Sending you back to login...");
        router.replace("/login?error=google_auth_failed");
      }
    };

    finishLogin();
  }, [completeGoogleLogin, router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </main>
  );
}
