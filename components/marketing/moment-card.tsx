"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/cn";
import type { GalleryMediaItem } from "@/src/models/gallery";

export const MOMENT_CARD_WIDTH_CLASS = "w-[16.5rem] sm:w-[18.5rem]";

function PlayIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-50",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 translate-x-0.5"
        >
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </span>
    </span>
  );
}

export function MomentCard({
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
        "relative aspect-3/4 shrink-0 snap-start overflow-hidden rounded-2xl bg-black",
        MOMENT_CARD_WIDTH_CLASS,
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
