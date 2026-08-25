import type { LocalityListItem } from "@/src/apis/srp";
import { imageUrlFormatter } from "@/src/lib/images";
import { buildLocalitySrpHref } from "@/src/lib/srp/locality-srp-href";
import { getLocalitySlug } from "@/src/lib/sitemap-slug";
import type { Property } from "@/src/models/property";
import type { LocalityCardData } from "@/src/tokens/locality-card";

const FALLBACK_IMAGES = [
  "/assets/community/hero/hero-1.webp",
  "/assets/community/hero/hero-2.webp",
  "/assets/community/hero/hero-3.webp",
  "/assets/community/hero/hero-4.webp",
  "/assets/locality/transit-bento-desktop.png",
] as const;

function normalizeImageSource(value: unknown): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  return trimmed;
}

function propertyImageSrc(property: Property): string {
  const candidates = [
    property.image,
    property.srp_image,
    property.hdp_image,
    ...(Array.isArray(property.property_image) ? property.property_image : []),
  ];

  for (const candidate of candidates) {
    const raw = normalizeImageSource(candidate);
    if (!raw) continue;
    if (raw.startsWith("/")) return raw;
    const formatted = imageUrlFormatter("srp", raw);
    if (formatted) return formatted;
  }

  return "";
}

function groupPropertiesByLocality(properties: Property[]) {
  const bySlug = new Map<string, Property[]>();

  for (const property of properties) {
    const slug = getLocalitySlug(property);
    if (!slug) continue;
    const list = bySlug.get(slug) ?? [];
    list.push(property);
    bySlug.set(slug, list);
  }

  return bySlug;
}

export function buildPopularLocalityCards(
  localityLinks: LocalityListItem[],
  properties: Property[],
  options: { city: string; canonicalPath: string },
): (LocalityCardData & { href: string })[] {
  if (localityLinks.length === 0) return [];

  const bySlug = groupPropertiesByLocality(properties);
  const cityMinRent = properties
    .map((property) => property.min_rent)
    .filter((rent) => rent > 0)
    .reduce((min, rent) => Math.min(min, rent), Number.POSITIVE_INFINITY);

  return localityLinks.slice(0, 12).flatMap((item, index) => {
    const localityProperties = bySlug.get(item.slug) ?? [];
    const rents = localityProperties
      .map((property) => property.min_rent)
      .filter((rent) => rent > 0);
    const startingRent =
      rents.length > 0
        ? Math.min(...rents)
        : Number.isFinite(cityMinRent)
          ? cityMinRent
          : 0;

    const imageSrc =
      localityProperties.map(propertyImageSrc).find(Boolean) ??
      FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

    const href = buildLocalitySrpHref(options.city, item.name, {
      srpSlug: options.canonicalPath.replace(/^\//, ""),
    });
    if (!href) return [];

    return [
      {
        id: item.slug,
        name: item.name,
        startingRent,
        propertyCount: localityProperties.length,
        imageSrc,
        href,
      },
    ];
  });
}
