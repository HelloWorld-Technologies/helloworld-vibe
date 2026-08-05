import type { GalleryMediaItem } from "@/src/models/gallery";
import type { CategoryProps } from "@/src/models/category";
import type { GoogleData, NearByArea, Property, SimilarProperty } from "@/src/models/property";
import type { HdpRoomType } from "@/src/tokens/hdp";

import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import type {
  HdpResidentReview,
} from "@/src/tokens/hdp-reviews";
import type { HdpReviewSummaryView } from "@/src/lib/hdp/map-hdp-api";

export type HdpPageView = {
  propertyId: number;
  pageTitle: string;
  displayName: string;
  name: string;
  badge?: string;
  locality: string;
  addressLine?: string;
  mapUrl?: string;
  startingRent: number;
  securityDepositMonths: number;
  securityDepositLabel: string;
  minStayMonths: number;
  rating: number;
  reviewCount: number;
  visitsToday?: number;
  trendingLabel?: string;
  topChoiceCopy?: string;
  about: string;
  amenities: readonly string[];
  galleryImages: readonly string[];
  galleryItems: readonly GalleryMediaItem[];
  moments: readonly GalleryMediaItem[];
  propertyUrl: string;
  hdpPath: string;
  bookingPath: string;
  soldOut: boolean;
  gstPercent?: number;
  roomTypes: readonly HdpRoomType[];
  nearbyItems: readonly NeighborhoodCardData[];
  reviewSummary: HdpReviewSummaryView | null;
  residentReviews: readonly HdpResidentReview[];
  googleLink?: string;
  nearbyDescription?: string;
  latitude?: number;
  longitude?: number;
  mapImageSrc?: string;
};

export type HdpPageContext = {
  view: HdpPageView;
  property: Property;
  googleData: GoogleData | null;
  nearBy: NearByArea | null;
  categories: CategoryProps[];
  similarProperties: SimilarProperty[];
  faqs: { question: string; answer: string }[];
};
