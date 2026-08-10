"use client";

import Image from "next/image";
import type { BookingOccupantInfo } from "@/src/lib/booking/url";
import type { SelectedCategory } from "@/src/models/booking";
import type { Property } from "@/src/models/property";
import { getBookingRoomChipLabel } from "@/src/lib/hdp/category-occupancy";
import { formatRupee } from "@/src/lib/booking/pricing";
import { imageUrlFormatter } from "@/src/lib/images";
import type { HdpOccupancy } from "@/src/tokens/hdp";
import { srpCardDefaultImage } from "@/src/tokens/srp-card";
import { cn } from "@/src/lib/cn";

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

function EditIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.99967 14.0001L2.66634 10.6667L11.333 2.00004Z"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatMoveInDate(moveInDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(moveInDate));
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <p className="shrink-0 text-gray-500">{label}</p>
      <p className="min-w-0 text-right font-medium text-gray-900">{value}</p>
    </div>
  );
}

export function BookingSummaryCard({
  property,
  category,
  occupancy,
  monthlyRent,
  moveInDate,
  occupantInfo,
  onEditRoom,
  onEditDetails,
  onEditMoveIn,
  className,
}: {
  property: Property;
  category: SelectedCategory;
  occupancy: HdpOccupancy;
  monthlyRent: number;
  moveInDate: string;
  occupantInfo?: BookingOccupantInfo;
  onEditRoom?: () => void;
  onEditDetails?: () => void;
  onEditMoveIn?: () => void;
  className?: string;
}) {
  const imageSrc = property.hdp_image
    ? imageUrlFormatter("hdp", property.hdp_image)
    : srpCardDefaultImage;
  const address = [property.address?.line2, property.address?.city]
    .filter(Boolean)
    .join(", ");
  const amenityPreview =
    category.key_feature?.length > 0
      ? category.key_feature.slice(0, 3)
      : category.amenities?.slice(0, 3) ?? [];
  const fullName = [occupantInfo?.firstName, occupantInfo?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const hasOccupantInfo = Boolean(
    fullName ||
      occupantInfo?.email ||
      occupantInfo?.phone ||
      occupantInfo?.gender,
  );

  return (
    <aside
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)]",
        className,
      )}
      aria-label="Booking summary"
    >
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={imageSrc}
            alt={property.display_name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-gray-900">
              {property.display_name}
            </h2>
            {onEditRoom ? (
              <button
                type="button"
                onClick={onEditRoom}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-hello-lime-700 hover:text-hello-lime-800"
              >
                <EditIcon className="size-3.5" />
                Edit
              </button>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{address}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {category.display_name || category.name}
            </p>
            <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
              {getBookingRoomChipLabel(category, occupancy)}
            </span>
          </div>
          <p className="text-base font-bold text-gray-900">
            {formatRupee(monthlyRent)}
            <span className="text-sm font-medium text-gray-500">/mo</span>
          </p>
        </div>

        {amenityPreview.length > 0 ? (
          <p className="text-xs text-gray-500">{amenityPreview.join(" • ")}</p>
        ) : null}

        {onEditMoveIn ? (
          <button
            type="button"
            onClick={onEditMoveIn}
            className="flex w-full items-center gap-2 rounded-xl text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <CalendarIcon className="size-4 shrink-0 text-gray-500" />
            <span>
              Move in Date-{" "}
              <span className="font-medium">{formatMoveInDate(moveInDate)}</span>
            </span>
            <EditIcon className="ml-auto size-3.5 text-hello-lime-700" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarIcon className="size-4 shrink-0 text-gray-500" />
            <span>
              Move in Date-{" "}
              <span className="font-medium">{formatMoveInDate(moveInDate)}</span>
            </span>
          </div>
        )}
      </div>

      {hasOccupantInfo ? (
        <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">Your details</p>
            {onEditDetails ? (
              <button
                type="button"
                onClick={onEditDetails}
                className="inline-flex items-center gap-1 text-xs font-semibold text-hello-lime-700 hover:text-hello-lime-800"
              >
                <EditIcon className="size-3.5" />
                Edit
              </button>
            ) : null}
          </div>
          <SummaryRow label="Name" value={fullName} />
          <SummaryRow label="Email" value={occupantInfo?.email ?? ""} />
          <SummaryRow label="Phone" value={occupantInfo?.phone ?? ""} />
          <SummaryRow label="Gender" value={occupantInfo?.gender ?? ""} />
        </div>
      ) : onEditDetails ? (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onEditDetails}
            className="inline-flex items-center gap-1 text-sm font-semibold text-hello-lime-700 hover:text-hello-lime-800"
          >
            <EditIcon className="size-3.5" />
            Add your details
          </button>
        </div>
      ) : null}
    </aside>
  );
}
