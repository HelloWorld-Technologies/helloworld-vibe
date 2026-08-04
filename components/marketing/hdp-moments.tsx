"use client";

import { useEffect, useRef, useState } from "react";
import { MomentsCarouselControls } from "@/components/marketing/moments-carousel-controls";
import { MomentCard } from "@/components/marketing/moment-card";
import { cn } from "@/src/lib/cn";
import type { GalleryMediaItem } from "@/src/models/gallery";

const CARD_GAP_PX = 16;

function getVisibleCount(container: HTMLElement): number {
  const first = container.children[0] as HTMLElement | undefined;
  if (!first) return 1;
  const cardWidth = first.getBoundingClientRect().width;
  if (cardWidth <= 0) return 1;
  return Math.max(
    1,
    Math.floor((container.clientWidth + CARD_GAP_PX) / (cardWidth + CARD_GAP_PX)),
  );
}

function getPageStartIndex(container: HTMLElement, page: number): number {
  const visible = getVisibleCount(container);
  return Math.min(page * visible, Math.max(0, container.children.length - 1));
}

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

    setCanScrollPrev(node.scrollLeft > 4);
    setCanScrollNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);

    const cards = Array.from(node.children) as HTMLElement[];
    if (cards.length === 0) return;

    const visible = getVisibleCount(node);
    const pages = Math.max(1, Math.ceil(cards.length / visible));
    setPageCount(pages);

    const scrollLeft = node.scrollLeft;
    const cardIndex = cards.findIndex((card, index) => {
      const nextCard = cards[index + 1];
      if (!nextCard) return true;
      return scrollLeft < nextCard.offsetLeft - node.offsetLeft - CARD_GAP_PX;
    });
    const safeIndex = cardIndex === -1 ? 0 : cardIndex;
    setActivePage(Math.min(pages - 1, Math.floor(safeIndex / visible)));
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
    const cardIndex = getPageStartIndex(container, nextPage);
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
        className="text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem] sm:leading-9"
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
