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
  desktop: "aspect-[5/4] w-full max-w-[480px]",
  mobile: "aspect-[3/4] w-[260px] shrink-0 snap-center",
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
  return (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt ?? name}
        fill
        className="object-cover"
        sizes={
          layout === "mobile"
            ? "260px"
            : "(max-width: 640px) 100vw, 480px"
        }
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
        <div className="min-w-0">
          <h3
            className={cn(
              "font-bold leading-tight",
              layout === "mobile" ? "text-xl" : "text-2xl",
            )}
          >
            {name}
          </h3>
          <p className="mt-1 text-sm text-white/90">
            {formatLocalityDetails(startingRent, propertyCount)}
          </p>
        </div>
        {showArrow ? (
          <ArrowRightIcon className="mb-0.5 size-6 shrink-0" />
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
    "relative overflow-hidden rounded-3xl bg-gray-200",
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
