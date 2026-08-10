"use client";

import { useRef } from "react";
import {
  NEIGHBORHOOD_CARD_WIDTH_PX,
  NeighborhoodTimeline,
} from "@/components/marketing/neighborhood-card";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import {
  neighborhoodRoutineSamples,
  neighborhoodSectionSubtitle,
  neighborhoodSectionTitle,
} from "@/src/tokens/neighborhood-card";
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
  embeddedMapUrl,
  subtitle,
  className,
}: {
  items?: readonly NeighborhoodCardData[];
  /** External Google Maps URL (`map_url`) — opened by Show on Maps. */
  mapUrl?: string;
  /** Google Maps iframe src (`embedded_url`) — same as next Neighbourhood. */
  embeddedMapUrl?: string;
  subtitle?: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const resolvedItems =
    items && items.length > 0 ? items : neighborhoodRoutineSamples;
  const hasApiItems = Boolean(items && items.length > 0);

  function scrollCarousel(direction: "prev" | "next") {
    scrollRef.current?.scrollBy({
      left: direction === "next" ? CARD_SCROLL_STEP_PX : -CARD_SCROLL_STEP_PX,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="hdp-nearby"
      className={cn("scroll-mt-32", className)}
      aria-label="Nearby places section"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[2rem] md:leading-10">
            {hasApiItems ? "What's nearby?" : neighborhoodSectionTitle}
          </h2>
          <p className="mt-1 text-base text-gray-600">
            {subtitle ||
              (hasApiItems
                ? "See nearby utilities, facilities, transport, hospitals and more."
                : neighborhoodSectionSubtitle)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          {mapUrl ? (
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

      {embeddedMapUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <iframe
            title="Property location map"
            className="h-[350px] w-full border-0"
            src={embeddedMapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}

      <div className="mt-6">
        <NeighborhoodTimeline
          items={resolvedItems}
          animate={false}
          scrollContainerRef={scrollRef}
        />
      </div>
    </section>
  );
}
