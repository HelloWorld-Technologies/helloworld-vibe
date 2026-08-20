"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/src/lib/cn";

function HeartIcon({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      className={className}
    >
      <path
        d="M10 17.5s-6.667-4.167-6.667-8.333A3.333 3.333 0 0 1 10 6.25a3.333 3.333 0 0 1 6.667 2.917c0 4.166-6.667 8.333-6.667 8.333Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
          "transition-colors active:scale-95 text-gray-900 hover:text-gray-700",
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
