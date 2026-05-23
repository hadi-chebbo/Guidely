"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  MessageCircleQuestion,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  muted?: boolean;
};

const navSections: Array<{ title: string; links: AdminNavLink[] }> = [
  {
    title: "Workspace",
    links: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/majors", label: "Majors", icon: BookOpen },
      { href: "/admin/universities", label: "Universities", icon: Building2 },
      { href: "/admin/faqs", label: "FAQs", icon: MessageCircleQuestion },
    ],
  },
  {
    title: "People",
    links: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/mentors", label: "Mentors", icon: UserCheck },
      { href: "/admin/mentor-applications", label: "Applications", icon: ClipboardList },
    ],
  },
  {
    title: "Planning",
    links: [
      { href: "/admin/test-bank", label: "Test Bank", icon: ClipboardList, muted: true },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, muted: true },
    ],
  },
];

export default function AdminSidebar({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-72 flex-col border-r border-gray-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between gap-3 border-b border-gray-200 px-5">
        <Link href="/admin" onClick={onClose} className="flex min-w-0 items-center gap-3">
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
              Admin Console
            </p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 lg:hidden"
            aria-label="Close admin navigation"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.links.map(({ href, label, icon: Icon, exact, muted }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active
                        ? "bg-brand-700 text-white shadow-sm"
                        : muted
                          ? "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
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
                    {muted && !active && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Content quality</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Keep majors and universities updated so students see reliable guidance.
          </p>
        </div>
      </div>
    </aside>
  );
}
