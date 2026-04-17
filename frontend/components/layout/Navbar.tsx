"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/majors",      label: "Explore Majors" },
  { href: "/compare",     label: "Compare" },
  { href: "/universities",label: "Universities" },
  { href: "/quiz",        label: "Personality Test" },
  { href: "/mentors",     label: "Mentors" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-brand-700">
          <GraduationCap className="h-6 w-6" />
          <span className="text-xl">Guidely</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                pathname.startsWith(href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-brand transition-colors duration-150"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold text-center shadow-brand transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
