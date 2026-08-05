export interface Property {
  id: number;
  name: string;
  srp_image: null;
  hdp_image: string;
  property_image: Array<string>;
  address: Address;
  city: string;
  locality: string;
  state: string;
  country: string;
  pincode: number;
  neighbourhood: null;
  description: string;
  /** Optional long-form neighbourhood copy returned by HDP API. */
  nearby_description?: string;
  rent_includes: Array<string>;
  amenities: Array<string>;
  status: string;
  move_in_charges: number;
  move_in_window: number;
  move_out_charges: number;
  security_deposit_months: number;
  total_apartments: null;
  latitude: null;
  longitude: null;
  gender: string;
  min_rent: number;
  available_beds: number;
  accomodation_type: string;
  place_of_supply: null;
  payment_terms: null;
  furnishing_type: string;
  furnished_by: string;
  services: Array<string>;
  sold_out: boolean;
  is_hall: boolean;
  is_kitchen: boolean;
  is_short_stay: boolean;
  display_name: string;
  utility_charge: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  sd_month: number;
  image: string;
  lockin_period: number;
  map_url: string;
  embedded_url: string;
  gst_percent: number;
  free_rent: boolean;
  lightning_deal: boolean;
}

export interface Address {
  city: string;
  line1: string;
  line2: string;
  state: string;
  country: string;
  pincode: string;
  landmark: string;
  latitude: number;
  longitude: number;
}

export interface HdpData {
  success: boolean;
  data: Property;
  events: Array<Event>;
}

export interface NearByArea {
  [category: string]: Array<NearbyData>;
}

export interface NewGoogleReviews {
  name: string;
  review: string;
  star: number;
}
export interface GoogleData {
  data: NearByArea;
  property_id: number;
  google_link: string;
  google_rating: number;
  google_reviews: Array<string>;
  google_reviews_new: Array<NewGoogleReviews>;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface NearbyData {
  name: string;
  rating?: number;
  distance: string | number;
  vicinity?: string;
  types?: Array<string>;
  latitude?: string | number;
  longitude?: string | number;
}

export interface SimilarProperty extends Property {
  id: number;
  image: string;
  name: string;
  address: Address;
  rent_includes: string[];
  sd_month: number;
  available_beds: number;
  min_rent: number;
  gender: string;
}
