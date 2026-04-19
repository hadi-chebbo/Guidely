"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GitCompare,
  Building2,
  BrainCircuit,
  Users,
  TrendingUp,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard",     label: "Dashboard",        icon: LayoutDashboard },
  { href: "/majors",        label: "Explore Majors",   icon: BookOpen },
  { href: "/compare",       label: "Compare",          icon: GitCompare },
  { href: "/universities",  label: "Universities",     icon: Building2 },
  { href: "/quiz",          label: "Personality Test", icon: BrainCircuit },
  { href: "/mentors",       label: "Mentors",          icon: Users },
  { href: "/market",        label: "Market Research",  icon: TrendingUp },
  { href: "/saved",         label: "Saved Majors",     icon: Heart },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-60 flex-col border-r border-gray-100 bg-white",
        className
      )}
    >
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
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
