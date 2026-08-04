"use client";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PropertyActionsProvider } from "@/components/booking/property-actions-provider";
import { HdpAbout } from "@/components/marketing/hdp-about";
import { HdpAmenities } from "@/components/marketing/hdp-amenities";
import { HdpBookingCard } from "@/components/marketing/hdp-booking-card";
import { HdpFaq } from "@/components/marketing/hdp-faq";
import { HdpHeader } from "@/components/marketing/hdp-header";
import { HdpMobileActions } from "@/components/marketing/hdp-mobile-actions";
import { HdpMobileHero } from "@/components/marketing/hdp-mobile-hero";
import { HdpNearbyPlaces } from "@/components/marketing/hdp-nearby-places";
import { HdpRatingCard } from "@/components/marketing/hdp-rating-card";
import { HdpSectionNav } from "@/components/marketing/hdp-section-nav";
import { HdpSimilarProperties } from "@/components/marketing/hdp-similar-properties";
import { HdpVibeMatch } from "@/components/marketing/hdp-vibe-match";
import { HdpMoments } from "@/components/marketing/hdp-moments";
import { HdpReviews } from "@/components/marketing/hdp-reviews";
import { PropertyGalleryDesktop } from "@/components/marketing/property-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import type { HdpPageConfig } from "@/src/lib/hdp/resolve-hdp-page";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";
import { formatCityDisplayName } from "@/src/tokens/cities";
import type { HdpSectionId } from "@/src/tokens/hdp";

const HIDDEN_WHEN_NO_MOMENTS = ["moments"] as const satisfies readonly HdpSectionId[];

export function HdpPageContent({ config }: { config: HdpPageConfig }) {
  const { view } = config;
  const cityRaw =
    config.property.address?.city || config.property.city || "";
  const city = cityRaw ? formatCityDisplayName(cityRaw) : undefined;
  const locality =
    config.property.locality ||
    config.property.address?.line2 ||
    config.localitySlug.replace(/-/g, " ");

  return (
    <PropertyActionsProvider defaultCity={city} defaultLocation={locality}>
      <div className={cn("bg-white", pageLayout.mobileStickyBottomPadding)}>
        <JsonLd schema={config.schema} />
        <SiteHeader />

        <HdpMobileHero
          view={view}
          breadcrumbItems={config.breadcrumbItems}
        />

        <main
          className={cn(
            pageLayout.containerWithTopPadding,
            "pt-0 md:pt-4",
          )}
        >
          <div className="hidden md:block">
            <Breadcrumbs
              items={config.breadcrumbItems}
              className="mb-4 md:mb-6"
            />
            <HdpHeader view={view} />
            <div className="mt-4 md:mt-6">
              <PropertyGalleryDesktop items={view.galleryItems} />
            </div>
          </div>

          <div className={pageLayout.hdpTwoColumn}>
            <div className={pageLayout.mainColumn}>
              <div className="space-y-6">
                <div className="hidden md:block">
                  <HdpRatingCard view={view} />
                </div>
                <HdpVibeMatch displayName={view.displayName} />
              </div>

              <HdpSectionNav
                className="mt-6"
                hiddenIds={
                  view.moments.length === 0 ? HIDDEN_WHEN_NO_MOMENTS : undefined
                }
              />

              <div className="mt-8 space-y-10 md:mt-10 md:space-y-12">
                <HdpAbout view={view} />
                <HdpAmenities amenities={view.amenities} />
                <HdpNearbyPlaces
                  items={view.nearbyItems}
                  mapUrl={view.mapUrl}
                  subtitle={view.nearbyDescription}
                />
                <HdpMoments
                  displayName={view.displayName}
                  moments={view.moments}
                />
                <section id="hdp-reviews" className="scroll-mt-32">
                  <HdpReviews
                    reviewSummary={view.reviewSummary}
                    residentReviews={view.residentReviews}
                    googleLink={view.googleLink}
                  />
                </section>
              </div>
            </div>

            <div className={pageLayout.hdpSidebarColumn}>
              <div className="sticky top-24 z-20 w-full">
                <HdpBookingCard view={view} categories={config.categories} />
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-12 md:mt-16 md:space-y-16">
            <HdpSimilarProperties
              properties={config.similarProperties}
              srpSlug={config.srpSlug}
              localitySlug={config.localitySlug}
            />
            <HdpFaq items={config.faqs} />
          </div>
        </main>

        <SiteFooter />
        <HdpMobileActions view={view} categories={config.categories} />
      </div>
    </PropertyActionsProvider>
  );
}
