"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdaptiveImage } from "@/components/media/adaptive-image";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import { fetchAllProperty } from "@/src/apis/srp";
import {
  campaignPropertySubtitle,
  mapPropertyToSrpCard,
} from "@/src/lib/map-property";
import {
  getMomentsCarouselState,
  getMomentsPageStartIndex,
} from "@/src/lib/moments-carousel";
import type { CampaignCitySlug } from "@/src/constants/campaign-prices";
import { campaignContactBannerImage, getCampaignCityApiSlug } from "@/src/tokens/campaign";
import type { Property } from "@/src/models/property";
import { footerContact } from "@/src/tokens/footer";

function measureCarouselGap(container: HTMLElement): number {
  const styles = getComputedStyle(container);
  return (
    Number.parseFloat(styles.columnGap) ||
    Number.parseFloat(styles.gap) ||
    16
  );
}

export function CampaignProperties({
  citySlug,
  titlePrefix,
  titleHighlight,
  offset = 0,
  limit = 6,
  onRequestCallback,
}: {
  citySlug: CampaignCitySlug;
  titlePrefix: string;
  titleHighlight: string;
  offset?: number;
  limit?: number;
  onRequestCallback?: () => void;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, success } = await fetchAllProperty(
        {
          city: getCampaignCityApiSlug(citySlug),
          localityName: "",
          filter: {
            gender: "",
            price: { minPrice: undefined, maxPrice: undefined },
            amenities: [],
            food: false,
          },
          sorting: undefined,
          campaign: "ok",
        },
        { page: 1, page_size: 32 },
      );
      if (!cancelled && success) {
        setProperties(data);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [citySlug]);

  const cards = useMemo(
    () =>
      properties
        .slice(offset, offset + limit)
        .map((property) =>
          mapPropertyToSrpCard(
            property,
            campaignPropertySubtitle(property, citySlug),
          ),
        ),
    [properties, offset, limit, citySlug],
  );

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const state = getMomentsCarouselState(
      container,
      measureCarouselGap(container),
    );
    setCanScrollPrev(state.canScrollPrev);
    setCanScrollNext(state.canScrollNext);
    setPageCount(state.pageCount);
    setActivePage(state.activePage);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, cards.length]);

  function goToPage(page: number) {
    const container = scrollRef.current;
    if (!container) return;
    const nextPage = Math.max(0, Math.min(page, pageCount - 1));
    const gap = measureCarouselGap(container);
    const cardIndex = getMomentsPageStartIndex(container, nextPage, gap);
    const card = container.children[cardIndex] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
    setActivePage(nextPage);
  }

  function scrollBy(direction: "prev" | "next") {
    goToPage(activePage + (direction === "next" ? 1 : -1));
  }

  if (!cards.length) return null;

  return (
    <section className="py-10 md:py-14">
      <HomepageSectionHeading
        prefix={titlePrefix}
        highlight={titleHighlight}
        gradient="home"
        size="properties"
      />
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="mt-8 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
      >
        {cards.map((property, index) => (
          <WishlistSrpCard
            key={property.propertyId}
            propertyId={property.propertyId}
            href={property.href}
            name={property.name}
            subtitle={property.subtitle}
            images={property.images}
            rating={property.rating}
            roomTypes={property.roomTypes}
            rent={property.rent}
            originalRent={property.originalRent}
            offerLabel={property.offerLabel}
            statusLabel={property.statusLabel}
            visitsToday={property.visitsToday}
            genderLabel={property.genderLabel}
            vibeMatchScore={property.vibeMatchScore}
            imagePriority={index < 2}
            className="w-[min(100%,22rem)] shrink-0 md:w-[calc((100%-1.5rem)/1.5)]"
            onRequestCallback={onRequestCallback}
          />
        ))}
      </div>
      <HomepageCarouselNav
        className="mt-6"
        onPrev={() => scrollBy("prev")}
        onNext={() => scrollBy("next")}
        prevDisabled={!canScrollPrev}
        nextDisabled={!canScrollNext}
        pageCount={pageCount}
        activeIndex={activePage}
        onSelectPage={goToPage}
      />
    </section>
  );
}

export function CampaignContactBanner() {
  return (
    <section className="my-10 md:my-14">
      <div
        className="flex flex-col items-center justify-between gap-6 rounded-2xl px-6 py-8 md:flex-row md:px-8"
        style={{
          backgroundImage:
            "linear-gradient(240deg, rgb(213, 236, 249) 67.5%, rgb(255, 255, 255) 107%)",
        }}
      >
        <div className="flex-1">
          <h2 className="font-satoshi text-2xl font-bold leading-8 text-gray-800 md:text-[30px] md:leading-[38px]">
            New City? No Stress.
          </h2>
          <p className="mt-2 font-satoshi text-sm font-medium leading-5 text-gray-600 md:text-lg">
            Give a Call to us, & We will help you find your home!
          </p>
          <Link
            href={footerContact.phoneHref}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-hello-lime-400 px-[18px] py-2.5 text-base font-semibold text-gray-900 shadow-sm hover:bg-hello-lime-500"
          >
            <svg
              aria-hidden="true"
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              className="size-3.5 shrink-0"
            >
              <path
                d="M12.432 9.74421C11.5245 9.02084 10.6036 8.58267 9.70727 9.30494L9.17206 9.74148C8.78047 10.0584 8.0524 11.539 5.23742 8.52094C2.42302 5.50673 4.09783 5.03742 4.49 4.72326L5.02814 4.28619C5.91977 3.56227 5.58328 2.65096 4.94021 1.71288L4.55214 1.14468C3.90614 0.208785 3.20268 -0.405858 2.30871 0.316962L1.82567 0.710333C1.43057 0.97859 0.326148 1.85056 0.0582502 3.50709C-0.264165 5.49471 0.75291 7.7708 3.0831 10.2682C5.41035 12.7666 7.68895 14.0216 9.84738 13.9997C11.6412 13.9817 12.7245 13.0846 13.0633 12.7584L13.5481 12.3645C14.4397 11.6422 13.8858 10.9068 12.9777 10.1818L12.432 9.74421Z"
                fill="currentColor"
              />
            </svg>
            {footerContact.phone}
          </Link>
        </div>
        <div className="relative h-[180px] w-full md:h-[216px] md:w-[200px] md:shrink-0">
          <AdaptiveImage
            src={campaignContactBannerImage.src}
            webpSrc={campaignContactBannerImage.webpSrc}
            alt="Moving to a new city"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
