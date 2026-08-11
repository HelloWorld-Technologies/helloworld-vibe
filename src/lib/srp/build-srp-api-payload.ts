import type { Filters, Sorting } from "@/src/apis/srp";
import { genderFilterApiValue } from "@/src/lib/srp-slug-parse";
import type { SrpQuery } from "@/src/models/srp-query";

export function hasActiveSrpQueryFilters(query: SrpQuery): boolean {
  return Boolean(
    query.price ||
      (query.gender && query.gender !== "any gender") ||
      query.amenity ||
      query.food === "available" ||
      (query.sort && query.sort !== "popularity"),
  );
}

export function buildSrpApiFilter(
  query: SrpQuery,
  slugGender?: "male only" | "female only",
  vibeIds: readonly number[] = [],
): Filters | undefined {
  const gender = genderFilterApiValue(query.gender, slugGender);
  const [minRaw, maxRaw] = query.price?.split(",") ?? [];
  const minPrice = minRaw ? Number(minRaw) : undefined;
  const maxPrice = maxRaw ? Number(maxRaw) : undefined;
  const amenities = query.amenity
    ? query.amenity.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  const food = query.food === "available";
  const vibes = vibeIds.filter((id) => Number.isFinite(id) && id > 0);

  if (
    !gender &&
    minPrice === undefined &&
    maxPrice === undefined &&
    amenities.length === 0 &&
    !food &&
    vibes.length === 0
  ) {
    return slugGender
      ? { gender: genderFilterApiValue(undefined, slugGender), amenities: [] }
      : undefined;
  }

  return {
    gender,
    price: {
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    },
    amenities,
    food: food || undefined,
    ...(vibes.length > 0 ? { vibes } : {}),
  };
}

export function buildSrpApiSorting(sort?: string): Sorting | null | undefined {
  if (!sort) return undefined;
  const [keyType, sortType] = sort.split("-");
  if (!keyType) return undefined;
  return { keyType, sortType };
}

export function serializeSrpQuery(query: SrpQuery): string {
  return JSON.stringify({
    price: query.price ?? "",
    gender: query.gender ?? "",
    amenity: query.amenity ?? "",
    food: query.food ?? "",
    sort: query.sort ?? "",
  });
}
