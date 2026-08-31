"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { Modal, ModalDescription, ModalTitle } from "@/components/ui/modal";
import { cn } from "@/src/lib/cn";
import {
  getMomentsCarouselState,
  getMomentsPageStartIndex,
} from "@/src/lib/moments-carousel";
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
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const measure = () => {
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [partner.quote]);

  return (
    <>
      <article
        className={cn(
          "flex h-full min-h-[16rem] w-[min(17.5rem,80vw)] shrink-0 flex-col rounded-[1.25rem] border border-gray-200 bg-white p-5 shadow-[0_4px_16px_rgba(16,24,40,0.04)] sm:w-[18rem]",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-left text-base font-bold text-gray-900">
            {partner.name}
          </p>
          <Image
            src={homeownersPartnerLogo}
            alt=""
            width={22}
            height={22}
            className="size-[1.375rem] shrink-0 object-contain"
          />
        </div>
        <div className="mt-4 flex flex-1 flex-col">
          <p
            ref={quoteRef}
            className="line-clamp-4 text-sm leading-6 text-gray-600"
          >
            {partner.quote}
          </p>
          {overflows ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-2 self-start text-sm font-semibold text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
            >
              Show more
            </button>
          ) : null}
        </div>
      </article>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        describedBy={descriptionId}
        closeLabel={`Close ${partner.name}'s testimonial`}
        maxWidthClassName="md:max-w-md"
      >
        <ModalTitle id={titleId}>{partner.name}</ModalTitle>
        <ModalDescription
          id={descriptionId}
          className="mt-3 text-sm leading-6 text-gray-600"
        >
          {partner.quote}
        </ModalDescription>
      </Modal>
    </>
  );
}

function measureCarouselGap(container: HTMLElement): number {
  const styles = getComputedStyle(container);
  return (
    Number.parseFloat(styles.columnGap) ||
    Number.parseFloat(styles.gap) ||
    16
  );
}

export function HomeownersPartners() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

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
