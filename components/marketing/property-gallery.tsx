"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ShareIcon } from "@/components/icons/share-icon";
import { cn } from "@/src/lib/cn";
import type { GalleryCategory, GalleryMediaItem } from "@/src/models/gallery";
import {
  buildGalleryDesktopFromImages,
  buildGalleryDesktopFromMedia,
  buildGalleryItemsFromImages,
  galleryCategoryTabs,
  getGalleryItemsByCategory,
  propertyGalleryDesktop,
  propertyGalleryItems,
  propertyGalleryTotal,
} from "@/src/tokens/property-gallery";

type PropertyGalleryProps = {
  images?: readonly string[];
  items?: readonly GalleryMediaItem[];
  className?: string;
};

function GalleryBadge({ children }: { children: React.ReactNode }) {
  if (children == null || children === "") return null;
  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
      {children}
    </span>
  );
}

function galleryMediaAlt(item: GalleryMediaItem): string {
  return item.caption || item.label || "Property photo";
}

function GalleryChevron({
  direction,
  label,
  onClick,
  disabled,
  variant = "dark",
}: {
  direction: "prev" | "next";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-30 sm:size-12",
        direction === "prev" ? "left-3 sm:left-4" : "right-3 sm:right-4",
        variant === "dark"
          ? "bg-black/30 text-white hover:bg-black/50"
          : "border border-gray-300 bg-white text-gray-900 shadow-xs hover:bg-gray-50",
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 z-[5] flex items-center justify-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg">
        <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-6 translate-x-0.5">
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </span>
    </span>
  );
}

function GalleryImageTile({
  item,
  className,
  showViewAll,
  totalCount,
  onViewAll,
  onHoverPlayChange,
}: {
  item: GalleryMediaItem;
  className?: string;
  showViewAll?: boolean;
  totalCount?: number;
  onViewAll?: () => void;
  onHoverPlayChange?: (playing: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const videoSrc = item.videoSrc;
  const hasVideo = Boolean(videoSrc);
  const playOnHover = hasVideo && item.category === "moments";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playOnHover) return;

    if (!isHovered) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // Ignore seek errors before metadata is ready.
      }
      return;
    }

    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {});
    }
  }, [item.id, videoSrc, playOnHover, isHovered]);

  function setHoverPlaying(playing: boolean) {
    if (!playOnHover) return;
    setIsHovered(playing);
    onHoverPlayChange?.(playing);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        hasVideo ? "bg-black" : "bg-gray-200",
        className,
      )}
      onPointerEnter={() => setHoverPlaying(true)}
      onPointerLeave={() => setHoverPlaying(false)}
    >
      {playOnHover ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={videoSrc}
          poster={item.imageSrc}
          muted
          playsInline
          loop
          preload="auto"
        />
      ) : (
        <Image
          key={item.id}
          src={item.imageSrc}
          alt={galleryMediaAlt(item)}
          fill
          className="object-cover animate-gallery-media-fade"
          sizes="(max-width: 768px) 100vw, 280px"
        />
      )}
      <GalleryBadge>{item.label}</GalleryBadge>
      {playOnHover && !isHovered ? <PlayBadge /> : null}
      {showViewAll ? (
        <button
          type="button"
          onClick={onViewAll}
          className="absolute bottom-3 right-3 z-10 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm"
        >
          View All {totalCount ?? propertyGalleryTotal}+
        </button>
      ) : null}
    </div>
  );
}

