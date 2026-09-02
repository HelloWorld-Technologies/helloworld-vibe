"use client";

import Image from "next/image";
import { AdaptiveVideo } from "@/components/media/adaptive-video";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/src/lib/cn";
import type { GalleryMediaItem } from "@/src/models/gallery";

export const MOMENT_CARD_WIDTH_CLASS = "w-[16.5rem] sm:w-[18.5rem]";
export const MOMENT_CARD_ASPECT_CLASS = "aspect-3/4";
/** Slightly taller cards for homepage and community feed carousels. */
export const MOMENT_CARD_FEED_ASPECT_CLASS = "aspect-[5/7]";

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
  aspectClass = MOMENT_CARD_ASPECT_CLASS,
  playWithAudio = false,
  isActivePlaying = false,
  onPlayingChange,
}: {
  item: GalleryMediaItem;
  className?: string;
  aspectClass?: string;
  /** Homepage feed: click-to-play with sound. HDP keeps muted hover preview. */
  playWithAudio?: boolean;
  isActivePlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasVideo = Boolean(item.videoSrc);
  const hasImagePoster =
    Boolean(item.imageSrc) &&
    item.imageSrc !== item.videoSrc &&
    !/\.(mp4|webm|mov|m4v)(\?|$)/i.test(item.imageSrc);
  const title = item.caption || item.label || "Moments";
  const isShowingVideo = playWithAudio
    ? isActivePlaying || !hasImagePoster
    : isHovered || !hasImagePoster;
  const showPlayIcon = playWithAudio ? !isActivePlaying : !isHovered;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (playWithAudio) {
      // Start/unmute happens in the click handler (user gesture). This only
      // stops playback when another card becomes active or the user pauses.
      if (!isActivePlaying) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
      return;
    }

    if (!isHovered) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {});
    }
  }, [hasVideo, isActivePlaying, isHovered, item.id, playWithAudio]);

  function togglePlayback() {
    if (!playWithAudio || !hasVideo) return;

    const video = videoRef.current;
    const nextPlaying = !isActivePlaying;

    if (nextPlaying && video) {
      // Unmute + play in the same user-gesture stack for autoplay policies.
      video.muted = false;
      const playPromise = video.play();
      if (playPromise) {
        void playPromise.catch(() => {});
      }
    }

    onPlayingChange?.(nextPlaying);
  }

  function handleClick() {
    togglePlayback();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!playWithAudio || !hasVideo) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlayback();
    }
  }

  return (
    <article
      className={cn(
        "relative shrink-0 snap-start overflow-hidden rounded-2xl bg-black",
        aspectClass,
        MOMENT_CARD_WIDTH_CLASS,
        playWithAudio && hasVideo && "cursor-pointer",
        className,
      )}
      role={playWithAudio && hasVideo ? "button" : undefined}
      tabIndex={playWithAudio && hasVideo ? 0 : undefined}
      aria-label={
        playWithAudio && hasVideo
          ? isActivePlaying
            ? `Pause ${title}`
            : `Play ${title}`
          : undefined
      }
      aria-pressed={playWithAudio && hasVideo ? isActivePlaying : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => !playWithAudio && hasVideo && setIsHovered(true)}
      onMouseLeave={() => !playWithAudio && setIsHovered(false)}
      onFocus={() => !playWithAudio && hasVideo && setIsHovered(true)}
      onBlur={() => !playWithAudio && setIsHovered(false)}
    >
      {hasVideo ? (
        <>
          <AdaptiveVideo
            ref={videoRef}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-200",
              isShowingVideo ? "opacity-100" : "opacity-0",
            )}
            mp4Src={item.videoSrc!}
            webmSrc={item.videoWebmSrc}
            poster={hasImagePoster ? item.imageSrc : undefined}
            muted={!playWithAudio || !isActivePlaying}
            playsInline
            loop
            preload="metadata"
          />
          {hasImagePoster ? (
            <Image
              src={item.imageSrc}
              alt={title}
              fill
              loading="lazy"
              className={cn(
                "object-cover transition-opacity duration-200",
                playWithAudio
                  ? isActivePlaying
                    ? "opacity-0"
                    : "opacity-100"
                  : isHovered
                    ? "opacity-0"
                    : "opacity-100",
              )}
              sizes="(max-width: 640px) 70vw, 296px"
            />
          ) : null}
          {showPlayIcon ? <PlayIcon /> : null}
        </>
      ) : (
        <Image
          src={item.imageSrc}
          alt={title}
          fill
          loading="lazy"
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
