"use client";

import type { RefObject, UIEventHandler } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { Modal, ModalDescription, ModalTitle } from "@/components/ui/modal";
import { cn } from "@/src/lib/cn";
import { useAnimateOnView } from "@/src/lib/use-animate-on-view";
import {
  homepageReviews,
  type HomepageReview,
} from "@/src/tokens/reviews";

export type HomepageReviewsProps = {
  reviews?: HomepageReview[];
  className?: string;
  title?: string;
  animate?: boolean;
  surface?: "dark" | "light";
  scrollRef?: RefObject<HTMLDivElement | null>;
  onScroll?: UIEventHandler<HTMLDivElement>;
};

const CARD_ANIMATION_MS = 700;
const STAGGER_MS = 120;

function TapeStrip() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-10 h-7 w-[4.5rem] -translate-x-1/2 -translate-y-[40%] rounded-[1px] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
      style={{
        background: "linear-gradient(180deg, #f8efc4 0%, #e6d07a 100%)",
      }}
    />
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="10" r="10" fill="#FF4500" />
      <circle cx="10" cy="11.25" r="5.25" fill="white" />
      <circle cx="7.75" cy="10.75" r="1" fill="#FF4500" />
      <circle cx="12.25" cy="10.75" r="1" fill="#FF4500" />
      <path
        d="M7.5 13.1c.7.55 1.55.85 2.5.85s1.8-.3 2.5-.85"
        stroke="#FF4500"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="14.75" cy="7.5" r="1.35" fill="white" />
      <path
        d="M12.6 5.1c.15.85.7 1.55 1.45 1.9"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="12.35" cy="4.35" r="1" fill="white" />
    </svg>
  );
}

function ReviewCard({
  review,
  index,
  isActive,
  shouldAnimate,
}: {
  review: HomepageReview;
  index: number;
  isActive: boolean;
  shouldAnimate: boolean;
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
      // line-clamp makes scrollHeight === clientHeight in some browsers;
      // compare against an unconstrained clone instead.
      const clone = el.cloneNode(true) as HTMLParagraphElement;
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.pointerEvents = "none";
      clone.style.height = "auto";
      clone.style.maxHeight = "none";
      clone.style.webkitLineClamp = "unset";
      clone.style.display = "block";
      clone.style.width = `${el.clientWidth}px`;
      clone.className = el.className.replace(/line-clamp-\[[^\]]+\]/g, "");
      el.parentElement?.appendChild(clone);
      const fullHeight = clone.scrollHeight;
      clone.remove();
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 20;
      const maxVisible = lineHeight * 9;
      setOverflows(fullHeight > maxVisible + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [review.quote]);

  return (
    <>
      <div
        className={cn(
          "shrink-0 transition-[opacity,transform] ease-out motion-reduce:transition-none",
          isActive
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0",
        )}
        style={{
          transitionDuration: `${CARD_ANIMATION_MS}ms`,
          transitionDelay:
            shouldAnimate && isActive ? `${index * STAGGER_MS}ms` : "0ms",
        }}
      >
        <div style={{ transform: `rotate(${review.rotation}deg)` }}>
          <article
            className={cn(
              "relative h-72 w-[min(18rem,calc(100vw-3rem))] overflow-visible shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:h-80 sm:w-80",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.16)]",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
            style={{ backgroundColor: review.backgroundColor }}
          >
            <TapeStrip />
            <div className="flex h-full flex-col justify-between gap-3 p-6 pt-9 sm:p-8 sm:pt-10">
              <div className="flex min-h-0 flex-1 flex-col">
                <p
                  ref={quoteRef}
                  className="line-clamp-[9] text-sm font-normal leading-5 text-[#1e2939]"
                >
                  {review.quote}
                </p>
                {overflows ? (
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mt-1.5 shrink-0 self-start text-sm font-semibold text-[#364153] underline-offset-2 hover:text-[#101828] hover:underline"
                  >
                    Show more
                  </button>
                ) : null}
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold leading-6 text-[#101828]">
                    {review.name}
                  </p>
                  <p className="text-xs font-normal leading-[18px] text-[#364153]">
                    {review.city}
                  </p>
                </div>
                {review.redditUrl ? (
                  <a
                    href={review.redditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${review.name}'s review on Reddit`}
                    className="shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4500]"
                  >
                    <RedditIcon className="size-5" />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        describedBy={descriptionId}
        closeLabel={`Close ${review.name}'s review`}
        maxWidthClassName="md:max-w-md"
      >
        <ModalTitle id={titleId}>{review.name}</ModalTitle>
        <ModalDescription
          id={descriptionId}
          className="mt-3 text-sm leading-6 text-gray-600"
        >
          {review.quote}
        </ModalDescription>
      </Modal>
    </>
  );
}

export function HomepageReviews({
  reviews = homepageReviews,
  className,
  title = "Homepage Reviews",
  animate = true,
  surface = "dark",
  scrollRef,
  onScroll,
}: HomepageReviewsProps) {
  const { ref, isActive, shouldAnimate } = useAnimateOnView(animate);
  const isLight = surface === "light";

  return (
    <section
      ref={ref}
      className={cn(
        isLight ? "bg-white" : "bg-[#3d3d3d]",
        "px-4 py-10 sm:py-12 md:px-8",
        className,
      )}
    >
      {title ? (
        <h2
          className={cn(
            "mb-6 text-base font-medium sm:mb-8 sm:text-lg",
            isLight ? "text-gray-700" : "text-gray-300",
            shouldAnimate &&
              "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
            shouldAnimate &&
              (isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"),
          )}
        >
          {title}
        </h2>
      ) : null}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="-mx-2 flex gap-4 overflow-x-auto px-2 py-6 scrollbar-none sm:gap-5 sm:py-8 md:gap-6"
      >
        {reviews.map((review, index) => (
          <ReviewCard
            key={`${review.name}-${review.city}-${index}`}
            review={review}
            index={index}
            isActive={isActive}
            shouldAnimate={shouldAnimate}
          />
        ))}
      </div>
    </section>
  );
}
