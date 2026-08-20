"use client";

import { cn } from "@/src/lib/cn";

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

export function SrpSectionToggle({
  activeSection,
  onShowDetails,
  onShowProperties,
  className,
}: {
  activeSection: "properties" | "details";
  onShowDetails: () => void;
  onShowProperties: () => void;
  className?: string;
}) {
  const onDetails = activeSection === "details";

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden justify-center p-4 md:flex",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDetails ? onShowProperties : onShowDetails}
        className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-hello-lime-100 px-8 text-sm font-semibold text-hello-lime-900 shadow-lg transition-colors hover:bg-hello-lime-200"
      >
        {onDetails ? "Show Properties" : "Show Locality Details"}
        <ChevronIcon direction={onDetails ? "up" : "down"} className="size-3.5" />
      </button>
    </div>
  );
}
