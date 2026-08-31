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
  vibeMatchScore?: number;
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
    <svg aria-hidden viewBox="0 0 16 12" fill="none" className={className}>
      <path
        d="M13.6364 5.1375C13.2925 4.98655 12.921 4.90877 12.5455 4.90909H2.72727C2.35176 4.90873 1.98028 4.98639 1.63636 5.13716C1.1503 5.34972 0.736683 5.69929 0.446078 6.14313C0.155472 6.58696 0.000464471 7.10585 0 7.63636V11.4545C0 11.5992 0.0574673 11.7379 0.15976 11.8402C0.262052 11.9425 0.400791 12 0.545455 12C0.690118 12 0.828857 11.9425 0.931149 11.8402C1.03344 11.7379 1.09091 11.5992 1.09091 11.4545V11.1818C1.09179 11.1098 1.12081 11.0409 1.17177 10.9899C1.22272 10.939 1.29158 10.91 1.36364 10.9091H13.9091C13.9811 10.91 14.05 10.939 14.101 10.9899C14.1519 11.0409 14.1809 11.1098 14.1818 11.1818V11.4545C14.1818 11.5992 14.2393 11.7379 14.3416 11.8402C14.4439 11.9425 14.5826 12 14.7273 12C14.8719 12 15.0107 11.9425 15.113 11.8402C15.2153 11.7379 15.2727 11.5992 15.2727 11.4545V7.63636C15.2722 7.10591 15.1172 6.5871 14.8266 6.14332C14.536 5.69955 14.1224 5.35004 13.6364 5.1375ZM11.7273 0H3.54545C3.03913 0 2.55355 0.201136 2.19552 0.55916C1.8375 0.917184 1.63636 1.40277 1.63636 1.90909V4.36364C1.63638 4.38477 1.64131 4.40561 1.65075 4.42451C1.6602 4.44341 1.67391 4.45986 1.69081 4.47255C1.7077 4.48525 1.72731 4.49384 1.7481 4.49766C1.76888 4.50148 1.79027 4.50041 1.81057 4.49455C2.10834 4.40745 2.41703 4.36337 2.72727 4.36364H2.87148C2.90514 4.36385 2.93768 4.35161 2.96286 4.32927C2.98803 4.30692 3.00406 4.27606 3.00784 4.24261C3.03759 3.97609 3.16448 3.72986 3.36426 3.55095C3.56404 3.37205 3.82273 3.273 4.09091 3.27273H6C6.26836 3.27275 6.52729 3.37168 6.72729 3.55061C6.92729 3.72954 7.05432 3.97591 7.08409 4.24261C7.08788 4.27606 7.1039 4.30692 7.12907 4.32927C7.15425 4.35161 7.1868 4.36385 7.22045 4.36364H8.05432C8.08798 4.36385 8.12053 4.35161 8.1457 4.32927C8.17087 4.30692 8.1869 4.27606 8.19068 4.24261C8.22041 3.97626 8.34715 3.73018 8.54672 3.55129C8.74629 3.37241 9.00472 3.27325 9.27273 3.27273H11.1818C11.4502 3.27275 11.7091 3.37168 11.9091 3.55061C12.1091 3.72954 12.2361 3.97591 12.2659 4.24261C12.2697 4.27606 12.2857 4.30692 12.3109 4.32927C12.3361 4.35161 12.3686 4.36385 12.4023 4.36364H12.5455C12.8557 4.36349 13.1644 4.40768 13.4622 4.49489C13.4825 4.50076 13.5039 4.50182 13.5247 4.49798C13.5455 4.49415 13.5652 4.48552 13.5821 4.47279C13.599 4.46006 13.6127 4.44357 13.6221 4.42462C13.6315 4.40568 13.6364 4.3848 13.6364 4.36364V1.90909C13.6364 1.40277 13.4352 0.917184 13.0772 0.55916C12.7192 0.201136 12.2336 0 11.7273 0Z"
        fill="currentColor"
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
                    "relative z-10 rounded-full transition-[width,opacity,background-color] duration-300 ease-out motion-reduce:transition-none",
                    isActive
                      ? cn(
                          "h-1.5 w-5",
                          pill ? "bg-transparent" : "bg-white",
                        )
                      : "h-1.5 w-1.5 bg-white/70 hover:bg-white/90",
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
  vibeMatchScore,
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
  const showVibeMatch =
    vibeMatchScore != null &&
    Number.isFinite(vibeMatchScore) &&
    vibeMatchScore > 0;
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

      {showVibeMatch ? (
        <div className="bg-gradient-property-card-vibe-match px-4 py-1 text-center text-xs leading-4 text-gray-900">
          <span aria-hidden>✨ </span>
          <span className="font-bold">{Math.round(vibeMatchScore)}%</span> Vibe
          Match
        </div>
      ) : null}

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
              iconClassName="size-6"
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
          <BedIcon className="size-3.5 text-gray-900" />
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
            size="lg"
            className="w-full min-w-0 rounded-lg border-gray-300 !px-2.5 text-gray-800 whitespace-nowrap sm:!px-[18px]"
            onClick={(event) => {
              event.stopPropagation();
              onRequestCallback?.();
            }}
          >
            Request Callback
          </Button>
          <Button
            hierarchy="primary"
            size="lg"
            className="w-full min-w-0 rounded-lg bg-hello-lime-400 !px-2.5 text-gray-800 ring-0 whitespace-nowrap hover:bg-hello-lime-500 focus-visible:ring-hello-lime-100 sm:!px-[18px]"
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
