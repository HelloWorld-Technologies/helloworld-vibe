"use client";

import { cn } from "@/src/lib/cn";
import type { LocalityMobileTab } from "@/components/marketing/locality-mobile-tabs";

function ChevronIcon({
  direction,
  className,
}: {
  direction: "up" | "down";
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 7"
      fill="none"
      className={cn(direction === "up" && "rotate-180", className)}
    >
      <path
        d="M1 1.5 7 5.5 13 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LocalityMobileActions({
  activeTab,
  onShowDetails,
  onShowProperties,
  className,
}: {
  activeTab: LocalityMobileTab;
  onShowDetails: () => void;
  onShowProperties: () => void;
  className?: string;
}) {
  const onDetails = activeTab === "details";

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-sm md:hidden",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDetails ? onShowProperties : onShowDetails}
        className="mx-auto flex h-11 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-gray-900 px-6 text-sm font-semibold text-white"
      >
        {onDetails ? "Show Properties" : "Show Locality Details"}
        <ChevronIcon direction={onDetails ? "up" : "down"} className="size-3.5" />
      </button>
    </div>
  );
}
