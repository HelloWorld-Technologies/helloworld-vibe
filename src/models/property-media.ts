export type PropertyMediaItem = {
  id: string | number;
  media_type: "image" | "video" | string;
  url: string;
  thumbnail_url?: string | null;
  tag?: string | null;
  caption?: string | null;
  is_srp?: boolean;
  is_hdp?: boolean;
  display_order?: number;
};
