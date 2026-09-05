/** Minimal types for sitemap URL generation (matches helloworld-next API shapes). */

export interface SitemapProperty {
  id: number;
  name: string;
  display_name?: string;
  locality?: string;
  city?: string;
  gender?: string;
  updatedAt?: string;
  address?: {
    city?: string;
    line2?: string;
  };
}

export interface NearbyPlace {
  name: string;
  slug: string;
  city?: string;
}

export interface NearbyPlaceApiItem {
  display_name?: string;
  slug?: string;
  city?: string;
}

export interface NearbyPlacesApiResponse {
  data?: Record<string, NearbyPlaceApiItem[]>;
}
