"use client";

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/src/lib/cn";

export interface UnderlineTabItem {
  id: string;
  label: string;
}

export interface UnderlineTabsProps<T extends string = string> {
  items: readonly UnderlineTabItem[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  baseId?: string;
  layout?: "stretch" | "inline" | "start";
  "aria-label"?: string;
}

type IndicatorStyle = {
  left: number;
  width: number;
};

export function UnderlineTabs<T extends string>({
  items,
  value,
  onChange,
  className,
  baseId,
  layout = "stretch",
  "aria-label": ariaLabel = "Sections",
}: UnderlineTabsProps<T>) {
  const generatedId = useId();
  const tabListId = baseId ?? generatedId;
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const hasMountedRef = useRef(false);
  const [indicator, setIndicator] = useState<IndicatorStyle | null>(null);
  const isInline = layout === "inline";
  const isStart = layout === "start";
  const isCompact = isInline || isStart;

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const activeTab = tabRefs.current.get(value);

    if (!list || !activeTab) {
      return;
    }

    setIndicator({
      left: activeTab.offsetLeft,
      width: activeTab.offsetWidth,
    });

    list.scrollTo({
      left: activeTab.offsetLeft - 16,
      behavior: hasMountedRef.current ? "smooth" : "instant",
    });
    hasMountedRef.current = true;
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, items]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    observer.observe(list);
    return () => observer.disconnect();
  }, [updateIndicator]);

  return (
    <div className={cn("w-full min-w-0 border-b border-gray-200", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(
          "relative flex overflow-x-auto scroll-smooth scrollbar-none",
          isInline
            ? "justify-center gap-8 sm:overflow-visible"
            : isStart
              ? "justify-start gap-8 sm:overflow-visible"
              : "sm:overflow-visible",
        )}
      >
        {items.map((item) => {
          const isActive = item.id === value;

          return (
            <button
              key={item.id}
              ref={(element) => {
                if (element) {
                  tabRefs.current.set(item.id, element);
                } else {
                  tabRefs.current.delete(item.id);
                }
              }}
              id={`${tabListId}-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabListId}-${item.id}-panel`}
              onClick={() => onChange(item.id as T)}
              className={cn(
                "relative shrink-0 py-2.5 text-sm font-semibold transition-colors duration-300",
                isCompact
                  ? "px-0"
                  : "px-3 py-4 sm:flex-1 sm:px-4 sm:text-center",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100",
                "motion-reduce:transition-none",
                isActive
                  ? "text-hello-lime-600"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {item.label}
            </button>
          );
        })}

        {indicator ? (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute bottom-0 h-0.5 bg-hello-lime-500",
              "transition-[left,width] duration-300 ease-in-out",
              "motion-reduce:transition-none",
            )}
            style={{
              left: indicator.left,
              width: indicator.width,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export interface UnderlineTabPanelProps {
  id: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function UnderlineTabPanel({
  id,
  labelledBy,
  children,
  className,
  active = true,
}: UnderlineTabPanelProps) {
  if (!active) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      className={cn("animate-tab-panel-in motion-reduce:animate-none", className)}
    >
      {children}
    </div>
  );
}
