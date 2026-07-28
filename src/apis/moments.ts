import { createHttpClient } from "@/src/apis/http";
import type { FetchMomentsResponse } from "@/src/models/moment";

export async function fetchPropertyMoments(
  propertyId: number,
  options?: {
    mediaType?: "image" | "video";
    tags?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<FetchMomentsResponse> {
  try {
    const { data } = await createHttpClient().get("moments", {
      params: {
        property_id: propertyId,
        ...(options?.mediaType ? { media_type: options.mediaType } : {}),
        ...(options?.tags ? { tags: options.tags } : {}),
        page: options?.page ?? 1,
        pageSize: options?.pageSize ?? 100,
      },
    });
    return data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function fetchBookingMoments(
  bookingId: string | number,
  options?: {
    mediaType?: "image" | "video";
    tags?: string;
  },
): Promise<FetchMomentsResponse> {
  try {
    const { data } = await createHttpClient().get(
      `admin/booking/${bookingId}/moments`,
      {
        params: {
          ...(options?.mediaType ? { media_type: options.mediaType } : {}),
          ...(options?.tags ? { tags: options.tags } : {}),
        },
      },
    );
    return data;
  } catch {
    return { success: false, data: [] };
  }
}
