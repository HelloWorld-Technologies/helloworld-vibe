"use client";

import { cn } from "@/src/lib/cn";

export type LocalityMobileTab = "properties" | "details";

const DEFAULT_TABS: { id: LocalityMobileTab; label: string }[] = [
  { id: "properties", label: "Coliving PGs" },
  { id: "details", label: "Locality Details" },
];

export function LocalityMobileTabs({
  value,
  onChange,
  className,
  tabs = DEFAULT_TABS,
}: {
  value: LocalityMobileTab;
  onChange: (tab: LocalityMobileTab) => void;
  className?: string;
  tabs?: readonly { id: LocalityMobileTab; label: string }[];
}) {
  if (tabs.length < 2) return null;
  return (
    <div
      className={cn(
        "mx-auto flex w-fit rounded-full bg-gray-100 p-1 md:hidden",
        className,
      )}
      role="tablist"
      aria-label="Locality sections"
    >
      {tabs.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              selected
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
