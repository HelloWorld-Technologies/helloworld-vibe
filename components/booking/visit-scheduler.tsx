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
import { useAnimateOnView } from "@/src/lib/use-animate-on-view";
import { AnimateHeight } from "@/components/ui/animate-height";
import type { VisitDate, VisitTimeSlot } from "@/src/tokens/visit-scheduler";
import {
  visitSchedulerTitle,
  visitTimeSlotListMaxHeight,
} from "@/src/tokens/visit-scheduler";

type IndicatorStyle = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function useSlidingIndicator(activeId: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const [indicator, setIndicator] = useState<IndicatorStyle | null>(null);

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeItem = itemRefs.current.get(activeId);

    if (!container || !activeItem) {
      return;
    }

    setIndicator({
      left: activeItem.offsetLeft,
      top: activeItem.offsetTop,
      width: activeItem.offsetWidth,
      height: activeItem.offsetHeight,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [updateIndicator]);

  return { containerRef, itemRefs, indicator };
}

function StaggeredRow({
  children,
  delayOffset = 0,
  isActive,
  shouldAnimate,
}: {
  children: ReactNode;
  delayOffset?: number;
  isActive: boolean;
  shouldAnimate: boolean;
}) {
  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        shouldAnimate && (isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
      )}
      style={{
        transitionDelay:
          shouldAnimate && isActive ? `${delayOffset}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

export interface VisitSchedulerProps {
  dates: readonly VisitDate[];
  timeSlots: readonly VisitTimeSlot[];
  selectedDateId: string;
  selectedTimeSlotId: string;
  onDateChange: (id: string) => void;
  onTimeSlotChange: (id: string) => void;
  title?: string;
  className?: string;
  animate?: boolean;
  layout?: "default" | "embedded";
}

export function VisitScheduler({
  dates,
  timeSlots,
  selectedDateId,
  selectedTimeSlotId,
  onDateChange,
  onTimeSlotChange,
  title = visitSchedulerTitle,
  className,
  animate = true,
  layout = "default",
}: VisitSchedulerProps) {
  const embedded = layout === "embedded";
  const dateGroupId = useId();
  const timeGroupId = useId();
  const {
    ref: viewRef,
    isActive: inView,
    shouldAnimate,
  } = useAnimateOnView(animate && !embedded);
  const {
    containerRef: dateListRef,
    itemRefs: dateItemRefs,
    indicator: dateIndicator,
  } = useSlidingIndicator(selectedDateId);
  const {
    containerRef: timeListRef,
    itemRefs: timeItemRefs,
    indicator: timeIndicator,
  } = useSlidingIndicator(selectedTimeSlotId);
  const timeScrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = timeScrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [selectedDateId]);

  return (
    <div
      ref={viewRef}
      className={cn(
        embedded
          ? "w-full text-left"
          : "mx-auto w-full max-w-3xl px-2 text-center",
        className,
      )}
    >
      <h2
        className={cn(
          embedded
            ? "text-base font-medium text-[#343434]"
            : "text-lg font-semibold text-gray-900 sm:text-xl",
        )}
      >
        {title}
      </h2>

      <StaggeredRow
        isActive={inView}
        shouldAnimate={shouldAnimate}
        delayOffset={80}
      >
        <div
          className={cn(
            "overflow-x-auto scrollbar-none",
            embedded ? "mt-4" : "mt-8",
          )}
        >
          <div
            ref={dateListRef}
            role="radiogroup"
            aria-label="Visit date"
            className={cn(
              "relative flex w-max min-w-full gap-3 py-2 sm:gap-4",
              embedded ? "justify-start px-0" : "justify-center px-3",
            )}
          >
          {dateIndicator ? (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute rounded-2xl bg-blue-light-50",
                "transition-[left,width,top,height] duration-300 ease-in-out",
                "motion-reduce:transition-none",
              )}
              style={{
                left: dateIndicator.left,
                top: dateIndicator.top,
                width: dateIndicator.width,
                height: dateIndicator.height,
              }}
            />
          ) : null}

          {dates.map((date) => {
            const isSelected = date.id === selectedDateId;

            return (
              <label
                key={date.id}
                ref={(element) => {
                  if (element) {
                    dateItemRefs.current.set(date.id, element);
                  } else {
                    dateItemRefs.current.delete(date.id);
                  }
                }}
                className={cn(
                  "relative z-10 flex w-18 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border px-3 py-4",
                  "transition-[border-color,transform,box-shadow] duration-300 motion-reduce:transition-none",
                  "focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-light-100",
                  isSelected
                    ? "border-transparent text-blue-light-900"
                    : "border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm motion-reduce:hover:translate-y-0",
                )}
              >
                <input
                  type="radio"
                  name={dateGroupId}
                  value={date.id}
                  checked={isSelected}
                  onChange={() => onDateChange(date.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors duration-300 motion-reduce:transition-none",
                    isSelected ? "text-blue-light-900" : "text-gray-500",
                  )}
                >
                  {date.label}
                </span>
                <span
                  className={cn(
                    "mt-1 text-2xl font-bold tabular-nums transition-colors duration-300 motion-reduce:transition-none",
                    isSelected ? "text-blue-light-900" : "text-gray-300",
                  )}
                >
                  {date.day}
                </span>
              </label>
            );
          })}
          </div>
        </div>
      </StaggeredRow>

      <StaggeredRow
        isActive={inView}
        shouldAnimate={shouldAnimate}
        delayOffset={180}
      >
        <div className={embedded ? "mt-4" : "mt-6 sm:mt-8"}>
          {embedded ? (
            <div
              ref={timeScrollRef}
              className="overflow-y-auto scrollbar-none"
              style={{ maxHeight: visitTimeSlotListMaxHeight }}
            >
              <div
                key={selectedDateId}
                ref={timeListRef}
                role="radiogroup"
                aria-label="Visit time"
                className={cn(
                  "relative flex flex-wrap gap-3 py-2",
                  "justify-start px-0",
                )}
              >
                {timeIndicator ? (
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute rounded-full bg-blue-light-50",
                      "transition-[left,width,top,height] duration-300 ease-in-out",
                      "motion-reduce:transition-none",
                    )}
                    style={{
                      left: timeIndicator.left,
                      top: timeIndicator.top,
                      width: timeIndicator.width,
                      height: timeIndicator.height,
                    }}
                  />
                ) : null}

                {timeSlots.map((slot, index) => {
                  const isSelected = slot.id === selectedTimeSlotId;

                  return (
                    <label
                      key={slot.id}
                      ref={(element) => {
                        if (element) {
                          timeItemRefs.current.set(slot.id, element);
                        } else {
                          timeItemRefs.current.delete(slot.id);
                        }
                      }}
                      className={cn(
                        "relative z-10 cursor-pointer rounded-full px-5 py-3 text-sm font-semibold",
                        "transition-[color,transform] duration-300 motion-reduce:transition-none",
                        "focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-light-100",
                        "animate-tab-panel-in motion-reduce:animate-none",
                        isSelected
                          ? "text-blue-light-900"
                          : "bg-gray-100 text-gray-900 hover:-translate-y-0.5 hover:bg-gray-200/80 motion-reduce:hover:translate-y-0",
                      )}
                      style={{
                        animationDelay: `${index * 60}ms`,
                      }}
                    >
                      <input
                        type="radio"
                        name={timeGroupId}
                        value={slot.id}
                        checked={isSelected}
                        onChange={() => onTimeSlotChange(slot.id)}
                        className="sr-only"
                      />
                      {slot.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <AnimateHeight
              ref={timeScrollRef}
              className="overflow-y-auto scrollbar-none"
              style={{ maxHeight: visitTimeSlotListMaxHeight }}
            >
              <div
                key={selectedDateId}
                ref={timeListRef}
                role="radiogroup"
                aria-label="Visit time"
                className={cn(
                  "relative flex flex-wrap gap-3 py-2",
                  "justify-center px-2",
                )}
              >
          {timeIndicator ? (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute rounded-full bg-blue-light-50",
                "transition-[left,width,top,height] duration-300 ease-in-out",
                "motion-reduce:transition-none",
              )}
              style={{
                left: timeIndicator.left,
                top: timeIndicator.top,
                width: timeIndicator.width,
                height: timeIndicator.height,
              }}
            />
          ) : null}

          {timeSlots.map((slot, index) => {
            const isSelected = slot.id === selectedTimeSlotId;

            return (
              <label
                key={slot.id}
                ref={(element) => {
                  if (element) {
                    timeItemRefs.current.set(slot.id, element);
                  } else {
                    timeItemRefs.current.delete(slot.id);
                  }
                }}
                className={cn(
                  "relative z-10 cursor-pointer rounded-full px-5 py-3 text-sm font-semibold",
                  "transition-[color,transform] duration-300 motion-reduce:transition-none",
                  "focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-light-100",
                  "animate-tab-panel-in motion-reduce:animate-none",
                  isSelected
                    ? "text-blue-light-900"
                    : "bg-gray-100 text-gray-900 hover:-translate-y-0.5 hover:bg-gray-200/80 motion-reduce:hover:translate-y-0",
                )}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <input
                  type="radio"
                  name={timeGroupId}
                  value={slot.id}
                  checked={isSelected}
                  onChange={() => onTimeSlotChange(slot.id)}
                  className="sr-only"
                />
                {slot.label}
              </label>
            );
          })}
              </div>
            </AnimateHeight>
          )}
        </div>
      </StaggeredRow>
    </div>
  );
}
