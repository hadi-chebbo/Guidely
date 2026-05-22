"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export interface SearchableDropdownOption<T = unknown> {
  value: string;
  label: string;
  disabled?: boolean;
  item?: T;
}

interface SearchableDropdownProps<T = unknown> {
  value: string;
  onChange: (value: string, option?: SearchableDropdownOption<T>) => void;
  loadOptions: (search: string) => Promise<SearchableDropdownOption<T>[]>;
  selectedOption?: SearchableDropdownOption<T> | null;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export default function SearchableDropdown<T = unknown>({
  value,
  onChange,
  loadOptions,
  selectedOption,
  label,
  placeholder = "Select option",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  error,
  hint,
  disabled,
  clearable,
  className,
  id,
  name,
}: SearchableDropdownProps<T>) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-") ?? name;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [options, setOptions] = useState<SearchableDropdownOption<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const hasError = Boolean(error);

  const activeOption = useMemo(
    () =>
      options.find((option) => option.value === value) ??
      selectedOption ??
      null,
    [options, selectedOption, value],
  );

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

  useEffect(() => {
    if (!open) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setLoadError(false);

    loadOptions(debouncedQuery.trim())
      .then((items) => {
        if (requestIdRef.current !== requestId) return;
        setOptions(items);
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setOptions([]);
        setLoadError(true);
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      });
  }, [debouncedQuery, loadOptions, open]);

  const handleSelect = (option: SearchableDropdownOption<T>) => {
    if (option.disabled) return;
    onChange(option.value, option);
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
        <button
          type="button"
          id={selectId ? `${selectId}-button` : undefined}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={selectId ? `${selectId}-listbox` : undefined}
          onClick={() => {
            if (disabled) return;
            setOpen((current) => !current);
          }}
          className={cn(
            "auth-input flex min-h-[46px] items-center justify-between gap-3 pr-3 text-left",
            !activeOption && "text-gray-400",
            hasError && "auth-input-error",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          <span className="min-w-0 truncate">
            {activeOption?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 flex-shrink-0 text-gray-400 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

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
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>
            </div>

            <div
              id={selectId ? `${selectId}-listbox` : undefined}
              role="listbox"
              aria-labelledby={selectId ? `${selectId}-button` : undefined}
              className="max-h-64 overflow-y-auto p-1"
            >
              {loadError ? (
                <div className="px-3 py-8 text-center text-sm text-red-500">
                  Options could not be loaded.
                </div>
              ) : options.length > 0 ? (
                <>
                  {clearable && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === ""}
                      onClick={() => handleSelect({ value: "", label: placeholder })}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-500 transition hover:bg-gray-50"
                    >
                      <span className="min-w-0 truncate">{placeholder}</span>
                      {value === "" && (
                        <Check className="h-4 w-4 flex-shrink-0 text-brand-600" />
                      )}
                    </button>
                  )}
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={option.value === value}
                      disabled={option.disabled}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                        option.value === value
                          ? "bg-brand-50 text-brand-800"
                          : "text-gray-700 hover:bg-gray-50",
                        option.disabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span className="min-w-0 truncate">{option.label}</span>
                      {option.value === value && (
                        <Check className="h-4 w-4 flex-shrink-0 text-brand-600" />
                      )}
                    </button>
                  ))}
                </>
              ) : isLoading ? (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  Loading options...
                </div>
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
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}
