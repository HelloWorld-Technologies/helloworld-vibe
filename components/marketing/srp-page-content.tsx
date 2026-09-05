"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderSearch } from "@/components/layout/site-header-search";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { LocalityBentoHero } from "@/components/marketing/locality-bento-hero";
import { LocalityAmenitiesSection } from "@/components/marketing/locality-amenities-section";
import { LocalityContactCard } from "@/components/marketing/locality-contact-card";
import { LocalityDayFromHereSection } from "@/components/marketing/locality-day-from-here";
import type { NearbyMapProperty } from "@/components/marketing/hdp-nearby-map-modal";
import {
  LocalityMobileActions,
} from "@/components/marketing/locality-mobile-actions";
import {
  LocalityMobileTabs,
  type LocalityMobileTab,
} from "@/components/marketing/locality-mobile-tabs";
import { SrpFaq } from "@/components/marketing/srp-faq";
import { SrpListingsSection } from "@/components/marketing/srp-listings-section";
import { SrpLocalitySeoLinks } from "@/components/marketing/srp-locality-seo-links";
import { SrpPopularLocalities } from "@/components/marketing/srp-popular-localities";
import { SrpSectionToggle } from "@/components/marketing/srp-section-toggle";
import { PropertyActionsProvider } from "@/components/booking/property-actions-provider";
import { JsonLd } from "@/components/seo/json-ld";
import {
  colivingPgSubtitle,
  mapPropertiesToSrpCards,
} from "@/src/lib/map-property";
import type { SrpPageConfig } from "@/src/lib/srp/resolve-srp-page";
import type { Property } from "@/src/models/property";
import type { SrpQuery } from "@/src/models/srp-query";
import { resolveSrpHeroImageAssets, resolveSrpHeroImageSrc } from "@/src/lib/srp/srp-hero-image";
import { useSrpFilters } from "@/src/lib/srp/use-srp-filters";
import { useSrpPagination } from "@/src/lib/srp/use-srp-pagination";
import { cn } from "@/src/lib/cn";
import { getCityLabel } from "@/src/tokens/cities";
import { pageLayout } from "@/src/tokens/layout";
import type { CitySlug } from "@/src/tokens/cities";
import {
  localityAmenities,
  localityDayFromHereTitle,
} from "@/src/tokens/locality";

const EMPTY_SRP_QUERY: SrpQuery = {};

function resolvePropertyCoords(property: Property): {
  latitude: number;
  longitude: number;
} | null {
  const latitude = Number(property.address?.latitude ?? property.latitude);
  const longitude = Number(property.address?.longitude ?? property.longitude);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !latitude ||
    !longitude
  ) {
    return null;
  }
  return { latitude, longitude };
}

