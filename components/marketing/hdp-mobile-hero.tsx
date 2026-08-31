"use client";

import type { BreadcrumbItem } from "@/components/navigation/breadcrumbs";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { HdpRatingCard } from "@/components/marketing/hdp-rating-card";
import { PropertyGalleryMobile } from "@/components/marketing/property-gallery";
import { ShowOnMapsIcon } from "@/components/icons/show-on-maps-icon";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { useOptionalWishlist } from "@/components/wishlist/wishlist-provider";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { cn } from "@/src/lib/cn";
import { localitySlugToName } from "@/src/lib/string-utils";
import { hdpProperty } from "@/src/tokens/hdp";

const locationLinkClassName =
  "mt-3 inline-flex items-center gap-1.5 text-sm font-bold leading-none text-hello-lime-700 hover:text-hello-lime-800";

const locationLinkTextClassName =
  "min-w-0 leading-none underline decoration-dashed decoration-current underline-offset-[6px]";

function formatLocationLabel(locality: string | undefined): string | undefined {
  const trimmed = locality?.trim();
  if (!trimmed) return undefined;
  return trimmed === trimmed.toLowerCase() ? localitySlugToName(trimmed) : trimmed;
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
  const wishlist = useOptionalWishlist();
  const pageTitle = view.pageTitle || hdpProperty.name;
  const propertyId = view.propertyId;
  const saved = wishlist?.isWishlisted(propertyId) ?? false;
  const locationLabel = formatLocationLabel(view.locality);
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
        onShare={() => void handleShare()}
        wishlistControl={
          <WishlistButton
            saved={saved}
            aria-label={saved ? "Remove from saved" : "Save property"}
            iconClassName="size-5"
            className="flex size-10 items-center justify-center rounded-full bg-white text-hello-lime-900 shadow-sm hover:text-hello-lime-800"
            onClick={() => {
              void wishlist?.toggleWishlist(propertyId, pageTitle);
            }}
          />
        }
      />

      <div className="relative z-10 -mt-8 rounded-t-[2.5rem] bg-white px-4 pb-2 pt-6 sm:px-6">
        {breadcrumbItems.length > 0 ? (
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        ) : null}

        <h1 className="font-satoshi text-lg font-bold leading-tight text-gray-900">
          {pageTitle}
        </h1>

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
                className={locationLinkClassName}
              >
                <ShowOnMapsIcon className="h-[19px] w-[17px] shrink-0" />
                <span className={locationLinkTextClassName}>{locationLabel}</span>
              </a>
            ) : (
              <p className={locationLinkClassName}>
                <ShowOnMapsIcon className="h-[19px] w-[17px] shrink-0" />
                <span className={locationLinkTextClassName}>{locationLabel}</span>
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
            <p className="mt-1 text-xl font-bold text-gray-900">
              {securityDepositLabel}
            </p>
          </div>
        </div>

        {view.showRatingCard ? (
          <HdpRatingCard view={view} className="mt-5" showTrophy />
        ) : null}
      </div>
    </section>
  );
}
