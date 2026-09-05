import { createHttpClient } from "@/src/apis/http";
import type {
  LandmarkPlaceApi,
  NearbyPlaceApiItem,
  NearbyPlacesApiResponse,
} from "@/src/models/nearby-place";
import {
  parseLocalityInfo,
  type LocalityInfo,
} from "@/src/models/locality-info";
import type { Property } from "@/src/models/property";

export const SRP_LIST_PAGE_SIZE = 18;

export interface Sorting {
  keyType?: string;
  sortType?: string;
}

export interface Filters {
  gender?: string;
  price?: {
    minPrice?: number;
    maxPrice?: number;
  };
  amenities: string[];
  food?: boolean;
  /** Selected vibe API ids for ranking / matching. */
  vibes?: number[];
}

export interface LocalityListItem {
  name: string;
  slug: string;
  /** Locality cover / photo from `hello/localities` when available. */
  coverImage?: string;
  startingRent?: number;
  propertyCount?: number;
}

interface FetchAllPropertyPayload {
  city: string;
  localityName?: string;
  filter?: Filters;
  sorting?: Sorting | null;
  campaign?: string;
}

interface FetchPropertiesBySlugPayload {
  slug: string;
  filter?: Filters;
  sorting?: Sorting | null;
}

export interface PropertyListResponse {
  success: boolean;
  data: Property[];
  pageInfo?: { total: number; nextPage?: boolean; count?: number };
  nearBy?: Property[];
  message?: string;
  place?: LandmarkPlaceApi;
  localityInfo?: LocalityInfo;
}

function asPropertyListResponse(body: object): PropertyListResponse {
  const response = body as PropertyListResponse;
  return {
    ...response,
    localityInfo: parseLocalityInfo(
      (body as { localityInfo?: unknown }).localityInfo,
    ),
  };
}

const LIST_FETCH_RETRIES = 1;
const LIST_FETCH_RETRY_DELAY_MS = 250;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function putPropertyList(
  path: "v3/property/list" | "v3/property/list/slug",
  payload: FetchAllPropertyPayload | FetchPropertiesBySlugPayload,
  params?: { page?: number; page_size?: number },
): Promise<PropertyListResponse> {
  let last: PropertyListResponse = { success: false, data: [] };
  for (let attempt = 0; attempt <= LIST_FETCH_RETRIES; attempt++) {
    try {
      const res = await createHttpClient().put(path, payload, { params });
      const body = res?.data;
      if (body != null && typeof body === "object" && !Array.isArray(body)) {
        const parsed = asPropertyListResponse(body);
        if (parsed.success && Array.isArray(parsed.data) && parsed.data.length > 0) {
          return parsed;
        }
        last = parsed;
      } else {
        last = { success: false, data: [] };
      }
    } catch {
      last = { success: false, data: [] };
    }
    if (attempt < LIST_FETCH_RETRIES) {
      await delay(LIST_FETCH_RETRY_DELAY_MS);
    }
  }
  return last;
}

export async function fetchAllProperty(
  payload: FetchAllPropertyPayload,
  params?: { page?: number; page_size?: number },
): Promise<PropertyListResponse> {
  return putPropertyList("v3/property/list", payload, params);
}

export async function fetchPropertiesBySlug(
  payload: FetchPropertiesBySlugPayload,
  params?: { page?: number; page_size?: number },
): Promise<PropertyListResponse> {
  return putPropertyList("v3/property/list/slug", payload, params);
}

export async function fetchNearbyPlaces(
  city: string,
  locality?: string,
): Promise<NearbyPlaceApiItem[]> {
  try {
    const { data } = await createHttpClient().get("property/nearby-places", {
      params: {
        city,
        ...(locality ? { locality } : {}),
      },
    });
    const body = data as NearbyPlacesApiResponse;
    const rawMap =
      body && typeof body === "object" && body.data && typeof body.data === "object"
        ? body.data
        : {};
    const bySlug = new Map<string, NearbyPlaceApiItem>();
    for (const list of Object.values(rawMap)) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        const slug = String(item?.slug || "")
          .trim()
          .toLowerCase();
        if (!slug || bySlug.has(slug)) continue;
        bySlug.set(slug, item);
      }
    }
    return Array.from(bySlug.values());
  } catch {
    return [];
  }
}

export async function fetchCityLocalities(
  city: string,
): Promise<LocalityListItem[]> {
  try {
    const { data } = await createHttpClient().get("v3/locality/list", {
      params: { city },
    });
    const raw = data?.data ?? data;
    const list = Array.isArray(raw) ? raw : [];
    return list
      .map((item: unknown) => {
        const record =
          typeof item === "string"
            ? { name: item, slug: item }
            : (item as { name?: string; locality?: string; slug?: string });
        const nameRaw = record?.name ?? record?.locality ?? record?.slug ?? "";
        const slugRaw = record?.slug ?? nameRaw;
        const name = String(nameRaw || "").trim();
        const slug = String(slugRaw || "")
          .trim()
          .toLowerCase()
          .replace(/[_\s]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");
        return { name, slug };
      })
      .filter((item) => Boolean(item.name) && Boolean(item.slug));
  } catch {
    return [];
  }
}

function mapHelloLocalityRow(item: Record<string, unknown>): LocalityListItem | null {
  const name = String(
    item.display_name ?? item.locality_name ?? item.name ?? "",
  ).trim();
  if (!name) return null;
  const slugRaw = String(item.slug ?? name).trim();
  const slug = slugRaw
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const coverImage = String(
    item.photo ?? item.cover_image ?? item.landmark_image ?? "",
  ).trim();
  const startingRent = Number(item.starting_rent);
  const propertyCount = Number(item.no_of_properties);
  return {
    name,
    slug,
    ...(coverImage &&
    coverImage !== "null" &&
    !coverImage.includes("coming-soon")
      ? { coverImage }
      : {}),
    ...(Number.isFinite(startingRent) && startingRent > 0
      ? { startingRent }
      : {}),
    ...(Number.isFinite(propertyCount) && propertyCount > 0
      ? { propertyCount }
      : {}),
  };
}

async function fetchHelloLocalitiesPage(
  city: string,
  params: Record<string, string | number | boolean>,
): Promise<LocalityListItem[]> {
  try {
    const { data } = await createHttpClient().get("hello/localities", {
      params: {
        city: city.trim().toLowerCase(),
        ...params,
      },
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    return list
      .map((item: Record<string, unknown>) => mapHelloLocalityRow(item))
      .filter((item: LocalityListItem | null): item is LocalityListItem =>
        Boolean(item?.name && item?.slug),
      );
  } catch {
    return [];
  }
}

/**
 * Popular localities for a city — same source as the mobile app
 * (`hello/localities?is_popular=true`, falling back to all localities).
 */
export async function fetchPopularLocalities(
  city: string,
  count = 12,
): Promise<LocalityListItem[]> {
  const popular = await fetchHelloLocalitiesPage(city, {
    is_popular: true,
    count,
  });
  if (popular.length > 0) return popular.slice(0, count);

  const all = await fetchHelloLocalitiesPage(city, {
    page: 1,
    page_size: count,
  });
  return all.slice(0, count);
}