function resolveSrpNearbyMap(
  config: SrpPageConfig,
  heroImageSrc?: string,
): { property: NearbyMapProperty; mapUrl?: string } {
  const cityLabel = getCityLabel(config.city as CitySlug) || config.city;
  const locality = config.localityName?.trim() || undefined;
  const name = locality || cityLabel;
  const addressLine = [locality, cityLabel].filter(Boolean).join(", ");

  const anchor =
    config.properties.find((property) => resolvePropertyCoords(property)) ??
    config.properties[0];
  const propertyCoords = anchor ? resolvePropertyCoords(anchor) : null;
  const coords = config.nearbyMapCenter ?? propertyCoords;
  const startingRent =
    typeof anchor?.min_rent === "number" && anchor.min_rent > 0
      ? anchor.min_rent
      : undefined;
  const imageSrc =
    heroImageSrc ||
    config.heroImageSrc ||
    anchor?.image ||
    anchor?.hdp_image ||
    undefined;

  const mapUrl =
    anchor?.map_url?.trim() ||
    (coords
      ? `https://www.google.com/maps/place/${coords.latitude},${coords.longitude}`
      : addressLine
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`
        : undefined);

  return {
    property: {
      name,
      addressLine,
      locality,
      imageSrc,
      startingRent,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    },
    mapUrl,
  };
}

function SrpHero({
  config,
  heroImageSrc,
  title,
  subtitle,
}: {
  config: SrpPageConfig;
  heroImageSrc?: string;
  title: string;
  subtitle: string;
}) {
  const heroAssets = resolveSrpHeroImageAssets(config, heroImageSrc);

  return (
    <LocalityBentoHero
      title={title}
      subtitle={subtitle}
      heroImageSrc={heroAssets?.src}
      heroImageWebpSrc={heroAssets?.webpSrc}
      heroImageAlt={title}
      breadcrumbItems={config.breadcrumbItems}
      bentoTiles={config.bentoTiles}
    />
  );
}

function hasSrpHeroMedia(config: SrpPageConfig, heroImageSrc?: string) {
  return Boolean(
    resolveSrpHeroImageSrc(config, heroImageSrc) ||
      (config.bentoTiles && config.bentoTiles.length > 0),
  );
}

function SrpAboutSection({ config }: { config: SrpPageConfig }) {
  return (
    <section aria-label="About" className="space-y-6">
      <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
        {config.aboutTitle}
      </h2>
      <p className="text-base leading-7 text-gray-600">{config.aboutText}</p>
    </section>
  );
}

function RelatedLandmarkLinks({
  links,
}: {
  links: SrpPageConfig["relatedLandmarkLinks"];
}) {
  if (links.length === 0) return null;

  return (
    <section aria-label="Explore nearby landmarks" className="space-y-5">
      <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
        Explore nearby landmarks
      </h2>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((item) => (
          <li key={item.href} className="min-w-0">
            <Link
              href={item.href}
              prefetch={false}
              className="block truncate text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SrpPageContent({ config }: { config: SrpPageConfig }) {
  const [mobileTab, setMobileTab] = useState<LocalityMobileTab>("properties");
  const [desktopSection, setDesktopSection] =
    useState<"properties" | "details">("properties");
  const listingsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const paginationContext = useMemo(
    () => ({
      kind: config.kind,
      city: config.city,
      localitySlug: config.localitySlug,
      landmarkSlug: config.landmarkSlug,
      slugGender: config.slugGender,
    }),
    [
      config.kind,
      config.city,
      config.localitySlug,
      config.landmarkSlug,
      config.slugGender,
    ],
  );

  const { query, setQuery } = useSrpFilters();
  const isCityPage = config.kind === "city";
  const activeQuery = isCityPage ? query : EMPTY_SRP_QUERY;

  const {
    properties,
    total,
    isLoading,
    isRefreshing,
    sentinelRef,
  } = useSrpPagination(
    config.properties,
    config.total,
    paginationContext,
    config.canonicalPath,
    activeQuery,
    {
      // Pause infinite scroll while jumping to / viewing locality details so
      // the listings sentinel passing through the viewport does not paginate.
      enabled: mobileTab === "properties" && desktopSection === "properties",
    },
  );

  const heroSubtitle = useMemo(
    () =>
      config.heroSubtitle.replace(
        /\|\s*\d+\s+Propert(?:y|ies)\b/i,
        `| ${total} ${total === 1 ? "Property" : "Properties"}`,
      ),
    [config.heroSubtitle, total],
  );

  const heroTitle = useMemo(() => {
    const countHeading = config.propertiesHeading.replace(/^\d+/, String(total));
    const suffixIndex = config.pageTitle.indexOf(" | ");
    if (suffixIndex >= 0) {
      return `${countHeading}${config.pageTitle.slice(suffixIndex)}`;
    }
    return countHeading;
  }, [config.pageTitle, config.propertiesHeading, total]);

  const subtitleBuilder = (property: (typeof properties)[number]) => {
    if (config.kind === "landmark") {
      return `Coliving PG near ${config.localityName ?? getCityLabel(config.city)}`;
    }
    // Prefer each property's locality so city SRPs don't show the city slug.
    return colivingPgSubtitle(
      property,
      config.localityName ?? getCityLabel(config.city),
      config.city,
    );
  };

  const cardProperties = mapPropertiesToSrpCards(properties, subtitleBuilder, {
    city: config.city,
    // Only pin page locality on locality pages; city pages use each property.
    locality: config.kind === "city" ? undefined : config.localityName,
  });

  const contactLocation = config.localityName ?? config.city;
  const dayFromHereLocation =
    config.localityName ?? getCityLabel(config.city);
  const dayFromHereItems = config.dayFromHereItems ?? [];
  const dayFromHereSubtitle = `What living at ${dayFromHereLocation} actually looks like.`;
  const nearbyMap = useMemo(
    () => resolveSrpNearbyMap(config),
    [config],
  );
  const hasAbout = Boolean(config.aboutText?.trim());
  const hasLandmarks = config.relatedLandmarkLinks.length > 0;
  const hasDetails =
    dayFromHereItems.length > 0 ||
    localityAmenities.length > 0 ||
    hasAbout ||
    hasLandmarks;
  const hasProperties = total > 0 || properties.length > 0;
  const showSectionToggle = hasProperties && hasDetails;
  const mobileTabs = [
    { id: "properties" as const, label: "Coliving PGs" },
    ...(hasDetails
      ? [{ id: "details" as const, label: "Locality Details" }]
      : []),
  ];
  const contactCardProps = {
    city: config.city,
    location: contactLocation,
    locationEditable: config.kind === "city",
  };

  function showDetails() {
    flushSync(() => {
      setMobileTab("details");
      setDesktopSection("details");
    });
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showProperties() {
    flushSync(() => {
      setMobileTab("properties");
      setDesktopSection("properties");
    });
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Keep the floating desktop toggle label in sync with which section is in view
  // (same IntersectionObserver band as HdpSectionNav).
  useEffect(() => {
    if (!showSectionToggle) return;

    const sections: {
      el: HTMLElement;
      id: "properties" | "details";
    }[] = [];
    if (listingsRef.current) {
      sections.push({ el: listingsRef.current, id: "properties" });
    }
    if (detailsRef.current) {
      sections.push({ el: detailsRef.current, id: "details" });
    }
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = sections.find((section) => section.el === visible.target);
        if (match) setDesktopSection(match.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [showSectionToggle]);

  return (
    <PropertyActionsProvider
      defaultCity={config.city}
      defaultLocation={config.localityName ?? config.city}
    >
    <div
      className={cn(
        "bg-white",
        pageLayout.mobileStickyBottomPadding,
        showSectionToggle && "md:pb-24",
      )}
    >
      <JsonLd schema={config.schema} />
      <SiteHeaderSearch
        city={config.city as CitySlug}
        defaultLocality={
          config.kind === "locality" ? config.localityName : undefined
        }
        srpSlug={config.canonicalPath}
        navigateOnCityChange
      />

      <main className={cn(pageLayout.container, "pt-0 lg:pt-8 pb-10")}>
        <Breadcrumbs
          items={config.breadcrumbItems}
          className="mb-4 hidden md:mb-6 lg:block"
        />
        <SrpHero config={config} title={heroTitle} subtitle={heroSubtitle} />

        <div
          className={cn(
            hasSrpHeroMedia(config)
              ? "mt-8 md:mt-12"
              : "mt-4 md:mt-6",
          )}
        >
          <LocalityMobileTabs
            value={mobileTab}
            onChange={setMobileTab}
            tabs={mobileTabs}
            className="mb-4"
          />

          <div
            ref={listingsRef}
            className={cn(
              mobileTab === "properties" ? "block" : "hidden md:block",
            )}
          >
            <SrpListingsSection
              properties={cardProperties}
              isLoadingMore={isLoading}
              isRefreshing={isRefreshing}
              loadMoreRef={sentinelRef}
              filterQuery={query}
              onFilterChange={setQuery}
              slugGender={config.slugGender}
              showFilters={isCityPage}
            />
          </div>

          <div
            ref={detailsRef}
            className={cn(
              // On mobile only one tab panel shows, so skip the large top gap.
              "mt-0 md:mt-16",
              mobileTab === "details" ? "block" : "hidden md:block",
            )}
          >
            <div className={pageLayout.twoColumn}>
              <div className={cn(pageLayout.mainColumn, "space-y-10 md:space-y-12")}>
                {dayFromHereItems.length > 0 ? (
                  <LocalityDayFromHereSection
                    title={localityDayFromHereTitle}
                    subtitle={dayFromHereSubtitle}
                    items={dayFromHereItems}
                    mapUrl={nearbyMap.mapUrl}
                    property={nearbyMap.property}
                  />
                ) : null}
                <LocalityAmenitiesSection amenities={localityAmenities} />
                {hasAbout ? <SrpAboutSection config={config} /> : null}
                <RelatedLandmarkLinks links={config.relatedLandmarkLinks} />
              </div>
              <div className={pageLayout.sidebarColumn}>
                <LocalityContactCard sticky {...contactCardProps} />
              </div>
            </div>
          </div>

          <div className="mt-12 md:hidden">
            <LocalityContactCard {...contactCardProps} />
          </div>

          {config.popularLocalities.length > 0 ? (
            <SrpPopularLocalities
              className="mt-12 md:mt-16"
              city={config.city}
              canonicalPath={config.canonicalPath}
              localityLinks={config.popularLocalities}
              properties={properties}
            />
          ) : null}

          {!config.hideFaqSection ? (
            <div className="mt-12 md:mt-16">
              <SrpFaq items={config.faqs} />
            </div>
          ) : null}

          <SrpLocalitySeoLinks config={config} className="mt-12 md:mt-16" />
        </div>
      </main>

      <SiteFooter />
      {hasDetails && !isCityPage ? (
        <LocalityMobileActions
          activeTab={mobileTab}
          onShowDetails={showDetails}
          onShowProperties={showProperties}
        />
      ) : null}
      {showSectionToggle ? (
        <SrpSectionToggle
          activeSection={desktopSection}
          onShowDetails={showDetails}
          onShowProperties={showProperties}
        />
      ) : null}
    </div>
    </PropertyActionsProvider>
  );
}
