import {
  getGenderDisplayLabel,
  getGenderSubtitlePrefix,
} from "@/src/lib/gender-label";
import { formatCityDisplayName } from "@/src/tokens/cities";
import { imageUrlFormatter } from "@/src/lib/images";
import { getPropertyHref } from "@/src/lib/sitemap-slug";
import { getPublicSiteUrl } from "@/src/lib/schema";
import type { WishlistPropertyCard } from "@/src/models/wishlist";
import type { Property } from "@/src/models/property";
import { srpCardDefaultImage, SRP_CARD_MAX_IMAGES, type SrpCardStatusLabel } from "@/src/tokens/srp-card";
import type { LocalityProperty } from "@/src/tokens/locality";

function normalizeImageSource(value: unknown): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  return trimmed;
}

function genderLabel(gender?: string): string | undefined {
  return getGenderDisplayLabel(gender);
}

function statusLabel(property: Property): SrpCardStatusLabel | undefined {
  if (property.lightning_deal) return "trending";
  if (property.available_beds != null && property.available_beds <= 3) {
    return "filling-fast";
  }
  return undefined;
}

function vibeMatchScore(property: Property): number | undefined {
  const raw = property.vibe_match_score;
  const score = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(score) || score <= 0) return undefined;
  return Math.round(score);
}

function propertyRating(property: Property): number | undefined {
  const raw = property.rating ?? property.google_rating;
  if (raw == null) return undefined;
  const rating = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(rating) || rating <= 0) return undefined;
  return rating;
}

/** Prefer property locality; list APIs often leave `locality` null and put it in address.line2. */
export function resolvePropertyLocality(property: Property): string | undefined {
  const candidates = [
    property.locality,
    property.address?.line2,
    property.address?.landmark,
  ];
  for (const candidate of candidates) {
    const label = String(candidate ?? "").trim();
    if (label && label.toLowerCase() !== "null" && label.toLowerCase() !== "undefined") {
      return label;
    }
  }
  return undefined;
}

export function colivingPgSubtitle(
  property: Property,
  fallbackLocality?: string,
): string {
  const locality =
    resolvePropertyLocality(property) ||
    String(fallbackLocality ?? "").trim() ||
    formatCityDisplayName(property.city || property.address?.city || "");
  return `Coliving PG in ${locality || "your city"}`;
}

/** Campaign carousel card subtitle — kota uses "hostel"; other cities use "Coliving PG". */
export function campaignPropertySubtitle(
  property: Property,
  citySlug: string,
  fallbackLocality?: string,
): string {
  const locality =
    resolvePropertyLocality(property) ||
    String(fallbackLocality ?? "").trim() ||
    formatCityDisplayName(property.city || property.address?.city || "");
  const place = locality || "your city";
  const genderPrefix = getGenderSubtitlePrefix(property.gender);
  const isKota = citySlug.toLowerCase() === "kota";

  if (isKota) {
    return `${genderPrefix}hostel in ${place}`;
  }
  return `${genderPrefix}Coliving PG in ${place}`;
}

function propertyImages(property: Property): readonly string[] {
  const candidates = [
    property.image,
    property.hdp_image,
    ...(typeof property.srp_image === "string" ? [property.srp_image] : []),
    ...(Array.isArray(property.property_image) ? property.property_image : []),
  ];

  const urls = candidates
    .map(normalizeImageSource)
    .filter(Boolean)
    .map((url) => imageUrlFormatter("srp", url))
    .filter((url) => url.length > 0);

  const unique = [...new Set(urls)];
  return unique.length > 0
    ? unique.slice(0, SRP_CARD_MAX_IMAGES)
    : [srpCardDefaultImage];
}

export function mapPropertyToSrpCard(
  property: Property,
  subtitle: string,
  context?: { city?: string; locality?: string; propertyUrl?: string },
): LocalityProperty {
  const href = getPropertyHref(property);
  const propertyUrl =
    context?.propertyUrl ?? `${getPublicSiteUrl()}${href}`;

  return {
    id: String(property.id),
    propertyId: property.id,
    name: property.display_name || property.name,
    subtitle,
    images: propertyImages(property),
    rating: propertyRating(property),
    roomTypes: ["Private", "Double", "Triple"],
    rent: property.min_rent ?? 0,
    statusLabel: statusLabel(property),
    genderLabel: genderLabel(property.gender),
    city: formatCityDisplayName(
      context?.city ?? property.address?.city ?? property.city ?? "",
    ),
    location:
      context?.locality ||
      resolvePropertyLocality(property) ||
      undefined,
    href,
    propertyUrl,
    vibeMatchScore: vibeMatchScore(property),
  };
}

export function mapPropertiesToSrpCards(
  properties: Property[],
  subtitleBuilder: (property: Property) => string,
  context?: { city?: string; locality?: string },
): LocalityProperty[] {
  return properties.map((property) =>
    mapPropertyToSrpCard(property, subtitleBuilder(property), {
      city: context?.city,
      // Page-level locality only when provided; otherwise each property's own.
      locality: context?.locality || resolvePropertyLocality(property),
    }),
  );
}

export function mapWishlistCardToSrpCard(
  card: WishlistPropertyCard,
): LocalityProperty {
  const property = {
    id: card.id,
    name: card.name,
    display_name: card.display_name,
    image: card.image,
    hdp_image: card.image,
    srp_image: null,
    property_image: card.image ? [card.image] : [],
    address: card.address,
    city: card.city,
    locality: card.locality,
    gender: card.gender,
    min_rent: card.min_rent,
    available_beds: card.available_beds,
    lightning_deal: card.lightning_deal,
    free_rent: card.free_rent,
    sold_out: card.sold_out,
  } as Property;
  const localityLabel =
    resolvePropertyLocality(property) || card.city || "your city";

  return mapPropertyToSrpCard(property, colivingPgSubtitle(property, card.city), {
    city: card.city,
    locality: localityLabel,
  });
}
