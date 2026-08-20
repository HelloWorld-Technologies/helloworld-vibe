"use client";

import Image from "next/image";
import Link from "next/link";
import { PaginatedCarousel } from "@/components/ui/paginated-carousel";
import type { HdpReviewSummaryView } from "@/src/lib/hdp/map-hdp-api";
import type { HdpResidentReview } from "@/src/tokens/hdp-reviews";
import { cn } from "@/src/lib/cn";

const VISIBLE_DESKTOP_COUNT = 3;

function RecommendRing({ percent }: { percent: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#7FC723"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-hello-lime-700">
        {percent}%
      </span>
    </div>
  );
}

function CategoryBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const widthPercent = Math.min(100, (score / 5) * 100);

  return (
    <div className="flex items-center gap-4">
      <span className="w-[4.625rem] shrink-0 text-sm font-medium text-gray-800">
        {label}
      </span>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7FC723] to-[#3E6111]"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-medium text-gray-800">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function ReviewCard({
  review,
  className,
}: {
  review: HdpResidentReview;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-[16.375rem] w-full shrink-0 flex-col gap-4 rounded-[10px] border border-[#eee] bg-white p-4 shadow-[0_1px_5.5px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-gray-100">
          <Image
            src={review.avatarSrc}
            alt=""
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <p className="truncate text-base font-bold text-gray-900">
            {review.name}
          </p>
          <span className="shrink-0 rounded-2xl bg-blue-light-50 px-2 py-0.5 text-xs font-medium text-blue-light-600">
            {review.rating}★
          </span>
        </div>
      </div>
      <p className="line-clamp-6 text-sm leading-5 text-[#343434]">
        {review.quote}
      </p>
    </article>
  );
}

export function HdpReviews({
  reviewSummary,
  residentReviews,
  googleLink,
  className,
}: {
  reviewSummary?: HdpReviewSummaryView | null;
  residentReviews?: readonly HdpResidentReview[];
  googleLink?: string;
  className?: string;
}) {
  const summary = reviewSummary ?? null;
  const reviews = residentReviews ?? [];
  const allReviewsLink = googleLink;

  if (!summary && reviews.length === 0) return null;

  return (
    <section
      className={cn("space-y-8", className)}
      aria-label="What residents say"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-medium text-black md:text-[1.875rem] md:leading-[2.375rem]">
          What Residents Say
        </h2>
        {allReviewsLink ? (
          <Link
            href={allReviewsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-semibold text-hello-lime-600 hover:text-hello-lime-700 hover:underline md:inline"
          >
            Show all Google reviews
          </Link>
        ) : null}
      </div>

      <div className="space-y-4">
        {summary ? (
        <div
          className={cn(
            "rounded-2xl border border-gray-300/60 p-4 md:p-[1.0625rem]",
            "bg-[linear-gradient(131deg,rgba(255,255,255,0.56)_45.09%,rgba(213,236,249,0.56)_94.76%),linear-gradient(90deg,#fff_0%,#fff_100%)]",
          )}
        >
          {/* Mobile: rating | recommend on top, categories below */}
          <div className="space-y-4 lg:hidden">
            <div className="flex items-stretch gap-4">
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[1.875rem] font-medium leading-[2.375rem] text-gray-800">
                  {summary.rating}
                  <span className="text-amber-400">★</span>
                </p>
                <p className="text-base font-bold text-gray-900">{summary.label}</p>
                <p className="text-xs font-medium text-gray-500">
                  Based on {summary.reviewCount} reviews
                </p>
              </div>

              <div className="w-px shrink-0 bg-gray-300" aria-hidden />

              <div className="flex w-[7.5rem] shrink-0 flex-col items-center justify-center gap-2 text-center">
                <RecommendRing percent={summary.recommendPercent} />
                <p className="text-xs font-medium leading-4 text-gray-800">
                  Residents would recommend to a friend
                </p>
              </div>
            </div>

            {/* Category bars — re-enable when scores are integrated
            <div className="h-px bg-gray-300" />

            <div className="flex flex-col gap-3">
              {summary.categories.map((category) => (
                <CategoryBar
                  key={category.label}
                  label={category.label}
                  score={category.score}
                />
              ))}
            </div>
            */}
          </div>

          {/* Desktop */}
          <div className="hidden flex-col gap-6 lg:flex lg:flex-row lg:items-stretch lg:justify-between">
            <div className="space-y-4 lg:max-w-[18.3125rem]">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[1.875rem] font-medium leading-[2.375rem] text-gray-800">
                    {summary.rating}
                    <span className="text-amber-400">★</span>
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {summary.label}
                  </p>
                </div>
                <p className="text-xs font-medium text-gray-500">
                  Based on {summary.reviewCount} verified reviews
                </p>
              </div>

              <div className="h-px bg-gray-300" />

              <div className="flex items-center gap-4">
                <RecommendRing percent={summary.recommendPercent} />
                <p className="max-w-[9.375rem] text-sm font-medium leading-5 text-gray-800">
                  Residents would recommend to a friend
                </p>
              </div>
            </div>

            {/* Category bars — re-enable when scores are integrated
            <div className="hidden w-px shrink-0 bg-gray-300 lg:block" />

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 lg:max-w-[18.875rem]">
              {summary.categories.map((category) => (
                <CategoryBar
                  key={category.label}
                  label={category.label}
                  score={category.score}
                />
              ))}
            </div>
            */}
          </div>
        </div>
        ) : null}

        {reviews.length > 0 ? (
        <PaginatedCarousel
          items={reviews}
          getItemKey={(review) => review.id}
          visibleDesktopCount={VISIBLE_DESKTOP_COUNT}
          mobileScrollGap={16}
          desktopItemClassName="w-full"
          mobileItemClassName="w-[min(18.8125rem,85vw)]"
          paginationClassName="mt-4"
          mobilePaginationClassName="mt-4"
          renderItem={(review, cardClassName) => (
            <ReviewCard review={review} className={cardClassName} />
          )}
        />
        ) : null}
      </div>
    </section>
  );
}
