import PRESENT_CITIES from "@/src/constants/cities";

const cities = PRESENT_CITIES;

export type SrpLivingType = "hostels" | "coliving";

export interface ParsedMarketingSrpSlug {
  city: string;
  livingType: SrpLivingType;
  /** Applied as default gender when the URL has no `?gender=` query. */
  slugGender?: "male only" | "female only";
  /** True for slug families that should only work on locality pages. */
  localityOnly?: boolean;
}

export interface ParsedNearLandmarkSrpSlug {
  landmarkSlug: string;
  livingType: SrpLivingType;
  slugGender?: "male only" | "female only";
  /** Coliving near-landmark: room-for-rent family vs default PG-near. */
  colivingNearKind?: "room_for_rent";
}

const HOSTELS_PREFIX = "hostels-in-";
const COLIVING_PREFIX = "coliving-in-";
const PG_PREFIX = "pg-in-";
const ROOMS_PREFIX = "rooms-in-";
const PG_FOR_BOYS_PREFIX = "pg-for-boys-in-";
const PG_FOR_GIRLS_PREFIX = "pg-for-girls-in-";
/** Kota-only, singular "hostel": `boys-hostel-in-talwandi-kota` / `girls-hostel-in-talwandi-kota` */
const BOYS_HOSTEL_IN_PREFIX = "boys-hostel-in-";
const GIRLS_HOSTEL_IN_PREFIX = "girls-hostel-in-";
const BOYS_HOSTEL_NEAR_PREFIX = "boys-hostel-near-";
const GIRLS_HOSTEL_NEAR_PREFIX = "girls-hostel-near-";
const HOSTEL_NEAR_PREFIX = "hostel-near-";
const PG_FOR_BOYS_NEAR_PREFIX = "pg-for-boys-near-";
const PG_FOR_GIRLS_NEAR_PREFIX = "pg-for-girls-near-";
const PG_NEAR_PREFIX = "pg-near-";
const ROOM_FOR_RENT_NEAR_PREFIX = "room-for-rent-near-";
/** Flat locality: `room-for-rent-in-hsr-layout-bangalore` */
const ROOM_FOR_RENT_IN_PREFIX = "room-for-rent-in-";
const KOTA_SLUG = "kota";

/**
 * Landmark SRP slugs:
 * - `boys-hostel-near-{landmark}`
 * - `girls-hostel-near-{landmark}`
 * - `hostel-near-{landmark}`
 * - `pg-for-boys-near-{landmark}`
 * - `pg-for-girls-near-{landmark}`
 * - `pg-near-{landmark}`
 * - `room-for-rent-near-{landmark}`
 */
export function parseNearLandmarkSrpSlug(
  srpSlugParam: string
): ParsedNearLandmarkSrpSlug | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  const variants: Array<{
    prefix: string;
    livingType: SrpLivingType;
    slugGender?: "male only" | "female only";
    colivingNearKind?: "room_for_rent";
  }> = [
    {
      prefix: BOYS_HOSTEL_NEAR_PREFIX,
      livingType: "hostels",
      slugGender: "male only",
    },
    {
      prefix: GIRLS_HOSTEL_NEAR_PREFIX,
      livingType: "hostels",
      slugGender: "female only",
    },
    { prefix: HOSTEL_NEAR_PREFIX, livingType: "hostels" },
    {
      prefix: PG_FOR_BOYS_NEAR_PREFIX,
      livingType: "coliving",
      slugGender: "male only",
    },
    {
      prefix: PG_FOR_GIRLS_NEAR_PREFIX,
      livingType: "coliving",
      slugGender: "female only",
    },
    {
      prefix: ROOM_FOR_RENT_NEAR_PREFIX,
      livingType: "coliving",
      colivingNearKind: "room_for_rent",
    },
    { prefix: PG_NEAR_PREFIX, livingType: "coliving" },
  ];

  for (const variant of variants) {
    if (!raw.startsWith(variant.prefix)) continue;
    const landmarkSlug = raw
      .slice(variant.prefix.length)
      .replace(/^-+|-+$/g, "");
    if (!landmarkSlug) return null;
    return {
      landmarkSlug,
      livingType: variant.livingType,
      slugGender: variant.slugGender,
      ...(variant.colivingNearKind
        ? { colivingNearKind: variant.colivingNearKind }
        : {}),
    };
  }

  return null;
}

