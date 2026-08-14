"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  resolveHdpPage,
  type HdpPageConfig,
} from "@/src/lib/hdp/resolve-hdp-page";
import { useDebounce } from "@/src/lib/use-debounce";
import { useSelectedVibes } from "@/src/lib/use-selected-vibes";
import { useVibeList } from "@/src/lib/use-vibe-list";
import { selectedVibeApiIds } from "@/src/lib/vibe-list-storage";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";
import { formatCityDisplayName } from "@/src/tokens/cities";
import type { HdpSectionId } from "@/src/tokens/hdp";

const HIDDEN_WHEN_NO_MOMENTS = ["moments"] as const satisfies readonly HdpSectionId[];
const HIDDEN_WHEN_NO_NEARBY = ["nearby"] as const satisfies readonly HdpSectionId[];
const HIDDEN_WHEN_NO_REVIEWS = ["reviews"] as const satisfies readonly HdpSectionId[];
const HIDDEN_WHEN_NO_AMENITIES = ["amenities"] as const satisfies readonly HdpSectionId[];
const HIDDEN_WHEN_NO_ABOUT = ["about"] as const satisfies readonly HdpSectionId[];
const VIBE_FILTER_DEBOUNCE_MS = 400;

export function HdpPageContent({ config }: { config: HdpPageConfig }) {
  const [liveConfig, setLiveConfig] = useState(config);
  const { selectedVibes } = useSelectedVibes();
  const { vibes } = useVibeList();
  const vibeIds = useMemo(
    () => selectedVibeApiIds(selectedVibes, vibes),
    [selectedVibes, vibes],
  );
  const vibeKey = vibeIds.join(",");
  const debouncedVibeKey = useDebounce(vibeKey, VIBE_FILTER_DEBOUNCE_MS);
  const debouncedVibeIds = useMemo(() => {
    if (!debouncedVibeKey) return [] as number[];
    return debouncedVibeKey
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);
  }, [debouncedVibeKey]);

  useEffect(() => {
    setLiveConfig(config);
  }, [config]);

  useEffect(() => {
    let cancelled = false;

    async function refetchHdp() {
      const fresh = await resolveHdpPage(
        config.srpSlug,
        config.localitySlug,
        config.hdpSlug,
        debouncedVibeIds.length > 0 ? { vibes: debouncedVibeIds } : undefined,
      );
      if (!cancelled && fresh) {
        setLiveConfig(fresh);
      }
    }

    void refetchHdp();
    return () => {
      cancelled = true;
    };
  }, [
    config.srpSlug,
    config.localitySlug,
    config.hdpSlug,
    debouncedVibeKey,
    debouncedVibeIds,
  ]);

  const { view } = liveConfig;
  const hasReviews =
    view.reviewSummary != null || view.residentReviews.length > 0;
  const hasAbout = Boolean(view.about?.trim());
  const hasAmenities = view.amenities.length > 0;
  const cityRaw =
    liveConfig.property.address?.city || liveConfig.property.city || "";
  const city = cityRaw ? formatCityDisplayName(cityRaw) : undefined;
  const locality =
    liveConfig.property.locality ||
    liveConfig.property.address?.line2 ||
    liveConfig.localitySlug.replace(/-/g, " ");

  return (
    <PropertyActionsProvider defaultCity={city} defaultLocation={locality}>
      <div className={cn("bg-white", pageLayout.mobileStickyBottomPadding)}>
        <JsonLd schema={liveConfig.schema} />
        <SiteHeader />

        <HdpMobileHero
          view={view}
          breadcrumbItems={liveConfig.breadcrumbItems}
        />

        <main
          className={cn(
            pageLayout.containerWithTopPadding,
            "pt-0 md:pt-4",
          )}
        >
          <div className="hidden md:block">
            <Breadcrumbs
              items={liveConfig.breadcrumbItems}
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
                <HdpVibeMatch
                  displayName={view.displayName}
                  overallScore={view.vibeMatchScore}
                  selectedVibes={view.selectedVibeMatches}
                  residentInterests={view.residentInterests}
                />
              </div>

              <HdpSectionNav
                className="mt-6"
                hiddenIds={[
                  ...(hasAbout ? [] : HIDDEN_WHEN_NO_ABOUT),
                  ...(hasAmenities ? [] : HIDDEN_WHEN_NO_AMENITIES),
                  ...(view.nearbyItems.length === 0 ? HIDDEN_WHEN_NO_NEARBY : []),
                  ...(view.moments.length === 0 ? HIDDEN_WHEN_NO_MOMENTS : []),
                  ...(hasReviews ? [] : HIDDEN_WHEN_NO_REVIEWS),
                ]}
              />

              <div className="mt-8 space-y-10 md:mt-10 md:space-y-12">
                <HdpAbout view={view} />
                <HdpAmenities amenities={view.amenities} />
                <HdpNearbyPlaces
                  items={view.nearbyItems}
                  mapUrl={view.mapUrl}
                  subtitle={view.nearbyDescription}
                  property={{
                    name: view.displayName,
                    addressLine: [view.addressLine, view.locality]
                      .filter(Boolean)
                      .join(", "),
                    locality: view.locality,
                    imageSrc: view.mapImageSrc ?? view.galleryImages[0],
                    startingRent: view.startingRent,
                    latitude: view.latitude,
                    longitude: view.longitude,
                  }}
                />
                <HdpMoments
                  displayName={view.displayName}
                  moments={view.moments}
                />
                {hasReviews ? (
                  <section id="hdp-reviews" className="scroll-mt-32">
                    <HdpReviews
                      reviewSummary={view.reviewSummary}
                      residentReviews={view.residentReviews}
                      googleLink={view.googleLink}
                    />
                  </section>
                ) : null}
              </div>
            </div>

            <div className={pageLayout.hdpSidebarColumn}>
              <div className="sticky top-24 z-20 w-full">
                <HdpBookingCard
                  view={view}
                  categories={liveConfig.categories}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-12 md:mt-16 md:space-y-16">
            <HdpSimilarProperties
              properties={liveConfig.similarProperties}
              srpSlug={liveConfig.srpSlug}
              localitySlug={liveConfig.localitySlug}
            />
            <HdpFaq items={liveConfig.faqs} />
          </div>
        </main>

        <SiteFooter />
        <HdpMobileActions
          view={view}
          categories={liveConfig.categories}
        />
      </div>
    </PropertyActionsProvider>
  );
}
