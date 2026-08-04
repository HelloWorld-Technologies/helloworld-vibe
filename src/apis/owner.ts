import { createHttpClient } from "@/src/apis/http";
import type {
  UploadOwnerLeadPayload,
  UploadOwnerLeadResponse,
} from "@/src/models/owner";

export async function uploadOwnerLead(
  payload: UploadOwnerLeadPayload,
): Promise<UploadOwnerLeadResponse> {
  try {
    const formData = new FormData();
    formData.append("owner_details", JSON.stringify(payload));
    const { data } = await createHttpClient().post<UploadOwnerLeadResponse>(
      "/hello/owner/callback",
      formData,
    );
    return data?.success === false
      ? data
      : { success: true, ...data };
  } catch (error) {
    const message =
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? String((error.response.data as { message?: string }).message)
        : undefined;
    return { success: false, message };
  }
}
