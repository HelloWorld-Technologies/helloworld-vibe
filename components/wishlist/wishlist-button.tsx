"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/src/lib/cn";

/** Outline path from design (hollow heart). */
const HEART_OUTLINE_PATH =
  "M9.08493 16.4264L8.02933 15.4775C6.44407 14.0393 5.13313 12.8035 4.0965 11.7699C3.05989 10.7364 2.23845 9.81656 1.63218 9.01044C1.0259 8.20432 0.602301 7.469 0.36139 6.80449C0.120463 6.13998 0 5.46566 0 4.78153C0 3.42432 0.457619 2.2881 1.37286 1.37286C2.28809 0.45762 3.42432 0 4.78153 0C5.61647 0 6.40543 0.195256 7.1484 0.585765C7.89138 0.976259 8.53689 1.53625 9.08493 2.26574C9.63298 1.53625 10.2785 0.976259 11.0215 0.585765C11.7644 0.195256 12.5534 0 13.3883 0C14.7456 0 15.8818 0.45762 16.797 1.37286C17.7123 2.2881 18.1699 3.42432 18.1699 4.78153C18.1699 5.46566 18.0494 6.13998 17.8085 6.80449C17.5676 7.469 17.144 8.20432 16.5377 9.01044C15.9314 9.81656 15.1115 10.7364 14.078 11.7699C13.0444 12.8035 11.7319 14.0393 10.1405 15.4775L9.08493 16.4264ZM9.08493 14.4881C10.615 13.1112 11.8742 11.9312 12.8624 10.9479C13.8506 9.96462 14.6315 9.11038 15.2053 8.38518C15.7791 7.65997 16.1776 7.01599 16.4007 6.45324C16.6239 5.89048 16.7354 5.33325 16.7354 4.78153C16.7354 3.82522 16.4167 3.0283 15.7791 2.39075C15.1416 1.75321 14.3446 1.43444 13.3883 1.43444C12.6331 1.43444 11.9352 1.6487 11.2946 2.0772C10.654 2.5057 10.1467 3.10186 9.77274 3.8657H8.39713C8.01706 3.09574 7.50826 2.49804 6.87072 2.07259C6.23317 1.64716 5.53678 1.43444 4.78153 1.43444C3.83136 1.43444 3.03596 1.75321 2.39534 2.39075C1.75474 3.0283 1.43444 3.82522 1.43444 4.78153C1.43444 5.33325 1.54601 5.89048 1.76915 6.45324C1.99229 7.01599 2.39075 7.65997 2.96454 8.38518C3.53833 9.11038 4.31932 9.96309 5.3075 10.9433C6.29569 11.9235 7.55484 13.1051 9.08493 14.4881Z";

/** Outer silhouette only — used when the heart is saved/filled. */
const HEART_SOLID_PATH =
  "M9.08493 16.4264L8.02933 15.4775C6.44407 14.0393 5.13313 12.8035 4.0965 11.7699C3.05989 10.7364 2.23845 9.81656 1.63218 9.01044C1.0259 8.20432 0.602301 7.469 0.36139 6.80449C0.120463 6.13998 0 5.46566 0 4.78153C0 3.42432 0.457619 2.2881 1.37286 1.37286C2.28809 0.45762 3.42432 0 4.78153 0C5.61647 0 6.40543 0.195256 7.1484 0.585765C7.89138 0.976259 8.53689 1.53625 9.08493 2.26574C9.63298 1.53625 10.2785 0.976259 11.0215 0.585765C11.7644 0.195256 12.5534 0 13.3883 0C14.7456 0 15.8818 0.45762 16.797 1.37286C17.7123 2.2881 18.1699 3.42432 18.1699 4.78153C18.1699 5.46566 18.0494 6.13998 17.8085 6.80449C17.5676 7.469 17.144 8.20432 16.5377 9.01044C15.9314 9.81656 15.1115 10.7364 14.078 11.7699C13.0444 12.8035 11.7319 14.0393 10.1405 15.4775L9.08493 16.4264Z";

function HeartIcon({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 19 19"
      fill="none"
      className={cn("block shrink-0", className)}
    >
      {/* Path is drawn in a 19×17 box — offset Y so it sits optically centered in a square. */}
      <g transform="translate(0 1)">
        <path
          d={filled ? HEART_SOLID_PATH : HEART_OUTLINE_PATH}
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

type WishlistButtonProps = {
  saved: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  variant?: "ghost" | "circle";
  className?: string;
  iconClassName?: string;
  "aria-label"?: string;
};

export function WishlistButton({
  saved,
  onClick,
  variant = "ghost",
  className,
  iconClassName = "size-5",
  "aria-label": ariaLabel,
}: WishlistButtonProps) {
  const [animating, setAnimating] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setAnimating(true);
    const timer = window.setTimeout(() => setAnimating(false), 420);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const defaultAriaLabel = saved ? "Remove from wishlist" : "Save to wishlist";

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? defaultAriaLabel}
      aria-pressed={saved}
      onClick={onClick}
      className={cn(
        variant === "circle" &&
          "inline-flex size-9 items-center justify-center rounded-full border transition-colors active:scale-95",
        variant === "circle" &&
          (saved
            ? "border-error-200 bg-error-50 text-error-500 hover:border-error-300"
            : "border-gray-900 text-gray-900 hover:border-gray-700 hover:text-gray-700"),
        variant === "ghost" &&
          "inline-flex items-center justify-center text-hello-lime-900 transition-colors hover:text-hello-lime-800 active:scale-95",
        className,
      )}
    >
      <HeartIcon
        filled={saved}
        className={cn(
          iconClassName,
          animating &&
            (saved ? "animate-wishlist-heart-pop" : "animate-wishlist-heart-unfill"),
        )}
      />
    </button>
  );
}
