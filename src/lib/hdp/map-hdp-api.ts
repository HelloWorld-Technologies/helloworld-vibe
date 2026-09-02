import { capitalizeFirstLetter } from "@/src/lib/string-utils";
import { formatSrpCardImageSrc } from "@/src/lib/images";
import type { GoogleData, NearByArea, NearbyData } from "@/src/models/property";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import {
  nearbyCategoryFlow,
  nearbyComingSoonImage,
} from "@/src/tokens/nearby-categories";
import type {
  HdpResidentReview,
  HdpReviewCategory,
} from "@/src/tokens/hdp-reviews";

const NEARBY_EMOJI: Record<string, string> = {
  transport: "🚇",
  transit: "🚌",
  school: "🎓",
  education: "🎓",
  hospital: "🏥",
  health: "🏥",
  store: "🛒",
  shopping: "🛍️",
  food: "🍽️",
  dining: "☕",
  restaurant: "🍽️",
  gym: "💪",
  fitness: "💪",
  work: "🧑‍💻",
  office: "🏢",
  park: "🌳",
  mall: "🏬",
};

function formatNearbyLabel(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

function nearbyEmoji(key: string): string {
  const normalized = key.toLowerCase().replace(/[_-]+/g, " ");
  for (const [token, emoji] of Object.entries(NEARBY_EMOJI)) {
    if (normalized.includes(token)) return emoji;
  }
  return "📍";
}

function isLocalAssetPath(src: string): boolean {
  return src.startsWith("/assets/") || src.startsWith("assets/");
}

/** Place photos from the API only — never local files or Google map icons. */
function resolveNearbyPlaceImage(place: NearbyData): string {
  const record = place as NearbyData & Record<string, unknown>;
  const raw = [
    place.image,
    place.photo,
    place.image_url,
    record.imageUrl,
    record.photo_url,
    record.photoUrl,
    record.thumbnail,
  ]
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

  if (!raw || raw.includes("coming-soon") || isLocalAssetPath(raw)) {
    return nearbyComingSoonImage;
  }

  if (raw.startsWith("data:")) return raw;

  // Absolute URL (Google place photo, CDN, etc.)
  if (raw.includes("http://") || raw.includes("https://")) {
    return formatSrpCardImageSrc(raw) || nearbyComingSoonImage;
  }

  // Root-relative app path (only allow coming-soon; never category artwork)
  if (raw.startsWith("/")) {
    return isLocalAssetPath(raw) ? nearbyComingSoonImage : raw;
  }

  // Relative S3 / media keys from the API
  const formatted = formatSrpCardImageSrc(raw);
  if (
    !formatted ||
    formatted.includes("coming-soon") ||
    isLocalAssetPath(formatted)
  ) {
    return nearbyComingSoonImage;
  }

  return formatted;
}

function parseDistanceKm(distance?: string | number): number | null {
  if (typeof distance === "number" && Number.isFinite(distance)) {
    return distance;
  }
  const raw = String(distance ?? "").trim();
  if (!raw) return null;
  const match = raw.match(/([\d.]+)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function formatDistanceAway(distance?: string | number): string {
  const km = parseDistanceKm(distance);
  if (km == null) {
    const value = String(distance || "").trim();
    return value
      ? /km$/i.test(value)
        ? `${value} away`
        : `${value} km away`
      : "";
  }

  // Prefer a walk estimate for short distances (≈12 min per km).
  if (km > 0 && km < 2) {
    const minutes = Math.max(1, Math.round(km * 12));
    return `${minutes} min walk`;
  }

  const rounded =
    km < 10 ? km.toFixed(1).replace(/\.0$/, "") : String(Math.round(km));
  return `${rounded} km away`;
}

function parseCoord(value?: string | number): number | undefined {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function sortPlacesByDistance(places: readonly NearbyData[]): NearbyData[] {
  return [...places].sort((a, b) => {
    const distA = parseDistanceKm(a.distance);
    const distB = parseDistanceKm(b.distance);
    if (distA == null && distB == null) return 0;
    if (distA == null) return 1;
    if (distB == null) return -1;
    return distA - distB;
  });
}

function normalizeNearbyKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function findPlacesForCategory(
  nearBy: NearByArea,
  apiKeys: readonly string[],
  claimedKeys: ReadonlySet<string>,
): { key: string; places: NearbyData[] } | null {
  const entries = Object.entries(nearBy).filter(
    ([key]) => !claimedKeys.has(key),
  );

  for (const apiKey of apiKeys) {
    const needle = normalizeNearbyKey(apiKey);
    for (const [key, places] of entries) {
      if (!Array.isArray(places) || places.length === 0) continue;
      if (normalizeNearbyKey(key) === needle) {
        const valid = places.filter((place) => place?.name);
        if (valid.length > 0) return { key, places: valid };
      }
    }
  }

  for (const apiKey of apiKeys) {
    const needle = normalizeNearbyKey(apiKey);
    for (const [key, places] of entries) {
      if (!Array.isArray(places) || places.length === 0) continue;
      const normalized = normalizeNearbyKey(key);
      if (normalized.includes(needle) || needle.includes(normalized)) {
        const valid = places.filter((place) => place?.name);
        if (valid.length > 0) return { key, places: valid };
      }
    }
  }

  return null;
}

export function mergeNearByAreas(
  nearBy: NearByArea | null | undefined,
  googleNearBy: NearByArea | null | undefined,
): NearByArea | null {
  const merged: NearByArea = {};
  for (const source of [nearBy, googleNearBy]) {
    if (!source) continue;
    for (const [key, places] of Object.entries(source)) {
      if (!Array.isArray(places) || places.length === 0) continue;
      merged[key] = [...(merged[key] ?? []), ...places];
    }
  }
  return Object.keys(merged).length > 0 ? merged : null;
}

export function mapNearByToNeighborhoodCards(
  nearBy: NearByArea | null | undefined,
  _mapUrl?: string,
): NeighborhoodCardData[] {
  if (!nearBy || Object.keys(nearBy).length === 0) return [];

  const source = nearBy;
  const claimedKeys = new Set<string>();

  const flowCards: NeighborhoodCardData[] = nearbyCategoryFlow.flatMap((def) => {
    const matched = findPlacesForCategory(source, def.apiKeys, claimedKeys);
    if (matched) claimedKeys.add(matched.key);
    const places = matched?.places ?? [];

    if (places.length === 0) return [];

    const nearestFirst = sortPlacesByDistance(places);
    const options = nearestFirst.map((place, placeIndex) => ({
      id: `${def.id}-${placeIndex}`,
      placeName: place.name,
      walkTime: formatDistanceAway(place.distance) || "Nearby",
      imageSrc: resolveNearbyPlaceImage(place),
      imageAlt: place.name,
      latitude: parseCoord(place.latitude),
      longitude: parseCoord(place.longitude),
    }));

    const primary = options[0];

    return [
      {
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
      },
    ];
  });

  // Append any unmatched API categories after the design flow.
  for (const [categoryKey, places] of Object.entries(source)) {
    if (claimedKeys.has(categoryKey)) continue;
    if (!Array.isArray(places) || places.length === 0) continue;

    const validPlaces = places.filter((place) => place?.name);
    if (validPlaces.length === 0) continue;

    const category = formatNearbyLabel(categoryKey);
    const nearestFirst = sortPlacesByDistance(validPlaces);
    const options = nearestFirst.map((place, placeIndex) => ({
      id: `${categoryKey}-${placeIndex}`,
      placeName: place.name,
      walkTime: formatDistanceAway(place.distance) || "Nearby",
      imageSrc: resolveNearbyPlaceImage(place),
      imageAlt: place.name,
      latitude: parseCoord(place.latitude),
      longitude: parseCoord(place.longitude),
    }));
    const primary = options[0];

    flowCards.push({
      id: categoryKey,
      emoji: nearbyEmoji(categoryKey),
      category,
      placeName: primary.placeName,
      imageSrc: primary.imageSrc,
      imageAlt: primary.imageAlt,
      walkTime: primary.walkTime,
      linkLabel: `View ${category} Nearby`,
      modalLabel: category,
      options,
    });
  }

  return flowCards;
}

function ratingLabel(rating: number): string {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  return "Rated";
}

export function mapGoogleDataToReviewSummary(
  googleData: GoogleData | null | undefined,
) {
  if (!googleData) return null;

  const rating = Number(googleData.google_rating);
  const reviewCount =
    googleData.google_reviews_new?.length ??
    googleData.google_reviews?.length ??
    0;

  if (!Number.isFinite(rating) && reviewCount === 0) return null;

  const categories: HdpReviewCategory[] = [
    { label: "Cleanliness", score: Number.isFinite(rating) ? rating : 4.5 },
    {
      label: "Location",
      score: Number.isFinite(rating) ? Math.max(0, rating - 0.1) : 4.4,
    },
    { label: "Amenities", score: Number.isFinite(rating) ? rating : 4.5 },
    {
      label: "Community",
      score: Number.isFinite(rating) ? Math.max(0, rating - 0.2) : 4.3,
    },
  ];

  return {
    rating: Number.isFinite(rating) ? rating.toFixed(1) : "—",
    label: Number.isFinite(rating) ? ratingLabel(rating) : "Reviews",
    reviewCount,
    recommendPercent: Number.isFinite(rating)
      ? Math.min(99, Math.round((rating / 5) * 100))
      : 90,
    categories,
    googleLink: googleData.google_link || undefined,
  };
}

export function mapGoogleReviewsToResidentReviews(
  googleData: GoogleData | null | undefined,
): HdpResidentReview[] {
  const reviews = googleData?.google_reviews_new ?? [];
  return reviews
    .filter((review) => review?.name && review?.review)
    .map((review, index) => ({
      id: `google-review-${index}`,
      name: review.name,
      quote: review.review,
    }));
}

export type HdpReviewSummaryView = NonNullable<
  ReturnType<typeof mapGoogleDataToReviewSummary>
>;
