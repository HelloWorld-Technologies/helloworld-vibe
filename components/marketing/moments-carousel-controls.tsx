import { LocalityCarouselButton } from "@/components/marketing/locality-card";
import { cn } from "@/src/lib/cn";

export function MomentsCarouselControls({
  count,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
  prevDisabled,
  nextDisabled,
  className,
}: {
  count: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-0 sm:gap-5",
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
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to moment ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => onSelect(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex
                ? "w-8 bg-gray-700"
                : "w-2 bg-gray-300",
            )}
          />
        ))}
      </div>
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
