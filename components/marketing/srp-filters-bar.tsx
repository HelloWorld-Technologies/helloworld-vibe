"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { FilterCheckbox } from "@/components/ui/filter-checkbox";
import { Modal, ModalTitle } from "@/components/ui/modal";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import { cn } from "@/src/lib/cn";
import type { SrpQuery } from "@/src/models/srp-query";
import {
  srpAmenitiesList,
  srpBudgetPresets,
  srpGenderOptions,
  srpPriceRangeMax,
  srpPriceRangeMin,
  srpPriceRangeStep,
  srpSortingOptions,
  type SrpFilterOption,
} from "@/src/tokens/srp-filters";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterSlidersIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M7 3v14M13 3v14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="5" y="6" width="4" height="3" rx="0.75" fill="currentColor" />
      <rect x="11" y="11" width="4" height="3" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
      <path
        d="M2 2l8 8M10 2 2 10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatPriceChip(price: string): string {
  const [minRaw, maxRaw] = price.split(",");
  const min = Number(minRaw);
  const max = Number(maxRaw);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return "Budget";
  const format = (value: number) =>
    `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  return `${format(min)} – ${format(max)}`;
}

function getActiveFilterChips(query: SrpQuery) {
  const chips: Array<{ id: string; label: string; onRemove: () => Partial<SrpQuery> }> =
    [];

  if (query.price) {
    chips.push({
      id: "price",
      label: formatPriceChip(query.price),
      onRemove: () => ({ price: undefined }),
    });
  }

  if (query.gender && query.gender !== "any gender") {
    const label =
      srpGenderOptions.find((option) => option.value === query.gender)?.label ??
      query.gender;
    chips.push({
      id: "gender",
      label,
      onRemove: () => ({ gender: undefined }),
    });
  }

  if (query.food === "available") {
    chips.push({
      id: "food",
      label: "Food available",
      onRemove: () => ({ food: undefined }),
    });
  }

  if (query.amenity) {
    for (const amenity of query.amenity.split(",").filter(Boolean)) {
      chips.push({
        id: `amenity-${amenity}`,
        label: amenity,
        onRemove: () => {
          const remaining = query
            .amenity!.split(",")
            .filter((item) => item !== amenity);
          return { amenity: remaining.length > 0 ? remaining.join(",") : undefined };
        },
      });
    }
  }

  if (query.sort && query.sort !== "popularity") {
    const label =
      srpSortingOptions.find((option) => option.value === query.sort)?.label ??
      query.sort;
    chips.push({
      id: "sort",
      label: `Sort: ${label}`,
      onRemove: () => ({ sort: undefined }),
    });
  }

  return chips;
}

function FilterDropdown({
  label,
  selectedLabel,
  options,
  onSelect,
  className,
}: {
  label: string;
  selectedLabel?: string;
  options: readonly SrpFilterOption[];
  onSelect: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>{selectedLabel ?? label}</span>
        <ChevronDownIcon className="size-4 text-gray-500" />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-[12rem] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.value || option.label} role="option">
              <button
                type="button"
                className="flex w-full px-3.5 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SortDropdown({
  sortValue,
  onSelect,
  className,
  menuPlacement = "bottom",
  fullWidth = false,
}: {
  sortValue?: string;
  onSelect: (value: string) => void;
  className?: string;
  menuPlacement?: "top" | "bottom";
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected =
    srpSortingOptions.find((option) => option.value === sortValue) ??
    srpSortingOptions[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-700 hover:bg-gray-50",
          fullWidth && "w-full",
        )}
      >
        <span>Sort By:</span>
        <span className="truncate font-semibold text-hello-lime-900">
          {selected.label}
        </span>
        <ChevronDownIcon className="ml-auto size-4 shrink-0 text-gray-500" />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className={cn(
            "absolute z-20 min-w-full overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg",
            menuPlacement === "top"
              ? "bottom-[calc(100%+0.375rem)] left-0 right-0"
              : "right-0 top-[calc(100%+0.375rem)] min-w-[12.5rem]",
          )}
        >
          {srpSortingOptions.map((option) => (
            <li key={option.value} role="option">
              <button
                type="button"
                className={cn(
                  "flex w-full px-3.5 py-2.5 text-left text-sm hover:bg-gray-50",
                  option.value === selected.value
                    ? "font-semibold text-hello-lime-900"
                    : "text-gray-700",
                )}
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FoodToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-hello-lime-500" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-5 translate-y-0.5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function FilterModalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}

function GenderFilterChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Gender">
      {srpGenderOptions.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selected
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SrpFiltersBar({
  query,
  setQuery,
  slugGender,
}: {
  query: SrpQuery;
  setQuery: (updates: Partial<SrpQuery>) => void;
  slugGender?: "male only" | "female only";
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftPriceRange, setDraftPriceRange] = useState<
    readonly [number, number]
  >([srpPriceRangeMin, srpPriceRangeMax]);
  const [draftGender, setDraftGender] = useState("any gender");
  const [draftAmenities, setDraftAmenities] = useState<string[]>([]);
  const [draftFood, setDraftFood] = useState(false);

  const chips = getActiveFilterChips(query);

  const selectedBudget =
    srpBudgetPresets.find((option) => option.value === (query.price ?? "")) ??
    (query.price
      ? { label: formatPriceChip(query.price), value: query.price }
      : srpBudgetPresets[0]);

  const selectedGender =
    srpGenderOptions.find((option) => option.value === query.gender) ??
    (slugGender
      ? srpGenderOptions.find((option) => option.value === slugGender)
      : undefined);

  function openFiltersModal() {
    const [minRaw, maxRaw] = query.price?.split(",") ?? [];
    setDraftPriceRange([
      minRaw ? Number(minRaw) : srpPriceRangeMin,
      maxRaw ? Number(maxRaw) : srpPriceRangeMax,
    ]);
    setDraftGender(query.gender ?? slugGender ?? "any gender");
    setDraftAmenities(query.amenity?.split(",").filter(Boolean) ?? []);
    setDraftFood(query.food === "available");
    setFiltersOpen(true);
  }

  function applyFilters() {
    const [min, max] = draftPriceRange;
    const hasCustomPrice =
      min > srpPriceRangeMin || max < srpPriceRangeMax;

    setQuery({
      price: hasCustomPrice ? `${min},${max}` : undefined,
      gender: draftGender === "any gender" ? undefined : draftGender,
      amenity:
        draftAmenities.length > 0 ? draftAmenities.join(",") : undefined,
      food: draftFood ? "available" : undefined,
    });
    setFiltersOpen(false);
  }

  function clearDraftFilters() {
    setDraftPriceRange([srpPriceRangeMin, srpPriceRangeMax]);
    setDraftGender(slugGender ?? "any gender");
    setDraftAmenities([]);
    setDraftFood(false);
  }

  function toggleDraftAmenity(amenity: string) {
    setDraftAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden flex-wrap items-center justify-start gap-2 sm:gap-3 md:flex">
        <FilterDropdown
          label="Budget"
          selectedLabel={selectedBudget?.value ? selectedBudget.label : "Budget"}
          options={srpBudgetPresets}
          onSelect={(value) => setQuery({ price: value || undefined })}
        />

        <FilterDropdown
          label="Gender"
          selectedLabel={selectedGender?.label ?? "Gender"}
          options={srpGenderOptions}
          onSelect={(value) =>
            setQuery({ gender: value === "any gender" ? undefined : value })
          }
        />

        <span aria-hidden className="hidden h-6 w-px bg-gray-200 sm:block" />

        <button
          type="button"
          onClick={openFiltersModal}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FilterSlidersIcon className="size-4" />
          Filters
        </button>

        <SortDropdown
          className="shrink-0"
          sortValue={query.sort}
          onSelect={(value) =>
            setQuery({ sort: value === "popularity" ? undefined : value })
          }
        />
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setQuery(chip.onRemove())}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              {chip.label}
              <CloseIcon className="size-3" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="pointer-events-auto border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <button
              type="button"
              onClick={openFiltersModal}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FilterSlidersIcon className="size-4" />
              Filters
            </button>

            <SortDropdown
              className="min-w-0 flex-1"
              fullWidth
              menuPlacement="top"
              sortValue={query.sort}
              onSelect={(value) =>
                setQuery({ sort: value === "popularity" ? undefined : value })
              }
            />
          </div>
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        maxWidthClassName="max-w-lg"
        labelledBy="srp-filters-title"
      >
        <ModalTitle id="srp-filters-title">Filters</ModalTitle>

        <div className="mt-6 space-y-6">
          <FilterModalSection title="Price range">
            <PriceRangeSlider
              min={srpPriceRangeMin}
              max={srpPriceRangeMax}
              step={srpPriceRangeStep}
              value={draftPriceRange}
              onChange={setDraftPriceRange}
            />
          </FilterModalSection>

          <FilterModalSection title="Food">
            <FoodToggle checked={draftFood} onChange={setDraftFood} />
          </FilterModalSection>

          <FilterModalSection title="Gender">
            <GenderFilterChips value={draftGender} onChange={setDraftGender} />
          </FilterModalSection>

          <FilterModalSection title="Amenities">
            <div className="grid max-h-56 gap-x-6 gap-y-4 overflow-y-auto sm:grid-cols-2">
              {srpAmenitiesList.map((amenity) => (
                <FilterCheckbox
                  key={amenity}
                  label={amenity}
                  checked={draftAmenities.includes(amenity)}
                  onChange={() => toggleDraftAmenity(amenity)}
                />
              ))}
            </div>
          </FilterModalSection>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={clearDraftFilters}
              className="text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900"
            >
              Clear all
            </button>
            <Button type="button" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
