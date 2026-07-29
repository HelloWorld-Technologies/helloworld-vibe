export interface LocalitySuggestProperty {
  id: number;
  name: string;
  display_name?: string;
  locality?: string;
  city?: string;
  gender?: string;
  address?: {
    city?: string;
    line1?: string;
    line2?: string;
    state?: string;
    country?: string;
    pincode?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface LocalitySuggestResult {
  locality: string[];
  properties: LocalitySuggestProperty[];
}

export interface FetchLocalitySuggestParams {
  city: string;
  keyword: string;
  campaign?: "" | "ok";
  signal?: AbortSignal;
}

export interface LocalitySuggestResponse {
  success: boolean;
  data: LocalitySuggestResult;
}