function GalleryImageCountBadge({
  current,
  total,
  onClick,
  className,
}: {
  current: number;
  total: number;
  onClick?: () => void;
  className?: string;
}) {
  // Keep width stable as counts go from 9 → 10 (and beyond).
  const digitSlots = Math.max(String(total).length, String(current).length, 1);
  const countMinWidth = `calc(${digitSlots * 2}ch + 0.55ch)`;

  const content = (
    <>
      <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
        <path
          d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m2.5 13 3.2-3.2a1.5 1.5 0 0 1 2.12 0L12 14m-1.5-1.5 1.2-1.2a1.5 1.5 0 0 1 2.12 0l2.68 2.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="8" r="1.25" fill="currentColor" />
      </svg>
      <span
        className="inline-flex justify-center tabular-nums"
        style={{ minWidth: countMinWidth }}
      >
        {current}/{total}
      </span>
    </>
  );

  const sharedClassName = cn(
    "absolute z-10 inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm",
    className ?? "bottom-3 right-3",
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Photo ${current} of ${total}. View all photos`}
        className={sharedClassName}
      >
        {content}
      </button>
    );
  }

  return <span className={sharedClassName}>{content}</span>;
}

function GalleryVideoTile({
  item,
  className,
  onPrev,
  onNext,
  autoPlay = false,
  paused = false,
  imageIndex,
  imageTotal,
  onViewAllImages,
  swipeDirection = "next",
  slideKey = 0,
}: {
  item: GalleryMediaItem;
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
  autoPlay?: boolean;
  paused?: boolean;
  imageIndex?: number;
  imageTotal?: number;
  onViewAllImages?: () => void;
  swipeDirection?: "next" | "prev";
  slideKey?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(item.videoSrc);
  const showImageCount =
    !hasVideo &&
    typeof imageIndex === "number" &&
    typeof imageTotal === "number" &&
    imageTotal > 0;
  const mediaAnimClass =
    swipeDirection === "prev"
      ? "animate-gallery-swipe-prev"
      : "animate-gallery-swipe-next";
  const mediaKey = `${item.id}-${slideKey}-${swipeDirection}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (!autoPlay || paused) {
      video.pause();
      return;
    }

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {
        // Autoplay can be blocked; muted + playsInline usually works.
      });
    }
  }, [item.id, item.videoSrc, hasVideo, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo || !autoPlay) return;

    if (paused) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {});
    }
  }, [paused, autoPlay, hasVideo]);

  const isPlaying = autoPlay && hasVideo && !paused;
  const showIdleOverlay = hasVideo && !autoPlay;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black",
        className,
      )}
    >
      {hasVideo ? (
        <video
          key={mediaKey}
          ref={videoRef}
          className={cn(
            "absolute inset-0 size-full object-cover",
            mediaAnimClass,
          )}
          src={item.videoSrc}
          poster={item.imageSrc}
          muted
          playsInline
          loop
          autoPlay={isPlaying}
          preload="auto"
        />
      ) : (
        <Image
          key={mediaKey}
          src={item.imageSrc}
          alt={galleryMediaAlt(item)}
          fill
          className={cn("object-cover", mediaAnimClass)}
          sizes="(max-width: 768px) 100vw, 480px"
        />
      )}
      {showIdleOverlay ? (
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      ) : null}
      <GalleryBadge>{item.label}</GalleryBadge>
      {showIdleOverlay ? <PlayBadge /> : null}
      {showImageCount ? (
        <GalleryImageCountBadge
          current={imageIndex + 1}
          total={imageTotal}
          onClick={onViewAllImages}
        />
      ) : null}
      <GalleryChevron direction="prev" label="Previous" onClick={onPrev} />
      <GalleryChevron direction="next" label="Next" onClick={onNext} />
    </div>
  );
}

