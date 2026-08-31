"use client";

import { useId } from "react";
import { cn } from "@/src/lib/cn";

export interface TabNavItem {
  id: string;
  label: string;
  heading?: string;
}

export interface TabNavProps<T extends string = string> {
  items: readonly TabNavItem[];
  value: T;
  onChange: (id: T) => void;
  heading?: string;
  className?: string;
  "aria-label"?: string;
}

export function TabNav<T extends string>({
  items,
  value,
  onChange,
  heading,
  className,
  "aria-label": ariaLabel = "Property sections",
}: TabNavProps<T>) {
  const tabListId = useId();
  const activeItem = items.find((item) => item.id === value) ?? items[0];
  const sectionHeading =
    heading ?? activeItem?.heading ?? activeItem?.label ?? "";
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === value),
  );
  const count = Math.max(items.length, 1);

  return (
    <div className={cn("w-full min-w-0", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(
          "relative flex w-full items-center overflow-x-auto rounded-full bg-white p-1 scrollbar-none",
          "shadow-[0_2px_10px_rgba(16,24,40,0.08)]",
          "md:grid md:overflow-visible",
        )}
        style={{
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        }}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-1 left-1 hidden rounded-full bg-hello-lime-100 md:block",
            "transition-transform duration-300 ease-in-out",
            "motion-reduce:transition-none",
          )}
          style={{
            width: `calc((100% - 0.5rem) / ${count})`,
            transform: `translateX(calc(${selectedIndex} * 100%))`,
          }}
        />

        {items.map((item) => {
          const isActive = item.id === value;

          return (
            <button
              key={item.id}
              id={`${tabListId}-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabListId}-${item.id}-panel`}
              onClick={() => onChange(item.id as T)}
              className={cn(
                "relative z-10 shrink-0 cursor-pointer rounded-full px-3 py-2.5 text-center text-sm font-semibold transition-colors duration-300",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100",
                "motion-reduce:transition-none",
                "md:min-w-0 md:px-2",
                isActive
                  ? "bg-hello-lime-200 text-gray-900 md:bg-transparent"
                  : "text-gray-900 hover:text-gray-700",
              )}
            >
              <span className="block whitespace-nowrap md:truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {sectionHeading ? (
        <div
          role="tabpanel"
          id={`${tabListId}-${activeItem.id}-panel`}
          aria-labelledby={`${tabListId}-${activeItem.id}`}
          className="pt-6"
        >
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            <span className="bg-[linear-gradient(to_right,#08a4ed,#8c40c1)] bg-[length:100%_3px] bg-bottom bg-no-repeat pb-2">
              {sectionHeading}
            </span>
          </h2>
        </div>
      ) : null}
    </div>
  );
}

export const propertyDetailTabs = [
  {
    id: "about",
    label: "About",
    heading: "About Helloworld Park Square",
  },
  {
    id: "amenities",
    label: "Amenities",
    heading: "Amenities at Helloworld Park Square",
  },
  {
    id: "nearby",
    label: "Nearby Places",
    heading: "Nearby Places",
  },
  {
    id: "reviews",
    label: "Reviews",
    heading: "Reviews",
  },
] as const;

export type PropertyDetailTab = (typeof propertyDetailTabs)[number]["id"];
