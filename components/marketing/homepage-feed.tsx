"use client";

import { useEffect, useRef, useState } from "react";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { MomentsCarouselControls } from "@/components/marketing/moments-carousel-controls";
import { MomentCard } from "@/components/marketing/moment-card";
import {
  getMomentsCarouselState,
  getMomentsPageStartIndex,
} from "@/src/lib/moments-carousel";
import type { GalleryMediaItem } from "@/src/models/gallery";
import { homepageFeedMoments } from "@/src/tokens/homepage";
import { pageShell } from "@/src/tokens/layout";

const CARD_GAP_PX = 16;
const MOBILE_MOMENT_LIMIT = 10;
const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

export function HomepageFeed({
  moments = homepageFeedMoments,
}: {
  moments?: readonly GalleryMediaItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isMobile, setIsMobile] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

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
  }, [visibleMoments]);

  if (visibleMoments.length === 0) return null;

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
    <section className="py-12 sm:py-16 lg:py-20">
      <div className={pageShell.homepage}>
        <HomepageSectionHeading
          prefix="Straight from the"
          highlight="Feed!"
          gradient="home"
          className="text-center"
        />
        <div
          ref={scrollRef}
          className="mt-8 flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 snap-x snap-mandatory scrollbar-none"
        >
          {visibleMoments.map((item) => (
            <MomentCard
              key={item.id}
              item={item}
              playWithAudio
              isActivePlaying={playingId === item.id}
              onPlayingChange={(playing) =>
                setPlayingId(playing ? item.id : null)
              }
            />
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
