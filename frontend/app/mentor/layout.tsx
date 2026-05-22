"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { MentorSidebar, MentorTopbar } from "@/components/mentor/MentorShell";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push("/login?redirect=/mentor");
        return;
      }

      if (user.role !== "mentor") {
        router.push(user.role === "admin" ? "/admin" : "/student/dashboard");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden w-72 border-r border-gray-200 bg-white lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-16 border-b border-gray-200 bg-white" />
          <main className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "mentor") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MentorSidebar className="hidden lg:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <MentorTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
