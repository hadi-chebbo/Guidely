"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      placeholder,
      searchPlaceholder = "Search options...",
      emptyMessage = "No options found.",
      options,
      className,
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const selectedValue = String(value ?? defaultValue ?? "");
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const visibleOptions = useMemo(() => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return options;

      return options.filter((opt) =>
        opt.label.toLowerCase().includes(normalized) ||
        opt.value.toLowerCase().includes(normalized)
      );
    }, [options, query]);

    useEffect(() => {
      const handlePointerDown = (event: PointerEvent) => {
        if (!wrapperRef.current?.contains(event.target as Node)) {
          setOpen(false);
          setQuery("");
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    useEffect(() => {
      if (open) searchRef.current?.focus();
    }, [open]);

    const emitChange = (nextValue: string) => {
      const syntheticEvent = {
        target: { value: nextValue, name },
        currentTarget: { value: nextValue, name },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange?.(syntheticEvent);
    };

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;

      emitChange(option.value);
      setOpen(false);
      setQuery("");
    };

    return (
      <div className="w-full" ref={wrapperRef}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            name={name}
            required={required}
            disabled={disabled}
            value={selectedValue}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={hasError}
            className="sr-only"
            tabIndex={-1}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            id={`${selectId}-button`}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${selectId}-listbox`}
            onClick={() => {
              if (disabled) return;
              setOpen((current) => !current);
            }}
            className={cn(
              "auth-input flex min-h-[46px] items-center justify-between gap-3 pr-3 text-left",
              !selectedOption && "text-gray-400",
              hasError && "auth-input-error",
              disabled && "cursor-not-allowed opacity-60",
              className
            )}
          >
            <span className="min-w-0 truncate">
              {selectedOption?.label ?? placeholder ?? "Select option"}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 text-gray-400 transition-transform",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>

          <ChevronDown
            className="hidden"
            aria-hidden="true"
          />

          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="border-b border-gray-100 p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>

              <div
                id={`${selectId}-listbox`}
                role="listbox"
                aria-labelledby={`${selectId}-button`}
                className="max-h-64 overflow-y-auto p-1"
              >
                {placeholder && (
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedValue === ""}
                    onClick={() => handleSelect({ value: "", label: placeholder })}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-500 transition hover:bg-gray-50"
                  >
                    <span className="min-w-0 truncate">{placeholder}</span>
                    {selectedValue === "" && <Check className="h-4 w-4 flex-shrink-0 text-brand-600" />}
                  </button>
                )}

                {visibleOptions.length > 0 ? (
                  visibleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={opt.value === selectedValue}
                      disabled={opt.disabled}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                        opt.value === selectedValue
                          ? "bg-brand-50 text-brand-800"
                          : "text-gray-700 hover:bg-gray-50",
                        opt.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <span className="min-w-0 truncate">{opt.label}</span>
                      {opt.value === selectedValue && <Check className="h-4 w-4 flex-shrink-0 text-brand-600" />}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-8 text-center text-sm text-gray-500">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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

Select.displayName = "Select";
export default Select;
