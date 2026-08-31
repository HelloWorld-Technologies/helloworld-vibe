"use client";

import { useEffect, useRef, useState } from "react";
import { CommunitySectionTitle } from "@/components/marketing/community-headings";
import {
  LocalityCarouselButton,
  LocalityPaginationDots,
} from "@/components/marketing/locality-card";
import { TenantReviewCard } from "@/components/marketing/tenant-review-card";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";
import {
  homepageReviews,
  type HomepageReview,
} from "@/src/tokens/reviews";

const VISIBLE_DESKTOP_COUNT = 4;

type DesktopMetrics = {
  step: number;
  itemWidth: number;
};

function measureDesktopTrack(
  viewport: HTMLElement,
  track: HTMLElement,
  visibleDesktopCount: number,
): DesktopMetrics {
  const viewportWidth = viewport.clientWidth;
  if (!viewportWidth) return { step: 0, itemWidth: 0 };

  const styles = getComputedStyle(track);
  const gap =
    Number.parseFloat(styles.columnGap) || Number.parseFloat(styles.gap) || 0;
  const itemWidth =
    (viewportWidth - gap * Math.max(0, visibleDesktopCount - 1)) /
    visibleDesktopCount;
  const step = itemWidth + gap;

  return { step, itemWidth };
}

export function CommunityReviews({
  reviews = homepageReviews,
  className,
}: {
  reviews?: HomepageReview[];
  className?: string;
}) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [desktopMetrics, setDesktopMetrics] = useState<DesktopMetrics>({
    step: 0,
    itemWidth: 0,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const desktopViewportRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);

  const count = reviews.length;
  const desktopPageCount =
    count === 0 ? 0 : Math.ceil(count / VISIBLE_DESKTOP_COUNT);

  useEffect(() => {
    const viewport = desktopViewportRef.current;
    const track = desktopTrackRef.current;
    if (!viewport || !track || count === 0) return;

    const updateMetrics = () => {
      setDesktopMetrics(
        measureDesktopTrack(viewport, track, VISIBLE_DESKTOP_COUNT),
      );
    };

    updateMetrics();

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [count, reviews]);

  function goToMobileIndex(index: number) {
    const nextIndex = Math.max(0, Math.min(index, count - 1));
    setMobileIndex(nextIndex);
    const container = scrollRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-community-review-slide]"),
    );
    const card = cards[nextIndex];
    if (!card) return;
    const paddingLeft =
      Number.parseFloat(getComputedStyle(container).paddingLeft) || 0;
    container.scrollTo({
      left: Math.max(0, card.offsetLeft - paddingLeft),
      behavior: "smooth",
    });
  }

  function handleMobileScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-community-review-slide]"),
    );
    if (cards.length === 0) return;

    const paddingLeft =
      Number.parseFloat(getComputedStyle(container).paddingLeft) || 0;
    const scrollLeft = container.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - paddingLeft - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setMobileIndex(closestIndex);
  }

  if (count === 0) return null;

  const showDesktopNav = desktopPageCount > 1;
  const showMobilePagination = count > 1;

  return (
    <section className={cn("bg-white", className)} aria-label="What our tenants say">
      <div className={pageShell.community}>
        <CommunitySectionTitle>What Our Tenants Say</CommunitySectionTitle>

        <div className="mt-8 hidden lg:block">
          <div ref={desktopViewportRef} className="w-full overflow-hidden">
            <div
              ref={desktopTrackRef}
              className="flex gap-6 transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={
                desktopMetrics.step > 0
                  ? {
                      transform: `translateX(-${
                        desktopIndex * VISIBLE_DESKTOP_COUNT * desktopMetrics.step
                      }px)`,
                    }
                  : undefined
              }
            >
              {reviews.map((review, index) => (
                <div
                  key={`${review.name}-${review.city}-${index}`}
                  className="shrink-0"
                  style={
                    desktopMetrics.itemWidth > 0
                      ? { width: desktopMetrics.itemWidth }
                      : undefined
                  }
                >
                  <TenantReviewCard
                    name={review.name}
                    quote={review.quote}
                  />
                </div>
              ))}
            </div>
          </div>

          {showDesktopNav ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <LocalityCarouselButton
                direction="prev"
                label="Previous reviews"
                disabled={desktopIndex === 0}
                onClick={() => setDesktopIndex((index) => Math.max(0, index - 1))}
              />
              <LocalityCarouselButton
                direction="next"
                label="Next reviews"
                disabled={desktopIndex >= desktopPageCount - 1}
                onClick={() =>
                  setDesktopIndex((index) =>
                    Math.min(desktopPageCount - 1, index + 1),
                  )
                }
              />
            </div>
          ) : null}
        </div>

        <div className="mt-8 lg:hidden">
          <div
            ref={scrollRef}
            onScroll={handleMobileScroll}
            className={cn(
              "flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain pb-2",
              "snap-x snap-mandatory scroll-smooth scrollbar-none",
              "-mx-4 px-4 scroll-px-4",
            )}
          >
            {reviews.map((review, index) => (
              <div
                key={`${review.name}-${review.city}-${index}`}
                data-community-review-slide
                className="w-[min(18.8125rem,85vw)] shrink-0 snap-start"
              >
                <TenantReviewCard
                  name={review.name}
                  quote={review.quote}
                />
              </div>
            ))}
          </div>

          {showMobilePagination ? (
            <div className="mt-6">
              <LocalityPaginationDots
                count={count}
                activeIndex={mobileIndex}
                onSelect={goToMobileIndex}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
