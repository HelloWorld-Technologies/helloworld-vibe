import { imageUrlFormatter } from "@/src/lib/images";
import type { SrpPageConfig } from "@/src/lib/srp/resolve-srp-page";
import { getCityHeroImage } from "@/src/tokens/city-hero-images";
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
 * Hero image for SRP pages.
 * - City pages always use the hardcoded city landmark image (fallback: coming-soon).
 * - Locality/landmark pages use API cover (or override) only — no city image swap.
 */
export function resolveSrpHeroImageSrc(
  config: SrpPageConfig,
  override?: string,
): string {
  if (config.kind === "city") {
    return (
      getCityHeroImage(config.city) ||
      srpCardComingSoonImage
    );
  }

  const raw =
    normalizeImageSource(override) ||
    normalizeImageSource(config.heroImageSrc) ||
    "";

  return raw ? formatHeroImageUrl(raw) : "";
}
