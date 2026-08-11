"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { fetchLocalitySuggest } from "@/src/apis/search";
import { cn } from "@/src/lib/cn";
import { persistCity, readStoredCity } from "@/src/lib/city-storage";
import { useDebounce } from "@/src/lib/use-debounce";
import {
  cities,
  defaultCitySlug,
  getCityLabel,
  type CitySlug,
} from "@/src/tokens/cities";

const SUGGEST_DEBOUNCE_MS = 500;
const SUGGEST_MIN_LENGTH = 3;

export interface LocationSuggestFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Classes for the field chrome (border, radius, shadow). */
  fieldClassName?: string;
  /** City used for locality suggestions. Defaults to stored / Bangalore. */
  city?: CitySlug;
  onCityChange?: (city: CitySlug) => void;
  /** When true, show a compact city selector beside the input. */
  showCitySelect?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export function LocationSuggestField({
  value,
  onChange,
  placeholder = "Search your location here",
  className,
  inputClassName,
  fieldClassName,
  city: cityProp,
  onCityChange,
  showCitySelect = true,
  invalid = false,
  id,
  name,
  disabled = false,
  readOnly = false,
}: LocationSuggestFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalCity, setInternalCity] = useState<CitySlug>(defaultCitySlug);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const city = cityProp ?? internalCity;
  const debouncedQuery = useDebounce(value, SUGGEST_DEBOUNCE_MS);
  const trimmedQuery = value.trim();
  const canSuggest = trimmedQuery.length >= SUGGEST_MIN_LENGTH;
  const isDebouncing =
    canSuggest && trimmedQuery !== debouncedQuery.trim();
  const showDropdown =
    !readOnly &&
    !disabled &&
    open &&
    canSuggest &&
    (isLoading || isDebouncing || hasFetched);

  useEffect(() => {
    if (cityProp !== undefined) return;
    setInternalCity(readStoredCity());
  }, [cityProp]);

  useEffect(() => {
    const query = debouncedQuery.trim();

    if (query.length < SUGGEST_MIN_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      setHasFetched(false);
      setHighlightedIndex(-1);
      return;
    }

    const abortController = new AbortController();

    async function loadSuggestions() {
      setIsLoading(true);
      setHasFetched(false);

      try {
        const { success, data } = await fetchLocalitySuggest({
          city,
          keyword: query,
          campaign: "ok",
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) return;

        setSuggestions(success ? data.locality : []);
        setHasFetched(true);
        setHighlightedIndex(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setSuggestions([]);
        setHasFetched(true);
        setHighlightedIndex(-1);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadSuggestions();

    return () => {
      abortController.abort();
    };
  }, [city, debouncedQuery]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function updateCity(nextCity: CitySlug) {
    if (cityProp === undefined) setInternalCity(nextCity);
    persistCity(nextCity);
    onCityChange?.(nextCity);
    setSuggestions([]);
    setHasFetched(false);
  }

  function selectSuggestion(label: string) {
    onChange(label);
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || suggestions.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setHighlightedIndex((current) => {
        if (current < 0) {
          return direction === 1 ? 0 : suggestions.length - 1;
        }
        const next = current + direction;
        if (next < 0) return 0;
        if (next >= suggestions.length) return suggestions.length - 1;
        return next;
      });
      return;
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      const selected = suggestions[highlightedIndex];
      if (selected) selectSuggestion(selected);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex h-12 w-full items-center overflow-hidden rounded-xl border bg-white transition-shadow",
          invalid
            ? "border-error-300 ring-2 ring-error-100"
            : "border-gray-200 focus-within:border-hello-lime-300 focus-within:shadow-[0_0_0_3px_rgba(198,255,55,0.35)]",
          fieldClassName,
        )}
      >
        {showCitySelect && !readOnly ? (
          <>
            <label className="sr-only" htmlFor={`${inputId}-city`}>
              City
            </label>
            <select
              id={`${inputId}-city`}
              value={city}
              disabled={disabled}
              onChange={(event) => updateCity(event.target.value as CitySlug)}
              className="h-full max-w-[7.5rem] shrink-0 border-0 bg-transparent py-0 pl-3 pr-1 text-sm font-semibold text-gray-900 outline-none"
              aria-label="City for location search"
            >
              {cities.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="h-6 w-px shrink-0 bg-gray-200" />
          </>
        ) : null}

        <input
          id={inputId}
          name={name}
          type="search"
          role="combobox"
          autoComplete="off"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={invalid || undefined}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            if (readOnly) return;
            onChange(event.target.value);
            setOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (!readOnly) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400",
            readOnly && "text-gray-700",
            inputClassName,
          )}
        />
      </div>

      {showDropdown ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`Locations in ${getCityLabel(city)}`}
          className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-200 bg-white py-2 shadow-lg"
        >
          {isLoading || isDebouncing ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching…</p>
          ) : suggestions.length > 0 ? (
            suggestions.map((label, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={label}
                  type="button"
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(label);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm text-gray-900 transition-colors",
                    isHighlighted ? "bg-hello-lime-50" : "hover:bg-hello-lime-50",
                  )}
                >
                  {label}
                </button>
              );
            })
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">
              No matches — you can still submit with “{trimmedQuery}”.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
