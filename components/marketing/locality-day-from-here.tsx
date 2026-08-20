"use client";

import { HdpNearbyPlaces } from "@/components/marketing/hdp-nearby-places";
import type { NearbyMapProperty } from "@/components/marketing/hdp-nearby-map-modal";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";

export function LocalityDayFromHereSection({
  title,
  subtitle,
  items,
  mapUrl,
  property,
}: {
  title: string;
  subtitle: string;
  items: readonly NeighborhoodCardData[];
  mapUrl?: string;
  property?: NearbyMapProperty;
}) {
  if (items.length === 0) return null;

  return (
    <HdpNearbyPlaces
      title={title}
      subtitle={subtitle}
      items={items}
      mapUrl={mapUrl}
      property={property}
      sectionId="srp-nearby"
    />
  );
}
