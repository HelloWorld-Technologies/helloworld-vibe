"use client";

import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import { useOptionalPropertyActions } from "@/components/booking/property-actions-provider";
import { PaginatedCarousel } from "@/components/ui/paginated-carousel";
import {
  colivingPgSubtitle,
  mapPropertyToSrpCard,
  resolvePropertyLocality,
} from "@/src/lib/map-property";
import type { SimilarProperty } from "@/src/models/property";
import type { HomepageFeaturedProperty } from "@/src/tokens/homepage";
import type { LocalityProperty } from "@/src/tokens/locality";
import { hdpSimilarProperties } from "@/src/tokens/hdp";
import { cn } from "@/src/lib/cn";

const VISIBLE_DESKTOP_COUNT = 3;

type SimilarPropertyCard = LocalityProperty | HomepageFeaturedProperty;

function isLocalityProperty(
  property: SimilarPropertyCard,
): property is LocalityProperty {
  return "propertyId" in property;
}

export function HdpSimilarProperties({
  properties,
  srpSlug,
  localitySlug,
  className,
}: {
  properties?: SimilarProperty[];
  srpSlug?: string;
  localitySlug?: string;
  className?: string;
}) {
  const propertyActions = useOptionalPropertyActions();
  const fallbackLocality = localitySlug?.replace(/-/g, " ");
  const apiCards: LocalityProperty[] =
    properties && properties.length > 0
      ? properties.map((property) =>
          mapPropertyToSrpCard(
            property,
            colivingPgSubtitle(property, fallbackLocality),
            {
              city: property.address?.city || property.city,
              locality:
                resolvePropertyLocality(property) || fallbackLocality,
            },
          ),
        )
      : [];
  const usingApiCards = apiCards.length > 0;
  const cards: SimilarPropertyCard[] = usingApiCards
    ? apiCards
    : hdpSimilarProperties;

  function renderPropertyCard(property: SimilarPropertyCard, cardClassName: string) {
    const localityProperty = isLocalityProperty(property) ? property : null;

    return (
      <WishlistSrpCard
        propertyId={localityProperty?.propertyId}
        className={cardClassName}
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
        propertyUrl={localityProperty?.propertyUrl}
        vibeMatchScore={localityProperty?.vibeMatchScore}
        onRequestCallback={
          usingApiCards && propertyActions && localityProperty
            ? () =>
                propertyActions.openRequestCallback({
                  propertyId: localityProperty.propertyId,
                  propertyName: property.name,
                  location: localityProperty.location,
                  city: localityProperty.city,
                })
            : undefined
        }
        onTakeTour={
          usingApiCards && propertyActions && localityProperty
            ? () =>
                propertyActions.openScheduleVisit({
                  propertyId: localityProperty.propertyId,
                  propertyName: property.name,
                  propertyUrl: localityProperty.propertyUrl,
                })
            : undefined
        }
      />
    );
  }

  return (
    <section
      className={cn("space-y-6", className)}
      aria-label="Similar properties section"
    >
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Similar Properties
        </h2>
      </div>

      <PaginatedCarousel
        items={cards}
        getItemKey={(property) => property.id}
        visibleDesktopCount={VISIBLE_DESKTOP_COUNT}
        mobileScrollGap={16}
        desktopItemClassName="w-full"
        paginationClassName="mt-6"
        mobilePaginationClassName="mt-4"
        renderItem={(property, cardClassName) =>
          renderPropertyCard(property, cardClassName)
        }
      />
    </section>
  );
}
