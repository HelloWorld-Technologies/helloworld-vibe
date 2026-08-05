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
          : "max-w-[17.5rem] text-center text-[1.625rem] leading-[2rem]",
        className,
      )}
    >
      {size === "mobile" ? (
        <>
          Coliving that Matches Your{" "}
          <span className="font-satoshi font-bold italic text-gradient-vibe">
            Vibe!
          </span>
        </>
      ) : (
        <>
          <span className="block">Coliving that</span>
          <span className="block">
            Matches Your{" "}
            <span className="font-satoshi font-bold italic text-gradient-vibe">
              Vibe!
            </span>
          </span>
        </>
      )}
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
    <div className="mt-0 lg:mt-5">
      <p className="text-sm text-gray-600">
        <span aria-hidden className="mr-1">
          ✨
        </span>
        Pick up to 5 vibes for better matches{" "}
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
    <section className="relative mx-auto max-w-7xl bg-white">
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="relative">
          <div className="overflow-hidden rounded-b-[3.5rem] bg-[#f3f4f6]">
            <div className="relative z-10 px-4 pb-1 pt-3">
              <div className="flex justify-center">
                <HomepageHeroHeading size="mobile" />
              </div>
            </div>

            <div className="relative -mt-2 w-full">
              <Image
                src={homepageHeroMobile.file}
                alt=""
                width={750}
                height={560}
                priority
                sizes="100vw"
                className="h-auto w-full object-bottom"
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-4 sm:px-6">
            <div className="pointer-events-auto">
              <LocationSearch
                localityPlaceholder="Search Localities"
                barClassName="border-gray-300 shadow-[0_8px_0_0_#8b8f96]"
              />
            </div>
          </div>
        </div>

        <div className="px-4 pb-8 pt-[3.25rem] sm:px-6">
          <VibeFilters
            chips={vibes}
            selectedVibes={selectedVibes}
            onToggle={toggleVibe}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden rounded-b-[50px] bg-gray-50 lg:block lg:min-h-[28.875rem]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] overflow-hidden rounded-b-[50px]">
          <Image
            src={homepageHeroDesktop.file}
            alt={homepageHeroDesktop.name}
            fill
            priority
            sizes="58vw"
            className="object-cover object-left-bottom"
          />
          <div aria-hidden className={heroImageBlendOverlayClass} />
        </div>

        <div className={pageShell.homepageHero}>
          <div
            className={cn(
              pageShell.homepageHeroCopy,
              "pb-10 pt-10 xl:pb-12 xl:pt-12",
            )}
          >
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
