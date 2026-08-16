import { createHttpClient } from "@/src/apis/http";
import type {
  GetPaymentDetailsPayload,
  PostInitBookingPayload,
  PostValidateReferralPayload,
  PostVerifyBookingPayload,
} from "@/src/models/booking";

export async function getPaymentDetails(payload: GetPaymentDetailsPayload) {
  try {
    const { data } = await createHttpClient(true).post(
      "api/v3/booking/payment_details",
      payload,
    );
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load payment details";
    return { success: false, message };
  }
}

export async function postInitBooking(payload: PostInitBookingPayload) {
  try {
    const { data } = await createHttpClient(true).post(
      "api/v2/booking/init",
      payload,
    );
    return data;
  } catch {
    return { success: false };
  }
}

export async function postValidateReferral(payload: PostValidateReferralPayload) {
  try {
    const { data } = await createHttpClient(true).post(
      "api/hello/referral/validate",
      payload,
    );
    return data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to validate referral code";
    return { isValid: false, message };
  }
}

export async function postVerifyBooking(payload: PostVerifyBookingPayload) {
  try {
    const { data } = await createHttpClient(true).post(
      "api/v2/booking/verify",
      payload,
    );
    if (data?.success && typeof window !== "undefined") {
      window.localStorage.setItem("booking_successfull", payload.bookingId);
    }
    return data;
  } catch {
    return { success: false };
  }
}
