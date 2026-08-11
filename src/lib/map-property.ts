import { getGenderDisplayLabel } from "@/src/lib/gender-label";
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

function propertyImages(property: Property): readonly string[] {
  const candidates = [
    property.image,
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
    rating: Number(property.address?.latitude ? 4.5 : 4.5),
    roomTypes: ["Private", "Double", "Triple"],
    rent: property.min_rent ?? 0,
    statusLabel: statusLabel(property),
    genderLabel: genderLabel(property.gender),
    city: formatCityDisplayName(
      context?.city ?? property.address?.city ?? property.city ?? "",
    ),
    location: context?.locality ?? property.locality,
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
      locality:
        context?.locality ||
        property.locality ||
        property.address?.line2 ||
        undefined,
    }),
  );
}

export function mapWishlistCardToSrpCard(
  card: WishlistPropertyCard,
): LocalityProperty {
  const localityLabel =
    card.locality || card.address?.line2 || card.city || "your city";
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

  return mapPropertyToSrpCard(property, `Coliving PG in ${localityLabel}`, {
    city: card.city,
    locality: localityLabel,
  });
}
