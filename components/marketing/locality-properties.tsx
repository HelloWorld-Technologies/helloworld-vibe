"use client";

import { useRef } from "react";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import { VibeChips } from "@/components/ui/vibe-chips";
import { useSelectedVibes } from "@/src/lib/use-selected-vibes";
import { useVibeList } from "@/src/lib/use-vibe-list";
import {
  localityProperties,
  localityPropertiesHeading,
  type LocalityProperty,
} from "@/src/tokens/locality";
import { cn } from "@/src/lib/cn";

function PropertyCard({
  property,
  className,
}: {
  property: LocalityProperty;
  className?: string;
}) {
  return (
    <WishlistSrpCard
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
      className={className}
    />
  );
}

export function LocalityProperties({ className }: { className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { vibes } = useVibeList();
  const { selectedVibes, toggleVibe, clearSelectedVibes } = useSelectedVibes();

  function scrollChips(direction: "left" | "right") {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "right" ? 240 : -240,
      behavior: "smooth",
    });
  }

  return (
    <section className={cn("space-y-6", className)} aria-label="Coliving listings">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          {localityPropertiesHeading}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Pick your interests, We&apos;ll match you with the right home!
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
              className="text-sm font-semibold text-hello-lime-600 hover:text-hello-lime-700"
            >
              Clear All
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {localityProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
