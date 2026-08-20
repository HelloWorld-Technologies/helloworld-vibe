import { createHttpClient } from "@/src/apis/http";
import type {
  PropertyVisitStats,
  PropertyVisitsApiData,
  PropertyVisitsApiResponse,
} from "@/src/models/property-visits";

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function readNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Matches vibe-app `formatHdpReviewDate`. */
export function formatHdpReviewDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function mapPropertyVisitsData(
  data?: PropertyVisitsApiData | null,
): PropertyVisitStats | null {
  if (!data) return null;

  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  const newestReviewDate = reviews.reduce<string | undefined>((latest, review) => {
    const createdAt = readString(review.created_at);
    if (!createdAt) return latest;
    if (!latest) return createdAt;
    return new Date(createdAt).getTime() > new Date(latest).getTime()
      ? createdAt
      : latest;
  }, undefined);

  return {
    propertyId: readNumber(data.property_id) ?? 0,
    rating: readNumber(data.rating),
    totalReviews: readNumber(data.total_reviews) ?? reviews.length,
    isTrending: data.is_trending === true,
    totalVisits: readNumber(data.total_visits) ?? 0,
    topChoiceDate:
      readString(data.top_choice_date) ??
      readString(data.date) ??
      newestReviewDate,
  };
}

export async function fetchPropertyVisitStats(
  propertyId: number | string,
): Promise<PropertyVisitStats | null> {
  try {
    const { data } = await createHttpClient().get<PropertyVisitsApiResponse>(
      "v2/property/visits",
      { params: { id: propertyId } },
    );
    if (!data?.success) return null;
    return mapPropertyVisitsData(data.data);
  } catch {
    return null;
  }
}
