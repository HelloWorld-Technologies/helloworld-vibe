import { AdaptiveImage } from "@/components/media/adaptive-image";
import { CommunityWeekendsHeading } from "@/components/marketing/community-headings";
import {
  communityHeroFrame,
  communityHeroPolaroids,
} from "@/src/tokens/community";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function PolaroidCard({
  label,
  src,
  webpSrc,
  rotation,
  left,
  top,
  width,
  zIndex,
}: {
  label: string;
  src: string;
  webpSrc: string;
  rotation: number;
  left: number;
  top: number;
  width: number;
  zIndex: number;
}) {
  const widthPercent = toPercent(width, communityHeroFrame.width);

  return (
    <div
      className="absolute"
      style={{
        left: toPercent(left, communityHeroFrame.width),
        top: toPercent(top, communityHeroFrame.height),
        width: widthPercent,
        zIndex,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="flex flex-col items-center bg-white px-2 py-[3px] shadow-[0_19px_20px_rgba(26,35,50,0.45)]">
        <div className="relative aspect-[244/306] w-full overflow-hidden">
          <AdaptiveImage
            src={src}
            webpSrc={webpSrc}
            alt={label}
            fill
            loading="lazy"
            decoding="async"
            sizes="275px"
            className="object-cover"
          />
        </div>
        <p className="py-1 font-caveat text-[0.8125rem] leading-5 text-[rgba(26,35,50,0.7)]">
          {label}
        </p>
      </div>
    </div>
  );
}

/** Figma Ellipse 1592 — Hello Lime/100 @ 12%, layer blur 322.26 */
function MobilePolaroidCard({
  polaroid,
}: {
  polaroid: (typeof communityHeroPolaroids)[number];
}) {
  return (
    <div
      className="w-36 shrink-0"
      style={{ transform: `rotate(${polaroid.rotation}deg)` }}
    >
      <div className="flex flex-col items-center bg-white px-1.5 py-1 shadow-[0_12px_16px_rgba(26,35,50,0.35)]">
        <div className="relative aspect-[244/306] w-full overflow-hidden">
          <AdaptiveImage
            src={polaroid.src}
            webpSrc={polaroid.webpSrc}
            alt={polaroid.label}
            fill
            loading="lazy"
            decoding="async"
            sizes="144px"
            className="object-cover"
          />
        </div>
        <p className="py-0.5 font-caveat text-xs text-[rgba(26,35,50,0.7)]">
          {polaroid.label}
        </p>
      </div>
    </div>
  );
}

function BannerGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 -translate-x-1/2",
        className,
      )}
    >
      <div
        className="aspect-square w-[min(677px,90vw)] rounded-full bg-[#D9F99E]/12"
        style={{ filter: "blur(322.26px)" }}
      />
    </div>
  );
}

export function CommunityHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <BannerGlow />

      <div className={cn(pageShell.communityHeroDesktop, "relative z-10")}>
        <div
          className="relative mx-auto w-full"
          style={{
            aspectRatio: `${communityHeroFrame.width} / ${communityHeroFrame.height}`,
          }}
        >
          <div className="absolute left-1/2 top-[4.73%] z-30 -translate-x-1/2">
            <CommunityWeekendsHeading size="desktop" />
          </div>

          {communityHeroPolaroids.map((polaroid) => (
            <PolaroidCard key={polaroid.id} {...polaroid} />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 py-8 sm:px-6 lg:hidden">
        <div className={pageShell.communityMobileHero}>
          <CommunityWeekendsHeading size="mobile" className="w-full" />
          <div className="group -mx-4 mt-10 overflow-hidden px-4 py-6 motion-reduce:overflow-x-auto motion-reduce:scrollbar-none">
            <div
              className={cn(
                "flex w-max gap-4",
                "animate-community-polaroid-marquee motion-reduce:animate-none",
                "group-hover:[animation-play-state:paused]",
              )}
            >
              {[...communityHeroPolaroids, ...communityHeroPolaroids].map(
                (polaroid, index) => (
                  <MobilePolaroidCard
                    key={`${polaroid.id}-${index}`}
                    polaroid={polaroid}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
