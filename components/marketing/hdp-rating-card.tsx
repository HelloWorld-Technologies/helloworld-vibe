import Image from "next/image";
import type { ReactNode } from "react";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { hdpProperty } from "@/src/tokens/hdp";
import { cn } from "@/src/lib/cn";

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 7" fill="none" className={className}>
      <path
        d="M1 5.5 4.25 2.25 6.5 4.5 11 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" fill="currentColor" className={className}>
      <path d="M6 1.2 7.545 4.13l3.21.28-2.43 2.11.73 3.15L6 8.28l-3.055 1.39.73-3.15-2.43-2.11 3.21-.28L6 1.2Z" />
    </svg>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: number | string;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-[4.25rem] text-center">
      <p className="text-2xl font-bold leading-none tabular-nums text-gray-900">
        {value}
      </p>
      <p className="mt-1.5 flex h-4 items-center justify-center gap-1 text-xs text-gray-500">
        {icon}
        <span>{label}</span>
      </p>
    </div>
  );
}

function StatDivider() {
  return <div className="h-10 w-px shrink-0 bg-gray-200" aria-hidden />;
}

export function HdpRatingCard({
  view,
  className,
  showTrophy = false,
}: {
  view?: HdpPageView;
  className?: string;
  showTrophy?: boolean;
}) {
  const displayName = view?.displayName ?? hdpProperty.name;
  const trendingLabel = view ? view.trendingLabel : hdpProperty.trendingLabel;
  const topChoiceCopy = view?.topChoiceCopy ?? hdpProperty.topChoiceCopy;
  const topChoiceDate = view?.topChoiceDate;
  const rating = view?.rating ?? hdpProperty.rating;
  const visitsScheduled = view?.visitsScheduled ?? hdpProperty.visitsToday;
  const reviewCount = view?.reviewCount ?? hdpProperty.reviewCount;
  const ratingLabel =
    rating != null && Number.isFinite(rating) ? rating.toFixed(1) : "—";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
      aria-label="Property rating summary"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[min(42%,14rem)] bg-linear-to-l from-blue-light-50 to-transparent"
      />

      <div className="relative flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 md:p-6">
        <div className="min-w-0 flex-1 space-y-2">
          {trendingLabel ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-hello-lime-50 px-2 py-0.5 text-xs font-semibold text-hello-lime-800">
              <TrendingIcon className="size-3" />
              {trendingLabel}
            </span>
          ) : null}
          <p className="text-sm leading-snug text-gray-700 md:text-base md:leading-normal">
            <span className="font-semibold text-gray-900">{displayName}</span>{" "}
            <span className="text-gray-600">{topChoiceCopy}</span>
          </p>
          {topChoiceDate ? (
            <p className="text-sm text-gray-500">{topChoiceDate}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end sm:gap-5 md:gap-6">
          <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
            <Stat
              value={ratingLabel}
              label="Rating"
              icon={<StarIcon className="size-3 text-amber-400" />}
            />
            {visitsScheduled != null ? (
              <>
                <StatDivider />
                <Stat value={visitsScheduled} label="Visits scheduled" />
              </>
            ) : null}
            <StatDivider />
            <Stat value={reviewCount} label="Reviews" />
          </div>

          <Image
            src={hdpProperty.trophySrc}
            alt=""
            width={80}
            height={80}
            className={cn(
              "size-14 shrink-0 object-contain sm:size-16 md:size-20",
              !showTrophy && "hidden sm:block",
            )}
          />
        </div>
      </div>
    </section>
  );
}
