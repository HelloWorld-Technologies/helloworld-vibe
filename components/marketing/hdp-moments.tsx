"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { cn } from "@/src/lib/cn";
import type { GalleryMediaItem } from "@/src/tokens/property-gallery";

const CARD_WIDTH_CLASS = "w-[16.5rem] sm:w-[18.5rem]";
const CARD_SCROLL_STEP_PX = 312;

function PlayIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 translate-x-0.5">
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </span>
    </span>
  );
}

function MomentCard({
  item,
  className,
}: {
  item: GalleryMediaItem;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasVideo = Boolean(item.videoSrc);
  const title = item.caption || item.label || "Moments";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (!isHovered) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {});
    }
  }, [hasVideo, isHovered, item.id]);

  return (
    <article
      className={cn(
        "relative aspect-3/4 shrink-0 overflow-hidden rounded-2xl bg-black",
        CARD_WIDTH_CLASS,
        className,
      )}
      onMouseEnter={() => hasVideo && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => hasVideo && setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0",
            )}
            src={item.videoSrc}
            poster={item.imageSrc}
            muted
            playsInline
            loop
            preload="metadata"
          />
          <Image
            src={item.imageSrc}
            alt={title}
            fill
            className={cn(
              "object-cover transition-opacity duration-200",
              isHovered ? "opacity-0" : "opacity-100",
            )}
            sizes="(max-width: 640px) 70vw, 296px"
          />
          {!isHovered ? <PlayIcon /> : null}
        </>
      ) : (
        <Image
          src={item.imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 70vw, 296px"
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 via-black/25 to-transparent"
      />
      <p className="absolute bottom-4 left-4 right-4 z-10 truncate text-base font-semibold text-white">
        {title}
      </p>
    </article>
  );
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

  function updateScrollState() {
    const node = scrollRef.current;
    if (!node) return;
    setCanScrollPrev(node.scrollLeft > 4);
    setCanScrollNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
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
      left: direction === "next" ? CARD_SCROLL_STEP_PX : -CARD_SCROLL_STEP_PX,
      behavior: "smooth",
    });
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
        className="mt-5 flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none"
      >
        {moments.map((item) => (
          <MomentCard key={item.id} item={item} />
        ))}
      </div>

      {moments.length > 1 ? (
        <HomepageCarouselNav
          className="mt-5"
          onPrev={() => scrollByDirection("prev")}
          onNext={() => scrollByDirection("next")}
          prevDisabled={!canScrollPrev}
          nextDisabled={!canScrollNext}
        />
      ) : null}
    </section>
  );
}
