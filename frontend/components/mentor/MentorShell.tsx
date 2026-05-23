"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  UserRoundCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { cn } from "@/lib/utils";

type MentorNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const navLinks: MentorNavLink[] = [
  { href: "/mentor", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/mentor/profile", label: "Profile", icon: UserRoundCog },
  { href: "/mentor/sessions", label: "Sessions", icon: CalendarClock },
];

const pageTitles: Array<{ match: string; title: string; subtitle: string; exact?: boolean }> = [
  { match: "/mentor", title: "Overview", subtitle: "Your mentor activity and next actions", exact: true },
  { match: "/mentor/profile", title: "Profile", subtitle: "Keep your public mentor details sharp" },
  { match: "/mentor/sessions", title: "Sessions", subtitle: "Create and manage student mentoring sessions" },
];

function getPageMeta(pathname: string) {
  return (
    pageTitles.find((item) => (item.exact ? pathname === item.match : pathname.startsWith(item.match))) ??
    { title: "Mentor", subtitle: "Guidely mentor workspace" }
  );
}

export function MentorSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex w-72 flex-col border-r border-gray-200 bg-white shadow-sm", className)}>
      <Link href="/mentor" className="flex h-16 items-center gap-3 border-b border-gray-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <Image
            src="/logo-transparent.png"
            alt="Guidely"
            width={34}
            height={34}
            priority
            className="object-contain"
          />
        </div>
        <div className="leading-tight">
          <p className="font-heading text-lg font-bold text-gray-900">Guidely</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Mentor Studio
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Workspace
          </p>
          <div className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-gray-600 hover:bg-brand-50 hover:text-brand-800"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-gray-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Mentor quality</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Keep your profile current and sessions clear so students can book with confidence.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MentorTopbar() {
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
          <div className="mb-0.5 inline-flex items-center gap-2 text-xs font-semibold text-brand-700">
            <GraduationCap className="h-3.5 w-3.5" />
            Mentor Workspace
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <h1 className="truncate font-heading text-base font-bold text-gray-900 sm:text-lg">{page.title}</h1>
            <p className="hidden text-xs text-gray-500 sm:block">{page.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-10 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 shadow-sm md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {(user?.name ?? "M").slice(0, 1).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-900">{user?.name ?? "Mentor"}</p>
              <p className="text-[11px] text-gray-400">{user?.email ?? "mentor"}</p>
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

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
        <MessageSquareText className="h-5 w-5" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
