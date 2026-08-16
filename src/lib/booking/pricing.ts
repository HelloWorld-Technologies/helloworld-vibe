import type {
  BookingPricing,
  DiscountPricingDetails,
  PaymentSelections,
  PricingDetails,
} from "@/src/models/booking";

export function formatRupee(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function numberOfDaysForRent(moveInDate: string | Date) {
  const moveInDateObject = new Date(moveInDate);
  return (
    new Date(
      moveInDateObject.getFullYear(),
      moveInDateObject.getMonth() + 1,
      0,
    ).getDate() -
    new Date(moveInDate).getDate() +
    1
  );
}

function pricingFromCoupon(
  paymentDetails: PaymentSelections,
  discountPricingDetails: DiscountPricingDetails,
): BookingPricing {
  const pricing: BookingPricing = {
    token: discountPricingDetails.token,
    moveInCharges: discountPricingDetails.moveInCharges.amount,
    advanceRent: discountPricingDetails.advanceRent.amount,
    securityDeposit: discountPricingDetails.securityDeposit,
    totalAmount: discountPricingDetails.token,
    rent: discountPricingDetails.rent.amount,
    sdKey: discountPricingDetails.sdKey,
    sdMonths: discountPricingDetails.sdMonths,
    utilityCharges: discountPricingDetails.utility.amount,
    cgst: 0,
    sgst: 0,
  };

  if (paymentDetails.advanceRent) {
    pricing.totalAmount += discountPricingDetails.advanceRent.totalAmount;
    pricing.cgst += discountPricingDetails.advanceRent.cgst;
    pricing.sgst += discountPricingDetails.advanceRent.sgst;
  }
  if (paymentDetails.securityDeposit) {
    pricing.totalAmount += discountPricingDetails.securityDeposit;
  }
  if (paymentDetails.moveInCharges) {
    pricing.totalAmount += discountPricingDetails.moveInCharges.totalAmount;
    pricing.cgst += discountPricingDetails.moveInCharges.cgst;
    pricing.sgst += discountPricingDetails.moveInCharges.sgst;
  }
  if (paymentDetails.utilityCharges) {
    pricing.totalAmount += discountPricingDetails.utility.totalAmount;
    pricing.cgst += discountPricingDetails.utility.cgst;
    pricing.sgst += discountPricingDetails.utility.sgst;
  }

  return pricing;
}

function pricingFromPlan(
  paymentDetails: PaymentSelections,
  pricingDetails: PricingDetails,
): BookingPricing {
  const pricing: BookingPricing = {
    token: pricingDetails.token,
    moveInCharges: pricingDetails.moveInCharges.amount,
    advanceRent: pricingDetails.advanceRent.amount,
    securityDeposit: pricingDetails.securityDeposit,
    totalAmount: pricingDetails.token,
    rent: pricingDetails.rent.amount,
    sdKey: pricingDetails.sdKey,
    sdMonths: pricingDetails.sdMonths,
    utilityCharges: pricingDetails.utility.amount,
    cgst: 0,
    sgst: 0,
  };

  if (paymentDetails.advanceRent) {
    pricing.totalAmount += pricingDetails.advanceRent.totalAmount;
    pricing.cgst += pricingDetails.advanceRent.cgst;
    pricing.sgst += pricingDetails.advanceRent.sgst;
  }
  if (paymentDetails.securityDeposit) {
    pricing.totalAmount += pricingDetails.securityDeposit;
  }
  if (paymentDetails.moveInCharges) {
    pricing.totalAmount += pricingDetails.moveInCharges.totalAmount;
    pricing.cgst += pricingDetails.moveInCharges.cgst;
    pricing.sgst += pricingDetails.moveInCharges.sgst;
  }
  if (paymentDetails.utilityCharges) {
    pricing.totalAmount += pricingDetails.utility.totalAmount;
    pricing.cgst += pricingDetails.utility.cgst;
    pricing.sgst += pricingDetails.utility.sgst;
  }

  return pricing;
}

export function firstPricingRow<T extends DiscountPricingDetails | PricingDetails>(
  data: unknown,
): T | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") {
    return null;
  }

  const token = (row as { token?: unknown }).token;
  if (typeof token !== "number" || !Number.isFinite(token)) {
    return null;
  }

  return row as T;
}

export function getBookingPricing({
  paymentDetails,
  pricingDetails,
  discountPricingDetails,
  couponApplied,
}: {
  paymentDetails: PaymentSelections;
  pricingDetails?: PricingDetails | null;
  discountPricingDetails?: DiscountPricingDetails | null;
  couponApplied: boolean;
}): BookingPricing | null {
  if (couponApplied && discountPricingDetails) {
    return pricingFromCoupon(paymentDetails, discountPricingDetails);
  }
  if (pricingDetails) {
    return pricingFromPlan(paymentDetails, pricingDetails);
  }
  return null;
}
