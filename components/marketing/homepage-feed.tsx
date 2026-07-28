"use client";

import { useEffect, useRef, useState } from "react";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { MomentsCarouselControls } from "@/components/marketing/moments-carousel-controls";
import {
  MomentCard,
  MOMENT_CARD_SCROLL_STEP_PX,
} from "@/components/marketing/moment-card";
import type { GalleryMediaItem } from "@/src/tokens/property-gallery";
import { pageShell } from "@/src/tokens/layout";

export function HomepageFeed({
  moments = [],
}: {
  moments?: readonly GalleryMediaItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateScrollState() {
    const node = scrollRef.current;
    if (!node) return;
    setCanScrollPrev(node.scrollLeft > 4);
    setCanScrollNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);

    const cards = Array.from(node.children) as HTMLElement[];
    if (cards.length === 0) return;

    const scrollLeft = node.scrollLeft;
    const nextIndex = cards.findIndex((card, index) => {
      const nextCard = cards[index + 1];
      if (!nextCard) return true;
      return scrollLeft < nextCard.offsetLeft - node.offsetLeft - 16;
    });
    setActiveIndex(nextIndex === -1 ? 0 : nextIndex);
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

  function scrollByDirection(direction: "prev" | "next") {
    scrollRef.current?.scrollBy({
      left:
        direction === "next"
          ? MOMENT_CARD_SCROLL_STEP_PX
          : -MOMENT_CARD_SCROLL_STEP_PX,
      behavior: "smooth",
    });
  }

  function goToIndex(index: number) {
    const container = scrollRef.current;
    const card = container?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
    setActiveIndex(index);
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
          className="mt-8 flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none"
        >
          {moments.map((item) => (
            <MomentCard key={item.id} item={item} />
          ))}
        </div>
        {moments.length > 1 ? (
          <MomentsCarouselControls
            className="mt-8"
            count={moments.length}
            activeIndex={activeIndex}
            onPrev={() => scrollByDirection("prev")}
            onNext={() => scrollByDirection("next")}
            onSelect={goToIndex}
            prevDisabled={!canScrollPrev}
            nextDisabled={!canScrollNext}
          />
        ) : null}
      </div>
    </section>
  );
}
