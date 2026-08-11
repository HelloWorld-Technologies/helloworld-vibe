"use client";

import { useState, type RefObject } from "react";
import { cn } from "@/src/lib/cn";
import type { VibeChip } from "@/src/tokens/vibes";

const vibeChipSelectedBorderClass =
  "bg-[linear-gradient(to_right,#28b2b0_0%,#08a4ed_50%,#8c40c1_100%)]";

function VibeCheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="M5 8l2 2 4-4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VibeChipButton({
  chip,
  selected,
  onToggle,
}: {
  chip: VibeChip;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-full p-px transition-[background] duration-300 ease-out motion-reduce:transition-none",
        selected ? vibeChipSelectedBorderClass : "bg-transparent",
      )}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onToggle(chip.id)}
        className={cn(
          "inline-flex items-center rounded-full bg-white px-3 py-2 text-sm font-medium",
          "transition-[color,border-color,background-color] duration-300 ease-out motion-reduce:transition-none",
          selected
            ? "border border-transparent text-gray-900"
            : "border border-gray-200 text-gray-600 hover:border-gray-300",
        )}
      >
        <span aria-hidden className="mr-2 shrink-0">
          {chip.emoji}
        </span>
        <span className="whitespace-nowrap">{chip.label}</span>
        <span
          aria-hidden
          className={cn(
            "inline-flex overflow-hidden transition-[width,margin,opacity] duration-300 ease-out motion-reduce:transition-none",
            selected
              ? "ml-2 w-4 opacity-100"
              : "ml-0 w-0 opacity-0",
          )}
        >
          <VibeCheckIcon className="size-4 shrink-0 text-hello-lime-500" />
        </span>
      </button>
    </div>
  );
}

export type VibeChipsProps = {
  chips: readonly VibeChip[];
  selectedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  /** When set, truncates the list and shows a "+N More" control for the rest. */
  showMaxCount?: number;
  className?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

export function VibeChips({
  chips,
  selectedIds,
  onToggle,
  showMaxCount,
  className,
  scrollRef,
}: VibeChipsProps) {
  const [expanded, setExpanded] = useState(false);

  const canTruncate =
    showMaxCount != null && chips.length > showMaxCount && !expanded;
  const visibleChips = canTruncate ? chips.slice(0, showMaxCount) : chips;
  const hiddenCount =
    showMaxCount != null ? Math.max(0, chips.length - showMaxCount) : 0;
  const showMoreButton = canTruncate && hiddenCount > 0;

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
        className,
      )}
    >
      {visibleChips.map((chip) => (
        <VibeChipButton
          key={chip.id}
          chip={chip}
          selected={selectedIds.has(chip.id)}
          onToggle={onToggle}
        />
      ))}

      {showMoreButton ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-gradient-to-r from-hello-lime-100 to-[#f4fce9] px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:from-hello-lime-200 hover:to-hello-lime-100"
        >
          +{hiddenCount} More
        </button>
      ) : null}
    </div>
  );
}
