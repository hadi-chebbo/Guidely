"use client";

import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={hasError}
          rows={4}
          className={cn(
            "auth-input resize-y min-h-[96px]",
            hasError && "auth-input-error",
            className
          )}
          {...props}
        />

        {error && (
          <p role="alert" className="field-error">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
