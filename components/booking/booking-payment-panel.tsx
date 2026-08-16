"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BookingPaymentCheckout } from "@/components/booking/booking-payment-checkout";
import { BookingPaymentOption } from "@/components/booking/booking-payment-option";
import { PromoCodeInput } from "@/components/ui/promo-code-input";
import { Snackbar } from "@/components/ui/snackbar";
import {
  getPaymentDetails,
  postValidateReferral,
} from "@/src/apis/booking";
import { bookingTermsAndConditions } from "@/src/constants/booking-policy";
import {
  firstPricingRow,
  formatRupee,
  getBookingPricing,
  numberOfDaysForRent,
} from "@/src/lib/booking/pricing";
import type {
  DiscountPricingDetails,
  PaymentSelections,
  PricingDetails,
  SelectedCategory,
  SharingType,
} from "@/src/models/booking";
import type { Property } from "@/src/models/property";
import type { BookingOccupantInfo } from "@/src/lib/booking/url";
import { cn } from "@/src/lib/cn";

const defaultPaymentSelections: PaymentSelections = {
  token: true,
  moveInCharges: false,
  securityDeposit: false,
  advanceRent: false,
  utilityCharges: false,
};

const COUPON_INVALID_MESSAGE =
  "This coupon is invalid or has expired. Please try again.";

function bookingPropertyName(property: Property) {
  return property.display_name?.trim() || property.name;
}

export interface BookingPaymentPanelProps {
  property: Property;
  category: SelectedCategory;
  moveInDate: string;
  sharingType: SharingType;
  propertyPath: string;
  occupantInfo?: BookingOccupantInfo;
  className?: string;
}

