"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Modal, ModalTitle } from "@/components/ui/modal";
import { cn } from "@/src/lib/cn";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDisplayDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return "DD/MM/YYYY";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M17.5 8.33333H2.5M13.3333 1.66667V5M6.66667 1.66667V5M6.5 18.3333H13.5C14.9001 18.3333 15.6002 18.3333 16.135 18.0608C16.6054 17.821 16.9877 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3333V7.66667C17.5 6.26654 17.5 5.56647 17.2275 5.03169C16.9877 4.56128 16.6054 4.17897 16.135 3.93915C15.6002 3.66667 14.9001 3.66667 13.5 3.66667H6.5C5.09987 3.66667 4.3998 3.66667 3.86502 3.93915C3.39462 4.17897 3.01231 4.56128 2.77249 5.03169C2.5 5.56647 2.5 6.26654 2.5 7.66667V14.3333C2.5 15.7335 2.5 16.4335 2.77249 16.9683C3.01231 17.4387 3.39462 17.821 3.86502 18.0608C4.3998 18.3333 5.09987 18.3333 6.5 18.3333Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({
  direction,
  className,
}: {
  direction: "prev" | "next";
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d={direction === "prev" ? "M12.5 15 7.5 10l5-5" : "M7.5 5l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function getDefaultMoveInDateBounds() {
  const min = startOfDay(new Date());
  const max = startOfDay(new Date());
  max.setDate(max.getDate() + 6);
  return { min: toDateInputValue(min), max: toDateInputValue(max) };
}

export function MoveInDatePickerModal({
  open,
  onClose,
  value,
  min,
  max,
  onSelect,
  title = "Pick Your move in date",
}: {
  open: boolean;
  onClose: () => void;
  value?: string;
  min?: string;
  max?: string;
  onSelect: (value: string) => void;
  title?: string;
}) {
  const titleId = useId();
  const bounds = useMemo(() => {
    const defaults = getDefaultMoveInDateBounds();
    return {
      min: parseDateInput(min ?? defaults.min) ?? parseDateInput(defaults.min)!,
      max: parseDateInput(max ?? defaults.max) ?? parseDateInput(defaults.max)!,
    };
  }, [min, max]);

  const selected = parseDateInput(value ?? "");
  const [viewMonth, setViewMonth] = useState(() => selected ?? bounds.min);

  useEffect(() => {
    if (!open) return;
    setViewMonth(selected ?? bounds.min);
  }, [open, selected, bounds.min]);

  const days = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const startOffset = first.getDay();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < startOffset; i += 1) cells.push(null);
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0,
    ).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
    }
    return cells;
  }, [viewMonth]);

  const monthLabel = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  function canSelect(date: Date) {
    const day = startOfDay(date);
    return day >= bounds.min && day <= bounds.max;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      closeLabel="Close move-in date picker"
      maxWidthClassName="max-w-md"
      // Above HDP / booking edit sheets on mobile.
      overlayClassName="z-[80]"
      className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:p-6"
    >
      <ModalTitle id={titleId} className="text-xl sm:text-2xl">
        {title}
      </ModalTitle>

      <div className="mt-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Previous month"
            className="inline-flex size-11 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
            onClick={() =>
              setViewMonth(
                new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
              )
            }
          >
            <ChevronIcon direction="prev" className="size-5" />
          </button>
          <p className="text-base font-semibold text-gray-900">{monthLabel}</p>
          <button
            type="button"
            aria-label="Next month"
            className="inline-flex size-11 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
            onClick={() =>
              setViewMonth(
                new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
              )
            }
          >
            <ChevronIcon direction="next" className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 sm:text-sm">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square min-h-11" />;
            }
            const enabled = canSelect(date);
            const isSelected = selected ? isSameDay(date, selected) : false;
            return (
              <button
                key={toDateInputValue(date)}
                type="button"
                disabled={!enabled}
                onClick={() => {
                  onSelect(toDateInputValue(date));
                  onClose();
                }}
                className={cn(
                  "aspect-square min-h-11 rounded-xl text-sm font-semibold transition-colors sm:text-base",
                  "touch-manipulation active:scale-[0.98]",
                  isSelected
                    ? "bg-hello-lime-400 text-gray-900"
                    : enabled
                      ? "text-gray-900 hover:bg-hello-lime-100 active:bg-hello-lime-200"
                      : "cursor-not-allowed text-gray-300",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

/** Field that opens the same move-in calendar modal as the current website. */
export function MoveInDatePickerField({
  id,
  label = "Move in Date",
  value,
  min,
  max,
  error,
  onChange,
  className,
}: {
  id?: string;
  label?: string;
  value: string;
  min?: string;
  max?: string;
  error?: boolean;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const bounds = getDefaultMoveInDateBounds();

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        aria-invalid={error || undefined}
        className={cn(
          "flex min-h-11 w-full items-center justify-between rounded-lg border bg-white px-3.5 text-left text-sm shadow-xs transition-colors",
          "touch-manipulation focus:outline-none focus:ring-4",
          error
            ? "border-error-300 hover:border-error-400 focus:border-error-300 focus:ring-error-100"
            : "border-gray-300 hover:border-gray-400 focus:border-hello-lime-300 focus:ring-hello-lime-100",
        )}
      >
        <span className={value ? "font-semibold text-gray-900" : "text-gray-400"}>
          {formatDisplayDate(value)}
        </span>
        <CalendarIcon className="size-4 shrink-0 text-gray-500" />
      </button>

      <MoveInDatePickerModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        min={min ?? bounds.min}
        max={max ?? bounds.max}
        onSelect={onChange}
        title="Pick Your move in date"
      />
    </div>
  );
}
