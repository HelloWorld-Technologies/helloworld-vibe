import type { LocalityInfoRatings } from "@/src/models/locality-info";
import type { CitySlug } from "@/src/tokens/cities";
import { isCitySlug } from "@/src/tokens/cities";

/** City-level ratings; `overall` is stored but unused by the bento UI. */
export type CityRatings = LocalityInfoRatings & {
  overall?: number;
};

const CITY_SLUG_ALIASES: Record<string, CitySlug> = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  gurgaon: "gurugram",
  gurugram: "gurugram",
  vizag: "visakhapatnam",
  visakhapatnam: "visakhapatnam",
};

/**
 * Hardcoded city SRP ratings.
 * Columns: transit, dining, health, night_life, overall.
 */
export const CITY_RATINGS = {
  ahmedabad: { transit: 4.4, dining: 4.4, health: 4.5, night_life: 4, overall: 4.5 },
  bangalore: { transit: 4.2, dining: 4.4, health: 4.6, night_life: 4.7, overall: 4.9 },
  chennai: { transit: 4.4, dining: 4.5, health: 4.7, night_life: 4, overall: 4.6 },
  coimbatore: { transit: 4.5, dining: 4.2, health: 4.4, night_life: 3.6, overall: 4.2 },
  delhi: { transit: 3.5, dining: 4.7, health: 4.7, night_life: 4.7, overall: 4.8 },
  goa: { transit: 4.2, dining: 3.7, health: 4, night_life: 4.9, overall: 4.8 },
  gurugram: { transit: 4, dining: 4.3, health: 4.6, night_life: 4.8, overall: 4.9 },
  hyderabad: { transit: 4.3, dining: 4.2, health: 4.6, night_life: 4.4, overall: 4.7 },
  indore: { transit: 4.6, dining: 4.3, health: 4.3, night_life: 3.9, overall: 4.7 },
  jaipur: { transit: 4.4, dining: 4.1, health: 4.3, night_life: 4.1, overall: 4.6 },
  kolkata: { transit: 4.2, dining: 4.6, health: 4.5, night_life: 4.4, overall: 4.8 },
  mumbai: { transit: 4.1, dining: 4.9, health: 4.8, night_life: 4.9, overall: 4.9 },
  noida: { transit: 4, dining: 4.5, health: 4.5, night_life: 4.3, overall: 4.6 },
  pune: { transit: 4.3, dining: 4.3, health: 4.6, night_life: 4.6, overall: 4.8 },
  visakhapatnam: {
    transit: 4.5,
    dining: 4,
    health: 4.3,
    night_life: 3.7,
    overall: 4.3,
  },
  kota: { transit: 4.3, dining: 4.1, health: 4.1, night_life: 3.3, overall: 4.1 },
} as const satisfies Record<CitySlug, CityRatings>;

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

/** Returns hardcoded city ratings, or undefined for unknown cities. */
export function getCityRatings(city: string): CityRatings | undefined {
  const slug = normalizeCitySlug(city);
  if (!slug) return undefined;
  return CITY_RATINGS[slug];
}
