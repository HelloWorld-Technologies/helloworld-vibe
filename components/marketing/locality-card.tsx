import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/cn";
import { formatLocalityDetails } from "@/src/tokens/locality-card";

export type LocalityCardLayout = "desktop" | "mobile";

export interface LocalityCardProps {
  name: string;
  startingRent: number;
  propertyCount: number;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  layout?: LocalityCardLayout;
  showArrow?: boolean;
  className?: string;
}

/** Title Case each word when the source is uniform case (e.g. ALL CAPS / lowercase). */
function toTitleCaseName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  const isUniformCase =
    trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase();
  if (!isUniformCase) return trimmed;
  return trimmed
    .split(/\s+/)
    .map((word) =>
      word
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const layoutClassName: Record<LocalityCardLayout, string> = {
  desktop: "aspect-[5/4] w-full max-w-[280px]",
  mobile: "aspect-[3/4] w-[170px] shrink-0 snap-center",
};

function LocalityCardContent({
  name,
  startingRent,
  propertyCount,
  imageSrc,
  imageAlt,
  layout,
  showArrow,
}: Pick<
  LocalityCardProps,
  | "name"
  | "startingRent"
  | "propertyCount"
  | "imageSrc"
  | "imageAlt"
  | "layout"
  | "showArrow"
>) {
  const displayName = toTitleCaseName(name);

  return (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt ?? displayName}
        fill
        className="object-cover"
        sizes={
          layout === "mobile"
            ? "170px"
            : "(max-width: 640px) 100vw, 280px"
        }
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white sm:p-4">
        <div className="min-w-0">
          <h3
            className={cn(
              "font-medium leading-tight",
              layout === "mobile" ? "text-sm" : "text-base",
            )}
          >
            {displayName}
          </h3>
          <p className="mt-0.5 text-[11px] text-white/90 sm:text-xs">
            {formatLocalityDetails(startingRent, propertyCount)}
          </p>
        </div>
        {showArrow ? (
          <ArrowRightIcon className="mb-0.5 size-4 shrink-0" />
        ) : null}
      </div>
    </>
  );
}

export function LocalityCard({
  name,
  startingRent,
  propertyCount,
  imageSrc,
  imageAlt,
  href,
  layout = "desktop",
  showArrow = layout === "desktop",
  className,
}: LocalityCardProps) {
  const sharedClassName = cn(
    "relative overflow-hidden rounded-2xl bg-gray-200",
    layoutClassName[layout],
    className,
  );

  const content = (
    <LocalityCardContent
      name={name}
      startingRent={startingRent}
      propertyCount={propertyCount}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      layout={layout}
      showArrow={showArrow}
    />
  );

  if (href) {
    return (
      <Link href={href} className={cn(sharedClassName, "group block")}>
        {content}
      </Link>
    );
  }

  return <article className={sharedClassName}>{content}</article>;
}

export function LocalityCarouselButton({
  direction,
  label,
  onClick,
  disabled,
  className,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40",
        className,
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

export function LocalityPaginationDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === activeIndex}
          onClick={() => onSelect(index)}
          className={cn(
            "h-2 rounded-full bg-gray-800 transition-all",
            index === activeIndex ? "w-8" : "w-2 opacity-40",
          )}
        />
      ))}
    </div>
  );
}
