"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

const pageTitles: Array<{ match: string; title: string; subtitle: string; exact?: boolean }> = [
  { match: "/admin", title: "Overview", subtitle: "Platform health and admin shortcuts", exact: true },
  { match: "/admin/majors/create", title: "Add Major", subtitle: "Create a new academic path" },
  { match: "/admin/majors", title: "Majors", subtitle: "Manage academic paths and market data" },
  { match: "/admin/universities", title: "Universities", subtitle: "Manage universities and offered programs" },
  { match: "/admin/faqs", title: "FAQs", subtitle: "Curate student-facing questions" },
  { match: "/admin/users", title: "Users", subtitle: "Review and moderate student accounts" },
  { match: "/admin/mentor-applications", title: "Mentor Applications", subtitle: "Review pending mentor requests" },
  { match: "/admin/mentors", title: "Mentors", subtitle: "Manage mentor access and profiles" },
  { match: "/admin/test-bank", title: "Test Bank", subtitle: "Question bank tools are coming soon" },
  { match: "/admin/analytics", title: "Analytics", subtitle: "Platform insights are coming soon" },
];

function getPageMeta(pathname: string) {
  return (
    pageTitles.find((item) => (item.exact ? pathname === item.match : pathname.startsWith(item.match))) ??
    { title: "Admin", subtitle: "Guidely management console" }
  );
}

export default function AdminTopbar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const page = getPageMeta(pathname);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex h-16 items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-0.5 flex items-center gap-2 text-xs font-semibold text-brand-700">
            <button
              type="button"
              onClick={onOpenMenu}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Panel
            </span>
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <h1 className="truncate font-heading text-base font-bold text-gray-900 sm:text-lg">{page.title}</h1>
            <p className="hidden text-xs text-gray-500 sm:block">{page.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-10 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 shadow-sm md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {(user?.name ?? "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-900">{user?.name ?? "Admin"}</p>
              <p className="text-[11px] text-gray-400">{user?.email ?? "admin"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