/**
 * Kota-only flat **generic** student-hostel locality: `hostels-in-{locality}-kota` (unfiltered).
 */
export function parseFlatKotaGenericHostelSlug(srpSlugParam: string): {
  city: typeof KOTA_SLUG;
  localitySlug: string;
} | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  if (!raw.startsWith(HOSTELS_PREFIX)) return null;
  const tail = raw.slice(HOSTELS_PREFIX.length);
  if (!tail) return null;
  const suffix = `-${KOTA_SLUG}`;
  if (!tail.endsWith(suffix)) return null;
  const localitySlug = tail.slice(0, -suffix.length).replace(/^-+|-+$/g, "");
  if (!localitySlug) return null;
  return { city: KOTA_SLUG, localitySlug };
}

/**
 * Kota-only flat locality URLs for gendered student hostels (singular `hostel` in the path).
 */
export function parseFlatKotaGenderHostelSlug(srpSlugParam: string): {
  city: typeof KOTA_SLUG;
  localitySlug: string;
  slugGender: "male only" | "female only";
} | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  let gender: "male only" | "female only" | undefined;
  let tail = "";
  if (raw.startsWith(BOYS_HOSTEL_IN_PREFIX)) {
    gender = "male only";
    tail = raw.slice(BOYS_HOSTEL_IN_PREFIX.length);
  } else if (raw.startsWith(GIRLS_HOSTEL_IN_PREFIX)) {
    gender = "female only";
    tail = raw.slice(GIRLS_HOSTEL_IN_PREFIX.length);
  }
  if (!gender || !tail) return null;
  const suffix = `-${KOTA_SLUG}`;
  if (!tail.endsWith(suffix)) return null;
  const localitySlug = tail.slice(0, -suffix.length).replace(/^-+|-+$/g, "");
  if (!localitySlug) return null;
  return { city: KOTA_SLUG, localitySlug, slugGender: gender };
}

/**
 * Single-segment locality URLs: `pg-for-boys-in-hsr-layout-bangalore`,
 * `pg-for-girls-in-sector-53-gurugram`. City must match a suffix from {@link cityKeys}.
 */
export function parseFlatGenderLocalitySlug(
  srpSlugParam: string,
  cityKeys: readonly string[] = cities
): {
  city: string;
  localitySlug: string;
  slugGender: "male only" | "female only";
} | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  let gender: "male only" | "female only" | undefined;
  let tail = "";
  if (raw.startsWith(PG_FOR_BOYS_PREFIX)) {
    gender = "male only";
    tail = raw.slice(PG_FOR_BOYS_PREFIX.length);
  } else if (raw.startsWith(PG_FOR_GIRLS_PREFIX)) {
    gender = "female only";
    tail = raw.slice(PG_FOR_GIRLS_PREFIX.length);
  }
  if (!gender || !tail) return null;

  const sorted = [...cityKeys]
    .map((c) => String(c).trim().toLowerCase())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const city of sorted) {
    const suffix = `-${city}`;
    if (!tail.endsWith(suffix)) continue;
    const localitySlug = tail.slice(0, -suffix.length).replace(/^-+|-+$/g, "");
    if (!localitySlug) return null;
    /** Kota keeps both `pg-for-*-in-{locality}-kota` and `boys-hostel-in-{locality}-kota` families. */
    return { city, localitySlug, slugGender: gender };
  }
  return null;
}

/**
 * Single-segment coliving locality URLs: `coliving-in-hsr-layout-bangalore`.
 * City must match a suffix from {@link cityKeys}. `coliving-in-{city}` alone is not matched (locality empty).
 */
