"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { OccupantDetailsForm } from "@/components/booking/occupant-details-form";
import { ScheduleVisitFlow } from "@/components/booking/schedule-visit-flow";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { buildBookingHref } from "@/src/lib/booking/url";
import {
  filterCategoriesByOccupancy,
  getAvailableOccupancies,
  getBookingRoomChipLabel,
  getFallbackRoomChipLabel,
  getRentForOccupancy,
} from "@/src/lib/hdp/category-occupancy";
import type { CategoryProps } from "@/src/models/category";
import {
  hdpOccupancies,
  hdpProperty,
  hdpRoomTypes,
  type HdpOccupancy,
  type HdpRoomType,
} from "@/src/tokens/hdp";
import type {
  BookingOccupantInfo,
  BookNowCompleteDetails,
  BookingSelectionDetails,
} from "@/src/lib/booking/url";
import { cn } from "@/src/lib/cn";

type BookingMode = "tour" | "book";
type BookStep = "select" | "occupant";

const bookingModeOptions = [
  { value: "tour" as const, label: "Take a Tour" },
  { value: "book" as const, label: "Book Now" },
];

type BookingRoom = {
  id: string;
  name: string;
  rent: number;
  features: readonly string[];
  chipLabel: string;
  soldOut?: boolean;
};

function mapCategoryToBookingRoom(
  category: CategoryProps,
  occupancy: HdpOccupancy,
): BookingRoom {
  return {
    id: String(category.id),
    name: category.display_name || category.name,
    rent: getRentForOccupancy(category, occupancy),
    features: category.key_feature?.length
      ? category.key_feature
      : category.amenities?.slice(0, 3) ?? [],
    chipLabel: getBookingRoomChipLabel(category, occupancy),
    soldOut: category.sold_out,
  };
}

function mapRoomTypeToBookingRoom(
  room: HdpRoomType,
  occupancy: HdpOccupancy,
): BookingRoom {
  return {
    id: room.id,
    name: room.name,
    rent: room.rent,
    features: room.features,
    chipLabel: getFallbackRoomChipLabel(occupancy),
  };
}

