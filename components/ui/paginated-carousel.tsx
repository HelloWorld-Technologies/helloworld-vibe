"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { HomepageCarouselPagination } from "@/components/marketing/homepage-carousel-pagination";
import { cn } from "@/src/lib/cn";

export type PaginatedCarouselProps<T> = {
  items: readonly T[];
  getItemKey: (item: T, index: number) => string;
  renderItem: (item: T, className: string, index: number) => ReactNode;
  visibleDesktopCount?: number;
  desktopItemClassName?: string;
  mobileItemClassName?: string;
  desktopTrackClassName?: string;
  mobileTrackClassName?: string;
  paginationClassName?: string;
  mobilePaginationClassName?: string;
  /** Gap offset (px) used when inferring the active slide from mobile scroll. */
  mobileScrollGap?: number;
  isLoading?: boolean;
  loadingSkeletonCount?: number;
  renderSkeleton?: (className: string, index: number) => ReactNode;
  placeholderPageCount?: number;
  emptyState?: ReactNode;
  resetKey?: string | number;
};

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

export function PaginatedCarousel<T>({
  items,
  getItemKey,
  renderItem,
  visibleDesktopCount = 3,
  desktopItemClassName,
  mobileItemClassName,
  desktopTrackClassName,
  mobileTrackClassName,
  paginationClassName,
  mobilePaginationClassName,
  mobileScrollGap: _mobileScrollGap = 16,
  isLoading = false,
  loadingSkeletonCount,
  renderSkeleton,
  placeholderPageCount = 6,
  emptyState = null,
  resetKey,
}: PaginatedCarouselProps<T>) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [desktopMetrics, setDesktopMetrics] = useState<DesktopMetrics>({
    step: 0,
    itemWidth: 0,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const desktopViewportRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const skeletonCount = loadingSkeletonCount ?? visibleDesktopCount;
  // One pagination "page" = one full set of visible desktop cards.
  const desktopPageCount =
    count === 0 ? 0 : Math.ceil(count / visibleDesktopCount);

  useEffect(() => {
    setMobileIndex(0);
    setDesktopIndex(0);
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ left: 0, behavior: "instant" });
  }, [resetKey, count]);

  useEffect(() => {
    const viewport = desktopViewportRef.current;
    const track = desktopTrackRef.current;
    if (!viewport || !track || isLoading || count === 0) return;

    const updateMetrics = () => {
      setDesktopMetrics(
        measureDesktopTrack(viewport, track, visibleDesktopCount),
      );
    };

    updateMetrics();

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [count, isLoading, items, visibleDesktopCount]);

  function goToMobileIndex(index: number) {
    const nextIndex = Math.max(0, Math.min(index, count - 1));
    setMobileIndex(nextIndex);
    const container = scrollRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-carousel-slide]"),
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
      container.querySelectorAll<HTMLElement>("[data-carousel-slide]"),
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

  function goToDesktopIndex(index: number) {
    setDesktopIndex(index);
  }

  if (isLoading && renderSkeleton) {
    return (
      <>
        <div
          className={cn(
            "hidden w-full gap-6 lg:flex",
            desktopTrackClassName,
          )}
        >
          {Array.from({ length: skeletonCount }, (_, index) => (
            <Fragment key={`skeleton-desktop-${index}`}>
              {renderSkeleton(
                cn(desktopItemClassName, "min-w-0 flex-1"),
                index,
              )}
            </Fragment>
          ))}
        </div>

        <div
          className={cn(
            "flex gap-4 overflow-x-auto pb-2 scrollbar-none lg:hidden",
            "-mx-4 px-4 scroll-px-4",
            mobileTrackClassName,
          )}
        >
          {Array.from({ length: skeletonCount }, (_, index) => (
            <Fragment key={`skeleton-mobile-${index}`}>
              {renderSkeleton(
                cn(
                  "shrink-0",
                  mobileItemClassName ?? "w-[min(21.375rem,85vw)]",
                ),
                index,
              )}
            </Fragment>
          ))}
        </div>

        <HomepageCarouselPagination
          className={cn("mt-6 lg:hidden", mobilePaginationClassName)}
          pageCount={placeholderPageCount}
          activeIndex={0}
          prevDisabled
          nextDisabled
          placeholder
          showArrows={false}
          activeTone="gray"
          onPrev={() => {}}
          onNext={() => {}}
        />
        <HomepageCarouselPagination
          className={cn("mt-8 hidden lg:flex", paginationClassName)}
          pageCount={placeholderPageCount}
          activeIndex={0}
          prevDisabled
          nextDisabled
          placeholder
          onPrev={() => {}}
          onNext={() => {}}
        />
      </>
    );
  }

  if (!isLoading && count === 0) {
    return emptyState;
  }

  const showDesktopPagination = desktopPageCount > 1;
  const showMobilePagination = count > 1;

  return (
    <>
      <div className={cn("hidden w-full lg:block", desktopTrackClassName)}>
        <div ref={desktopViewportRef} className="w-full overflow-hidden">
          <div
            ref={desktopTrackRef}
            className="flex gap-6 transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={
              desktopMetrics.step > 0
                ? {
                    transform: `translateX(-${
                      desktopIndex * visibleDesktopCount * desktopMetrics.step
                    }px)`,
                  }
                : undefined
            }
          >
            {items.map((item, index) => (
              <div
                key={getItemKey(item, index)}
                data-carousel-slide
                className="shrink-0"
                style={
                  desktopMetrics.itemWidth > 0
                    ? { width: desktopMetrics.itemWidth }
                    : undefined
                }
              >
                {renderItem(
                  item,
                  cn(desktopItemClassName, "w-full max-w-none"),
                  index,
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDesktopPagination ? (
        <HomepageCarouselPagination
          className={cn("hidden lg:flex", paginationClassName)}
          pageCount={desktopPageCount}
          activeIndex={desktopIndex}
          prevDisabled={desktopIndex === 0}
          nextDisabled={desktopIndex >= desktopPageCount - 1}
          onPrev={() => setDesktopIndex((index) => Math.max(0, index - 1))}
          onNext={() =>
            setDesktopIndex((index) =>
              Math.min(desktopPageCount - 1, index + 1),
            )
          }
          onSelectPage={goToDesktopIndex}
        />
      ) : null}

      <div className="lg:hidden">
        <div
          ref={scrollRef}
          onScroll={handleMobileScroll}
          className={cn(
            "flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain pb-2",
            "snap-x snap-mandatory scroll-smooth scrollbar-none",
            "-mx-4 px-4 scroll-px-4",
            mobileTrackClassName,
          )}
        >
          {items.map((item, index) => (
            <div
              key={getItemKey(item, index)}
              data-carousel-slide
              className={cn(
                "shrink-0 snap-start",
                mobileItemClassName ?? "w-[min(21.375rem,85vw)]",
              )}
            >
              {renderItem(item, "w-full max-w-none", index)}
            </div>
          ))}
        </div>

        {showMobilePagination ? (
          <HomepageCarouselPagination
            className={cn("mt-6", mobilePaginationClassName)}
            pageCount={count}
            activeIndex={mobileIndex}
            prevDisabled={mobileIndex === 0}
            nextDisabled={mobileIndex >= count - 1}
            showArrows={false}
            activeTone="gray"
            onPrev={() => goToMobileIndex(mobileIndex - 1)}
            onNext={() => goToMobileIndex(mobileIndex + 1)}
            onSelectPage={goToMobileIndex}
          />
        ) : null}
      </div>
    </>
  );
}
