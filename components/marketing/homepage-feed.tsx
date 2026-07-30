"use client";

import { useEffect, useRef, useState } from "react";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { MomentsCarouselControls } from "@/components/marketing/moments-carousel-controls";
import { MomentCard } from "@/components/marketing/moment-card";
import type { GalleryMediaItem } from "@/src/models/gallery";
import { pageShell } from "@/src/tokens/layout";

const CARD_GAP_PX = 16;
const MOBILE_MOMENT_LIMIT = 10;
const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

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

export function HomepageFeed({
  moments = [],
}: {
  moments?: readonly GalleryMediaItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isMobile, setIsMobile] = useState(true);

  const visibleMoments = isMobile
    ? moments.slice(0, MOBILE_MOMENT_LIMIT)
    : moments;

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
  }, [visibleMoments]);

  if (visibleMoments.length === 0) return null;

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
    <section className="py-12 sm:py-16 lg:py-20">
      <div className={pageShell.homepage}>
        <div className="flex justify-center">
          <HomepageSectionHeading
            prefix="Straight from the"
            highlight="Feed!"
            gradient="home"
          />
        </div>
        <div
          ref={scrollRef}
          className="mt-8 flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 snap-x snap-mandatory scrollbar-none"
        >
          {visibleMoments.map((item) => (
            <MomentCard key={item.id} item={item} />
          ))}
        </div>
        {pageCount > 1 ? (
          <MomentsCarouselControls
            className="mt-8"
            count={pageCount}
            activeIndex={activePage}
            onPrev={() => goToPage(activePage - 1)}
            onNext={() => goToPage(activePage + 1)}
            onSelect={goToPage}
            prevDisabled={!canScrollPrev}
            nextDisabled={!canScrollNext}
          />
        ) : null}
      </div>
    </section>
  );
}
