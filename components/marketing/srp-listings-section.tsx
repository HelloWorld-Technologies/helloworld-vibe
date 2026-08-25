"use client";

import { useRef, type RefObject } from "react";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import { SrpFiltersBar } from "@/components/marketing/srp-filters-bar";
import { useOptionalPropertyActions } from "@/components/booking/property-actions-provider";
import type { SrpQuery } from "@/src/models/srp-query";
import { VibeChips } from "@/components/ui/vibe-chips";
import { useSelectedVibes } from "@/src/lib/use-selected-vibes";
import { useVibeList } from "@/src/lib/use-vibe-list";
import type { LocalityProperty } from "@/src/tokens/locality";
import { cn } from "@/src/lib/cn";

function SrpCardSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
    >
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        <div className="h-8 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function SrpListingsSection({
  properties,
  className,
  isLoadingMore = false,
  isRefreshing = false,
  loadMoreRef,
  filterQuery,
  onFilterChange,
  slugGender,
  showFilters = true,
}: {
  properties: readonly LocalityProperty[];
  className?: string;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
  loadMoreRef?: RefObject<HTMLDivElement | null>;
  filterQuery: SrpQuery;
  onFilterChange: (updates: Partial<SrpQuery>) => void;
  slugGender?: "male only" | "female only";
  showFilters?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { vibes } = useVibeList();
  const { selectedVibes, toggleVibe, clearSelectedVibes } = useSelectedVibes();
  const propertyActions = useOptionalPropertyActions();

  function scrollChips(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? 240 : -240,
      behavior: "smooth",
    });
  }

  return (
    <section className={cn("space-y-6", className)} aria-label="Coliving listings">
      <div className="space-y-4">
        {showFilters ? (
          <SrpFiltersBar
            query={filterQuery}
            setQuery={onFilterChange}
            slugGender={slugGender}
          />
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Pick upto 5 interests for better matches
            </p>
            <div className="hidden shrink-0 items-center gap-4 sm:flex">
              <button
                type="button"
                aria-label="Scroll vibe filters left"
                onClick={() => scrollChips("left")}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
                  <path
                    d="M10 4L6 8l4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Scroll vibe filters right"
                onClick={() => scrollChips("right")}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <VibeChips
            chips={vibes}
            selectedIds={selectedVibes}
            onToggle={toggleVibe}
            scrollRef={scrollRef}
          />

          {selectedVibes.size > 0 ? (
            <button
              type="button"
              onClick={clearSelectedVibes}
              className="ml-auto block w-fit text-sm font-semibold text-blue-light-600 hover:text-blue-light-700"
            >
              Clear All
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
          isRefreshing && "pointer-events-none opacity-60",
        )}
      >
        {properties.map((property) => (
          <WishlistSrpCard
            key={property.id}
            propertyId={property.propertyId}
            href={property.href}
            name={property.name}
            subtitle={property.subtitle}
            images={property.images}
            rating={property.rating}
            roomTypes={property.roomTypes}
            rent={property.rent}
            originalRent={property.originalRent}
            offerLabel={property.offerLabel}
            statusLabel={property.statusLabel}
            visitsToday={property.visitsToday}
            genderLabel={property.genderLabel}
            propertyUrl={property.propertyUrl}
            vibeMatchScore={property.vibeMatchScore}
            onRequestCallback={
              propertyActions
                ? () =>
                    propertyActions.openRequestCallback({
                      propertyId: property.propertyId,
                      propertyName: property.name,
                      location: property.location,
                      city: property.city,
                    })
                : undefined
            }
            onTakeTour={
              propertyActions
                ? () =>
                    propertyActions.openScheduleVisit({
                      propertyId: property.propertyId,
                      propertyName: property.name,
                      propertyUrl: property.propertyUrl,
                    })
                : undefined
            }
          />
        ))}
        {isLoadingMore
          ? Array.from({ length: 3 }, (_, index) => (
              <SrpCardSkeleton key={`loading-${index}`} />
            ))
          : null}
      </div>

      <div ref={loadMoreRef} aria-hidden className="h-px w-full" />
    </section>
  );
}
