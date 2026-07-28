import { createHttpClient } from "@/src/apis/http";
import type { FetchVibesListResponse } from "@/src/models/vibe";

export async function fetchVibesList(): Promise<FetchVibesListResponse> {
  try {
    const { data } = await createHttpClient().get("vibes/list");
    return data;
  } catch {
    return { success: false };
  }
}
