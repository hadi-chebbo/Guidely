"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Plus,
  UserRoundCog,
  Users,
} from "lucide-react";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import { mentorService } from "@/services/mentorService";

export default function MentorOverviewPage() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["mentor-sessions"],
    queryFn: mentorService.getSessions,
  });

  const activeSessions = sessions.filter((session) => session.is_active).length;
  const groupSessions = sessions.filter((session) => session.type === "group").length;
  const totalAvailability = sessions.reduce(
    (total, session) => total + Number(session.availabilities_count ?? 0),
    0
  );

  const stats = [
    {
      label: "Sessions",
      helper: "Created offers",
      value: sessions.length,
      icon: CalendarClock,
      href: "/mentor/sessions",
    },
    {
      label: "Active",
      helper: "Visible to students",
      value: activeSessions,
      icon: CheckCircle2,
      href: "/mentor/sessions",
    },
    {
      label: "Group Sessions",
      helper: "Multi-student formats",
      value: groupSessions,
      icon: Users,
      href: "/mentor/sessions",
    },
    {
      label: "Availability",
      helper: "Linked time slots",
      value: totalAvailability,
      icon: Clock3,
      href: "/mentor/sessions",
    },
  ];

  return (
    <AdminPageShell>
      <AdminCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <AdminPageHeader
            eyebrow="Mentor workspace"
            title="Welcome back"
            description="Manage the profile and session offers students see when they choose a mentor."
            className="border-b-0 pb-0"
          />

          <Link
            href="/mentor/sessions"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Link>
        </div>
      </AdminCard>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, helper, value, icon: Icon, href }) => (
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
              {isLoading ? (
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl text-gray-900">Recent Sessions</h2>
              <p className="mt-1 text-sm text-gray-500">Latest offers in your mentor catalog</p>
            </div>
            <CalendarClock className="h-5 w-5 text-brand-600" />
          </div>

          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
              ))
            ) : sessions.length ? (
              sessions.slice(0, 4).map((session) => (
                <div key={session.slug} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{session.title}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {session.duration_minutes} min · {session.type === "one-on-one" ? "One-on-one" : "Group"}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {session.currency} {Number(session.price).toFixed(0)}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                Create your first session to start accepting student interest.
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="mb-5">
            <h2 className="font-heading text-xl text-gray-900">Profile Readiness</h2>
            <p className="mt-1 text-sm text-gray-500">Keep these details polished for student trust</p>
          </div>

          <div className="space-y-3">
            {[
              "Select your major expertise",
              "Write a useful mentor bio",
              "Publish at least one active session",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-brand-600" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/mentor/profile"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-800"
          >
            <UserRoundCog className="h-4 w-4" />
            Edit Profile
          </Link>
        </AdminCard>
      </section>
    </AdminPageShell>
  );
}
