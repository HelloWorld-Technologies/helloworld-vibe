"use client";

import { useMemo, useRef, useState } from "react";
import {
  NEIGHBORHOOD_CARD_WIDTH_PX,
  NeighborhoodTimeline,
} from "@/components/marketing/neighborhood-card";
import {
  HdpNearbyMapModal,
  type NearbyMapProperty,
} from "@/components/marketing/hdp-nearby-map-modal";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import { cn } from "@/src/lib/cn";

const CARD_SCROLL_STEP_PX = NEIGHBORHOOD_CARD_WIDTH_PX + 16;

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 8.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.33"
      />
      <path
        d="M8 14.667s5.333-3.58 5.333-8A5.333 5.333 0 1 0 2.667 6.667c0 4.42 5.333 8 5.333 8Z"
        stroke="currentColor"
        strokeWidth="1.33"
      />
    </svg>
  );
}

function CarouselChevron({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center text-gray-500 transition-colors hover:text-gray-800"
    >
      <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
        <path
          d={direction === "prev" ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function HdpNearbyPlaces({
  items,
  mapUrl,
  subtitle,
  property,
  className,
}: {
  items?: readonly NeighborhoodCardData[];
  mapUrl?: string;
  subtitle?: string;
  property?: NearbyMapProperty;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const resolvedItems = items && items.length > 0 ? items : [];
  const [mapOpen, setMapOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => resolvedItems[0]?.id ?? "",
  );

  const mapProperty = useMemo<NearbyMapProperty>(
    () => ({
      name: property?.name ?? "HelloWorld",
      addressLine: property?.addressLine,
      locality: property?.locality,
      imageSrc: property?.imageSrc,
      startingRent: property?.startingRent,
      latitude: property?.latitude,
      longitude: property?.longitude,
    }),
    [property],
  );

  // Hide the whole nearby block when the API has no places.
  if (resolvedItems.length === 0) return null;

  function scrollCarousel(direction: "prev" | "next") {
    scrollRef.current?.scrollBy({
      left: direction === "next" ? CARD_SCROLL_STEP_PX : -CARD_SCROLL_STEP_PX,
      behavior: "smooth",
    });
  }

  function openMap(categoryId?: string) {
    if (categoryId) setActiveCategoryId(categoryId);
    else if (!activeCategoryId && resolvedItems[0]) {
      setActiveCategoryId(resolvedItems[0].id);
    }
    setMapOpen(true);
  }

  const canOpenMapModal = mapProperty.latitude != null;

  return (
    <section
      id="hdp-nearby"
      className={cn("scroll-mt-32", className)}
      aria-label="Nearby places section"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[2rem] md:leading-10">
            What&apos;s nearby?
          </h2>
          <p className="mt-1 text-base text-gray-600">
            {subtitle ||
              "See nearby utilities, facilities, transport, hospitals and more."}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          {canOpenMapModal ? (
            <button
              type="button"
              onClick={() => openMap()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-hello-lime-600 transition-colors hover:text-hello-lime-700"
            >
              <MapPinIcon className="size-4" />
              Show on Maps
            </button>
          ) : mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-hello-lime-600 transition-colors hover:text-hello-lime-700"
            >
              <MapPinIcon className="size-4" />
              Show on Maps
            </a>
          ) : null}

          <div className="flex items-center gap-1">
            <CarouselChevron
              direction="prev"
              label="Previous nearby place"
              onClick={() => scrollCarousel("prev")}
            />
            <CarouselChevron
              direction="next"
              label="Next nearby place"
              onClick={() => scrollCarousel("next")}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <NeighborhoodTimeline
          items={resolvedItems}
          animate={false}
          scrollContainerRef={scrollRef}
          onViewNearby={
            canOpenMapModal ? (categoryId) => openMap(categoryId) : undefined
          }
        />
      </div>

      {canOpenMapModal ? (
        <HdpNearbyMapModal
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          property={mapProperty}
          categories={resolvedItems}
          activeCategoryId={activeCategoryId || resolvedItems[0]?.id || ""}
          onCategoryChange={setActiveCategoryId}
        />
      ) : null}
    </section>
  );
}
