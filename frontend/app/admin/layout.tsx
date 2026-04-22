"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        router.push("/login?redirect=/admin");
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
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden lg:flex w-64 bg-white border-r border-gray-200" />
        <div className="flex flex-1 flex-col">
          <div className="h-16 bg-white border-b border-gray-200" />
          <main className="flex-1 p-6 lg:p-8 space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  // Only show admin content if authorized
  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
