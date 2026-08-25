import { imageUrlFormatter } from "@/src/lib/images";
import type { SrpPageConfig } from "@/src/lib/srp/resolve-srp-page";
import { srpCardComingSoonImage } from "@/src/tokens/srp-card";

function normalizeImageSource(value: unknown): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  if (trimmed.includes("coming-soon")) return "";
  return trimmed;
}

function formatHeroImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/")) return trimmed;

  if (trimmed.includes("http")) {
    return trimmed
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/ /g, "%20");
  }

  return imageUrlFormatter("hdp", trimmed);
}

/**
 * Hero image from the locality/city API cover (or an explicit override).
 * Does not fall back to listing property photos.
 * City pages without a cover use the coming-soon placeholder so the media
 * row can still show beside ratings; locality/landmark pages hide the image.
 */
export function resolveSrpHeroImageSrc(
  config: SrpPageConfig,
  override?: string,
): string {
  const raw =
    normalizeImageSource(override) ||
    normalizeImageSource(config.heroImageSrc) ||
    "";

  if (raw) return formatHeroImageUrl(raw);

  // City-only: fill the hero slot when the API omits cover_image.
  if (config.kind === "city") return srpCardComingSoonImage;

  return "";
}
