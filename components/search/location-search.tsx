"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchLocalitySuggest } from "@/src/apis/search";
import { cn } from "@/src/lib/cn";
import { persistCity, readStoredCity } from "@/src/lib/city-storage";
import { getPropertyHref } from "@/src/lib/sitemap-slug";
import { buildCitySrpHref, buildLocalitySrpHref } from "@/src/lib/srp/locality-srp-href";
import { capitalizeFirstLetter } from "@/src/lib/string-utils";
import { useDebounce } from "@/src/lib/use-debounce";
import type { LocalitySuggestProperty } from "@/src/models/search";
import {
  cities,
  defaultCitySlug,
  getCityLabel,
  type CitySlug,
} from "@/src/tokens/cities";

const LOCALITY_SUGGEST_DEBOUNCE_MS = 500;
const LOCALITY_SUGGEST_MIN_LENGTH = 3;

type SuggestItem =
  | { kind: "locality"; label: string }
  | { kind: "property"; label: string; property: LocalitySuggestProperty };

export interface LocationSearchValue {
  city: CitySlug;
  locality: string;
}

export interface LocationSearchProps {
  className?: string;
  barClassName?: string;
  city?: CitySlug;
  defaultCity?: CitySlug;
  locality?: string;
  defaultLocality?: string;
  localityPlaceholder?: string;
  strictLocality?: boolean;
  /** When true, selecting a locality only updates state — no navigation. */
  searchOnly?: boolean;
  /** Override SRP slug used when building locality URLs (defaults from route + city). */
  srpSlug?: string;
  /** When true, changing city navigates to that city's SRP (city pages only). */
  navigateOnCityChange?: boolean;
  onCityChange?: (city: CitySlug) => void;
  onLocalityChange?: (locality: string) => void;
  onSearch?: (value: LocationSearchValue) => void;
}