function useGallerySource({
  images,
  items,
}: {
  images?: readonly string[];
  items?: readonly GalleryMediaItem[];
}) {
  return useMemo(() => {
    if (items && items.length > 0) {
      return {
        galleryItems: items,
        desktop: buildGalleryDesktopFromMedia(items),
        photoItems: getGalleryItemsByCategory(items, "photos"),
      };
    }

    if (images && images.length > 0) {
      const galleryItems = buildGalleryItemsFromImages(images);
      return {
        galleryItems,
        desktop: buildGalleryDesktopFromImages(images),
        photoItems: getGalleryItemsByCategory(galleryItems, "photos"),
      };
    }

    return {
      galleryItems: propertyGalleryItems,
      desktop: propertyGalleryDesktop,
      photoItems: getGalleryItemsByCategory(propertyGalleryItems, "photos"),
    };
  }, [images, items]);
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M15 5 5 15M5 5l10 10"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GalleryPhotosModal({
  open,
  onClose,
  photos,
  initialIndex = 0,
}: {
  open: boolean;
  onClose: () => void;
  photos: readonly GalleryMediaItem[];
  initialIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const thumbRefs = useRef(new Map<number, HTMLButtonElement>());

  useEffect(() => {
    if (open) {
      setActiveIndex(
        Math.min(Math.max(initialIndex, 0), Math.max(photos.length - 1, 0)),
      );
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timer);
  }, [initialIndex, open, photos.length]);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (photos.length <= 1) return;
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === 0 ? photos.length - 1 : index - 1,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === photos.length - 1 ? 0 : index + 1,
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, onClose, photos.length]);

  useEffect(() => {
    const thumb = thumbRefs.current.get(activeIndex);
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  if (!mounted || typeof document === "undefined" || photos.length === 0) {
    return null;
  }

  const activePhoto = photos[activeIndex] ?? photos[0];

  function goPrev() {
    setActiveIndex((index) => (index === 0 ? photos.length - 1 : index - 1));
  }

  function goNext() {
    setActiveIndex((index) => (index === photos.length - 1 ? 0 : index + 1));
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[80] flex flex-col bg-black",
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-photos-title"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="min-w-0">
          <h2
            id="gallery-photos-title"
            className="truncate text-base font-semibold text-white sm:text-lg"
          >
            {activePhoto.caption || activePhoto.label || "Photos"}
          </h2>
          <p className="text-sm text-white/70">
            {activeIndex + 1} / {photos.length}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-2 sm:px-16">
          <div className="relative h-full w-full max-w-6xl">
            <Image
              key={activePhoto.id}
              src={activePhoto.imageSrc}
              alt={activePhoto.caption || activePhoto.label || "Property photo"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            {activePhoto.caption || activePhoto.label ? (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:left-4 sm:top-4">
                {activePhoto.caption || activePhoto.label}
              </span>
            ) : null}
          </div>
        </div>

        {photos.length > 1 ? (
          <>
            <GalleryChevron
              direction="prev"
              label="Previous photo"
              onClick={goPrev}
              variant="dark"
            />
            <GalleryChevron
              direction="next"
              label="Next photo"
              onClick={goNext}
              variant="dark"
            />
          </>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-white/10 bg-black/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
        <div className="flex gap-2 overflow-x-auto px-1 py-1.5 scrollbar-none">
          {photos.map((photo, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={photo.id}
                type="button"
                aria-label={`Show photo ${index + 1}`}
                aria-current={isActive}
                ref={(element) => {
                  if (element) thumbRefs.current.set(index, element);
                  else thumbRefs.current.delete(index);
                }}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition-all sm:h-20 sm:w-28",
                  isActive
                    ? "ring-2 ring-hello-lime-400 ring-offset-2 ring-offset-black"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={photo.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function PropertyGalleryDesktop({
  images,
  items,
  className,
}: PropertyGalleryProps) {
  const [photosOpen, setPhotosOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">(
    "next",
  );
  const [slideKey, setSlideKey] = useState(0);
  const [momentsSidePlaying, setMomentsSidePlaying] = useState(false);
  const { desktop, photoItems, galleryItems } = useGallerySource({
    images,
    items,
  });
  const { moments, livingRoom, washroom, featuredSequence } = desktop;
  const momentsTile =
    galleryItems.find(
      (item) => item.category === "moments" && Boolean(item.videoSrc),
    ) ?? moments;
  const totalCount =
    galleryItems.length ||
    photoItems.length ||
    images?.length ||
    propertyGalleryTotal;

  useEffect(() => {
    setFeaturedIndex(0);
    setMomentsSidePlaying(false);
  }, [items, images]);

  const sequence =
    featuredSequence.length > 0 ? featuredSequence : galleryItems;
  const featuredItem =
    sequence[
      Math.min(featuredIndex, Math.max(sequence.length - 1, 0))
    ] ?? desktop.video;

  const featuredShouldAutoPlay =
    featuredItem.kind === "video" &&
    (featuredItem.category === "property-video" ||
      featuredItem.category === "moments");

  const carouselImages = sequence.filter((item) => !item.videoSrc);
  const featuredImageIndex = carouselImages.findIndex(
    (item) => item.id === featuredItem.id,
  );

  function goFeaturedPrev() {
    setSwipeDirection("prev");
    setSlideKey((key) => key + 1);
    setFeaturedIndex((index) =>
      sequence.length === 0
        ? 0
        : index === 0
          ? sequence.length - 1
          : index - 1,
    );
  }

  function goFeaturedNext() {
    setSwipeDirection("next");
    setSlideKey((key) => key + 1);
    setFeaturedIndex((index) =>
      sequence.length === 0
        ? 0
        : index === sequence.length - 1
          ? 0
          : index + 1,
    );
  }

  if (images?.length === 0 && items?.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "grid h-[min(360px,55vw)] min-h-[280px] grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3",
          className,
        )}
      >
        <GalleryVideoTile
          item={featuredItem}
          className="h-full"
          autoPlay={featuredShouldAutoPlay}
          paused={momentsSidePlaying}
          onPrev={goFeaturedPrev}
          onNext={goFeaturedNext}
          swipeDirection={swipeDirection}
          slideKey={slideKey}
          imageIndex={
            featuredImageIndex >= 0 ? featuredImageIndex : undefined
          }
          imageTotal={
            featuredImageIndex >= 0
              ? carouselImages.length || totalCount
              : undefined
          }
          onViewAllImages={() => setPhotosOpen(true)}
        />
        <GalleryImageTile
          item={momentsTile}
          className="h-full"
          onHoverPlayChange={setMomentsSidePlaying}
        />
        <div className="grid min-h-0 grid-rows-2 gap-3">
          <GalleryImageTile item={livingRoom} className="min-h-0" />
          <GalleryImageTile
            item={washroom}
            className="min-h-0"
            showViewAll={totalCount > 0}
            totalCount={totalCount}
            onViewAll={() => setPhotosOpen(true)}
          />
        </div>
      </div>

      <GalleryPhotosModal
        open={photosOpen}
        onClose={() => setPhotosOpen(false)}
        photos={
          photoItems.length > 0
            ? photoItems
            : [livingRoom, washroom].filter(Boolean)
        }
      />
    </>
  );
}

function GalleryPaginationDots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  const visibleCount = Math.min(count, 6);

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: visibleCount }, (_, index) => (
        <span
          key={index}
          aria-hidden
          className={cn(
            "h-1.5 rounded-full bg-white transition-all",
            index === activeIndex % visibleCount ? "w-8" : "w-1.5 opacity-50",
          )}
        />
      ))}
    </div>
  );
}

export function PropertyGalleryMobile({
  images,
  items,
  className,
  variant = "inset",
  onBack,
  onShare,
}: PropertyGalleryProps & {
  variant?: "inset" | "hero";
  onBack?: () => void;
  onShare?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [photosOpen, setPhotosOpen] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">(
    "next",
  );
  const [slideKey, setSlideKey] = useState(0);
  const { galleryItems, photoItems } = useGallerySource({ images, items });
  const totalCount = galleryItems.length || propertyGalleryTotal;
  const activeItem = galleryItems[activeIndex] ?? galleryItems[0];
  const activeCategory = activeItem?.category;
  const availableTabs = galleryCategoryTabs.filter((tab) =>
    galleryItems.some((item) => item.category === tab.value),
  );
  const showCategoryTabs = availableTabs.length > 1;
  const mediaAnimClass =
    swipeDirection === "prev"
      ? "animate-gallery-swipe-prev"
      : "animate-gallery-swipe-next";
  const mediaKey = `${activeItem?.id ?? "empty"}-${slideKey}-${swipeDirection}`;
  const isHero = variant === "hero";

  if (galleryItems.length === 0 || !activeItem) return null;

  function goToCategory(category: GalleryCategory) {
    const index = galleryItems.findIndex((item) => item.category === category);
    if (index >= 0) {
      setSwipeDirection(index > activeIndex ? "next" : "prev");
      setSlideKey((key) => key + 1);
      setActiveIndex(index);
    }
  }

  function goPrev() {
    setSwipeDirection("prev");
    setSlideKey((key) => key + 1);
    setActiveIndex((index) =>
      index === 0 ? galleryItems.length - 1 : index - 1,
    );
  }

  function goNext() {
    setSwipeDirection("next");
    setSlideKey((key) => key + 1);
    setActiveIndex((index) =>
      index === galleryItems.length - 1 ? 0 : index + 1,
    );
  }

  const modalPhotos =
    photoItems.length > 0
      ? photoItems
      : galleryItems.filter((item) => item.kind === "image");

  return (
    <>
      <div className={cn(!isHero && "mx-auto w-full max-w-[320px]", className)}>
        <div
          className={cn(
            "relative overflow-hidden bg-black",
            isHero ? "aspect-[4/5] w-full" : "aspect-4/5 rounded-3xl",
          )}
        >
          {activeItem.kind === "video" && activeItem.videoSrc ? (
            <video
              key={mediaKey}
              className={cn(
                "absolute inset-0 size-full object-cover",
                mediaAnimClass,
              )}
              src={activeItem.videoSrc}
              poster={activeItem.imageSrc}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
            />
          ) : activeItem.kind === "video" ? (
            <>
              <Image
                key={mediaKey}
                src={activeItem.imageSrc}
                alt=""
                fill
                className={cn("object-cover opacity-35", mediaAnimClass)}
                sizes={isHero ? "100vw" : "320px"}
                priority={isHero}
              />
              <div className="absolute inset-0 bg-black/55" aria-hidden />
              <PlayBadge />
            </>
          ) : (
            <Image
              key={mediaKey}
              src={activeItem.imageSrc}
              alt={galleryMediaAlt(activeItem)}
              fill
              className={cn("object-cover", mediaAnimClass)}
              sizes={isHero ? "100vw" : "320px"}
              priority={isHero}
            />
          )}

          {isHero ? (
            <>
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                className="absolute left-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm"
              >
                <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-5">
                  <path
                    d="M12.5 4.5 7 10l5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Share property"
                onClick={onShare}
                className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white text-hello-lime-900 shadow-sm"
              >
                <ShareIcon className="size-5" />
              </button>
            </>
          ) : null}

          <GalleryChevron direction="prev" label="Previous" onClick={goPrev} />
          <GalleryChevron direction="next" label="Next" onClick={goNext} />

          <GalleryImageCountBadge
            current={activeIndex + 1}
            total={totalCount}
            onClick={() => setPhotosOpen(true)}
            className={
              isHero
                ? showCategoryTabs
                  ? "bottom-28 right-4"
                  : "bottom-16 right-4"
                : showCategoryTabs
                  ? "bottom-24 right-3"
                  : "bottom-12 right-3"
            }
          />

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-16",
              isHero ? "pb-10" : "pb-5",
            )}
          >
            {showCategoryTabs ? (
              <div className="flex flex-wrap justify-center gap-2">
                {availableTabs.map((tab) => {
                  const isActive = tab.value === activeCategory;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => goToCategory(tab.value)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-white text-gray-900"
                          : "bg-white/25 text-white backdrop-blur-sm",
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <div className={cn(showCategoryTabs && "mt-4")}>
              <GalleryPaginationDots
                count={galleryItems.length}
                activeIndex={activeIndex}
              />
            </div>
          </div>
        </div>
      </div>

      <GalleryPhotosModal
        open={photosOpen}
        onClose={() => setPhotosOpen(false)}
        photos={modalPhotos}
      />
    </>
  );
}
