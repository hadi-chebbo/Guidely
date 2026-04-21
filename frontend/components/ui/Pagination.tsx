"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const pages = buildPageRange(currentPage, lastPage);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-1 py-2 text-sm text-gray-600",
        className
      )}
    >
      <span className="hidden sm:block">
        Showing {from}–{to} of {total}
      </span>

      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </NavButton>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <NavButton
              key={p}
              onClick={() => onPageChange(p as number)}
              active={p === currentPage}
            >
              {p}
            </NavButton>
          )
        )}

        <NavButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({
  children,
  active,
  disabled,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-950 text-white"
          : "text-gray-600 hover:bg-gray-100",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function buildPageRange(current: number, last: number): (number | "…")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < last - 2) pages.push("…");

  pages.push(last);
  return pages;
}