type Panel = "city" | "locality" | null;

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={cn("aspect-square shrink-0", className)}
    >
      <path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M15 15L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M4 21V5.5C4 4.67157 4.67157 4 5.5 4H12.5C13.3284 4 14 4.67157 14 5.5V21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10H18.5C19.3284 10 20 10.6716 20 11.5V21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 21H20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M7 8H9.5M7 12H9.5M7 16H9.5M16.5 14H17.5M16.5 17H17.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchDropdown({
  open,
  children,
  className,
  labelledBy,
  id,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      role="listbox"
      aria-labelledby={labelledBy}
      className={cn(
        "absolute top-[calc(100%+10px)] z-50 max-h-[min(16rem,50vh)] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg",
        "transition-all duration-200 ease-out motion-reduce:transition-none",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LocationSearch({
  className,
  barClassName,
  city: cityProp,
  defaultCity = defaultCitySlug,
  locality: localityProp,
  defaultLocality = "",
  localityPlaceholder = "Search for Localities",
  strictLocality = true,
  searchOnly = false,
  srpSlug,
  navigateOnCityChange = false,
  onCityChange,
  onLocalityChange,
  onSearch,
}: LocationSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const localityOptionRefs = useRef(new Map<number, HTMLButtonElement>());
  const cityButtonId = useId();
  const localityInputId = useId();
  const localityListboxId = useId();

  const [internalCity, setInternalCity] = useState<CitySlug>(defaultCity);
  const [internalLocality, setInternalLocality] = useState(defaultLocality);
  const [localityQuery, setLocalityQuery] = useState(defaultLocality);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [highlightedCity, setHighlightedCity] = useState<CitySlug | null>(null);
  const [highlightedLocalityIndex, setHighlightedLocalityIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);

  const debouncedLocalityQuery = useDebounce(
    localityQuery,
    LOCALITY_SUGGEST_DEBOUNCE_MS,
  );

  const city = cityProp ?? internalCity;
  const locality = localityProp ?? internalLocality;

  const cityOpen = activePanel === "city";
  const localityOpen = activePanel === "locality";
  const trimmedLocalityQuery = localityQuery.trim();
  const canSuggestLocalities =
    trimmedLocalityQuery.length >= LOCALITY_SUGGEST_MIN_LENGTH;
  const isDebouncingSuggestions =
    canSuggestLocalities && trimmedLocalityQuery !== debouncedLocalityQuery.trim();
  const showLocalityDropdown =
    localityOpen &&
    canSuggestLocalities &&
    (isLoadingSuggestions ||
      isDebouncingSuggestions ||
      hasFetchedSuggestions);

  const localitySuggestions = suggestions.filter(
    (item): item is Extract<SuggestItem, { kind: "locality" }> =>
      item.kind === "locality",
  );
  const hasSuggestions = suggestions.length > 0;

  const activeLocalityOptionId =
    highlightedLocalityIndex >= 0 &&
    highlightedLocalityIndex < suggestions.length
      ? `${localityListboxId}-option-${highlightedLocalityIndex}`
      : undefined;

  // Always land on the city coliving SRP (e.g. /coliving-in-bangalore), not the
  // current page's gender/hostel marketing slug.
  const citySrpHref = buildCitySrpHref(city);

  function localityOptionId(index: number) {
    return `${localityListboxId}-option-${index}`;
  }

  function moveHighlightedLocality(direction: 1 | -1) {
    if (suggestions.length === 0) return;

    setHighlightedLocalityIndex((current) => {
      if (current < 0) {
        return direction === 1 ? 0 : suggestions.length - 1;
      }
      const next = current + direction;
      if (next < 0) return 0;
      if (next >= suggestions.length) {
        return suggestions.length - 1;
      }
      return next;
    });
  }

  function updateCity(nextCity: CitySlug) {
    if (cityProp === undefined) setInternalCity(nextCity);
    persistCity(nextCity);
    if (localityProp === undefined) {
      setInternalLocality("");
      setLocalityQuery("");
    }
    setSuggestions([]);
    setHasFetchedSuggestions(false);
    onCityChange?.(nextCity);
    setActivePanel(null);
    setHighlightedCity(null);

    if (navigateOnCityChange) {
      const href = buildCitySrpHref(nextCity, { pathname, srpSlug });
      if (href) router.push(href);
    }
  }

  function updateLocality(nextLocality: string) {
    if (localityProp === undefined) {
      setInternalLocality(nextLocality);
      setLocalityQuery(nextLocality);
    }
    onLocalityChange?.(nextLocality);
    setActivePanel(null);
    setHighlightedLocalityIndex(-1);
  }

  function selectLocality(nextLocality: string) {
    updateLocality(nextLocality);

    if (searchOnly) return;

    const href = buildLocalitySrpHref(city, nextLocality, {
      pathname,
      srpSlug,
    });
    if (href) router.push(href);
  }

  function selectProperty(property: LocalitySuggestProperty) {
    const label = capitalizeFirstLetter(property.display_name || property.name);
    updateLocality(label);

    if (searchOnly) return;

    const href = getPropertyHref(property);
    if (href) router.push(href);
  }

  function selectSuggestion(item: SuggestItem) {
    if (item.kind === "locality") {
      selectLocality(item.label);
      return;
    }
    selectProperty(item.property);
  }

  function handleSearch() {
    onSearch?.({ city, locality: localityQuery.trim() || locality });
    setActivePanel(null);

    if (searchOnly) return;

    const href = buildCitySrpHref(city, { pathname, srpSlug });
    if (href) router.push(href);
  }

  useEffect(() => {
    if (cityProp !== undefined) return;
    setInternalCity(readStoredCity());
  }, [cityProp]);

  useEffect(() => {
    if (localityProp !== undefined) {
      setLocalityQuery(localityProp);
      return;
    }

    setLocalityQuery(defaultLocality);
    setInternalLocality(defaultLocality);
  }, [localityProp, defaultLocality]);

  useEffect(() => {
    const query = debouncedLocalityQuery.trim();

    if (query.length < LOCALITY_SUGGEST_MIN_LENGTH) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      setHasFetchedSuggestions(false);
      setHighlightedLocalityIndex(-1);
      return;
    }

    const abortController = new AbortController();

    async function loadSuggestions() {
      setIsLoadingSuggestions(true);
      setHasFetchedSuggestions(false);

      try {
        const { success, data } = await fetchLocalitySuggest({
          city,
          keyword: query,
          campaign: strictLocality ? "ok" : "",
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) return;

        if (!success) {
          setSuggestions([]);
        } else {
          const nextSuggestions: SuggestItem[] = [
            ...data.locality.map((label) => ({
              kind: "locality" as const,
              label,
            })),
            ...data.properties.map((property) => ({
              kind: "property" as const,
              label: capitalizeFirstLetter(
                property.display_name || property.name,
              ),
              property,
            })),
          ];
          setSuggestions(nextSuggestions);
        }
        setHasFetchedSuggestions(true);
        setHighlightedLocalityIndex(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSuggestions([]);
        setHasFetchedSuggestions(true);
        setHighlightedLocalityIndex(-1);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }

    void loadSuggestions();

    return () => {
      abortController.abort();
    };
  }, [city, debouncedLocalityQuery, strictLocality]);

  useEffect(() => {
    if (highlightedLocalityIndex < 0) return;
    localityOptionRefs.current
      .get(highlightedLocalityIndex)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlightedLocalityIndex, suggestions]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActivePanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative w-full min-w-0", className)}>
      <div
        className={cn(
          "flex items-center gap-0 rounded-full border border-gray-200 bg-white p-1.5 sm:p-2",
          barClassName ?? "shadow-lg",
        )}
      >
        <div className="relative w-auto shrink-0">
          <button
            id={cityButtonId}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={cityOpen}
            onClick={() =>
              setActivePanel((panel) => (panel === "city" ? null : "city"))
            }
            className="flex w-auto min-w-0 items-center gap-2 rounded-full px-1.5 py-1 transition-colors hover:bg-gray-50 sm:gap-3 sm:px-2 sm:py-1.5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 sm:size-10">
              <LocationIcon className="size-4 text-black sm:size-5" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block opacity-50 font-satoshi text-xs font-bold leading-[18px] text-[#0A0F14]">
                You are in
              </span>
              <span className="flex min-w-0 items-center gap-0.5 text-xs font-bold text-hello-lime-700 sm:gap-1 sm:text-sm">
                <span className="max-w-[4.75rem] truncate sm:max-w-none">
                  {getCityLabel(city)}
                </span>
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 shrink-0 text-gray-600 transition-transform duration-200 motion-reduce:transition-none sm:size-4",
                    cityOpen && "rotate-180",
                  )}
                />
              </span>
            </span>
          </button>

          <SearchDropdown
            open={cityOpen}
            labelledBy={cityButtonId}
            className="left-0 right-auto w-[min(100vw-3rem,17.5rem)] p-2"
          >
            {cities.map((option) => {
              const isSelected = option.slug === city;
              const isHighlighted = highlightedCity === option.slug;

              return (
                <button
                  key={option.slug}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedCity(option.slug)}
                  onMouseLeave={() => setHighlightedCity(null)}
                  onClick={() => updateCity(option.slug)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors",
                    isSelected || isHighlighted
                      ? "bg-hello-lime-50"
                      : "hover:bg-hello-lime-50",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </SearchDropdown>
        </div>

        <span
          aria-hidden
          className="mx-1 h-8 w-px shrink-0 bg-gray-200 sm:mx-2 sm:h-10"
        />

        <div className="flex min-w-0 flex-1 items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor={localityInputId} className="sr-only">
              {localityPlaceholder}
            </label>
            <input
              id={localityInputId}
              type="search"
              role="combobox"
              autoComplete="off"
              aria-expanded={showLocalityDropdown}
              aria-controls={localityListboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeLocalityOptionId}
              value={localityQuery}
              placeholder={localityPlaceholder}
              onChange={(event) => {
                setLocalityQuery(event.target.value);
                setActivePanel("locality");
                setHighlightedLocalityIndex(-1);
                if (event.target.value.trim().length < LOCALITY_SUGGEST_MIN_LENGTH) {
                  setSuggestions([]);
                  setHasFetchedSuggestions(false);
                }
              }}
              onFocus={() => setActivePanel("locality")}
              onKeyDown={(event) => {
                if (
                  showLocalityDropdown &&
                  hasSuggestions &&
                  (event.key === "ArrowDown" || event.key === "ArrowUp")
                ) {
                  event.preventDefault();
                  moveHighlightedLocality(event.key === "ArrowDown" ? 1 : -1);
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();
                  const selected =
                    highlightedLocalityIndex >= 0
                      ? suggestions[highlightedLocalityIndex]
                      : suggestions[0];
                  if (selected) {
                    selectSuggestion(selected);
                    return;
                  }
                  handleSearch();
                }
              }}
              className="w-full bg-transparent px-1 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none sm:px-3 sm:py-2.5"
            />

            <SearchDropdown
              open={showLocalityDropdown}
              id={localityListboxId}
              labelledBy={localityInputId}
              className="left-0 right-0"
            >
              {isLoadingSuggestions || isDebouncingSuggestions ? (
                <p className="px-4 py-3.5 text-sm text-gray-500">Searching…</p>
              ) : hasSuggestions ? (
                suggestions.map((item, index) => {
                  const isHighlighted = highlightedLocalityIndex === index;
                  const showPropertyHeader =
                    item.kind === "property" &&
                    localitySuggestions.length > 0 &&
                    (index === 0 || suggestions[index - 1]?.kind === "locality");

                  return (
                    <div key={`${item.kind}-${item.kind === "property" ? item.property.id : item.label}`}>
                      {showPropertyHeader ? (
                        <div className="relative mt-1 border-t border-gray-100 pt-2">
                          <p className="px-4 pb-1 text-xs font-medium text-gray-500">
                            HelloWorld Properties
                          </p>
                        </div>
                      ) : null}
                      <button
                        id={localityOptionId(index)}
                        ref={(element) => {
                          if (element) {
                            localityOptionRefs.current.set(index, element);
                          } else {
                            localityOptionRefs.current.delete(index);
                          }
                        }}
                        type="button"
                        role="option"
                        aria-selected={isHighlighted || locality === item.label}
                        onMouseEnter={() => setHighlightedLocalityIndex(index)}
                        onMouseLeave={() => setHighlightedLocalityIndex(-1)}
                        onClick={() => selectSuggestion(item)}
                        className={cn(
                          "w-full px-4 py-3.5 text-left text-sm font-medium text-[#0A0F14] transition-colors",
                          index < suggestions.length - 1 && "border-b border-gray-100",
                          item.kind === "property" && "flex items-center gap-2.5",
                          isHighlighted ? "bg-gray-100" : "hover:bg-gray-25",
                        )}
                      >
                        {item.kind === "property" ? (
                          <>
                            <BuildingIcon className="size-4 shrink-0 text-gray-500" />
                            <span className="min-w-0 truncate">{item.label}</span>
                          </>
                        ) : (
                          item.label
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3.5">
                  <p className="text-sm text-gray-500">No locality found</p>
                  {citySrpHref ? (
                    <Link
                      href={citySrpHref}
                      onClick={() => setActivePanel(null)}
                      className="mt-2 inline-block text-sm font-semibold text-hello-lime-700 transition-colors hover:text-hello-lime-800 hover:underline"
                    >
                      Explore properties in {getCityLabel(city)}
                    </Link>
                  ) : null}
                </div>
              )}
            </SearchDropdown>
          </div>

          <button
            type="button"
            aria-label="Search localities"
            onClick={handleSearch}
            className={cn(
              "group ml-1 flex h-9 w-9 shrink-0 items-center justify-center gap-0 overflow-visible rounded-full bg-hello-lime-500 text-white",
              "transition-[width,background-color,padding,gap] duration-200 ease-out motion-reduce:transition-none",
              "hover:bg-hello-lime-600",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100",
              "sm:h-11 sm:w-11 sm:hover:w-[6.75rem] sm:hover:justify-start sm:hover:gap-2 sm:hover:px-3.5",
            )}
          >
            <SearchIcon className="size-4 shrink-0 sm:size-5" />
            <span
              aria-hidden
              className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none sm:inline sm:group-hover:max-w-[3.5rem] sm:group-hover:opacity-100"
            >
              Search
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
