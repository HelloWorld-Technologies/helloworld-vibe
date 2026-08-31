"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { HomepageReviews } from "@/components/marketing/homepage-reviews";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import {
  getMomentsCarouselState,
  getMomentsPageStartIndex,
} from "@/src/lib/moments-carousel";
import { pageLayout, pageShell } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";

function measureCarouselGap(container: HTMLElement): number {
  const styles = getComputedStyle(container);
  return (
    Number.parseFloat(styles.columnGap) ||
    Number.parseFloat(styles.gap) ||
    16
  );
}

export function HomepageTestimonials() {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, [updateScrollState]);

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

  return (
    <section className={cn("py-8 sm:py-12 lg:py-14", pageLayout.container)}>
      <div className={pageShell.homepage}>
        <HomepageSectionHeading
          prefix="Hear from our"
          highlight="Tribe!"
          gradient="home"
          className="text-center"
        />
      </div>
      <div className="mt-8">
        <HomepageReviews
          title=""
          surface="light"
          className="!px-0 !py-0"
          scrollRef={scrollRef}
          onScroll={updateScrollState}
        />
      </div>
      <div className={pageShell.homepage}>
        <HomepageCarouselNav
          className="mt-8"
          pageCount={pageCount}
          activeIndex={activePage}
          prevDisabled={!canScrollPrev}
          nextDisabled={!canScrollNext}
          onPrev={() => goToPage(activePage - 1)}
          onNext={() => goToPage(activePage + 1)}
          onSelectPage={goToPage}
        />
      </div>
    </section>
  );
}