function formatRent(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}/mo`;
}

function RoomFeatureIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M2.66667 14V6.66667L8 2.66667L13.3333 6.66667V14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14V9.33333H10V14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HdpBookingTourFooter() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-base font-medium text-black">
      <span className="inline-flex items-center gap-2">
        <Image
          src="/assets/homepage-website/no-brokerage.svg"
          alt=""
          width={17}
          height={16}
          className="size-4"
        />
        No Brokerage
      </span>
      <span aria-hidden className="text-sm text-gray-400">
        |
      </span>
      <span className="inline-flex items-center gap-2">
        <Image
          src="/assets/homepage-website/no-lockin-period.svg"
          alt=""
          width={17}
          height={16}
          className="size-4"
        />
        No Lock-in Period
      </span>
    </div>
  );
}

function HdpBookingBookFooter({ minStayMonths }: { minStayMonths: number }) {
  return (
    <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
      Refund of Security Deposit requires a minimum {minStayMonths}-month stay.*
    </p>
  );
}

function HdpBookingTourPanel({ view }: { view: HdpPageView }) {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#0a0e14]/50">
            Rent Starting From
          </p>
          <p className="text-lg font-bold text-hello-lime-700 sm:text-xl">
            ₹{view.startingRent.toLocaleString("en-IN")}/mo
          </p>
        </div>

        <div className="min-w-0 border-l border-gray-300 pl-3 sm:pl-4">
          <p className="text-[13px] font-medium text-[#0a0e14]/50">
            Security Deposit
          </p>
          <p className="text-lg font-bold text-[#0a0e14] sm:text-xl">
            {view.securityDepositLabel}
          </p>
        </div>
      </div>

      <ScheduleVisitFlow
        propertyId={view.propertyId}
        propertyName={view.displayName}
        propertyUrl={view.propertyUrl}
        layout="embedded"
      />
    </div>
  );
}

export function HdpBookingCard({
  view,
  categories,
  className,
  bookOnly = false,
  variant = "card",
  initialMode,
  initialCategoryId,
  initialOccupancy,
  initialOccupantInfo,
  onBookingComplete,
  selectionOnly = false,
  onSelectionComplete,
  confirmLabel,
  showSelectHeading = true,
}: {
  view?: Partial<HdpPageView>;
  categories?: readonly CategoryProps[];
  className?: string;
  bookOnly?: boolean;
  variant?: "card" | "modal";
  initialMode?: BookingMode;
  initialCategoryId?: string | number;
  initialOccupancy?: HdpOccupancy;
  initialOccupantInfo?: BookingOccupantInfo & { moveInDate?: string };
  onBookingComplete?: (details: BookNowCompleteDetails) => void;
  selectionOnly?: boolean;
  onSelectionComplete?: (details: BookingSelectionDetails) => void;
  confirmLabel?: string;
  showSelectHeading?: boolean;
}) {
  const router = useRouter();
  const resolvedView: HdpPageView = {
    propertyId: hdpProperty.propertyId,
    pageTitle: hdpProperty.name,
    displayName: hdpProperty.name,
    name: hdpProperty.name,
    badge: hdpProperty.badge,
    locality: hdpProperty.locality,
    startingRent: hdpProperty.startingRent,
    securityDepositMonths: 1,
    securityDepositLabel: hdpProperty.securityDepositLabel,
    minStayMonths: hdpProperty.minStayMonths,
    rating: hdpProperty.rating,
    reviewCount: hdpProperty.reviewCount,
    visitsToday: hdpProperty.visitsToday,
    about: "",
    amenities: [],
    galleryImages: [],
    galleryItems: [],
    moments: [],
    propertyUrl: "",
    hdpPath: "",
    bookingPath: "",
    soldOut: false,
    roomTypes: hdpRoomTypes,
    nearbyItems: [],
    reviewSummary: null,
    residentReviews: [],
    ...view,
  };

  const fallbackRoomTypes: readonly HdpRoomType[] =
    resolvedView.roomTypes.length > 0 ? resolvedView.roomTypes : hdpRoomTypes;

  const visibleCategories = useMemo(
    () => (categories ?? []).filter((category) => category.show_to_ui && !category.is_removed),
    [categories],
  );

  const availableOccupancies = useMemo(() => {
    if (visibleCategories.length > 0) {
      return getAvailableOccupancies(visibleCategories);
    }
    return hdpOccupancies
      .map((item) => item.id)
      .filter((id) => fallbackRoomTypes.some((room) => room.occupancy === id));
  }, [visibleCategories, fallbackRoomTypes]);

  const [mode, setMode] = useState<BookingMode>(
    () => initialMode ?? (bookOnly ? "book" : "tour"),
  );
  const [bookStep, setBookStep] = useState<BookStep>("select");
  const [panelDirection, setPanelDirection] = useState<"left" | "right">("right");
  const skipPanelAnimation = useRef(true);
  const [occupancy, setOccupancy] = useState<HdpOccupancy>(
    () => initialOccupancy ?? availableOccupancies[0] ?? "private",
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(() =>
    initialCategoryId != null ? String(initialCategoryId) : undefined,
  );

  useEffect(() => {
    if (!availableOccupancies.includes(occupancy)) {
      setOccupancy(availableOccupancies[0] ?? "private");
    }
  }, [availableOccupancies, occupancy]);

  const filteredRooms = useMemo(() => {
    if (visibleCategories.length > 0) {
      return filterCategoriesByOccupancy(visibleCategories, occupancy).map(
        (category) => mapCategoryToBookingRoom(category, occupancy),
      );
    }
    return fallbackRoomTypes
      .filter((room) => room.occupancy === occupancy)
      .map((room) => mapRoomTypeToBookingRoom(room, occupancy));
  }, [visibleCategories, occupancy, fallbackRoomTypes]);

  useEffect(() => {
    setSelectedRoomId((current) => {
      if (current && filteredRooms.some((room) => room.id === current)) {
        return current;
      }
      return filteredRooms[0]?.id;
    });
  }, [filteredRooms, occupancy]);

  const occupancyOptions = hdpOccupancies.filter((item) =>
    availableOccupancies.includes(item.id),
  );

  function handleModeChange(next: BookingMode) {
    if (next === mode) return;
    skipPanelAnimation.current = false;
    setPanelDirection(next === "book" ? "right" : "left");
    setMode(next);
    if (next === "tour") {
      setBookStep("select");
    }
  }

  function handleOccupantComplete(details: {
    moveInDate: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phone: string;
  }) {
    if (!selectedRoomId || !resolvedView.bookingPath) return;

    const payload: BookNowCompleteDetails = {
      categoryId: selectedRoomId,
      occupancy,
      ...details,
    };

    if (onBookingComplete) {
      onBookingComplete(payload);
      return;
    }

    router.push(
      buildBookingHref(resolvedView.bookingPath, {
        categoryId: selectedRoomId,
        occupancy,
        moveInDate: details.moveInDate,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        gender: details.gender,
        phone: details.phone,
      }),
    );
  }

  function handleSelectConfirm() {
    if (!selectedRoomId) return;

    if (selectionOnly) {
      onSelectionComplete?.({
        categoryId: selectedRoomId,
        occupancy,
      });
      return;
    }

    setBookStep("occupant");
  }

  const cardContent = (
    <>
      {!bookOnly ? (
        <SegmentedControl
          aria-label="Booking mode"
          options={bookingModeOptions}
          value={mode}
          onChange={handleModeChange}
          className="bg-gray-200"
        />
      ) : null}

      <div
        key={bookOnly ? "book" : mode}
        className={cn(
          "motion-reduce:animate-none",
          !bookOnly &&
            !skipPanelAnimation.current &&
            (panelDirection === "right"
              ? "animate-booking-panel-in-right"
              : "animate-booking-panel-in-left"),
        )}
      >
        {mode === "tour" ? (
          <>
            <HdpBookingTourPanel view={resolvedView} />
            <HdpBookingTourFooter />
          </>
        ) : bookStep === "occupant" ? (
          <>
            <OccupantDetailsForm
              className="mt-4"
              onBack={() => setBookStep("select")}
              onComplete={handleOccupantComplete}
              initialValues={initialOccupantInfo}
            />
            <HdpBookingBookFooter minStayMonths={resolvedView.minStayMonths} />
          </>
        ) : (
          <>
            <div className={cn("space-y-4", showSelectHeading ? "mt-4" : "")}>
              <div className="space-y-3">
                {showSelectHeading ? (
                  <p className="text-base font-semibold text-gray-900">
                    Select your Occupancy
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {occupancyOptions.map((item) => {
                    const isActive = occupancy === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setOccupancy(item.id)}
                        className={cn(
                          "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200",
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto pr-1">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room, index) => {
                    const isSelected = selectedRoomId === room.id;
                    return (
                      <label
                        key={room.id}
                        className={cn(
                          "block cursor-pointer py-3",
                          index > 0 && "border-t border-gray-200",
                          room.soldOut && "cursor-not-allowed opacity-60",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex min-w-0 items-start gap-2.5">
                            <input
                              type="radio"
                              name="hdp-room"
                              checked={isSelected}
                              disabled={room.soldOut}
                              onChange={() => setSelectedRoomId(room.id)}
                              className="mt-1 size-5 shrink-0 accent-gray-800"
                            />
                            <span className="min-w-0">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="text-base font-semibold text-gray-900">
                                  {room.name}
                                </span>
                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                                  {room.chipLabel}
                                </span>
                              </span>
                              {room.features.length > 0 ? (
                                <span className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500">
                                  {room.features.map((feature, featureIndex) => (
                                    <span
                                      key={feature}
                                      className="inline-flex items-center gap-1"
                                    >
                                      {featureIndex > 0 ? (
                                        <span aria-hidden className="text-gray-400">
                                          •
                                        </span>
                                      ) : null}
                                      <RoomFeatureIcon className="size-3.5 shrink-0 text-gray-400" />
                                      <span>{feature}</span>
                                    </span>
                                  ))}
                                </span>
                              ) : null}
                            </span>
                          </span>
                          <span className="shrink-0 text-base font-bold text-gray-900">
                            {formatRent(room.rent)}
                          </span>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <p className="py-3 text-sm text-gray-500">
                    No room types available for this occupancy.
                  </p>
                )}
              </div>
            </div>

            <Button
              className="mt-4 w-full bg-hello-lime-400 text-gray-900 hover:bg-hello-lime-500"
              size="lg"
              disabled={
                resolvedView.soldOut ||
                filteredRooms.length === 0 ||
                !selectedRoomId
              }
              onClick={handleSelectConfirm}
            >
              {resolvedView.soldOut
                ? "Sold Out"
                : (confirmLabel ?? (selectionOnly ? "Save" : "Next"))}
            </Button>
            {!selectionOnly ? (
              <HdpBookingBookFooter minStayMonths={resolvedView.minStayMonths} />
            ) : null}
          </>
        )}
      </div>
    </>
  );

  if (variant === "modal") {
    return (
      <div className={cn("w-full min-w-0", className)} aria-label="Book now">
        {cardContent}
      </div>
    );
  }

  return (
    <aside
      id="hdp-booking-card"
      className={cn(
        "w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(134,144,163,0.4)]",
        className,
      )}
      aria-label="Booking actions"
    >
      {cardContent}
    </aside>
  );
}
