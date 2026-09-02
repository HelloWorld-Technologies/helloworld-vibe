export interface LocalityInfoPlace {
  id: string;
  name: string;
  distance_meters: number | null;
  latitude?: number;
  longitude?: number;
  image?: string | null;
  photo?: string | null;
  image_url?: string | null;
}

export interface LocalityInfoRatings {
  dining?: number;
  health?: number;
  transit?: number;
  night_life?: number;
}

export type LocalityInfoNearby = Record<string, LocalityInfoPlace[]>;

export interface LocalityInfo {
  id?: string;
  display_name?: string;
  slug?: string;
  locality_type?: string;
  description?: string | null;
  cover_image?: string | null;
  landmark_image?: string | null;
  city_image?: string | null;
  images?: string[];
  ratings?: LocalityInfoRatings;
  starting_rent?: number;
  nearby?: LocalityInfoNearby;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseNumber(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parsePlace(value: unknown): LocalityInfoPlace | null {
  const record = asRecord(value);
  if (!record) return null;
  const name = String(record.name ?? "").trim();
  if (!name || /^test$/i.test(name)) return null;
  const meters = parseNumber(record.distance_meters);
  const latitude = parseNumber(record.latitude ?? record.lat);
  const longitude = parseNumber(record.longitude ?? record.lng ?? record.lon);
  const image = String(record.image ?? "").trim() || null;
  const photo = String(record.photo ?? "").trim() || null;
  const imageUrl = String(record.image_url ?? record.imageUrl ?? "").trim() || null;
  return {
    id: String(record.id ?? name),
    name,
    distance_meters: meters ?? null,
    ...(latitude != null ? { latitude } : {}),
    ...(longitude != null ? { longitude } : {}),
    ...(image ? { image } : {}),
    ...(photo ? { photo } : {}),
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };
}

function parseRatings(value: unknown): LocalityInfoRatings | undefined {
  const record = asRecord(value);
  if (!record) return undefined;

  const ratings: LocalityInfoRatings = {
    dining: parseNumber(record.dining),
    health: parseNumber(record.health),
    transit: parseNumber(record.transit),
    night_life: parseNumber(
      record.night_life ?? record.nightlife ?? record.nightLife,
    ),
  };

  return ratings.dining != null ||
    ratings.health != null ||
    ratings.transit != null ||
    ratings.night_life != null
    ? ratings
    : undefined;
}

function parseNearby(value: unknown): LocalityInfoNearby | undefined {
  const record = asRecord(value);
  if (!record) return undefined;

  const nearby: LocalityInfoNearby = {};
  for (const [key, places] of Object.entries(record)) {
    if (!Array.isArray(places)) continue;
    const parsed = places
      .map(parsePlace)
      .filter((place): place is LocalityInfoPlace => place != null);
    if (parsed.length === 0) continue;
    nearby[key] = parsed;
  }

  return Object.keys(nearby).length > 0 ? nearby : undefined;
}

export function parseLocalityInfo(value: unknown): LocalityInfo | undefined {
  const record = asRecord(value);
  if (!record) return undefined;

  const startingRent = parseNumber(record.starting_rent);
  const coverImage = String(record.cover_image ?? "").trim();
  const description = String(record.description ?? "").trim();

  const info: LocalityInfo = {
    id: record.id != null ? String(record.id) : undefined,
    display_name: String(record.display_name ?? "").trim() || undefined,
    slug: String(record.slug ?? "").trim() || undefined,
    locality_type: String(record.locality_type ?? "").trim() || undefined,
    description: description || null,
    cover_image: coverImage || null,
    landmark_image: String(record.landmark_image ?? "").trim() || null,
    city_image: String(record.city_image ?? "").trim() || null,
    images: Array.isArray(record.images)
      ? record.images.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [],
    ratings: parseRatings(record.ratings),
    starting_rent:
      startingRent != null && startingRent > 0 ? startingRent : undefined,
    nearby: parseNearby(record.nearby),
  };

  if (
    !info.cover_image &&
    !info.ratings &&
    info.starting_rent == null &&
    !info.nearby &&
    !info.description
  ) {
    return undefined;
  }

  return info;
}
