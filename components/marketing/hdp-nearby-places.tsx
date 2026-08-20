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
import {
  ShowOnMapsButtonLabel,
  showOnMapsLinkClassName,
} from "@/components/icons/show-on-maps-icon";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import { cn } from "@/src/lib/cn";

const CARD_SCROLL_STEP_PX = NEIGHBORHOOD_CARD_WIDTH_PX + 16;

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
  title = "A Day from here",
  subtitle,
  property,
  className,
  sectionId = "hdp-nearby",
  mapsButtonVariant = "link",
}: {
  items?: readonly NeighborhoodCardData[];
  mapUrl?: string;
  title?: string;
  subtitle?: string;
  property?: NearbyMapProperty;
  className?: string;
  sectionId?: string;
  mapsButtonVariant?: "link" | "srp";
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
  const mapsButtonClassName =
    mapsButtonVariant === "srp"
      ? "inline-flex items-center gap-1.5 rounded-lg bg-hello-lime-700 px-3 py-2 text-sm font-bold leading-none text-white transition-colors hover:bg-hello-lime-800"
      : showOnMapsLinkClassName;

  const mapsControl = canOpenMapModal ? (
    <button
      type="button"
      onClick={() => openMap()}
      className={mapsButtonClassName}
    >
      <ShowOnMapsButtonLabel />
    </button>
  ) : mapUrl ? (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={mapsButtonClassName}
    >
      <ShowOnMapsButtonLabel />
    </a>
  ) : null;

  const carouselControls = (
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
  );

  return (
    <section
      id={sectionId}
      className={cn("scroll-mt-32 mb-4", className)}
      aria-label="Nearby places section"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="min-w-0 text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-3">
            {mapsControl}
            <div className="hidden sm:block">{carouselControls}</div>
          </div>
        </div>
        <p className="mt-1 text-base text-gray-600">
          {subtitle ||
            "See nearby utilities, facilities, transport, hospitals and more."}
        </p>
      </div>

      <div className="mt-3 flex justify-end sm:hidden">{carouselControls}</div>

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
