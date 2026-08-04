"use client";

import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { ShareIcon } from "@/components/icons/share-icon";
import { useOptionalWishlist } from "@/components/wishlist/wishlist-provider";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { hdpProperty } from "@/src/tokens/hdp";
import { cn } from "@/src/lib/cn";

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 8.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.33"
      />
      <path
        d="M8 14.667s5.333-3.58 5.333-8A5.333 5.333 0 1 0 2.667 6.667c0 4.42 5.333 8 5.333 8Z"
        stroke="currentColor"
        strokeWidth="1.33"
      />
    </svg>
  );
}

export function HdpHeader({
  view,
  className,
}: {
  view?: HdpPageView;
  className?: string;
}) {
  const pageTitle = view?.pageTitle ?? hdpProperty.name;
  const badge = view?.badge ?? hdpProperty.badge;
  const locality = view?.locality ?? hdpProperty.locality;
  const mapUrl = view?.mapUrl;
  const propertyId = view?.propertyId ?? hdpProperty.propertyId;
  const wishlist = useOptionalWishlist();
  const saved = wishlist?.isWishlisted(propertyId) ?? false;

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: pageTitle, url });
        return;
      }
      await navigator.clipboard?.writeText(url);
    } catch {
      // User dismissed native share sheet.
    }
  }

  return (
    <header className={cn("space-y-4 md:space-y-6", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-satoshi text-2xl font-bold text-gray-800 md:text-3xl">
              {pageTitle}
            </h1>
            {badge ? (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="text-base font-medium text-gray-600 md:text-lg">
            {locality}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 self-start">
          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 underline-offset-4 hover:underline"
            >
              <MapPinIcon className="size-4" />
              Show on Maps
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 underline-offset-4 hover:underline"
            >
              <MapPinIcon className="size-4" />
              Show on Maps
            </button>
          )}
          <WishlistButton
            saved={saved}
            aria-label={saved ? "Remove from saved" : "Save property"}
            iconClassName="size-5"
            onClick={() => {
              void wishlist?.toggleWishlist(propertyId, pageTitle);
            }}
          />
          <button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${pageTitle}`}
            className="text-hello-lime-900 transition-colors hover:text-hello-lime-800"
          >
            <ShareIcon className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
