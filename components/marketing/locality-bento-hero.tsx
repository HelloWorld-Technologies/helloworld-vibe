"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdaptiveImage } from "@/components/media/adaptive-image";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/navigation/breadcrumbs";
import {
  localityBentoDesktopLayout,
  type LocalityBentoTile,
} from "@/src/tokens/locality";
import { cn } from "@/src/lib/cn";

function BentoRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="relative z-10 p-4">
      <p className="font-medium text-[1.875rem] leading-[2.375rem] text-gray-900">
        {rating}
        <span className="text-yelloworld-800">★</span>
      </p>
      <p className="font-medium text-2xl leading-8 text-gray-900">{label}</p>
    </div>
  );
}

function BentoTile({
  tile,
  className,
}: {
  tile: LocalityBentoTile;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-0 overflow-hidden rounded-2xl shadow-sm",
        tile.gradientClassName,
        className,
      )}
    >
      <BentoRating rating={tile.rating} label={tile.label} />
      <div
        className={cn(
          "pointer-events-none absolute ",
          tile.illustrationClassName,
        )}
      >
        <Image
          src={tile.imageSrc}
          alt=""
          fill
          className="object-contain object-bottom "
          sizes="200px"
        />
      </div>
    </div>
  );
}

function bentoLayout(tiles: readonly LocalityBentoTile[]) {
  const byId = new Map(tiles.map((tile) => [tile.id, tile]));
  return {
    transit: byId.get("transit") ?? localityBentoDesktopLayout.transit,
    nightLife: byId.get("night-life") ?? localityBentoDesktopLayout.nightLife,
    dining: byId.get("dining") ?? localityBentoDesktopLayout.dining,
    health: byId.get("health") ?? localityBentoDesktopLayout.health,
  };
}

function BentoDesktopGrid({ tiles }: { tiles: readonly LocalityBentoTile[] }) {
  const { transit, nightLife, dining, health } = bentoLayout(tiles);

  return (
    <div className="flex min-h-0 flex-1 gap-3.5">
      <div className="flex min-h-0 flex-1 flex-col gap-3.5">
        <BentoTile tile={transit} className="h-[54.27%] shrink-0" />
        <BentoTile tile={nightLife} className="min-h-0 flex-1" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3.5">
        <BentoTile tile={dining} className="h-[42.21%] shrink-0" />
        <BentoTile tile={health} className="min-h-0 flex-1" />
      </div>
    </div>
  );
}

function BentoMobileRatings({ tiles }: { tiles: readonly LocalityBentoTile[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-locality-ratings">
      <div className="grid grid-cols-4 gap-2 px-3 py-4">
        {tiles.map((tile) => (
          <div key={tile.id} className="min-w-0 text-center">
            <p className="text-base font-bold text-gray-900 sm:text-lg">
              {tile.rating}{" "}
              <span className="text-yelloworld-800">★</span>
            </p>
            <p className="mt-1 text-[11px] text-gray-700 sm:text-xs">
              <span aria-hidden>{tile.emoji} </span>
              {tile.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroImage({
  src,
  webpSrc,
  alt,
  className,
  sizes,
  priority = true,
  onError,
}: {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  onError?: () => void;
}) {
  if (webpSrc) {
    return (
      <AdaptiveImage
        src={src}
        webpSrc={webpSrc}
        alt={alt}
        fill
        fetchPriority={priority ? "high" : undefined}
        onError={onError}
        className={cn("object-cover", className)}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      onError={onError}
      className={cn("object-cover", className)}
      sizes={sizes}
    />
  );
}

export type LocalityBentoHeroProps = {
  title: string;
  subtitle: string;
  heroImageSrc?: string;
  heroImageWebpSrc?: string;
  heroImageAlt: string;
  breadcrumbItems?: readonly BreadcrumbItem[];
  bentoTiles?: readonly LocalityBentoTile[];
};

export function LocalityBentoHero({
  title,
  subtitle,
  heroImageSrc,
  heroImageWebpSrc,
  heroImageAlt,
  breadcrumbItems,
  bentoTiles,
}: LocalityBentoHeroProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showRatings = Boolean(bentoTiles && bentoTiles.length > 0);
  const showHeroImage = Boolean(heroImageSrc?.trim()) && !imageFailed;
  const showDesktopMedia = showHeroImage || showRatings;

  useEffect(() => {
    setImageFailed(false);
  }, [heroImageSrc]);

  return (
    <section
      aria-label="Search results overview"
      data-has-media={showDesktopMedia ? "true" : "false"}
    >
      <div className="hidden space-y-2 lg:block">
        <h1 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl md:leading-8">
          {title}
        </h1>
        <p className="text-base font-medium text-gray-900">{subtitle}</p>
      </div>

      {showDesktopMedia ? (
        <div
          className={cn(
            "mt-6 hidden items-stretch gap-6 lg:flex",
            showHeroImage && showRatings && "lg:h-[24.875rem]",
            showHeroImage && !showRatings && "lg:aspect-[21/9] lg:max-h-[22rem]",
            !showHeroImage && showRatings && "lg:h-[22rem]",
          )}
        >
          {showHeroImage ? (
            <div
              className={cn(
                "relative min-h-0 overflow-hidden rounded-2xl bg-gray-200",
                showRatings ? "flex-[2.06]" : "flex-1",
              )}
            >
              <HeroImage
                src={heroImageSrc!}
                webpSrc={heroImageWebpSrc}
                alt={heroImageAlt}
                sizes="(max-width: 1280px) 65vw, 846px"
                onError={() => setImageFailed(true)}
              />
            </div>
          ) : null}
          {showRatings && bentoTiles ? (
            <BentoDesktopGrid tiles={bentoTiles} />
          ) : null}
        </div>
      ) : null}

      <div className="-mx-4 sm:-mx-6 lg:hidden">
        {showHeroImage ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
            <HeroImage
              src={heroImageSrc!}
              webpSrc={heroImageWebpSrc}
              alt={heroImageAlt}
              sizes="100vw"
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : null}

        <div
          className={cn(
            "relative z-10 bg-white px-4 pb-1 sm:px-6",
            showHeroImage ? "-mt-10 rounded-t-[2.5rem] pt-8" : "pt-2",
          )}
        >
          {breadcrumbItems && breadcrumbItems.length > 0 ? (
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />
          ) : null}
          <h1 className="text-lg font-medium tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-xs font-medium leading-4 text-gray-900">{subtitle}</p>
          {showRatings && bentoTiles ? (
            <BentoMobileRatings tiles={bentoTiles} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
