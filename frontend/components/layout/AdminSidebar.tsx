"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  MessageCircleQuestion,
  ClipboardList,
  Users,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin",              label: "Overview",   icon: LayoutDashboard, exact: true },
  { href: "/admin/majors",       label: "Majors",     icon: BookOpen },
  { href: "/admin/universities", label: "Universities", icon: Building2 },
  { href: "/admin/faqs",         label: "FAQs",       icon: MessageCircleQuestion },
  { href: "/admin/test-bank",    label: "Test Bank",  icon: ClipboardList },
  { href: "/admin/users",        label: "Users",      icon: Users },
  { href: "/admin/mentors",      label: "Mentors",    icon: UserCheck },
  { href: "/admin/analytics",    label: "Analytics",  icon: BarChart3 },
];

export default function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-60 flex-col border-r border-gray-100 bg-white",
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
          <LayoutDashboard className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-gray-900 font-heading">Guidely</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-600 font-semibold">Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {adminLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-gray-400")}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
