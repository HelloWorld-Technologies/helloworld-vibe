"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAllProperty } from "@/src/apis/srp";
import {
  PropertyActionsProvider,
  useOptionalPropertyActions,
} from "@/components/booking/property-actions-provider";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { PaginatedCarousel } from "@/components/ui/paginated-carousel";
import {
  colivingPgSubtitle,
  mapPropertiesToSrpCards,
} from "@/src/lib/map-property";
import { useDebounce } from "@/src/lib/use-debounce";
import { useSelectedCity } from "@/src/lib/use-selected-city";
import { useSelectedVibes } from "@/src/lib/use-selected-vibes";
import { useVibeList } from "@/src/lib/use-vibe-list";
import { selectedVibeApiIds } from "@/src/lib/vibe-list-storage";
import { pageShell } from "@/src/tokens/layout";
import { getCityLabel } from "@/src/tokens/cities";
import type { LocalityProperty } from "@/src/tokens/locality";
import { cn } from "@/src/lib/cn";

const HOMEPAGE_PROPERTIES_PAGE_SIZE = 12;
const VISIBLE_DESKTOP_COUNT = 3;
const VIBE_FILTER_DEBOUNCE_MS = 400;

function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white",
        className,
      )}
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

function PropertyCard({
  property,
  city,
  className,
}: {
  property: LocalityProperty;
  city: string;
  className?: string;
}) {
  const propertyActions = useOptionalPropertyActions();
  const location = property.location?.trim() || getCityLabel(city);

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
      propertyUrl={property.propertyUrl}
      className={className}
      vibeMatchScore={property.vibeMatchScore}
      onRequestCallback={
        propertyActions
          ? () =>
              propertyActions.openRequestCallback({
                propertyId: property.propertyId,
                propertyName: property.name,
                location,
                // Homepage always uses the city stored from location search.
                city,
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
  );
}

function HomepagePropertiesCarousel({ city }: { city: string }) {
  const [properties, setProperties] = useState<LocalityProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedVibes } = useSelectedVibes();
  const { vibes } = useVibeList();
  const vibeIds = useMemo(
    () => selectedVibeApiIds(selectedVibes, vibes),
    [selectedVibes, vibes],
  );
  const vibeKey = vibeIds.join(",");
  const debouncedVibeKey = useDebounce(vibeKey, VIBE_FILTER_DEBOUNCE_MS);
  const debouncedVibeIds = useMemo(() => {
    if (!debouncedVibeKey) return [] as number[];
    return debouncedVibeKey
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);
  }, [debouncedVibeKey]);

  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      setIsLoading(true);

      const { data, success } = await fetchAllProperty(
        {
          city,
          filter:
            debouncedVibeIds.length > 0
              ? { amenities: [], vibes: debouncedVibeIds }
              : undefined,
        },
        { page: 1, page_size: HOMEPAGE_PROPERTIES_PAGE_SIZE },
      );

      if (cancelled) return;

      if (success && data.length > 0) {
        setProperties(
          mapPropertiesToSrpCards(
            data,
            (property) => colivingPgSubtitle(property, getCityLabel(city)),
            { city },
          ),
        );
      } else {
        setProperties([]);
      }

      setIsLoading(false);
    }

    void loadProperties();

    return () => {
      cancelled = true;
    };
  }, [city, debouncedVibeKey, debouncedVibeIds]);

  return (
    <PaginatedCarousel
      items={properties}
      getItemKey={(property) => property.id}
      resetKey={`${city}:${debouncedVibeKey}`}
      isLoading={isLoading || vibeKey !== debouncedVibeKey}
      visibleDesktopCount={VISIBLE_DESKTOP_COUNT}
      mobileScrollGap={16}
      desktopItemClassName="w-full"
      desktopTrackClassName="mt-8"
      mobileTrackClassName="mt-8"
      paginationClassName="mt-8"
      mobilePaginationClassName="mt-6"
      renderSkeleton={(className) => (
        <PropertyCardSkeleton className={className} />
      )}
      renderItem={(property, className) => (
        <PropertyCard property={property} city={city} className={className} />
      )}
      emptyState={
        <p className="mt-8 text-center text-base text-gray-600">
          No properties found in {getCityLabel(city)} right now.
        </p>
      }
    />
  );
}

export function HomepageProperties() {
  const city = useSelectedCity();

  return (
    <PropertyActionsProvider defaultCity={city} defaultLocation={getCityLabel(city)}>
      <section className="bg-white py-8 sm:py-12 lg:py-14">
        <div className={pageShell.homepage}>
          <div className="flex justify-center">
            <HomepageSectionHeading
              prefix="This could be your"
              highlight="Home!"
              gradient="home"
            />
          </div>

          <HomepagePropertiesCarousel city={city} />
        </div>
      </section>
    </PropertyActionsProvider>
  );
}
