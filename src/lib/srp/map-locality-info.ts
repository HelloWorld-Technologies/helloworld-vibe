import type {
  LocalityInfo,
  LocalityInfoNearby,
  LocalityInfoPlace,
  LocalityInfoRatings,
} from "@/src/models/locality-info";
import {
  localityBentoTiles,
  type LocalityBentoTile,
} from "@/src/tokens/locality";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import { nearbyCategoryFlow } from "@/src/tokens/nearby-categories";

const RATING_KEY_TO_TILE_ID: Record<string, string> = {
  transit: "transit",
  dining: "dining",
  health: "health",
  night_life: "night-life",
  nightlife: "night-life",
  "night-life": "night-life",
};

function clampRating(value: number): number {
  return Math.round(Math.min(5, Math.max(0, value)) * 10) / 10;
}

function formatMetersAway(meters: number | null): string {
  if (meters == null || !Number.isFinite(meters) || meters < 0) return "Nearby";
  if (meters < 2000) {
    return `${Math.max(1, Math.round(meters / 80))} min walk`;
  }
  const km = meters / 1000;
  const rounded =
    km < 10 ? km.toFixed(1).replace(/\.0$/, "") : String(Math.round(km));
  return `${rounded} km away`;
}

function sortPlaces(places: readonly LocalityInfoPlace[]): LocalityInfoPlace[] {
  return [...places].sort((a, b) => {
    if (a.distance_meters == null && b.distance_meters == null) return 0;
    if (a.distance_meters == null) return 1;
    if (b.distance_meters == null) return -1;
    return a.distance_meters - b.distance_meters;
  });
}

function normalizeNearbyKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function mapLocalityBentoTiles(
  ratings?: LocalityInfoRatings | null,
): LocalityBentoTile[] {
  const overlay: Record<string, number> = {};
  if (ratings) {
    for (const [key, value] of Object.entries(ratings)) {
      if (typeof value !== "number" || !Number.isFinite(value)) continue;
      const tileId = RATING_KEY_TO_TILE_ID[normalizeNearbyKey(key)];
      if (!tileId) continue;
      overlay[tileId] = clampRating(value);
    }
  }

  return localityBentoTiles.map((tile) => {
    const rating = overlay[tile.id];
    return rating == null ? { ...tile } : { ...tile, rating };
  });
}

export function mapLocalityNearbyToDayFromHere(
  nearby?: LocalityInfoNearby | null,
): NeighborhoodCardData[] {
  if (!nearby || Object.keys(nearby).length === 0) return [];

  const claimed = new Set<string>();
  const cards: NeighborhoodCardData[] = [];

  for (const def of nearbyCategoryFlow) {
    const matchKey = def.apiKeys
      .map(normalizeNearbyKey)
      .find((needle) =>
        Object.keys(nearby).some(
          (key) => !claimed.has(key) && normalizeNearbyKey(key) === needle,
        ),
      );
    const sourceKey = matchKey
      ? Object.keys(nearby).find(
          (key) =>
            !claimed.has(key) && normalizeNearbyKey(key) === matchKey,
        )
      : undefined;
    const places = sourceKey ? nearby[sourceKey] : undefined;
    if (!sourceKey || !places?.length) continue;

    claimed.add(sourceKey);
    const nearestFirst = sortPlaces(places);
    const options = nearestFirst.map((place, index) => ({
      id: `${def.id}-${place.id || index}`,
      placeName: place.name,
      walkTime: formatMetersAway(place.distance_meters),
      imageSrc: def.imageSrc,
      imageAlt: place.name,
    }));
    const primary = options[0];
    if (!primary) continue;

    cards.push({
      id: def.id,
      emoji: def.emoji,
      category: def.category,
      placeName: primary.placeName,
      imageSrc: primary.imageSrc,
      imageAlt: primary.imageAlt,
      walkTime: primary.walkTime,
      linkLabel: def.linkLabel,
      modalLabel: def.modalLabel,
      options,
    });
  }

  return cards;
}

export function localityHeroImageSrc(
  localityInfo?: LocalityInfo | null,
): string | undefined {
  const cover = localityInfo?.cover_image?.trim();
  return cover || undefined;
}

export function localityStartingRent(
  localityInfo: LocalityInfo | undefined,
  fallback: number,
): number {
  const rent = localityInfo?.starting_rent;
  return rent != null && rent > 0 ? rent : fallback;
}

export function localityAboutText(
  localityInfo: LocalityInfo | undefined,
  fallback: string,
): string {
  const description = localityInfo?.description?.trim();
  return description || fallback;
}
