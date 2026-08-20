"use client";

import { useMemo, useRef, useState } from "react";
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

const VISIBLE_DESKTOP_COUNT = 2;

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
  const [index, setIndex] = useState(0);

  const cards = useMemo(
    () => buildPopularLocalityCards(localityLinks, properties, { city, canonicalPath }),
    [localityLinks, properties, city, canonicalPath],
  );

  if (cards.length === 0) return null;

  const cityLabel = getCityLabel(city);
  const maxIndex = Math.max(0, cards.length - VISIBLE_DESKTOP_COUNT);
  const visibleCards = cards.slice(index, index + VISIBLE_DESKTOP_COUNT);

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

      <div className="mt-6 hidden gap-6 lg:flex">
        {visibleCards.map((locality) => (
          <LocalityCard
            key={locality.id}
            href={locality.href}
            name={locality.name}
            startingRent={locality.startingRent}
            propertyCount={locality.propertyCount}
            imageSrc={locality.imageSrc}
            className="w-[min(100%,16rem)] shrink-0"
          />
        ))}
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
