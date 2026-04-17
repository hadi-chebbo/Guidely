"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  isLoading?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-950 hover:bg-brand-700 active:bg-brand-800 text-white shadow-brand " +
    "focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
  ghost:
    "border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 " +
    "focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
  danger:
    "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white " +
    "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-sm rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant   = "primary",
      size      = "lg",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "font-semibold transition-all duration-200 cursor-pointer",
          "focus:outline-none",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
