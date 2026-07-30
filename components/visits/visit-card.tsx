"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOptionalPropertyActions } from "@/components/booking/property-actions-provider";
import { formatVisitDateBox } from "@/src/lib/map-user-visit";
import { cn } from "@/src/lib/cn";
import { isSrpComingSoonImage } from "@/src/tokens/srp-card";
import type { MyVisitItem } from "@/src/models/user-visit";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-4">
      <path
        d={direction === "left" ? "M12.5 15L7.5 10L12.5 5" : "M7.5 15L12.5 10L7.5 5"}
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M6.9 3.3c.4-.9 1.4-1.3 2.3-.9l1.2.5c.8.4 1.2 1.3 1 2.2l-.4 1.6c-.1.5.1 1 .5 1.3l1.5 1.2c.3.3.8.4 1.2.2l1.5-.6c.9-.4 1.9 0 2.3.9l.5 1.2c.4.9 0 1.9-.9 2.3l-1.1.5c-1 .4-2.1.2-3-.4-2.4-1.6-4.4-3.6-6-6-.6-.9-.8-2-.4-3l.5-1.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DirectionsIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5 16.5 6.25v7.5L10 17.5 3.5 13.75v-7.5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.5v5M10 12.5h.005"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface VisitCardProps {
  visit: MyVisitItem;
  onRate?: (visit: MyVisitItem) => void;
}

export function VisitCard({ visit, onRate }: VisitCardProps) {
  const propertyActions = useOptionalPropertyActions();
  const [imageIndex, setImageIndex] = useState(0);
  const images = visit.images.length > 0 ? visit.images : [];
  const currentImage = images[imageIndex] ?? images[0];
  const dateBox = formatVisitDateBox(visit.visitDate);

  function showPreviousImage() {
    setImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function showNextImage() {
    setImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-gray-100">
        {currentImage ? (
          <Image
            src={currentImage}
            alt=""
            fill
            className={cn(
              "object-cover",
              isSrpComingSoonImage(currentImage) && "object-contain p-6",
            )}
            sizes="(max-width: 768px) 100vw, 640px"
          />
        ) : null}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {!visit.isPast ? (
            <span className="rounded-full bg-hello-lime-400 px-3 py-1 text-xs font-bold text-gray-900">
              Upcoming
            </span>
          ) : (
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
              Completed
            </span>
          )}
          {visit.daysUntilLabel ? (
            <span className="rounded-full bg-gray-900/85 px-3 py-1 text-xs font-bold text-white">
              {visit.daysUntilLabel}
            </span>
          ) : null}
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm"
            >
              <ChevronIcon direction="right" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((image, index) => (
                <span
                  key={`${image}-${index}`}
                  className={cn(
                    "size-1.5 rounded-full",
                    index === imageIndex ? "bg-white" : "bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div>
          {visit.propertyUrl ? (
            <Link
              href={visit.propertyUrl}
              className="text-lg font-bold text-gray-900 hover:text-gray-700"
            >
              {visit.propertyName}
            </Link>
          ) : (
            <h3 className="text-lg font-bold text-gray-900">
              {visit.propertyName}
            </h3>
          )}
          <p className="mt-1 text-sm text-gray-600">{visit.subtitle}</p>
        </div>

        <div className="flex gap-3 rounded-2xl border border-blue-light-200 bg-blue-light-50 p-3">
          <div className="flex min-w-[3.5rem] flex-col items-center justify-center rounded-xl bg-white px-3 py-2 text-center shadow-xs">
            <span className="text-2xl font-bold leading-none text-gray-900">
              {dateBox.day}
            </span>
            <span className="mt-1 text-xs font-bold tracking-wide text-gray-500">
              {dateBox.month}
            </span>
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-sm font-semibold text-gray-900">
              {visit.dayLabel}
            </p>
            <p className="text-sm text-gray-600">{visit.timeLabel}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {visit.propertyManagerName}
            </p>
            <p className="text-xs text-gray-500">Property Manager</p>
          </div>
          {visit.propertyManagerPhone ? (
            <a
              href={`tel:${visit.propertyManagerPhone}`}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-hello-lime-400 text-gray-900 transition-colors hover:bg-hello-lime-500"
              aria-label={`Call ${visit.propertyManagerName}`}
            >
              <PhoneIcon className="size-5" />
            </a>
          ) : null}
        </div>

        {visit.isPast ? (
          visit.canRate ? (
            <Button
              type="button"
              className="w-full"
              onClick={() => onRate?.(visit)}
            >
              Rate your visit
            </Button>
          ) : (
            <p className="text-center text-sm font-medium text-gray-500">
              Thanks for rating your visit
            </p>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              hierarchy="secondary-gray"
              className="w-full"
              onClick={() =>
                propertyActions?.openScheduleVisit({
                  propertyId: visit.propertyId,
                  propertyName: visit.propertyName,
                  location: visit.subtitle,
                  propertyUrl: visit.propertyUrl,
                })
              }
            >
              Reschedule
            </Button>
            {visit.mapUrl ? (
              <Button
                type="button"
                className="w-full"
                iconTrailing={<DirectionsIcon className="size-4" />}
                onClick={() =>
                  window.open(visit.mapUrl, "_blank", "noopener,noreferrer")
                }
              >
                Get Directions
              </Button>
            ) : (
              <Button type="button" className="w-full" disabled>
                Get Directions
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
