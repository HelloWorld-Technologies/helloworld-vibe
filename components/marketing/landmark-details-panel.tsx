"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { NeighborhoodTimeline } from "@/components/marketing/neighborhood-card";
import {
  LocalityCard,
  LocalityCarouselButton,
} from "@/components/marketing/locality-card";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import {
  landmarkAmenities,
  landmarkDayFromHereItems,
  landmarkDayFromHereSubtitle,
  landmarkDayFromHereTitle,
  landmarkPage,
  landmarkPopularLocalities,
  landmarkSimilarProperties,
} from "@/src/tokens/landmark";
import { cn } from "@/src/lib/cn";

function MapLinkButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 text-sm font-semibold text-hello-lime-600 hover:text-hello-lime-700"
    >
      <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
        <path
          d="M8 1.5a4 4 0 0 0-4 4c0 3 4 8.5 4 8.5s4-5.5 4-8.5a4 4 0 0 0-4-4Z"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="5.5" r="1.25" fill="currentColor" />
      </svg>
      Show on Maps
    </button>
  );
}

export function LandmarkDetailsPanel({ className }: { className?: string }) {
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const localityScrollRef = useRef<HTMLDivElement>(null);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [localityIndex, setLocalityIndex] = useState(0);

  const visibleSimilarCount = 2;
  const visibleLocalityCount = 3;

  function scrollSimilar(direction: "prev" | "next") {
    setSimilarIndex((index) => {
      const max = Math.max(0, landmarkSimilarProperties.length - visibleSimilarCount);
      return direction === "prev"
        ? Math.max(0, index - 1)
        : Math.min(max, index + 1);
    });
  }

  function scrollLocalities(direction: "prev" | "next") {
    setLocalityIndex((index) => {
      const max = Math.max(0, landmarkPopularLocalities.length - visibleLocalityCount);
      return direction === "prev"
        ? Math.max(0, index - 1)
        : Math.min(max, index + 1);
    });
  }

  const visibleSimilar = landmarkSimilarProperties.slice(
    similarIndex,
    similarIndex + visibleSimilarCount,
  );
  const visibleLocalities = landmarkPopularLocalities.slice(
    localityIndex,
    localityIndex + visibleLocalityCount,
  );

  return (
    <div className={cn("space-y-10 md:space-y-12", className)}>
      <section aria-label="A day from here">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
              {landmarkDayFromHereTitle}
            </h2>
            <p className="text-base text-gray-600">
              {landmarkDayFromHereSubtitle}
            </p>
          </div>
          <MapLinkButton />
        </div>
        <div className="mt-6">
          <NeighborhoodTimeline items={landmarkDayFromHereItems} />
        </div>
      </section>

      <section aria-label="Included amenities">
        <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          Included Across Our Homes
        </h2>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-5">
          {landmarkAmenities.map((amenity) => (
            <div
              key={amenity.id}
              className="flex w-[5.5rem] flex-col items-center gap-2.5 text-center"
            >
              <Image
                src={amenity.iconSrc}
                alt=""
                width={36}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <p className="text-xs font-medium text-gray-800">{amenity.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="About this place">
        <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          {landmarkPage.aboutTitle}
        </h2>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {landmarkPage.aboutText}
        </p>
      </section>

      <section aria-label="Similar properties">
        <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
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
            {landmarkSimilarProperties.map((property) => (
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
            similarIndex >= landmarkSimilarProperties.length - visibleSimilarCount
          }
          onPrev={() => scrollSimilar("prev")}
          onNext={() => scrollSimilar("next")}
        />
      </section>

      <section aria-label="Popular localities">
        <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
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
              className="w-[min(100%,16rem)] shrink-0"
            />
          ))}
        </div>
        <div className="mt-6 lg:hidden">
          <div
            ref={localityScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
          >
            {landmarkPopularLocalities.map((locality) => (
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
              localityIndex >= landmarkPopularLocalities.length - visibleLocalityCount
            }
            onClick={() => scrollLocalities("next")}
          />
        </div>
      </section>
    </div>
  );
}
