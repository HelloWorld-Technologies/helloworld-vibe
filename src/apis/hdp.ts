import { createHttpClient } from "@/src/apis/http";

export const SIMILAR_PROPERTIES_LIMIT = 12;

export type FetchPropertyOptions = {
  /** Selected vibe API ids — sent as `vibes=1,3,6`. */
  vibes?: readonly number[];
};

export async function fetchProperty(
  name: string,
  options?: FetchPropertyOptions,
) {
  try {
    const nameForApi = (name || "").replace(/-/g, " ");
    const vibes = (options?.vibes ?? []).filter(
      (id) => Number.isFinite(id) && id > 0,
    );
    const { data } = await createHttpClient().get("v2/hello/house", {
      params: {
        name: nameForApi,
        ...(vibes.length > 0 ? { vibes: vibes.join(",") } : {}),
      },
    });
    return data;
  } catch {
    return { success: false };
  }
}

export async function fetchPropertyCategories(propertyId: number) {
  try {
    const { data } = await createHttpClient().get("v2/category/list", {
      params: { property_id: propertyId },
    });
    return data;
  } catch {
    return { success: false };
  }
}

export async function fetchSimilarProperties(propertyId: number) {
  try {
    const { data } = await createHttpClient().get("v2/property/similar", {
      params: { id: propertyId, limit: SIMILAR_PROPERTIES_LIMIT },
    });
    if (!data?.success || !Array.isArray(data.data)) return data;
    return {
      ...data,
      data: data.data.slice(0, SIMILAR_PROPERTIES_LIMIT),
    };
  } catch {
    return { success: false };
  }
}

export async function fetchPropertiesList() {
  try {
    const { data } = await createHttpClient().get("property/all");
    return data;
  } catch {
    return { success: false, data: [] };
  }
}
