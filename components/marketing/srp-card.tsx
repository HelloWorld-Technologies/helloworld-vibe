"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { ShareIcon } from "@/components/icons/share-icon";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { cn } from "@/src/lib/cn";
import { formatSrpCardImageSrc } from "@/src/lib/images";
import {
  formatRent,
  isSrpComingSoonImage,
  SRP_CARD_MAX_IMAGES,
  srpCardDefaultImage,
  type SrpCardStatusLabel,
} from "@/src/tokens/srp-card";

export interface SrpCardProps {
  name: string;
  subtitle: string;
  images: readonly string[];
  rating: number;
  roomTypes: readonly string[];
  rent: number;
  originalRent?: number;
  offerLabel?: string;
  statusLabel?: SrpCardStatusLabel;
  visitsToday?: number;
  genderLabel?: string;
  saved?: boolean;
  className?: string;
  href?: string;
  propertyUrl?: string;
  onRequestCallback?: () => void;
  onTakeTour?: () => void;
  onSaveToggle?: () => void;
  onShare?: () => void;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-3.5">
      <path
        d={direction === "left" ? "M12.5 15L7.5 10L12.5 5" : "M7.5 15L12.5 10L7.5 5"}
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M11.333 14v-1.333A2.667 2.667 0 0 0 8.667 10H3.333A2.667 2.667 0 0 0 .667 12.667V14M8.667 7.333a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334ZM15.333 14v-1.333a2.667 2.667 0 0 0-2-2.576M10.667 1.757a2.667 2.667 0 0 1 0 5.182"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BedIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M2 12.667V10a2.667 2.667 0 0 1 2.667-2.667h6.666A2.667 2.667 0 0 1 14 10v2.667M2 12.667h12M2 12.667v1.333M14 12.667v1.333M4.667 7.333V5.333a1.333 1.333 0 0 1 1.334-1.333h4a1.333 1.333 0 0 1 1.333 1.333v2"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
      <path
        d="M6 4.5V6.75M6 8.25h.005M4.558 1.875 1.182 7.125A1.125 1.125 0 0 0 2.143 8.625h7.714a1.125 1.125 0 0 0 .961-1.5L7.442 1.875a1.125 1.125 0 0 0-1.884 0Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 7" fill="none" className={className}>
      <path
        d="M1 5.5 4.25 2.25 6.5 4.5 11 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PercentIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="4.667" cy="4.667" r="1.667" stroke="currentColor" strokeWidth="1.33" />
      <circle cx="11.333" cy="11.333" r="1.667" stroke="currentColor" strokeWidth="1.33" />
      <path
        d="M13.333 2.667 2.667 13.333"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeftImageBadge({
  statusLabel,
  visitsToday,
}: {
  statusLabel?: SrpCardStatusLabel;
  visitsToday?: number;
}) {
  if (statusLabel === "filling-fast") {
    return (
      <span className="inline-flex items-center gap-1 rounded-2xl bg-[#fff0d1] px-2 py-0.5 text-xs font-medium text-[#7a271a]">
        <WarningIcon className="size-3" />
        Filling Fast
      </span>
    );
  }

  if (statusLabel === "trending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-2xl bg-hello-lime-50 px-2 py-0.5 text-xs font-medium text-hello-lime-800">
        <TrendingIcon className="size-3" />
        Trending
      </span>
    );
  }

  if (visitsToday != null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-2xl bg-[#f4ebff] px-2 py-0.5 text-xs font-medium text-[#53389e]">
        <UsersIcon className="size-3" />
        {visitsToday} Visits Today
      </span>
    );
  }

  return null;
}

