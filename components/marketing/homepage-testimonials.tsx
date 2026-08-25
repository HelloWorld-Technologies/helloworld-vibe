"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { HomepageReviews } from "@/components/marketing/homepage-reviews";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { pageLayout, pageShell } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";

export function HomepageTestimonials() {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollPrev(container.scrollLeft > 8);
    setCanScrollNext(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 8,
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  function scrollByCard(direction: "prev" | "next") {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector("article") as HTMLElement | null;
    const offset = (card?.offsetWidth ?? 320) + 24;
    container.scrollBy({
      left: direction === "next" ? offset : -offset,
      behavior: "smooth",
    });
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
          prevDisabled={!canScrollPrev}
          nextDisabled={!canScrollNext}
          onPrev={() => scrollByCard("prev")}
          onNext={() => scrollByCard("next")}
        />
      </div>
    </section>
  );
}
