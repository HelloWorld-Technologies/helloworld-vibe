import type { LocalityListItem } from "@/src/apis/srp";
import { imageUrlFormatter } from "@/src/lib/images";
import { buildLocalitySrpHref } from "@/src/lib/srp/locality-srp-href";
import { getLocalitySlug } from "@/src/lib/sitemap-slug";
import type { Property } from "@/src/models/property";
import type { LocalityCardData } from "@/src/tokens/locality-card";
import { srpCardComingSoonImage } from "@/src/tokens/srp-card";

function normalizeImageSource(value: unknown): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  return trimmed;
}

function isLocalAssetPath(src: string): boolean {
  return src.startsWith("/assets/") || src.startsWith("assets/");
}

/** Format locality cover / property photo from the API. */
function formatApiImageSrc(raw: string): string {
  const value = normalizeImageSource(raw);
  if (!value || value.includes("coming-soon") || isLocalAssetPath(value)) {
    return "";
  }
  if (value.startsWith("data:")) return value;
  if (value.includes("http://") || value.includes("https://")) {
    return imageUrlFormatter("srp", value) || "";
  }
  const formatted = imageUrlFormatter("srp", value);
  if (
    !formatted ||
    formatted.includes("coming-soon") ||
    isLocalAssetPath(formatted)
  ) {
    return "";
  }
  return formatted;
}

/** API property photo only — never local category / hero artwork. */
function propertyImageSrc(property: Property): string {
  const candidates = [
    property.image,
    property.srp_image,
    property.hdp_image,
    ...(Array.isArray(property.property_image) ? property.property_image : []),
  ];

  for (const candidate of candidates) {
    const formatted = formatApiImageSrc(String(candidate ?? ""));
    if (formatted) return formatted;
  }

  return "";
}

function normalizeLocalityKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/-bangalore$|-bengaluru$/i, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function propertiesForLocality(
  item: LocalityListItem,
  properties: Property[],
): Property[] {
  const nameKey = normalizeLocalityKey(item.name);
  const slugKey = normalizeLocalityKey(item.slug);
  return properties.filter((property) => {
    const localityKey = normalizeLocalityKey(getLocalitySlug(property) || "");
    const localityName = String(property.locality ?? "")
      .trim()
      .toLowerCase();
    if (localityKey && (localityKey === nameKey || localityKey === slugKey)) {
      return true;
    }
    if (!nameKey) return false;
    return (
      localityName === item.name.trim().toLowerCase() ||
      localityName.includes(item.name.trim().toLowerCase())
    );
  });
}

export function buildPopularLocalityCards(
  localityLinks: LocalityListItem[],
  properties: Property[],
  options: { city: string; canonicalPath: string },
): (LocalityCardData & { href: string })[] {
  if (localityLinks.length === 0) return [];

  return localityLinks.slice(0, 12).flatMap((item) => {
    const localityProperties = propertiesForLocality(item, properties);
    const rents = localityProperties
      .map((property) => property.min_rent)
      .filter((rent) => rent > 0);
    const startingRent =
      item.startingRent && item.startingRent > 0
        ? item.startingRent
        : rents.length > 0
          ? Math.min(...rents)
          : 0;

    const propertyCount =
      item.propertyCount && item.propertyCount > 0
        ? item.propertyCount
        : localityProperties.length;

    // Prefer locality cover photo from hello/localities, then a property photo.
    const imageSrc =
      formatApiImageSrc(item.coverImage ?? "") ||
      localityProperties.map(propertyImageSrc).find(Boolean) ||
      srpCardComingSoonImage;

    const href = buildLocalitySrpHref(options.city, item.name, {
      srpSlug: options.canonicalPath.replace(/^\//, ""),
    });
    if (!href) return [];

    return [
      {
        id: item.slug,
        name: item.name,
        startingRent,
        propertyCount,
        imageSrc,
        href,
      },
    ];
  });
}
