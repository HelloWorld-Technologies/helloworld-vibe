"use client";

import { useState } from "react";
import { formatAmenityForDisplay } from "@/src/lib/amenity-display";
import { cn } from "@/src/lib/cn";

const VISIBLE_COUNT = 11;

export function HdpAmenities({
  amenities,
  className,
}: {
  amenities?: readonly string[];
  className?: string;
}) {
  const [showAll, setShowAll] = useState(false);

  const source = amenities ?? [];
  if (source.length === 0) return null;

  const items = source.map((raw, index) => {
    const display = formatAmenityForDisplay(raw);
    return {
      id: `${display.label}-${index}`,
      ...display,
    };
  });

  const visible = showAll ? items : items.slice(0, VISIBLE_COUNT);
  const hasMore = items.length > VISIBLE_COUNT;

  return (
    <section
      id="hdp-amenities"
      className={cn("scroll-mt-32 space-y-6", className)}
      aria-label="Amenities section"
    >
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Amenities</h2>
      <div className="flex flex-wrap gap-2">
        {visible.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800"
          >
            <span aria-hidden>{item.emoji}</span>
            {item.label}
          </span>
        ))}
        {hasMore && !showAll ? (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full bg-hello-lime-400 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-hello-lime-500"
          >
            View All
          </button>
        ) : null}
      </div>
    </section>
  );
}
