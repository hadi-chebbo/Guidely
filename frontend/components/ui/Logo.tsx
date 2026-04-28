"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "brand" | "white" | "current";
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

const wordSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
};

/**
 * Guidely — "The Ascent"
 *
 * Three stacked chevrons forming an abstract cedar/peak silhouette
 * with an amber star apex. Reads as:
 *   • Lebanese cedar (local identity)
 *   • Upward arrow (forward motion, ambition)
 *   • North star (guidance, decision-making)
 *
 * Geometric, monochrome-safe, recognizable at 16px favicon scale.
 */
export default function Logo({
  className,
  variant = "mark",
  size = "md",
  color = "brand",
}: LogoProps) {
  const primary =
    color === "white" ? "#ffffff" : color === "current" ? "currentColor" : "#0e1733";
  const accent =
    color === "white" ? "#fbbf24" : color === "current" ? "currentColor" : "#f59e0b";

  if (variant === "wordmark") {
    return (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        <Mark primary={primary} accent={accent} className={sizeClasses[size]} />
        <span
          className={cn(
            "font-heading font-bold tracking-tight",
            wordSizes[size]
          )}
          style={{ color: primary, letterSpacing: "-0.025em" }}
        >
          Guidely
        </span>
      </span>
    );
  }

  return (
    <Mark primary={primary} accent={accent} className={cn(sizeClasses[size], className)} />
  );
}

interface MarkProps {
  primary: string;
  accent: string;
  className?: string;
}

function Mark({ primary, accent, className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Guidely"
    >
      {/* Apex star — guidance / north */}
      <path
        d="M20 4 L21.4 7 L20 8.4 L18.6 7 Z"
        fill={accent}
      />

      {/* Top chevron — narrowest peak */}
      <path
        d="M20 11 L26 17 L23.5 17 L20 13.6 L16.5 17 L14 17 Z"
        fill={primary}
      />

      {/* Middle chevron */}
      <path
        d="M20 19 L29 27 L25.8 27 L20 21.8 L14.2 27 L11 27 Z"
        fill={primary}
      />

      {/* Base chevron — widest foundation */}
      <path
        d="M20 27 L32 36 L28 36 L20 30 L12 36 L8 36 Z"
        fill={primary}
      />
    </svg>
  );
}