export function parseFlatColivingLocalitySlug(
  srpSlugParam: string,
  cityKeys: readonly string[] = cities
): { city: string; localitySlug: string } | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  if (!raw.startsWith(COLIVING_PREFIX)) return null;
  const tail = raw.slice(COLIVING_PREFIX.length);
  if (!tail) return null;

  const sorted = [...cityKeys]
    .map((c) => String(c).trim().toLowerCase())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const city of sorted) {
    const suffix = `-${city}`;
    if (!tail.endsWith(suffix)) continue;
    const localitySlug = tail.slice(0, -suffix.length).replace(/^-+|-+$/g, "");
    if (!localitySlug) return null;
    return { city, localitySlug };
  }
  return null;
}

/**
 * Single-segment generic PG locality URLs: `pg-in-hsr-layout-bangalore`, `pg-in-talwandi-kota`.
 * City must match a suffix from {@link cityKeys}. `pg-in-{city}` alone is not matched (locality empty).
 */
export function parseFlatPgLocalitySlug(
  srpSlugParam: string,
  cityKeys: readonly string[] = cities
): { city: string; localitySlug: string } | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  if (!raw.startsWith(PG_PREFIX)) return null;
  const tail = raw.slice(PG_PREFIX.length);
  if (!tail) return null;

  const sorted = [...cityKeys]
    .map((c) => String(c).trim().toLowerCase())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const city of sorted) {
    const suffix = `-${city}`;
    if (!tail.endsWith(suffix)) continue;
    const localitySlug = tail.slice(0, -suffix.length).replace(/^-+|-+$/g, "");
    if (!localitySlug) return null;
    return { city, localitySlug };
  }
  return null;
}

/**
 * Single-segment locality URLs: `room-for-rent-in-hsr-layout-bangalore`.
 * City must match a suffix from {@link cityKeys}. City-only slugs are not matched.
 */
export function parseFlatRoomForRentLocalitySlug(
  srpSlugParam: string,
  cityKeys: readonly string[] = cities
): { city: string; localitySlug: string } | null {
  const raw = String(srpSlugParam || "").trim().toLowerCase();
  if (!raw.startsWith(ROOM_FOR_RENT_IN_PREFIX)) return null;
  const tail = raw.slice(ROOM_FOR_RENT_IN_PREFIX.length);
  if (!tail) return null;

  const sorted = [...cityKeys]
    .map((c) => String(c).trim().toLowerCase())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const city of sorted) {
    const suffix = `-${city}`;
    if (!tail.endsWith(suffix)) continue;
    const localitySlug = tail.slice(0, -suffix.length).replace(/^-+|-+$/g, "");
    if (!localitySlug) return null;
    return { city, localitySlug };
  }
  return null;
}

/**
 * Parses marketing SRP slugs: `hostels-in-kota`, `coliving-in-bangalore`,
 * `pg-in-bangalore`, `rooms-in-bangalore` (locality-only), and gender-prefixed variants
 * (`boys-*`, `girls-*`, `gents-*`, `ladies-*`).
 */
