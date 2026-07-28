"use client";

import Image from "next/image";
import { LocationSearch } from "@/components/search/location-search";
import { VibeChips } from "@/components/ui/vibe-chips";
import { cn } from "@/src/lib/cn";
import { useSelectedVibes } from "@/src/lib/use-selected-vibes";
import { useVibeList } from "@/src/lib/use-vibe-list";
import { pageShell } from "@/src/tokens/layout";
import {
  homepageHeroDesktop,
  homepageHeroMobile,
} from "@/src/tokens/homepage";
import type { VibeChip } from "@/src/tokens/vibes";

const heroImageBlendOverlayClass =
  "pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-[linear-gradient(to_right,#FAFAFA_0%,color-mix(in_srgb,#FAFAFA_96%,transparent)_30%,color-mix(in_srgb,#ffffff_70%,transparent)_48%,color-mix(in_srgb,#FAFAFA_30%,transparent)_66%,transparent_84%)]";

function HomepageHeroHeading({
  className,
  size = "desktop",
}: {
  className?: string;
  size?: "desktop" | "mobile";
}) {
  return (
    <h1
      className={cn(
        "font-bold tracking-tight text-gray-900",
        size === "desktop"
          ? "max-w-xl text-display-md sm:text-display-lg lg:text-[3.75rem] lg:leading-[4.5rem]"
          : "max-w-[19rem] text-[1.625rem] leading-[1.875rem]",
        className,
      )}
    >
      <span className="block">Coliving that</span>
      <span className="block">
        Matches Your{" "}
        <span className="font-satoshi font-bold italic text-gradient-vibe">
          Vibe!
        </span>
      </span>
    </h1>
  );
}

function VibeFilters({
  chips,
  selectedVibes,
  onToggle,
}: {
  chips: readonly VibeChip[];
  selectedVibes: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm text-gray-600">
        <span aria-hidden className="mr-1">
          ✨
        </span>
        Add your vibe for better matches{" "}
        <span className="text-xs italic text-gray-400">(optional)</span>
      </p>

      <VibeChips
        chips={chips}
        selectedIds={selectedVibes}
        onToggle={onToggle}
        showMaxCount={4}
        className="mt-3 lg:flex-wrap lg:overflow-visible"
      />
    </div>
  );
}

export function HomepageHero() {
  const { vibes } = useVibeList();
  const { selectedVibes, toggleVibe } = useSelectedVibes();

  return (
    <section className="relative bg-white max-w-7xl mx-auto ">
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="relative h-[17.25rem] w-full overflow-hidden bg-white">
          <Image
            src={homepageHeroMobile.file}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.35)_40%,transparent_72%)]"
          />
          <div className="absolute inset-x-4 top-2">
            <HomepageHeroHeading size="mobile" />
          </div>
        </div>

        <div className="relative z-20 bg-white px-4 pb-8 pt-5 sm:px-6">
          <LocationSearch localityPlaceholder="Search Here" />
          <VibeFilters
            chips={vibes}
            selectedVibes={selectedVibes}
            onToggle={toggleVibe}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden bg-gray-50 lg:block lg:min-h-[28.875rem] rounded-b-[50px] ">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%]">
          <Image
            src={homepageHeroDesktop.file}
            alt={homepageHeroDesktop.name}
            fill
            priority
            sizes="58vw"
            className="object-cover object-left-bottom rounded-b-[50px] overflow-hidden"
          />
          <div aria-hidden className={heroImageBlendOverlayClass} />
        </div>

        <div className={pageShell.homepageHero}>
          <div className={cn(pageShell.homepageHeroCopy, "pb-10 pt-10 xl:pb-12 xl:pt-12")}>
            <HomepageHeroHeading />

            <div className="relative z-20 mt-8">
              <LocationSearch localityPlaceholder="Search for Localities" />
            </div>

            <VibeFilters
              chips={vibes}
              selectedVibes={selectedVibes}
              onToggle={toggleVibe}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
