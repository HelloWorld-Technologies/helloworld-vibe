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

/** Landmark hero images for city SRP pages only. */
export const CITY_HERO_IMAGES = {
  ahmedabad: "/assets/cities/ahmedabad.png",
  bangalore: "/assets/cities/bangalore.png",
  chennai: "/assets/cities/chennai.png",
  coimbatore: "/assets/cities/coimbatore.png",
  delhi: "/assets/cities/delhi.png",
  goa: "/assets/cities/goa.png",
  gurugram: "/assets/cities/gurugram.png",
  hyderabad: "/assets/cities/hyderabad.png",
  indore: "/assets/cities/indore.png",
  jaipur: "/assets/cities/jaipur.png",
  kolkata: "/assets/cities/kolkata.png",
  kota: "/assets/cities/kota.png",
  mumbai: "/assets/cities/mumbai.png",
  noida: "/assets/cities/noida.png",
  pune: "/assets/cities/pune.png",
  visakhapatnam: "/assets/cities/visakhapatnam.png",
} as const satisfies Record<CitySlug, string>;

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

/** City SRP hero image path, or undefined for unknown cities. */
export function getCityHeroImage(city: string): string | undefined {
  const slug = normalizeCitySlug(city);
  if (!slug) return undefined;
  return CITY_HERO_IMAGES[slug];
}