export function parseMarketingSrpSlug(
  srpSlugParam: string
): ParsedMarketingSrpSlug | null {
  if (!srpSlugParam || typeof srpSlugParam !== "string") return null;
  if (parseNearLandmarkSrpSlug(srpSlugParam)) return null;
  /** City-only URLs stay `pg-for-*-in-{city}`; locality pages use the flat slug and are handled in `[srp_slug]/index`. */
  if (parseFlatGenderLocalitySlug(srpSlugParam, cities)) return null;
  /** Kota singular-hostel locality slugs are handled in `[srp_slug]/index`. */
  if (parseFlatKotaGenderHostelSlug(srpSlugParam)) return null;
  /** Flat coliving locality slugs (`coliving-in-{locality}-{city}`) are handled in `[srp_slug]/index`. */
  if (parseFlatColivingLocalitySlug(srpSlugParam, cities)) return null;
  /** Flat Kota generic hostel locality (`hostels-in-{locality}-kota`) is handled in `[srp_slug]/index`. */
  if (parseFlatKotaGenericHostelSlug(srpSlugParam)) return null;
  /** Flat PG locality (`pg-in-{locality}-{city}`) is handled in `[srp_slug]/index`. */
  if (parseFlatPgLocalitySlug(srpSlugParam, cities)) return null;
  /** Flat room-for-rent locality (`room-for-rent-in-{locality}-{city}`) is handled in `[srp_slug]/index`. */
  if (parseFlatRoomForRentLocalitySlug(srpSlugParam, cities)) return null;
  let rest = srpSlugParam.trim();
  let slugGender: "male only" | "female only" | undefined;
  if (rest.startsWith(PG_FOR_BOYS_PREFIX)) {
    slugGender = "male only";
    rest = `${PG_PREFIX}${rest.slice(PG_FOR_BOYS_PREFIX.length)}`;
  } else if (rest.startsWith(PG_FOR_GIRLS_PREFIX)) {
    slugGender = "female only";
    rest = `${PG_PREFIX}${rest.slice(PG_FOR_GIRLS_PREFIX.length)}`;
  }
  if (rest.startsWith("boys-")) {
    slugGender = "male only";
    rest = rest.slice(5);
  } else if (rest.startsWith("girls-")) {
    slugGender = "female only";
    rest = rest.slice(6);
  } else if (rest.startsWith("gents-")) {
    slugGender = "male only";
    rest = rest.slice(6);
  } else if (rest.startsWith("ladies-")) {
    slugGender = "female only";
    rest = rest.slice(7);
  }
  if (rest.startsWith(HOSTELS_PREFIX)) {
    const city = rest.slice(HOSTELS_PREFIX.length);
    if (!city) return null;
    return { city, livingType: "hostels", slugGender };
  }
  if (rest.startsWith(COLIVING_PREFIX)) {
    const city = rest.slice(COLIVING_PREFIX.length);
    if (!city) return null;
    return { city, livingType: "coliving", slugGender };
  }
  if (rest.startsWith(PG_PREFIX)) {
    const city = rest.slice(PG_PREFIX.length);
    if (!city) return null;
    return { city, livingType: "coliving", slugGender };
  }
  if (rest.startsWith(ROOMS_PREFIX)) {
    const city = rest.slice(ROOMS_PREFIX.length);
    if (!city) return null;
    return { city, livingType: "coliving", slugGender, localityOnly: true };
  }
  return null;
}

function firstPathSegment(asPath: string): string {
  return String(asPath || "")
    .split("?")[0]
    .replace(/^\/+/, "")
    .split("/")[0]
    .trim()
    .toLowerCase();
}

/** City key from an SRP-like path, when the first segment parses to a known city. */
export function cityFromSrpPath(asPath: string): string | null {
  const slug = firstPathSegment(asPath);
  if (!slug) return null;
  const parsed =
    parseFlatKotaGenderHostelSlug(slug) ||
    parseFlatKotaGenericHostelSlug(slug) ||
    parseFlatGenderLocalitySlug(slug, cities) ||
    parseFlatColivingLocalitySlug(slug, cities) ||
    parseFlatPgLocalitySlug(slug, cities) ||
    parseFlatRoomForRentLocalitySlug(slug, cities) ||
    parseMarketingSrpSlug(slug);
  const city = parsed?.city ? String(parsed.city).trim().toLowerCase() : "";
  if (!city) return null;
  const known = new Set(
    cities.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
  );
  return known.has(city) ? city : null;
}

/** API gender filter: explicit query wins; otherwise slug default (boys/girls pages). */
export function genderFilterApiValue(
  queryGender: string | undefined,
  slugGender: "male only" | "female only" | undefined
): "" | "male" | "female" {
  if (queryGender === "male only") return "male";
  if (queryGender === "female only") return "female";
  if (queryGender === "any gender") return "";
  if (slugGender === "male only") return "male";
  if (slugGender === "female only") return "female";
  return "";
}