function SrpCardCarousel({
  images,
  alt,
}: {
  images: readonly string[];
  alt: string;
}) {
  const slides = useMemo(
    () =>
      (images.length > 0 ? images : [srpCardDefaultImage])
        .slice(0, SRP_CARD_MAX_IMAGES)
        .map((src) => formatSrpCardImageSrc(src) || srpCardDefaultImage),
    [images],
  );
  const slidesKey = slides.join("|");
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;
  const imageSrc = slides[activeIndex] ?? srpCardDefaultImage;
  const isComingSoon = isSrpComingSoonImage(imageSrc);
  const paginationRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef(new Map<number, HTMLButtonElement>());
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null,
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [slidesKey]);

  const updatePill = useCallback(() => {
    const container = paginationRef.current;
    const activeDot = dotRefs.current.get(activeIndex);
    if (!container || !activeDot) return;
    setPill({
      left: activeDot.offsetLeft,
      width: activeDot.offsetWidth,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updatePill();
  }, [updatePill, slideCount]);

  useLayoutEffect(() => {
    const container = paginationRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => updatePill());
    observer.observe(container);
    return () => observer.disconnect();
  }, [updatePill]);

  function goTo(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + slideCount) % slideCount);
  }

  return (
    <div
      className={cn(
        "relative h-[14.25rem] w-full overflow-hidden",
        isComingSoon ? "bg-white" : "bg-gray-100",
      )}
    >
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt={
            isComingSoon
              ? `${alt} coming soon`
              : `${alt} — photo ${activeIndex + 1} of ${slideCount}`
          }
          fill
          className="object-cover"
          sizes="411px"
        />
      </div>

      {slideCount > 1 && !isComingSoon ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goTo(-1);
            }}
            className="absolute left-4 top-1/2 z-10 flex size-[25px] -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/40 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/55"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goTo(1);
            }}
            className="absolute right-4 top-1/2 z-10 flex size-[25px] -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/40 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/55"
          >
            <ChevronIcon direction="right" />
          </button>

          <div
            ref={paginationRef}
            className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5"
          >
            {pill ? (
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
                style={{ left: pill.left, width: pill.width }}
              />
            ) : null}
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${slide}-${index}`}
                  ref={(node) => {
                    if (node) {
                      dotRefs.current.set(index, node);
                    } else {
                      dotRefs.current.delete(index);
                    }
                  }}
                  type="button"
                  aria-label={`Go to photo ${index + 1}`}
                  aria-current={isActive}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={cn(
                    "relative z-10 h-1.5 rounded-full transition-[width,opacity,background-color] duration-300 ease-out motion-reduce:transition-none",
                    isActive
                      ? cn("w-5", pill ? "bg-transparent" : "bg-white")
                      : "w-1.5 bg-white/70 hover:bg-white/90",
                  )}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function SrpCard({
  name,
  subtitle,
  images,
  rating,
  roomTypes,
  rent,
  originalRent,
  offerLabel,
  statusLabel,
  visitsToday,
  genderLabel,
  saved = false,
  className,
  href,
  propertyUrl,
  onRequestCallback,
  onTakeTour,
  onSaveToggle,
  onShare,
}: SrpCardProps) {
  const router = useRouter();
  const hasOffer = originalRent != null && originalRent > rent;
  const leftBadge = (
    <LeftImageBadge statusLabel={statusLabel} visitsToday={visitsToday} />
  );

  function navigateToHdp(event: MouseEvent<HTMLElement>) {
    if (!href) return;
    if ((event.target as HTMLElement).closest("button, a")) return;
    router.push(href);
  }

  async function handleShare() {
    if (onShare) {
      onShare();
      return;
    }
    if (typeof window === "undefined") return;
    const url =
      propertyUrl ||
      (href
        ? href.startsWith("http")
          ? href
          : `${window.location.origin}${href}`
        : window.location.href);
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User dismissed native share sheet.
    }
  }

  return (
    <article
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-[6px_6px_23.5px_rgba(0,0,0,0.08)]",
          href && "cursor-pointer",
          className,
        )}
      onClick={navigateToHdp}
      onKeyDown={
        href
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                if ((event.target as HTMLElement).closest("button, a")) return;
                event.preventDefault();
                router.push(href);
              }
            }
          : undefined
      }
    >
      <div className="relative">
        <SrpCardCarousel images={images} alt={name} />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          {leftBadge ?? <span aria-hidden />}
          {genderLabel &&
          String(genderLabel).trim().toUpperCase() !== "ALL" ? (
            <span className="rounded-2xl bg-[#fecdca] px-2 py-0.5 text-xs font-medium text-gray-800">
              {genderLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 text-lg font-medium leading-7 text-gray-900">
            {href ? (
              <Link
                href={href}
                onClick={(event) => event.stopPropagation()}
                className="block truncate transition-colors hover:text-hello-lime-700 hover:underline"
              >
                {name}
              </Link>
            ) : (
              <span className="block truncate">{name}</span>
            )}
          </h3>
          <span className="inline-flex shrink-0 items-center rounded-2xl bg-[#f0f9ff] px-2 py-0.5 text-xs font-medium text-[#0086c9]">
            {rating.toFixed(1)}★
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs text-gray-600">{subtitle}</p>
          <div className="flex shrink-0 items-center gap-2">
            <WishlistButton
              saved={saved}
              aria-label={saved ? "Remove from saved" : "Save property"}
              onClick={(event) => {
                event.stopPropagation();
                onSaveToggle?.();
              }}
            />
            <button
              type="button"
              aria-label="Share property"
              onClick={(event) => {
                event.stopPropagation();
                void handleShare();
              }}
              className="text-hello-lime-900 transition-colors hover:text-hello-lime-800"
            >
              <ShareIcon className="size-5" />
            </button>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1 rounded-2xl bg-[#e9eaeb] px-2 py-0.5 text-xs font-medium text-gray-900">
          <BedIcon className="size-3 text-gray-700" />
          {roomTypes.join(" · ")}
        </span>

        <div>
          <p className="text-xs text-gray-600">Starting Rent</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            {hasOffer ? (
              <span className="text-sm text-gray-400 line-through">
                {formatRent(originalRent)}
              </span>
            ) : null}
            <p className="text-2xl font-bold leading-8 text-gray-900">
              {formatRent(rent)}
            </p>
            {offerLabel ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-light-50 px-2 py-1 text-xs font-semibold text-blue-light-700">
                <span className="flex size-4 items-center justify-center rounded-full bg-blue-light-500 text-white">
                  <PercentIcon className="size-2.5" />
                </span>
                {offerLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-2">
          <Button
            hierarchy="secondary-gray"
            size="md"
            className="w-full rounded-lg border-gray-300 text-gray-600"
            onClick={(event) => {
              event.stopPropagation();
              onRequestCallback?.();
            }}
          >
            Request Callback
          </Button>
          <Button
            hierarchy="primary"
            size="md"
            className="w-full rounded-lg bg-hello-lime-400 text-gray-800 ring-0 hover:bg-hello-lime-500 focus-visible:ring-hello-lime-100"
            onClick={(event) => {
              event.stopPropagation();
              onTakeTour?.();
            }}
          >
            Take a Tour
          </Button>
        </div>
      </div>
    </article>
  );
}
