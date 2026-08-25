"use client";

import { useEffect, useRef, useState } from "react";
import { MomentsCarouselControls } from "@/components/marketing/moments-carousel-controls";
import { MomentCard } from "@/components/marketing/moment-card";
import { cn } from "@/src/lib/cn";
import {
  getMomentsCarouselState,
  getMomentsPageStartIndex,
} from "@/src/lib/moments-carousel";
import type { GalleryMediaItem } from "@/src/models/gallery";

const CARD_GAP_PX = 16;

export function HdpMoments({
  displayName,
  moments,
  className,
}: {
  displayName: string;
  moments: readonly GalleryMediaItem[];
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  function updateScrollState() {
    const node = scrollRef.current;
    if (!node) return;

    const state = getMomentsCarouselState(node, CARD_GAP_PX);
    setCanScrollPrev(state.canScrollPrev);
    setCanScrollNext(state.canScrollNext);
    setPageCount(state.pageCount);
    setActivePage(state.activePage);
  }

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [moments]);

  if (moments.length === 0) return null;

  function goToPage(page: number) {
    const container = scrollRef.current;
    if (!container) return;
    const nextPage = Math.max(0, Math.min(page, pageCount - 1));
    const cardIndex = getMomentsPageStartIndex(container, nextPage, CARD_GAP_PX);
    const card = container.children[cardIndex] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
    setActivePage(nextPage);
  }

  return (
    <section
      id="hdp-moments"
      className={cn("scroll-mt-32", className)}
      aria-labelledby="hdp-moments-heading"
    >
      <h2
        id="hdp-moments-heading"
        className="text-2xl font-medium tracking-tight text-gray-900 sm:text-[1.75rem] sm:leading-9"
      >
        <span className="font-satoshi font-bold italic text-gradient-vibe">
          Moments
        </span>{" "}
        at {displayName}
      </h2>

      <div
        ref={scrollRef}
        className="mt-5 flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 snap-x snap-mandatory scrollbar-none"
      >
        {moments.map((item) => (
          <MomentCard key={item.id} item={item} />
        ))}
      </div>

      {pageCount > 1 ? (
        <MomentsCarouselControls
          className="mt-5"
          count={pageCount}
          activeIndex={activePage}
          onPrev={() => goToPage(activePage - 1)}
          onNext={() => goToPage(activePage + 1)}
          onSelect={goToPage}
          prevDisabled={!canScrollPrev}
          nextDisabled={!canScrollNext}
        />
      ) : null}
    </section>
  );
}
