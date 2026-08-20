"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppStoreIcon, PlayStoreIcon } from "@/components/brand/store-icons";
import { pageLayout } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";
import { clearReferCode } from "@/src/lib/refer-code";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.thehelloworld";
const APP_STORE_URL =
  "https://itunes.apple.com/in/app/hello-world-homes/id1481207096";

function formatMoveInDate(moveInDate: string) {
  if (!moveInDate) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(moveInDate));
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M17.5 8.33333H2.5M13.3333 1.66667V5M6.66667 1.66667V5M6.5 18.3333H13.5C14.9001 18.3333 15.6002 18.3333 16.135 18.0608C16.6054 17.821 16.9877 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3333V7.66667C17.5 6.26654 17.5 5.56647 17.2275 5.03169C16.9877 4.56128 16.6054 4.17897 16.135 3.93915C15.6002 3.66667 14.9001 3.66667 13.5 3.66667H6.5C5.09987 3.66667 4.3998 3.66667 3.86502 3.93915C3.39462 4.17897 3.01231 4.56128 2.77249 5.03169C2.5 5.56647 2.5 6.26654 2.5 7.66667V14.3333C2.5 15.7335 2.5 16.4335 2.77249 16.9683C3.01231 17.4387 3.39462 17.821 3.86502 18.0608C4.3998 18.3333 5.09987 18.3333 6.5 18.3333Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookingSuccessIcon() {
  return (
    <div
      className="relative mx-auto flex size-36 items-center justify-center"
      aria-hidden
    >
      <span className="absolute size-36 rounded-full bg-hello-lime-50" />
      <span className="absolute size-28 rounded-full bg-hello-lime-100/70" />
      <span className="relative flex size-[4.5rem] items-center justify-center rounded-full bg-green-500 shadow-sm">
        <CheckIcon className="size-9 text-white" />
      </span>
    </div>
  );
}

function StoreBadge({
  href,
  topLabel,
  bottomLabel,
  icon,
}: {
  href: string;
  topLabel: string;
  bottomLabel: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg bg-hello-lime-400 px-3 text-black transition-colors hover:bg-hello-lime-500 sm:h-[3.375rem] sm:flex-none sm:px-4"
    >
      {icon}
      <span className="min-w-0 text-left">
        <span className="block text-[10px] font-medium leading-[18px] sm:text-xs">
          {topLabel}
        </span>
        <span className="block truncate text-sm font-bold leading-5 sm:text-lg sm:leading-7">
          {bottomLabel}
        </span>
      </span>
    </Link>
  );
}

export function BookingSuccessContent({ propertyPath }: { propertyPath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moveInDate = searchParams.get("moveInDate") ?? "";
  const bookingIdFromQuery = searchParams.get("bookingId") ?? "";
  const [bookingId, setBookingId] = useState(bookingIdFromQuery);
  const formattedMoveInDate = formatMoveInDate(moveInDate);

  useEffect(() => {
    const storedBookingId =
      bookingIdFromQuery || window.localStorage.getItem("booking_successfull");

    if (!storedBookingId) {
      router.replace(propertyPath);
      return;
    }

    setBookingId(storedBookingId);
    window.localStorage.removeItem("booking_successfull");
    clearReferCode();
  }, [bookingIdFromQuery, propertyPath, router]);

  if (!bookingId) {
    return null;
  }

  return (
    <main
      className={cn(
        pageLayout.container,
        "flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-12 sm:py-16",
      )}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <BookingSuccessIcon />

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem] sm:leading-9">
          Booking Confirmed! 🎉
        </h1>

        <p className="mt-4 inline-flex rounded-full bg-blue-light-50 px-4 py-1.5 text-sm font-medium text-blue-light-700">
          Booking ID: {bookingId}
        </p>

        <p className="mt-5 max-w-md text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
          Your booking is confirmed with a partial payment. Pay the remaining
          amount through our App before move-in.
        </p>

        {formattedMoveInDate ? (
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gray-900 sm:text-base">
            <CalendarIcon className="size-5 shrink-0 text-gray-700" />
            <span>Move in Date: {formattedMoveInDate}</span>
          </p>
        ) : null}

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <StoreBadge
            href={PLAY_STORE_URL}
            topLabel="Get it on"
            bottomLabel="Google Play"
            icon={<PlayStoreIcon className="size-5 shrink-0 sm:size-7" />}
          />
          <StoreBadge
            href={APP_STORE_URL}
            topLabel="Get it on"
            bottomLabel="App Store"
            icon={<AppStoreIcon className="size-5 shrink-0 sm:size-7" />}
          />
        </div>
      </div>
    </main>
  );
}
