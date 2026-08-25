import { cn } from "@/src/lib/cn";

function CarouselArrowButton({
  direction,
  label,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-6">
        <path
          d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function HomepageCarouselPagination({
  pageCount,
  activeIndex,
  onPrev,
  onNext,
  onSelectPage,
  prevDisabled,
  nextDisabled,
  className,
  placeholder = false,
  /** Desktop keeps arrows; mobile uses dots-only. */
  showArrows = true,
  /** Active pill color. Mobile design uses dark gray. */
  activeTone = "lime",
}: {
  pageCount: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectPage?: (index: number) => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
  /** Renders non-interactive dots for loading states. */
  placeholder?: boolean;
  showArrows?: boolean;
  activeTone?: "lime" | "gray";
}) {
  const dotCount = placeholder ? 6 : pageCount;
  const activeClass =
    activeTone === "gray" ? "bg-gray-700" : "bg-hello-lime-400";

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        showArrows ? "gap-6" : "gap-0",
        className,
      )}
    >
      {showArrows ? (
        <CarouselArrowButton
          direction="prev"
          label="Previous"
          disabled={prevDisabled}
          onClick={onPrev}
        />
      ) : null}

      <div className="flex items-center gap-2">
        {Array.from({ length: dotCount }, (_, index) => {
          const isActive = index === activeIndex;

          if (placeholder) {
            return (
              <span
                key={index}
                aria-hidden
                className={cn(
                  "rounded-full bg-gray-300",
                  isActive
                    ? cn("h-2 w-8", activeClass)
                    : "size-2 opacity-60",
                )}
              />
            );
          }

          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive}
              disabled={!onSelectPage}
              onClick={() => onSelectPage?.(index)}
              className={cn(
                "rounded-full transition-all",
                isActive
                  ? cn("h-2 w-8", activeClass)
                  : "size-2 bg-gray-300 hover:bg-gray-400",
              )}
            />
          );
        })}
      </div>

      {showArrows ? (
        <CarouselArrowButton
          direction="next"
          label="Next"
          disabled={nextDisabled}
          onClick={onNext}
        />
      ) : null}
    </div>
  );
}
