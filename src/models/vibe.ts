export type VibeApiItem = {
  id: number;
  code: string;
  display_name: string;
};

export type FetchVibesListResponse = {
  success: boolean;
  data?: VibeApiItem[];
  message?: string;
};
