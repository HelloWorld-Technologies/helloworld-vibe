export type PropertyMoment = {
  id: number | string;
  media_type: "image" | "video" | string;
  url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  tags?: string[];
  display_order?: number;
  is_active?: boolean;
};

export type FetchMomentsResponse = {
  success: boolean;
  data?: PropertyMoment[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  message?: string;
};
