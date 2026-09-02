import { LocalityCarouselButton } from "@/components/marketing/locality-card";
import { cn } from "@/src/lib/cn";

export function HomepageCarouselNav({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  className,
  pageCount,
  activeIndex = 0,
  onSelectPage,
}: {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
  pageCount?: number;
  activeIndex?: number;
  onSelectPage?: (index: number) => void;
}) {
  const dotCount = pageCount ?? 0;
  const showPagination = dotCount > 1;

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        showPagination ? "gap-6" : "gap-4",
        className,
      )}
    >
      <LocalityCarouselButton
        direction="prev"
        label="Previous"
        disabled={prevDisabled}
        onClick={onPrev}
        className="hidden sm:flex"
      />
      {showPagination ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: dotCount }, (_, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive}
                disabled={!onSelectPage}
                onClick={() => onSelectPage?.(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  isActive
                    ? "w-8 bg-hello-lime-400"
                    : "w-2 bg-gray-300 hover:bg-gray-400",
                )}
              />
            );
          })}
        </div>
      ) : null}
      <LocalityCarouselButton
        direction="next"
        label="Next"
        disabled={nextDisabled}
        onClick={onNext}
        className="hidden sm:flex"
      />
    </div>
  );
}
