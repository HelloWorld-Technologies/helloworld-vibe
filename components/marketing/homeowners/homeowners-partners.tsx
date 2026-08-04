"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { cn } from "@/src/lib/cn";
import {
  homeownersPageCopy,
  homeownersPartnerLogo,
  homeownersPartners,
} from "@/src/tokens/homeowners";
import { pageLayout } from "@/src/tokens/layout";

function PartnerCard({
  partner,
  className,
}: {
  partner: (typeof homeownersPartners)[number];
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full min-h-[16rem] w-[min(17.5rem,80vw)] shrink-0 flex-col rounded-[1.25rem] border border-gray-200 bg-white p-5 shadow-[0_4px_16px_rgba(16,24,40,0.04)] sm:w-[18rem]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={partner.avatar}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
          <p className="truncate text-base font-bold text-gray-900">
            {partner.name}
          </p>
        </div>
        <Image
          src={homeownersPartnerLogo}
          alt=""
          width={22}
          height={22}
          className="mt-1 size-[1.375rem] shrink-0 object-contain"
        />
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-gray-600">
        {partner.quote}
      </p>
    </article>
  );
}

export function HomeownersPartners() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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
    const card = container.querySelector("article");
    const offset = (card?.clientWidth ?? 288) + 16;
    container.scrollBy({
      left: direction === "next" ? offset : -offset,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className={pageLayout.container}>
        <h2 className="text-center font-satoshi text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {homeownersPageCopy.partnersTitle}
        </h2>

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="mt-10 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {homeownersPartners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>

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
