import { dedupeAmenityLabels } from "@/src/lib/amenity-labels";
import { getGenderDisplayLabel } from "@/src/lib/gender-label";
import {
  buildPropertyEmbedMapUrl,
  buildPropertyMapUrl,
} from "@/src/lib/hdp/map-url";
import {
  fetchProperty,
  fetchPropertyCategories,
  fetchSimilarProperties,
} from "@/src/apis/hdp";
import { fetchPropertyMoments } from "@/src/apis/moments";
import { getHdpPageTitle } from "@/src/lib/hdp-page-title";
import { buildHdpMetaDescription } from "@/src/lib/hdp/hdp-description";
import { buildHdpFaqs } from "@/src/lib/hdp/hdp-faqs";
import {
  mapGoogleDataToReviewSummary,
  mapGoogleReviewsToResidentReviews,
  mapNearByToNeighborhoodCards,
  mergeNearByAreas,
} from "@/src/lib/hdp/map-hdp-api";
import {
  legacyPropertyPhotoUrls,
  mapLegacyPropertyPhotosToGalleryItems,
  mapMomentsToGalleryItems,
  mapPropertyMediaToGalleryItems,
} from "@/src/lib/hdp/map-gallery-media";
import {
  categorySharingOccupancy,
  categorySupportsPrivate,
} from "@/src/lib/hdp/category-occupancy";
import {
  mapPropertyVibesToInterests,
  mapVibeBadgesToSelectedMatches,
  parseVibeMatchScore,
  type HdpPropertyVibeApi,
  type HdpVibeBadgeApi,
} from "@/src/lib/hdp/map-hdp-vibes";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { imageUrlFormatter } from "@/src/lib/images";
import {
  colivingFlatLocalityPath,
  createHdpSlug,
  getLocalitySlug,
} from "@/src/lib/sitemap-slug";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getPlaceSchema,
  getPublicSiteUrl,
  getWebPageSchema,
  type HdpPageSchema,
} from "@/src/lib/schema";
import { formatCityDisplayName } from "@/src/tokens/cities";
import { capitalizeFirstLetter } from "@/src/lib/string-utils";
import type { CategoryProps } from "@/src/models/category";
import type { GalleryMediaItem } from "@/src/models/gallery";
import type { PropertyMoment } from "@/src/models/moment";
import type { PropertyMediaItem } from "@/src/models/property-media";
import type {
  GoogleData,
  NearByArea,
  Property,
  SimilarProperty,
} from "@/src/models/property";
import { srpCardComingSoonImage } from "@/src/tokens/srp-card";
import { buildGalleryItemsFromMedia } from "@/src/tokens/property-gallery";
import type { HdpRoomType } from "@/src/tokens/hdp";

export type HdpBreadcrumbItem = { name: string; path?: string };

export type ResolveHdpPageOptions = {
  vibes?: readonly number[];
};

export type HdpPageConfig = {
  canonicalPath: string;
  srpSlug: string;
  localitySlug: string;
  hdpSlug: string;
  property: Property;
  propertyId: number;
  pageTitle: string;
  headerH1: string;
  pageMetaDescription: string;
  breadcrumbItems: HdpBreadcrumbItem[];
  faqs: { question: string; answer: string }[];
  schema: HdpPageSchema;
  view: HdpPageView;
  googleData: GoogleData | null;
  nearBy: NearByArea | null;
  categories: CategoryProps[];
  similarProperties: SimilarProperty[];
};

function genderBadge(gender?: string): string | undefined {
  return getGenderDisplayLabel(gender);
}

