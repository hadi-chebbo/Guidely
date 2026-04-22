"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminMajorsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        router.push("/login?redirect=/admin/majors");
        return;
      }

      // Check if user is admin
      if (user.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  // Only show content if authorized
  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-gray-900 font-heading">Majors</h1>
      <p className="text-sm text-gray-500">
        Majors CRUD table — coming in Sprint 1.
      </p>
    </div>
  );
}
