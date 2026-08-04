import type { CategoryProps } from "@/src/models/category";

export type SharingType = "private" | "sharing";

export interface PriceWithGst {
  amount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
}

export interface PricingDetails {
  sdKey: string;
  token: number;
  moveInCharges: PriceWithGst;
  advanceRent: PriceWithGst;
  securityDeposit: number;
  sdMonths: number;
  rent: PriceWithGst;
  utility: PriceWithGst;
}

export interface DiscountPricingDetails {
  token: number;
  moveInCharges: PriceWithGst;
  advanceRent: PriceWithGst;
  securityDeposit: number;
  rent: PriceWithGst;
  sdMonths: number;
  sdKey: string;
  utility: PriceWithGst;
}

export interface PaymentSelections {
  token: boolean;
  moveInCharges: boolean;
  securityDeposit: boolean;
  advanceRent: boolean;
  utilityCharges: boolean;
}

export interface BookingPricing {
  sdKey: string;
  totalAmount: number;
  rent: number;
  advanceRent: number;
  securityDeposit: number;
  sdMonths: number;
  moveInCharges: number;
  token: number;
  utilityCharges: number;
  cgst: number;
  sgst: number;
}

export interface SelectedCategory extends CategoryProps {
  type: SharingType;
}

export interface GetPaymentDetailsPayload {
  categoryId: number;
  sharingType: SharingType;
  moveInDate: string;
  sdMonths: number;
  propertyId: number;
  couponCode?: string;
  propertyName?: string;
  sdKey?: string;
}

export interface PostInitBookingPayload {
  bookingInfo: {
    propertyId: number;
    moveInDate: string;
    categoryId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    couponCode: string;
    referralCode: string;
    sdKey: string;
  };
  payments: {
    rent: number;
    sdSelected: boolean;
    advanceRentSelected: boolean;
    isMoveInChargesSelected: boolean;
    amountToBePaid: number;
    sharingType: SharingType;
    sdMonths: number;
    utilitySelected: boolean;
  };
}

export interface PostValidateReferralPayload {
  referralCode: string;
  propertyName: string;
}

export interface BookingPaymentObj {
  paymentSessionId: string;
  razaorpayKey: string;
  orderId: string;
  amount: number;
  notes: Record<string, unknown>;
  transactionId: string;
}

export interface InitBookingResponse {
  id: string;
  paymentObj: BookingPaymentObj;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export type PostVerifyBookingPayload = {
  paymentId: string;
  amount: number;
  bookingId: string;
} & (
  | {
      payment_gateway: "razorpay";
      razorpayPaymentId: string;
      razorpaySignature: string;
    }
  | {
      payment_gateway: "cashfree";
      orderId: string;
    }
);
