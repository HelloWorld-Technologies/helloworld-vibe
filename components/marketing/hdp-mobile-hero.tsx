"use client";

import { useRouter } from "next/navigation";
import type { BreadcrumbItem } from "@/components/navigation/breadcrumbs";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { HdpRatingCard } from "@/components/marketing/hdp-rating-card";
import { PropertyGalleryMobile } from "@/components/marketing/property-gallery";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { useOptionalWishlist } from "@/components/wishlist/wishlist-provider";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { cn } from "@/src/lib/cn";
import { hdpProperty } from "@/src/tokens/hdp";

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

export function HdpMobileHero({
  view,
  breadcrumbItems,
  className,
}: {
  view: HdpPageView;
  breadcrumbItems: readonly BreadcrumbItem[];
  className?: string;
}) {
  const router = useRouter();
  const wishlist = useOptionalWishlist();
  const pageTitle = view.pageTitle || hdpProperty.name;
  const propertyId = view.propertyId;
  const saved = wishlist?.isWishlisted(propertyId) ?? false;
  const locationLabel =
    [view.addressLine, view.locality].filter(Boolean).join(", ") ||
    view.locality;
  const startingRent = view.startingRent;
  const securityDepositLabel = view.securityDepositLabel;

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
    <section className={cn("md:hidden", className)} aria-label="Property overview">
      <PropertyGalleryMobile
        items={view.galleryItems}
        variant="hero"
        onBack={() => router.back()}
        onShare={() => void handleShare()}
      />

      <div className="relative z-10 -mt-8 rounded-t-[2.5rem] bg-white px-4 pb-2 pt-6 sm:px-6">
        {breadcrumbItems.length > 0 ? (
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 font-satoshi text-2xl font-bold leading-tight text-gray-900">
            {pageTitle}
          </h1>
          <WishlistButton
            saved={saved}
            aria-label={saved ? "Remove from saved" : "Save property"}
            iconClassName="size-6"
            className="mt-0.5 shrink-0 text-hello-lime-900 hover:text-hello-lime-800"
            onClick={() => {
              void wishlist?.toggleWishlist(propertyId, pageTitle);
            }}
          />
        </div>

        {view.badge ? (
          <span className="mt-2 inline-flex rounded-2xl bg-error-200 px-2 py-0.5 text-xs font-medium text-gray-800">
            {view.badge}
          </span>
        ) : null}

        {locationLabel ? (
          (() => {
            const mapsHref =
              view.mapUrl ||
              (view.latitude && view.longitude
                ? `https://www.google.com/maps/place/${view.latitude},${view.longitude}`
                : undefined);
            return mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-hello-lime-700 underline underline-offset-2 hover:text-hello-lime-800"
              >
                <MapPinIcon className="size-4 shrink-0" />
                <span className="min-w-0">{locationLabel}</span>
              </a>
            ) : (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-hello-lime-700">
                <MapPinIcon className="size-4 shrink-0" />
                <span className="min-w-0">{locationLabel}</span>
              </p>
            );
          })()
        ) : null}

        <div className="mt-5 flex items-stretch gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">Rent Starting From</p>
            <p className="mt-1 text-xl font-bold text-hello-lime-800">
              ₹{startingRent.toLocaleString("en-IN")}/mo
            </p>
          </div>
          <div className="w-px shrink-0 bg-gray-200" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">Security Deposit</p>
            <p className="mt-1 text-base font-bold text-gray-900">
              {securityDepositLabel}
            </p>
          </div>
        </div>

        <HdpRatingCard view={view} className="mt-5" showTrophy />
      </div>
    </section>
  );
}
