import Image from "next/image";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/navigation/breadcrumbs";
import {
  localityBentoDesktopLayout,
  localityBentoTiles,
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

function BentoDesktopGrid() {
  const { transit, nightLife, dining, health } = localityBentoDesktopLayout;

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

function BentoMobileRatings() {
  return (
    <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-locality-ratings">
      <div className="grid grid-cols-4 gap-2 px-3 py-4">
        {localityBentoTiles.map((tile) => (
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
  alt,
  className,
  sizes,
  priority = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      sizes={sizes}
    />
  );
}

export type LocalityBentoHeroProps = {
  title: string;
  subtitle: string;
  heroImageSrc: string;
  heroImageAlt: string;
  breadcrumbItems?: readonly BreadcrumbItem[];
};

export function LocalityBentoHero({
  title,
  subtitle,
  heroImageSrc,
  heroImageAlt,
  breadcrumbItems,
}: LocalityBentoHeroProps) {
  return (
    <section aria-label="Search results overview">
      <div className="hidden space-y-2 lg:block">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
          {title}
        </h1>
        <p className="text-base font-medium text-gray-600">{subtitle}</p>
      </div>

      <div className="mt-6 hidden items-stretch gap-6 lg:flex lg:h-[24.875rem]">
        <div className="relative min-h-0 flex-[2.06] overflow-hidden rounded-2xl bg-gray-200">
          <HeroImage
            src={heroImageSrc}
            alt={heroImageAlt}
            sizes="(max-width: 1280px) 65vw, 846px"
            className="object-cover"
          />
        </div>
        <BentoDesktopGrid />
      </div>

      <div className="-mx-4 sm:-mx-6 lg:hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
          <HeroImage
            src={heroImageSrc}
            alt={heroImageAlt}
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-white px-4 pt-8 pb-1 sm:px-6">
          {breadcrumbItems && breadcrumbItems.length > 0 ? (
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />
          ) : null}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-base font-medium text-gray-600">{subtitle}</p>
          <BentoMobileRatings />
        </div>
      </div>
    </section>
  );
}