function localityDisplayName(localitySlug: string): string {
  return localitySlug
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function localityBreadcrumbPath(
  srpSlug: string,
  localitySlug: string,
  city: string,
): string {
  if (srpSlug.startsWith("coliving-in-")) {
    const flat = colivingFlatLocalityPath(city, localitySlug);
    if (flat) return flat.replace(/^\//, "");
  }
  return `${srpSlug}/${localitySlug}`;
}

function mapCategoriesToRoomTypes(categories: CategoryProps[]): HdpRoomType[] {
  return categories
    .filter((category) => category.show_to_ui && !category.is_removed)
    .map((category) => ({
      id: String(category.id),
      name: category.display_name || category.name,
      rent: category.rent ?? category.private_rent ?? 0,
      features: category.key_feature?.length
        ? category.key_feature
        : category.amenities?.slice(0, 3) ?? [],
      occupancy:
        categorySharingOccupancy(category) ??
        (categorySupportsPrivate(category) ? "private" : "double"),
    }));
}

function propertyGalleryImages(
  property: Property,
  media: readonly PropertyMediaItem[],
): readonly string[] {
  const fromMedia = mapPropertyMediaToGalleryItems(media).photos.map(
    (item) => item.imageSrc,
  );
  if (fromMedia.length > 0) return fromMedia;

  const legacy = legacyPropertyPhotoUrls(property)
    .map((url) => imageUrlFormatter("hdp", url))
    .filter(Boolean);
  return legacy.length > 0 ? legacy : [srpCardComingSoonImage];
}

function buildGalleryItems(
  property: Property,
  media: readonly PropertyMediaItem[],
  moments: readonly PropertyMoment[],
): GalleryMediaItem[] {
  const {
    videos,
    moments: mediaMoments,
    photos: mediaPhotos,
  } = mapPropertyMediaToGalleryItems(media);
  const momentItems = [
    ...mapMomentsToGalleryItems(moments),
    ...mediaMoments,
  ];
  const photos =
    mediaPhotos.length > 0
      ? mediaPhotos
      : mapLegacyPropertyPhotosToGalleryItems(legacyPropertyPhotoUrls(property));

  const items = buildGalleryItemsFromMedia({
    videos,
    moments: momentItems,
    photos,
  });

  return items.length > 0
    ? items
    : mapLegacyPropertyPhotosToGalleryItems([srpCardComingSoonImage]);
}

function buildHdpView(options: {
  property: Property;
  pageTitle: string;
  canonicalPath: string;
  categories: CategoryProps[];
  googleData: GoogleData | null;
  nearBy: NearByArea | null;
  localitySlug: string;
  media: readonly PropertyMediaItem[];
  moments: readonly PropertyMoment[];
  galleryImages: readonly string[];
  vibeMatchScore?: number;
  selectedVibeMatches?: HdpPageView["selectedVibeMatches"];
  residentInterests?: HdpPageView["residentInterests"];
}): HdpPageView {
  const {
    property,
    pageTitle,
    canonicalPath,
    categories,
    googleData,
    nearBy,
    localitySlug,
    media,
    moments,
    galleryImages,
    vibeMatchScore,
    selectedVibeMatches,
    residentInterests,
  } = options;
  const displayName = property.display_name || property.name;
  const reviewCount =
    googleData?.google_reviews_new?.length ??
    googleData?.google_reviews?.length ??
    0;
  const rating = Number(googleData?.google_rating ?? 4.5);
  const depositMonths = property.security_deposit_months ?? property.sd_month ?? 1;
  const locality =
    property.locality ||
    property.address?.line2 ||
    localityDisplayName(localitySlug);

  const reviewSummary = mapGoogleDataToReviewSummary(googleData);
  const residentReviews = mapGoogleReviewsToResidentReviews(googleData);
  const mapUrl = buildPropertyMapUrl(property);
  const embeddedMapUrl = buildPropertyEmbedMapUrl(property);
  const galleryItems = buildGalleryItems(property, media, moments);
  const {
    moments: mediaMoments,
  } = mapPropertyMediaToGalleryItems(media);
  const momentItems = [
    ...mapMomentsToGalleryItems(moments),
    ...mediaMoments,
  ];
  const latitude = Number(property.address?.latitude);
  const longitude = Number(property.address?.longitude);
  const mapImageSrc =
    galleryImages[0] ||
    (property.hdp_image
      ? imageUrlFormatter("hdp", property.hdp_image)
      : undefined);

  return {
    propertyId: property.id,
    pageTitle,
    displayName,
    name: property.name,
    badge: genderBadge(property.gender),
    locality,
    addressLine: property.address?.line1,
    mapUrl,
    embeddedMapUrl,
    startingRent: property.min_rent ?? 0,
    securityDepositMonths: depositMonths,
    securityDepositLabel: `${depositMonths} month${depositMonths === 1 ? "" : "s"} rent`,
    minStayMonths: property.lockin_period ?? 3,
    rating: Number.isFinite(rating) ? rating : 4.5,
    reviewCount,
    visitsToday: undefined,
    trendingLabel: property.lightning_deal ? "Trending" : undefined,
    topChoiceCopy: property.address?.city
      ? `is the top choice in ${formatCityDisplayName(property.address.city)}.`
      : undefined,
    about: property.description || property.nearby_description || "",
    amenities: dedupeAmenityLabels([
      ...(property.amenities ?? []),
      ...(property.rent_includes ?? []),
      ...(property.services ?? []),
    ]),
    galleryImages,
    galleryItems,
    moments: momentItems,
    propertyUrl: `${getPublicSiteUrl()}/${canonicalPath}`,
    hdpPath: `/${canonicalPath}`,
    bookingPath: `/${canonicalPath}/booking`,
    soldOut: Boolean(property.sold_out),
    gstPercent: property.gst_percent || undefined,
    roomTypes: mapCategoriesToRoomTypes(categories),
    nearbyItems: mapNearByToNeighborhoodCards(nearBy, mapUrl),
    reviewSummary,
    residentReviews,
    googleLink: googleData?.google_link || undefined,
    nearbyDescription: property.nearby_description || undefined,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
    mapImageSrc,
    vibeMatchScore,
    selectedVibeMatches,
    residentInterests,
  };
}

export async function resolveHdpPage(
  srpSlug: string,
  localitySlug: string,
  hdpSlug: string,
  options?: ResolveHdpPageOptions,
): Promise<HdpPageConfig | null> {
  const normalizedSrp = String(srpSlug || "").trim().toLowerCase();
  const normalizedLocality = String(localitySlug || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  const normalizedHdp = String(hdpSlug || "").trim().toLowerCase();
  if (!normalizedSrp || !normalizedLocality || !normalizedHdp) return null;

  const vibeIds = (options?.vibes ?? []).filter(
    (id) => Number.isFinite(id) && id > 0,
  );
  const response = await fetchProperty(normalizedHdp, {
    vibes: vibeIds.length > 0 ? vibeIds : undefined,
  });
  if (!response?.success || !response?.data?.id) return null;

  let property = response.data as Property;
  if (property.services || property.rent_includes) {
    property = {
      ...property,
      rent_includes: dedupeAmenityLabels([
        ...(property.rent_includes ?? []),
        ...(property.services ?? []),
      ]),
    };
  }

  const propertyId = Number(property.id);
  const media = (
    Array.isArray(response.media) ? response.media : []
  ) as PropertyMediaItem[];
  const houseMoments = (
    Array.isArray(response.moments) ? response.moments : []
  ) as PropertyMoment[];

  const [categoriesResponse, similarResponse, momentsResponse] =
    await Promise.all([
      fetchPropertyCategories(propertyId),
      fetchSimilarProperties(propertyId),
      fetchPropertyMoments(propertyId),
    ]);

  const momentsFromApi = (momentsResponse?.data ?? []) as PropertyMoment[];
  const moments =
    momentsFromApi.length > 0 ? momentsFromApi : houseMoments;

  const categories = (categoriesResponse?.data ?? []) as CategoryProps[];
  const similarProperties = (similarResponse?.data ?? []) as SimilarProperty[];
  const googleData = (response.googleData ?? null) as GoogleData | null;
  const nearBy = mergeNearByAreas(
    response.nearBy as NearByArea | null,
    googleData?.data ?? null,
  );

  const canonicalPath = `${normalizedSrp}/${normalizedLocality}/${normalizedHdp}`;
  const pageTitle = getHdpPageTitle(property, normalizedSrp);
  const pageMetaDescription = buildHdpMetaDescription(
    property,
    googleData,
    canonicalPath,
  );
  const faqs = buildHdpFaqs(property, googleData, categories, nearBy);

  const city = property.address?.city || property.city || "";
  const localityName = localityDisplayName(normalizedLocality);
  const srpLabel = capitalizeFirstLetter(normalizedSrp.split("-").join(" "));
  const breadcrumbItems: HdpBreadcrumbItem[] = [
    { name: "Home", path: "" },
    { name: srpLabel, path: normalizedSrp },
    {
      name: localityName,
      path: localityBreadcrumbPath(normalizedSrp, normalizedLocality, city),
    },
    { name: property.display_name || property.name, path: canonicalPath },
  ];

  const baseUrl = getPublicSiteUrl();
  const fullUrl = `${baseUrl}/${canonicalPath}`;
  const galleryImageUrls = propertyGalleryImages(property, media);
  const placeImage =
    galleryImageUrls[0] ??
    (property.hdp_image
      ? imageUrlFormatter("hdp", property.hdp_image)
      : undefined);
  const propertyImageUrls =
    galleryImageUrls.length > 0
      ? [...galleryImageUrls]
      : (property.property_image ?? [])
          .map((url) => imageUrlFormatter("hdp", url))
          .filter(Boolean);
  const ratingValue = googleData?.google_rating;
  const hasValidRating =
    ratingValue != null && !Number.isNaN(Number(ratingValue));
  const reviewCount =
    googleData?.google_reviews_new?.length ??
    googleData?.google_reviews?.length ??
    0;

  const schema: HdpPageSchema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: canonicalPath,
      name: pageTitle,
      description: pageMetaDescription,
      fullUrl,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, breadcrumbItems),
    ...(property.display_name || property.name
      ? {
          place: getPlaceSchema({
            name: property.display_name || property.name,
            description: pageMetaDescription,
            pageUrl: fullUrl,
            imageUrl: placeImage,
            imageUrls: propertyImageUrls,
            address: property.address,
            amenities: property.amenities,
            rentIncludes: property.rent_includes,
            minRent: property.min_rent,
            ...(hasValidRating
              ? {
                  aggregateRating: {
                    ratingValue: Number(ratingValue),
                    reviewCount: reviewCount || 1,
                  },
                }
              : {}),
          }),
        }
      : {}),
    ...(faqs.length > 0 ? { faqPage: getFAQPageSchema(faqs) } : {}),
  };

  const view = buildHdpView({
    property,
    pageTitle,
    canonicalPath,
    categories,
    googleData,
    nearBy,
    localitySlug: normalizedLocality,
    media,
    moments,
    galleryImages: galleryImageUrls,
    vibeMatchScore: parseVibeMatchScore(response.vibeMatchScore),
    selectedVibeMatches: mapVibeBadgesToSelectedMatches(
      response.vibeBadges as HdpVibeBadgeApi[] | undefined,
    ),
    residentInterests: mapPropertyVibesToInterests(
      response.propertyVibes as HdpPropertyVibeApi[] | undefined,
    ),
  });

  return {
    canonicalPath,
    srpSlug: normalizedSrp,
    localitySlug: normalizedLocality,
    hdpSlug: normalizedHdp,
    property,
    propertyId,
    pageTitle,
    headerH1: pageTitle,
    pageMetaDescription,
    breadcrumbItems,
    faqs,
    schema,
    view,
    googleData,
    nearBy,
    categories,
    similarProperties,
  };
}

export function buildHdpStaticParamsFromProperties(
  properties: Property[],
): { srp_slug: string; locality: string; hdp_slug: string }[] {
  const paths: { srp_slug: string; locality: string; hdp_slug: string }[] = [];
  const seen = new Set<string>();

  for (const property of properties) {
    const city = property.address?.city || property.city;
    if (!city) continue;
    const locality =
      getLocalitySlug(property) ||
      String(property.locality || "")
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");
    if (!locality) continue;
    const hdpSlug = createHdpSlug(property);
    const srpSlugValue = city.toLowerCase() === "kota" ? "hostels-in-kota" : `coliving-in-${city.toLowerCase()}`;
    const key = `${srpSlugValue}/${locality}/${hdpSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    paths.push({ srp_slug: srpSlugValue, locality, hdp_slug: hdpSlug });
  }

  return paths;
}
