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

export const SRP_LIST_PAGE_SIZE = 32;

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

interface PropertyListResponse {
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

export async function fetchAllProperty(
  payload: FetchAllPropertyPayload,
  params?: { page?: number; page_size?: number },
): Promise<PropertyListResponse> {
  try {
    const res = await createHttpClient().put("v3/property/list", payload, {
      params,
    });
    const body = res?.data;
    if (body == null || typeof body !== "object" || Array.isArray(body)) {
      return { success: false, data: [] };
    }
    return asPropertyListResponse(body);
  } catch {
    return { success: false, data: [] };
  }
}

export async function fetchPropertiesBySlug(
  payload: FetchPropertiesBySlugPayload,
  params?: { page?: number; page_size?: number },
): Promise<PropertyListResponse> {
  try {
    const res = await createHttpClient().put(
      "v3/property/list/slug",
      payload,
      { params },
    );
    const body = res?.data;
    if (body == null || typeof body !== "object" || Array.isArray(body)) {
      return { success: false, data: [] };
    }
    return asPropertyListResponse(body);
  } catch {
    return { success: false, data: [] };
  }
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
