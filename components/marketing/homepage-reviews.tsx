"use client";

import type { RefObject, UIEventHandler } from "react";
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
  return (
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
          <div className="flex h-full flex-col justify-between p-6 pt-9 sm:p-8 sm:pt-10">
            <p className="text-sm font-normal leading-5 text-[#1e2939]">
              {review.quote}
            </p>
            <div>
              <p className="text-base font-bold leading-6 text-[#101828]">
                {review.name}
              </p>
              <p className="text-xs font-normal leading-[18px] text-[#364153]">
                {review.city}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
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
            key={`${review.name}-${review.city}`}
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
