"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { postInitBooking, postVerifyBooking } from "@/src/apis/booking";
import type { BookingOccupantInfo } from "@/src/lib/booking/url";
import {
  markBookingSuccess,
  openCashfreeCheckout,
  openRazorpayCheckout,
  preloadPaymentGateways,
  usesCashfree,
} from "@/src/lib/booking/payment-gateways";
import type {
  InitBookingResponse,
  PostInitBookingPayload,
  RazorpayPaymentResponse,
} from "@/src/models/booking";
import { cn } from "@/src/lib/cn";

export interface BookingPaymentCheckoutProps {
  amount: number;
  initPayload: PostInitBookingPayload;
  occupantInfo: BookingOccupantInfo;
  propertyPath: string;
  moveInDate: string;
  propertyAddress: string;
  mapUrl?: string;
  disabled?: boolean;
  onInitError?: (message: string) => void;
  className?: string;
}

function buildSuccessHref({
  propertyPath,
  moveInDate,
  occupantInfo,
  propertyAddress,
  mapUrl,
  bookingId,
}: {
  propertyPath: string;
  moveInDate: string;
  occupantInfo: BookingOccupantInfo;
  propertyAddress: string;
  mapUrl?: string;
  bookingId: string;
}) {
  const params = new URLSearchParams({
    moveInDate,
    name: `${occupantInfo.firstName} ${occupantInfo.lastName}`.trim(),
    address: propertyAddress,
    bookingId,
  });
  if (mapUrl) params.set("mapURL", mapUrl);
  return `${propertyPath}/booking/success?${params.toString()}`;
}

function buildFailedHref({
  propertyPath,
  message,
}: {
  propertyPath: string;
  message: string;
}) {
  const params = new URLSearchParams({
    failedReason: message,
    type: "booking",
    propertyURL: propertyPath,
  });
  return `${propertyPath}/booking/failed?${params.toString()}`;
}

export function BookingPaymentCheckout({
  amount,
  initPayload,
  occupantInfo,
  propertyPath,
  moveInDate,
  propertyAddress,
  mapUrl,
  disabled = false,
  onInitError,
  className,
}: BookingPaymentCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    preloadPaymentGateways();
  }, []);

  function redirectToSuccess(bookingId: string) {
    markBookingSuccess(bookingId);
    router.push(
      buildSuccessHref({
        propertyPath,
        moveInDate,
        occupantInfo,
        propertyAddress,
        mapUrl,
        bookingId,
      }),
    );
  }

  function redirectToFailed(message: string) {
    router.push(buildFailedHref({ propertyPath, message }));
  }

  async function handleVerifyResult(
    verifyResponse: { success?: boolean; message?: string } | null | undefined,
    bookingId: string,
  ) {
    setLoading(false);

    if (verifyResponse?.success) {
      redirectToSuccess(bookingId);
      return;
    }

    redirectToFailed(
      verifyResponse?.message ?? "Payment verification failed. Please try again.",
    );
  }

  async function verifyRazorpayPayment(
    razorpayResponse: RazorpayPaymentResponse,
    initResponse: InitBookingResponse,
  ) {
    setLoading(true);

    const verifyResponse = await postVerifyBooking({
      paymentId: initResponse.paymentObj.transactionId,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpaySignature: razorpayResponse.razorpay_signature,
      amount,
      bookingId: initResponse.id,
      payment_gateway: "razorpay",
    });

    await handleVerifyResult(verifyResponse, initResponse.id);
  }

  async function verifyCashfreePayment(initResponse: InitBookingResponse) {
    setLoading(true);

    const verifyResponse = await postVerifyBooking({
      paymentId: initResponse.paymentObj.transactionId,
      amount,
      bookingId: initResponse.id,
      payment_gateway: "cashfree",
      orderId: initResponse.paymentObj.orderId,
    });

    await handleVerifyResult(verifyResponse, initResponse.id);
  }

  async function openGateway(initResponse: InitBookingResponse) {
    if (usesCashfree(initResponse)) {
      await openCashfreeCheckout(initResponse, {
        onComplete: () => {
          void verifyCashfreePayment(initResponse);
        },
        onError: (message) => {
          setLoading(false);
          onInitError?.(message);
        },
      });
      return;
    }

    await openRazorpayCheckout({
      initResponse,
      prefill: {
        name: `${occupantInfo.firstName} ${occupantInfo.lastName}`.trim(),
        email: occupantInfo.email,
        contact: occupantInfo.phone,
      },
      onSuccess: (response) => {
        void verifyRazorpayPayment(response, initResponse);
      },
      onFailure: (message) => {
        setLoading(false);
        onInitError?.(message ?? "Payment failed. Please try again.");
      },
    });

    setLoading(false);
  }

  async function handlePayNow() {
    setLoading(true);

    try {
      const response = await postInitBooking(initPayload);

      if (!response?.success || !response?.data) {
        const message = response?.message ?? "Payment could not be initiated.";
        onInitError?.(message);
        setLoading(false);
        return;
      }

      await openGateway(response.data as InitBookingResponse);
    } catch {
      onInitError?.(
        "Something went wrong while starting payment. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <Button
      size="xl"
      className={cn(
        "w-full bg-hello-lime-400 text-gray-900 hover:bg-hello-lime-500 sm:w-auto sm:min-w-40",
        className,
      )}
      disabled={disabled || loading}
      onClick={() => void handlePayNow()}
      aria-busy={loading}
    >
      {loading ? "Processing..." : "Pay Now"}
    </Button>
  );
}