export function BookingPaymentPanel({
  property,
  category,
  moveInDate,
  sharingType,
  propertyPath,
  occupantInfo,
  className,
}: BookingPaymentPanelProps) {
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentSelections>(defaultPaymentSelections);
  const [pricingDetails, setPricingDetails] = useState<PricingDetails | null>(
    null,
  );
  const [discountPricingDetails, setDiscountPricingDetails] =
    useState<DiscountPricingDetails | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSnackbar, setPaymentSnackbar] = useState<string | null>(null);

  const fetchPricing = useCallback(
    async (options?: { couponCode?: string; clearCoupon?: boolean }) => {
      setLoadingPricing(true);
      setErrorMessage(null);

      const activeCoupon = options?.clearCoupon
        ? undefined
        : options?.couponCode ?? (couponApplied ? couponCode : undefined);
      const propertyName = bookingPropertyName(property);

      const payload = {
        categoryId: category.id,
        sharingType,
        moveInDate,
        sdMonths: property.security_deposit_months,
        propertyId: property.id,
        ...(activeCoupon
          ? {
              couponCode: activeCoupon,
              propertyName,
              sdKey: pricingDetails?.sdKey,
            }
          : {}),
      };

      const response = await getPaymentDetails(payload);
      setLoadingPricing(false);

      if (!response?.success) {
        const message = activeCoupon
          ? response?.message || COUPON_INVALID_MESSAGE
          : (response?.message ?? "Could not load payment details.");
        if (!activeCoupon) {
          setErrorMessage(message);
        }
        return { ok: false as const, message };
      }

      if (activeCoupon) {
        const discountedPricing = firstPricingRow<DiscountPricingDetails>(
          response.data,
        );
        if (!discountedPricing) {
          const message =
            response.discountMessage ||
            response.message ||
            COUPON_INVALID_MESSAGE;
          return { ok: false as const, message };
        }

        setDiscountPricingDetails(discountedPricing);
        setCouponApplied(true);
        setCouponCode(activeCoupon);
        return {
          ok: true as const,
          discountedPricing,
          message: response.discountMessage || response.message,
        };
      }

      const nextPricing = firstPricingRow<PricingDetails>(response.data);
      if (!nextPricing) {
        const message = "No plans available for this selection.";
        setErrorMessage(message);
        return { ok: false as const, message };
      }

      setPricingDetails(nextPricing);
      setDiscountPricingDetails(null);
      setCouponApplied(false);
      return { ok: true as const };
    },
    [
      category.id,
      couponApplied,
      couponCode,
      moveInDate,
      pricingDetails?.sdKey,
      property,
      sharingType,
    ],
  );

  useEffect(() => {
    void fetchPricing();
    // Initial load only — coupon/referral changes call fetchPricing explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id, moveInDate, sharingType, property.id]);

  const pricing = useMemo(
    () =>
      getBookingPricing({
        paymentDetails,
        pricingDetails,
        discountPricingDetails,
        couponApplied,
      }),
    [
      couponApplied,
      discountPricingDetails,
      paymentDetails,
      pricingDetails,
    ],
  );

  const advanceRentDays = numberOfDaysForRent(moveInDate);
  const advanceRentDisabled = (pricing?.advanceRent ?? 0) < 5;

  function updatePaymentSelection(key: keyof PaymentSelections, value: boolean) {
    setPaymentDetails((current) => ({ ...current, [key]: value }));
  }

  async function handleApplyCoupon(code: string) {
    const trimmed = code.trim();
    if (!trimmed) {
      return {
        success: false as const,
        message: COUPON_INVALID_MESSAGE,
      };
    }

    const originalTotal =
      getBookingPricing({
        paymentDetails,
        pricingDetails,
        couponApplied: false,
      })?.totalAmount ?? 0;
    const result = await fetchPricing({ couponCode: trimmed });
    if (!result.ok || !result.discountedPricing) {
      return {
        success: false as const,
        message: result.message || COUPON_INVALID_MESSAGE,
      };
    }

    const discounted = getBookingPricing({
      paymentDetails,
      pricingDetails,
      discountPricingDetails: result.discountedPricing,
      couponApplied: true,
    });
    const discountAmount = Math.max(
      0,
      originalTotal - (discounted?.totalAmount ?? originalTotal),
    );

    return {
      success: true as const,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      message: result.message?.trim() || undefined,
    };
  }

  async function handleApplyReferral(code: string) {
    const trimmed = code.trim();
    const response = await postValidateReferral({
      referralCode: trimmed,
      propertyName: bookingPropertyName(property),
    });

    if (response?.isValid) {
      setReferralCode(trimmed);
      return {
        success: true as const,
        message: `Your referral code ${trimmed} has been applied`,
      };
    }

    return {
      success: false as const,
      message: response?.message || "Invalid referral code",
    };
  }

  function handleRemoveCoupon() {
    setCouponCode("");
    setCouponApplied(false);
    setDiscountPricingDetails(null);
    void fetchPricing({ clearCoupon: true });
  }

  function handleRemoveReferral() {
    setReferralCode("");
  }

  const propertyAddress = [
    property.address?.line1,
    property.address?.city,
    property.address?.pincode,
  ]
    .filter(Boolean)
    .join(" ");

  if (loadingPricing && !pricing) {
    return (
      <div className={cn("py-12 text-center text-sm text-gray-500", className)}>
        Loading payment options...
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className={cn("py-12 text-center text-sm text-error-600", className)}>
        {errorMessage ?? "Unable to load booking payment details."}
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h1 className="text-display-xs font-bold tracking-tight text-gray-900 sm:text-display-sm">
          You&apos;re Almost There!
        </h1>

        <div className="mt-4 rounded-xl bg-blue-light-50 px-4 py-3.5">
          <p className="text-sm leading-relaxed text-blue-light-800">
            Reserve now, pay the rest later. Start with the token amount to lock
            your room instantly.
          </p>
        </div>
      </div>

      <section aria-labelledby="booking-payment-options-heading">
        <h2
          id="booking-payment-options-heading"
          className="text-base font-semibold text-gray-900"
        >
          Choose what to pay now
        </h2>
        <div className="mt-4 space-y-3">
          <BookingPaymentOption
            id="token"
            title="Token Amount"
            description="Required to confirm booking"
            amount={pricing.token}
            checked={paymentDetails.token}
            disabled
            onChange={(value) => updatePaymentSelection("token", value)}
          />
          <BookingPaymentOption
            id="moveInCharges"
            title="Move-in Charges"
            description="One-time service charge during move-in"
            amount={pricing.moveInCharges}
            checked={paymentDetails.moveInCharges}
            onChange={(value) => updatePaymentSelection("moveInCharges", value)}
          />
          <BookingPaymentOption
            id="securityDeposit"
            title="Security Deposit"
            description="Refundable when you vacate the property"
            amount={pricing.securityDeposit}
            checked={paymentDetails.securityDeposit}
            onChange={(value) =>
              updatePaymentSelection("securityDeposit", value)
            }
          />
          <BookingPaymentOption
            id="advanceRent"
            title={`Advance Rent (${advanceRentDays} days)`}
            description="Optional early payment of rent"
            amount={pricing.advanceRent}
            checked={paymentDetails.advanceRent}
            disabled={advanceRentDisabled}
            onChange={(value) => updatePaymentSelection("advanceRent", value)}
          />
        </div>
      </section>

      <section aria-labelledby="booking-discounts-heading">
        <div className="mb-4 flex items-center gap-2">
          <Image
            src="/assets/booking/apply-coupon.png"
            alt=""
            width={20}
            height={20}
            className="size-5"
          />
          <h2
            id="booking-discounts-heading"
            className="text-base font-semibold text-gray-900"
          >
            Apply discounts
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <PromoCodeInput
            label="Referral Code"
            placeholder="Enter referral code"
            onApply={handleApplyReferral}
            onRemove={handleRemoveReferral}
          />
          <PromoCodeInput
            label="Coupon Code"
            placeholder="Enter coupon code"
            onApply={handleApplyCoupon}
            onRemove={handleRemoveCoupon}
          />
        </div>
      </section>

      <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold text-gray-900">
          Total Amount{" "}
          <span className="border-b border-dashed border-gray-400 font-bold">
            {formatRupee(pricing.totalAmount)}
          </span>
        </p>
        <BookingPaymentCheckout
          amount={pricing.totalAmount}
          propertyPath={propertyPath}
          moveInDate={moveInDate}
          propertyAddress={propertyAddress}
          mapUrl={property.map_url}
          occupantInfo={{
            firstName: occupantInfo?.firstName ?? "",
            lastName: occupantInfo?.lastName ?? "",
            email: occupantInfo?.email ?? "",
            gender: occupantInfo?.gender ?? "",
            phone: occupantInfo?.phone ?? "",
          }}
          initPayload={{
            bookingInfo: {
              propertyId: property.id,
              moveInDate,
              categoryId: category.id,
              firstName: occupantInfo?.firstName ?? "",
              lastName: occupantInfo?.lastName ?? "",
              email: occupantInfo?.email ?? "",
              gender: occupantInfo?.gender ?? "",
              couponCode: couponApplied ? couponCode : undefined,
              referralCode: referralCode || undefined,
              sdKey: pricing.sdKey,
            },
            payments: {
              rent: pricing.rent,
              sdSelected: paymentDetails.securityDeposit,
              advanceRentSelected: paymentDetails.advanceRent,
              isMoveInChargesSelected: paymentDetails.moveInCharges,
              amountToBePaid: pricing.totalAmount,
              sharingType,
              sdMonths: property.security_deposit_months,
              utilitySelected: paymentDetails.utilityCharges,
            },
          }}
          onInitError={(message) => setPaymentSnackbar(message)}
        />
      </div>

      <Snackbar
        open={paymentSnackbar != null}
        message={paymentSnackbar ?? ""}
        variant="error"
        onClose={() => setPaymentSnackbar(null)}
      />

      <section aria-labelledby="booking-terms-heading" className="space-y-3">
        <h2
          id="booking-terms-heading"
          className="text-base font-semibold text-gray-900"
        >
          Terms &amp; Conditions
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
          {bookingTermsAndConditions(property.lockin_period).map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          Read the full{" "}
          <Link href="/tenant-policy" className="font-medium text-hello-lime-700 hover:underline">
            Terms and conditions
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
