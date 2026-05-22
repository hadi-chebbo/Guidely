"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Plus,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import { useAuth } from "@/app/contexts/AuthContext";
import { getMajors } from "@/services/majorsService";
import { mentorApplicationService } from "@/services/mentorApplicationService";
import { universityService } from "@/services/universityService";
import { userService } from "@/services/userService";

const quickActions = [
  {
    label: "Add Major",
    href: "/admin/majors/create",
    icon: Plus,
  },
  {
    label: "Manage Universities",
    href: "/admin/universities",
    icon: Building2,
  },
  {
    label: "Review Students",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Manage Mentors",
    href: "/admin/mentors",
    icon: UserCheck,
  },
  {
    label: "Review Applications",
    href: "/admin/mentor-applications",
    icon: ClipboardList,
  },
];

export default function AdminOverviewPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push("/login?redirect=/admin");
        return;
      }
      if (user.role !== "admin") {
        router.push(user.role === "mentor" ? "/mentor" : "/student/dashboard");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const [majorsQuery, unisQuery, usersQuery, mentorsQuery, applicationsQuery] = useQueries({
    queries: [
      {
        queryKey: ["admin-overview-majors"],
        queryFn: () => getMajors({ per_page: 1, page: 1 }),
        enabled: isAuthenticated && user?.role === "admin",
      },
      {
        queryKey: ["admin-overview-unis"],
        queryFn: () => universityService.getAll(1),
        enabled: isAuthenticated && user?.role === "admin",
      },
      {
        queryKey: ["admin-overview-users"],
        queryFn: () => userService.getAll(1),
        enabled: isAuthenticated && user?.role === "admin",
      },
      {
        queryKey: ["admin-overview-mentors"],
        queryFn: () => userService.getAll(1, "mentor"),
        enabled: isAuthenticated && user?.role === "admin",
      },
      {
        queryKey: ["admin-overview-mentor-applications"],
        queryFn: () => mentorApplicationService.getPending(1),
        enabled: isAuthenticated && user?.role === "admin",
      },
    ],
  });

  const statsConfig = [
    {
      label: "Majors",
      helper: "Published academic paths",
      icon: BookOpen,
      href: "/admin/majors",
      value: majorsQuery.isLoading ? null : (majorsQuery.data?.meta?.total ?? "-"),
    },
    {
      label: "Universities",
      helper: "Institution records",
      icon: Building2,
      href: "/admin/universities",
      value: unisQuery.isLoading ? null : (unisQuery.data?.meta?.total ?? "-"),
    },
    {
      label: "Students",
      helper: "Registered student accounts",
      icon: Users,
      href: "/admin/users",
      value: usersQuery.isLoading ? null : (usersQuery.data?.meta?.total ?? "-"),
    },
    {
      label: "Mentors",
      helper: "Approved mentor accounts",
      icon: UserCheck,
      href: "/admin/mentors",
      value: mentorsQuery.isLoading ? null : (mentorsQuery.data?.meta?.total ?? "-"),
    },
    {
      label: "Applications",
      helper: "Pending mentor reviews",
      icon: ClipboardList,
      href: "/admin/mentor-applications",
      value: applicationsQuery.isLoading ? null : (applicationsQuery.data?.meta?.total ?? "-"),
    },
    {
      label: "Questions",
      helper: "Quiz content bank",
      icon: ClipboardList,
      href: "/admin",
      value: "-",
    },
  ];

  if (loading) {
    return (
      <AdminPageShell>
        <div className="h-28 animate-pulse rounded-lg bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm"
            />
          ))}
        </div>
      </AdminPageShell>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") return null;

  return (
    <AdminPageShell>
      <AdminCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
              <Image
                src="/logo-transparent.png"
                alt="Guidely"
                width={44}
                height={44}
                priority
              />
            </div>
            <AdminPageHeader
              eyebrow={
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin workspace
                </span>
              }
              title={`Welcome back, ${user.name ?? "Admin"}`}
              description="Monitor Guidely content, student accounts, universities, and major data from one production dashboard."
              className="border-b-0 pb-0"
            />
          </div>

          <Link
            href="/admin/majors/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add Major
          </Link>
        </div>
      </AdminCard>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statsConfig.map(({ label, helper, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-brand-50 p-2.5 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </div>
            <div className="mt-5">
              {value === null ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              )}
              <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
              <p className="mt-1 text-xs text-gray-500">{helper}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl text-gray-900">Operations</h2>
              <p className="mt-1 text-sm text-gray-500">Common admin workflows</p>
            </div>
            <GraduationCap className="h-5 w-5 text-brand-600" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
              >
                <Icon className="mb-3 h-5 w-5 text-brand-600" />
                {label}
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="mb-5">
            <h2 className="font-heading text-xl text-gray-900">System Snapshot</h2>
            <p className="mt-1 text-sm text-gray-500">Content readiness overview</p>
          </div>

          <div className="space-y-4">
            {[
              ["Content API", "Online"],
              ["Admin access", "Protected"],
              ["Data updates", "Ready"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>
    </AdminPageShell>
  );
}
