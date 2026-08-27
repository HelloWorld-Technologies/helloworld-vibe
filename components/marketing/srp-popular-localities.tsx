"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LocalityCard,
  LocalityCarouselButton,
} from "@/components/marketing/locality-card";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import type { LocalityListItem } from "@/src/apis/srp";
import { buildPopularLocalityCards } from "@/src/lib/srp/build-popular-locality-cards";
import { getCityLabel } from "@/src/tokens/cities";
import type { Property } from "@/src/models/property";
import { cn } from "@/src/lib/cn";

/** LocalityCard desktop size (`max-w-[280px]`). Do not stretch with %/calc. */
const DESKTOP_CARD_PX = 280;
/** Matches `gap-6` on the desktop track. */
const DESKTOP_GAP_PX = 24;
/** ~20% card peek so the list still reads as scrollable. */
const DESKTOP_PEEK_PX = 56;
/** Extra card rendered so the next locality can peek into view. */
const DESKTOP_PEEK_COUNT = 1;
/**
 * Keep LocalityCard’s fixed desktop size (`max-w-[280px]` / aspect 5/4).
 * Do not stretch with %/calc or `max-w-none`.
 */
const DESKTOP_CARD_WIDTH = "shrink-0";

/** How many full 280px cards fit while reserving a small peek of the next. */
function visibleDesktopCountForWidth(width: number): number {
  if (width <= 0) return 4;
  const count = Math.floor(
    (width - DESKTOP_PEEK_PX + DESKTOP_GAP_PX) / (DESKTOP_CARD_PX + DESKTOP_GAP_PX),
  );
  return Math.max(1, count);
}

export function SrpPopularLocalities({
  city,
  canonicalPath,
  localityLinks,
  properties,
  className,
}: {
  city: string;
  canonicalPath: string;
  localityLinks: LocalityListItem[];
  properties: Property[];
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visibleDesktopCount, setVisibleDesktopCount] = useState(4);

  const cards = useMemo(
    () => buildPopularLocalityCards(localityLinks, properties, { city, canonicalPath }),
    [localityLinks, properties, city, canonicalPath],
  );

  useEffect(() => {
    if (cards.length === 0) return;
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      setVisibleDesktopCount(visibleDesktopCountForWidth(el.clientWidth));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [cards.length]);

  useEffect(() => {
    setIndex((current) => {
      const max = Math.max(0, cards.length - visibleDesktopCount);
      return Math.min(current, max);
    });
  }, [cards.length, visibleDesktopCount]);

  if (cards.length === 0) return null;

  const cityLabel = getCityLabel(city);
  const maxIndex = Math.max(0, cards.length - visibleDesktopCount);
  const visibleCards = cards.slice(
    index,
    index + visibleDesktopCount + DESKTOP_PEEK_COUNT,
  );

  function scroll(direction: "prev" | "next") {
    setIndex((current) =>
      direction === "prev"
        ? Math.max(0, current - 1)
        : Math.min(maxIndex, current + 1),
    );
  }

  return (
    <section
      aria-label={`Popular ${cityLabel} localities`}
      className={cn(className)}
    >
      <HomepageCarouselNav
        className="mb-6 hidden lg:flex"
        prevDisabled={index === 0}
        nextDisabled={index >= maxIndex}
        onPrev={() => scroll("prev")}
        onNext={() => scroll("next")}
      />

      <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
        Popular {cityLabel} Localities
      </h2>

      <div
        ref={trackRef}
        className="mt-6 hidden w-full overflow-hidden lg:block"
      >
        <div className="flex gap-6">
          {visibleCards.map((locality) => (
            <LocalityCard
              key={locality.id}
              href={locality.href}
              name={locality.name}
              startingRent={locality.startingRent}
              propertyCount={locality.propertyCount}
              imageSrc={locality.imageSrc}
              className={DESKTOP_CARD_WIDTH}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 lg:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
        >
          {cards.map((locality) => (
            <LocalityCard
              key={locality.id}
              href={locality.href}
              layout="mobile"
              showArrow
              name={locality.name}
              startingRent={locality.startingRent}
              propertyCount={locality.propertyCount}
              imageSrc={locality.imageSrc}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 hidden items-center justify-center gap-4 lg:flex">
        <LocalityCarouselButton
          direction="prev"
          label="Previous localities"
          disabled={index === 0}
          onClick={() => scroll("prev")}
        />
        <LocalityCarouselButton
          direction="next"
          label="Next localities"
          disabled={index >= maxIndex}
          onClick={() => scroll("next")}
        />
      </div>
    </section>
  );
}
