import type { CitySlug } from "@/src/tokens/cities";
import { isCitySlug } from "@/src/tokens/cities";

const CITY_SLUG_ALIASES: Record<string, CitySlug> = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  gurgaon: "gurugram",
  gurugram: "gurugram",
  vizag: "visakhapatnam",
  visakhapatnam: "visakhapatnam",
};

export type CityHeroImage = {
  src: string;
  webpSrc: string;
};

/** JPG fallback + compressed WebP for `<picture>` / `AdaptiveImage`. */
function cityRasterImage(src: string): CityHeroImage {
  return {
    src,
    webpSrc: src.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
  };
}

/** Landmark hero images for city SRP pages only. */
export const CITY_HERO_IMAGES = {
  ahmedabad: cityRasterImage("/assets/cities/ahmedabad.jpg"),
  bangalore: cityRasterImage("/assets/cities/bangalore.jpg"),
  chennai: cityRasterImage("/assets/cities/chennai.jpg"),
  coimbatore: cityRasterImage("/assets/cities/coimbatore.jpg"),
  delhi: cityRasterImage("/assets/cities/delhi.jpg"),
  goa: cityRasterImage("/assets/cities/goa.jpg"),
  gurugram: cityRasterImage("/assets/cities/gurugram.jpg"),
  hyderabad: cityRasterImage("/assets/cities/hyderabad.jpg"),
  indore: cityRasterImage("/assets/cities/indore.jpg"),
  jaipur: cityRasterImage("/assets/cities/jaipur.jpg"),
  kolkata: cityRasterImage("/assets/cities/kolkata.jpg"),
  kota: cityRasterImage("/assets/cities/kota.jpg"),
  mumbai: cityRasterImage("/assets/cities/mumbai.jpg"),
  noida: cityRasterImage("/assets/cities/noida.jpg"),
  pune: cityRasterImage("/assets/cities/pune.jpg"),
  visakhapatnam: cityRasterImage("/assets/cities/visakhapatnam.jpg"),
} as const satisfies Record<CitySlug, CityHeroImage>;

function normalizeCitySlug(city: string): CitySlug | undefined {
  const raw = city.trim().toLowerCase().replace(/_/g, " ").replace(/\s+/g, " ");
  if (!raw) return undefined;

  const aliasKey = raw.replace(/\s+/g, "");
  const spacedSlug = raw.replace(/\s+/g, "_");

  const aliased =
    CITY_SLUG_ALIASES[raw] ??
    CITY_SLUG_ALIASES[aliasKey] ??
    CITY_SLUG_ALIASES[spacedSlug];
  if (aliased) return aliased;

  if (isCitySlug(spacedSlug)) return spacedSlug;
  if (isCitySlug(raw)) return raw;
  return undefined;
}

/** City SRP hero image paths, or undefined for unknown cities. */
export function getCityHeroImage(city: string): CityHeroImage | undefined {
  const slug = normalizeCitySlug(city);
  if (!slug) return undefined;
  return CITY_HERO_IMAGES[slug];
}
