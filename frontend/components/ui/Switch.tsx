"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export default function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}: SwitchProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          checked ? "bg-brand-950" : "bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm",
            "transform transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>

      {(label || description) && (
        <div>
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
