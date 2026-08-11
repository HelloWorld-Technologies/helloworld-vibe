"use client";

import { useState } from "react";
import {
  hdpResidentColleges,
  hdpResidentInterests,
  hdpResidentWorkplaces,
  hdpSelectedVibes,
  hdpVibeOverallScore,
} from "@/src/tokens/hdp";
import { cn } from "@/src/lib/cn";

function VibeScoreRing({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 56 56" className="size-full rotate-90" aria-hidden>
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
          stroke="url(#vibe-ring)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="vibe-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#378ADD" />
            <stop offset="50%" stopColor="#7F77DD" />
            <stop offset="100%" stopColor="#D4537E" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-gradient-score-vibe absolute inset-0 flex items-center justify-center text-sm font-bold">
        {score}%
      </span>
    </div>
  );
}

function ChevronIcon({
  className,
  direction = "down",
}: {
  className?: string;
  direction?: "up" | "down";
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-3.5", className)}
    >
      <path
        d={direction === "up" ? "M4 10.5 8 6.5 12 10.5" : "M4 6.5 8 10.5 12 6.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResidentInsightCard({
  emoji,
  label,
  items,
  extraCount,
}: {
  emoji: string;
  label: string;
  items: readonly string[];
  extraCount: number;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-2xl bg-[#EBF5FF]/70 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        <span aria-hidden className="text-sm leading-none">
          {emoji}
        </span>
        {label}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">
          {items.join(" • ")}
        </p>
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-gray-800 shadow-sm">
          +{extraCount}
        </span>
      </div>
    </div>
  );
}

export function HdpVibeMatch({
  displayName,
  className,
}: {
  displayName?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const propertyLabel = displayName ?? "this property";

  return (
    <section
      className={cn(
        "rounded-[1.25rem] border border-[#ece6f5]/80 bg-gradient-property-vibe-match p-4 md:rounded-3xl md:p-6",
        className,
      )}
      aria-label="Vibe match"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-6 tracking-tight text-gray-900 md:text-xl md:leading-7">
            How well this home matches your vibe
          </h2>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Based on the {hdpSelectedVibes.length} vibes you selected
          </p>
        </div>
        <VibeScoreRing score={hdpVibeOverallScore} />
      </div>

      <div className="-mx-1 mt-5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2.5 md:gap-3">
          {hdpSelectedVibes.map((vibe) => (
            <div
              key={vibe.label}
              className="flex w-[5.75rem] shrink-0 flex-col items-center rounded-2xl bg-white px-2 py-3.5 shadow-sm"
            >
              <span className="text-xl leading-none" aria-hidden>
                {vibe.emoji}
              </span>
              <span className="mt-2 text-center text-xs font-medium text-gray-800">
                {vibe.label}
              </span>
              <span className="text-gradient-score-vibe mt-1 text-sm font-bold">
                {vibe.score}%
              </span>
              <span className="text-[11px] text-gray-400">Match</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <ResidentInsightCard
          emoji="👨‍💻"
          label="Residents work at"
          items={hdpResidentWorkplaces.preview}
          extraCount={hdpResidentWorkplaces.extraCount}
        />
        <ResidentInsightCard
          emoji="🎓"
          label="From colleges like"
          items={hdpResidentColleges.preview}
          extraCount={hdpResidentColleges.extraCount}
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-gray-600">
          See what residents at {propertyLabel} are usually into
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-blue-light-600 hover:text-blue-light-700"
          aria-expanded={expanded}
        >
          {expanded ? "Show Less" : "Show More"}
          <ChevronIcon direction={expanded ? "up" : "down"} />
        </button>
      </div>

      {expanded ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {hdpResidentInterests.map((interest) => (
            <span
              key={interest.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm"
            >
              <span aria-hidden>{interest.emoji}</span>
              {interest.label}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
