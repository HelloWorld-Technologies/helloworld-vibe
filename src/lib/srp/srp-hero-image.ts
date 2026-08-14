import { imageUrlFormatter } from "@/src/lib/images";
import type { SrpPageConfig } from "@/src/lib/srp/resolve-srp-page";
import { srpHeroPlaceholderImage } from "@/src/tokens/srp";

function normalizeImageSource(value: unknown): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  return trimmed;
}

function formatHeroImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.includes("coming-soon")) return srpHeroPlaceholderImage;

  if (trimmed.startsWith("/")) return trimmed;

  if (trimmed.includes("http")) {
    return trimmed
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/ /g, "%20");
  }

  return imageUrlFormatter("hdp", trimmed);
}

export function resolveSrpHeroImageSrc(
  config: SrpPageConfig,
  override?: string,
): string {
  const property = config.properties[0];
  const raw =
    override?.trim() ||
    normalizeImageSource(config.heroImageSrc) ||
    normalizeImageSource(property?.image) ||
    normalizeImageSource(property?.srp_image) ||
    normalizeImageSource(property?.hdp_image) ||
    normalizeImageSource(property?.property_image?.[0]) ||
    "";

  if (!raw) {
    return srpHeroPlaceholderImage;
  }

  return formatHeroImageUrl(raw);
}
