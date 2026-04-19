"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:      string;
  error?:      string;
  success?:    string;
  hint?:       string;
  leftIcon?:   React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      leftIcon,
      rightElement,
      type,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword  = type === "password";
    const inputType   = isPassword ? (showPassword ? "text" : "password") : type;
    const inputId     = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError    = Boolean(error);
    const hasSuccess  = Boolean(success) && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "auth-input",
              leftIcon   && "pl-10",
              (isPassword || rightElement) && "pr-11",
              hasError   && "auth-input-error",
              hasSuccess && "border-brand-400 focus:border-brand-500 focus:ring-brand-500/25",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error   ? `${inputId}-error`   :
              hint    ? `${inputId}-hint`    :
              success ? `${inputId}-success` :
              undefined
            }
            {...props}
          />

          {/* Right: password toggle OR custom right element OR status icon */}
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {isPassword ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            ) : rightElement ? (
              rightElement
            ) : hasSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
            ) : null}
          </span>
        </div>

        {/* Messages */}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="field-error"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
        {!error && success && (
          <p id={`${inputId}-success`} className="flex items-center gap-1 mt-1.5 text-xs text-brand-600">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            {success}
          </p>
        )}
        {!error && !success && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
