"use client";

import { useRef, useState } from "react";
import {
  LocalityCard,
  LocalityCarouselButton,
} from "@/components/marketing/locality-card";
import { LocalityAmenitiesSection } from "@/components/marketing/locality-amenities-section";
import { LocalityDayFromHereSection } from "@/components/marketing/locality-day-from-here";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import {
  localityAmenities,
  localityDayFromHereItems,
  localityDayFromHereSubtitle,
  localityDayFromHereTitle,
  localityPage,
  localityPopularLocalities,
  localitySimilarProperties,
} from "@/src/tokens/locality";
import { cn } from "@/src/lib/cn";

export function LocalityDetailsPanel({ className }: { className?: string }) {
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const localityScrollRef = useRef<HTMLDivElement>(null);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [localityIndex, setLocalityIndex] = useState(0);

  const visibleSimilarCount = 2;
  const visibleLocalityCount = 3;

  function scrollSimilar(direction: "prev" | "next") {
    setSimilarIndex((index) => {
      const max = Math.max(0, localitySimilarProperties.length - visibleSimilarCount);
      return direction === "prev"
        ? Math.max(0, index - 1)
        : Math.min(max, index + 1);
    });
  }

  function scrollLocalities(direction: "prev" | "next") {
    setLocalityIndex((index) => {
      const max = Math.max(0, localityPopularLocalities.length - visibleLocalityCount);
      return direction === "prev"
        ? Math.max(0, index - 1)
        : Math.min(max, index + 1);
    });
  }

  const visibleSimilar = localitySimilarProperties.slice(
    similarIndex,
    similarIndex + visibleSimilarCount,
  );
  const visibleLocalities = localityPopularLocalities.slice(
    localityIndex,
    localityIndex + visibleLocalityCount,
  );

  return (
    <div className={cn("space-y-10 md:space-y-12", className)}>
      <LocalityDayFromHereSection
        title={localityDayFromHereTitle}
        subtitle={localityDayFromHereSubtitle}
        items={localityDayFromHereItems}
      />

      <LocalityAmenitiesSection amenities={localityAmenities} />

      <section aria-label="About locality">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          {localityPage.aboutTitle}
        </h2>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {localityPage.aboutText}
        </p>
      </section>

      <section aria-label="Similar properties">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          More Places you&apos;ll Like
        </h2>
        <div className="mt-6 hidden gap-6 lg:flex">
          {visibleSimilar.map((property) => (
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
              className="w-[min(100%,25.6875rem)] shrink-0"
              vibeMatchScore={property.vibeMatchScore}
            />
          ))}
        </div>
        <div className="mt-6 lg:hidden">
          <div
            ref={similarScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
          >
            {localitySimilarProperties.map((property) => (
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
                genderLabel={property.genderLabel}
                className="w-[min(100%,25.6875rem)] shrink-0 snap-center"
                vibeMatchScore={property.vibeMatchScore}
              />
            ))}
          </div>
        </div>
        <HomepageCarouselNav
          className="mt-6 hidden lg:flex"
          prevDisabled={similarIndex === 0}
          nextDisabled={
            similarIndex >= localitySimilarProperties.length - visibleSimilarCount
          }
          onPrev={() => scrollSimilar("prev")}
          onNext={() => scrollSimilar("next")}
        />
      </section>

      <section aria-label="Popular localities">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          Popular Bangalore Localities
        </h2>
        <div className="mt-6 hidden gap-6 lg:flex">
          {visibleLocalities.map((locality) => (
            <LocalityCard
              key={locality.id}
              name={locality.name}
              startingRent={locality.startingRent}
              propertyCount={locality.propertyCount}
              imageSrc={locality.imageSrc}
              className="w-[min(100%,25.6875rem)] shrink-0"
            />
          ))}
        </div>
        <div className="mt-6 lg:hidden">
          <div
            ref={localityScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
          >
            {localityPopularLocalities.map((locality) => (
              <LocalityCard
                key={locality.id}
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
            disabled={localityIndex === 0}
            onClick={() => scrollLocalities("prev")}
          />
          <LocalityCarouselButton
            direction="next"
            label="Next localities"
            disabled={
              localityIndex >= localityPopularLocalities.length - visibleLocalityCount
            }
            onClick={() => scrollLocalities("next")}
          />
        </div>
      </section>
    </div>
  );
}
