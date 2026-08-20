export type PropertyVisitStats = {
  propertyId: number;
  rating: number | null;
  totalReviews: number;
  isTrending: boolean;
  totalVisits: number;
  topChoiceDate?: string;
};

export type PropertyVisitsApiData = {
  property_id?: number;
  rating?: number | string;
  total_reviews?: number;
  is_trending?: boolean;
  total_visits?: number;
  top_choice_date?: string;
  date?: string;
  reviews?: Array<{
    id?: string | number;
    rating?: number | string;
    review?: string;
    created_at?: string;
    name?: string;
  }>;
};

export type PropertyVisitsApiResponse = {
  success?: boolean;
  data?: PropertyVisitsApiData | null;
  message?: string;
};
