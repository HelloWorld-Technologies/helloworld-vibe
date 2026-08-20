import Image from "next/image";
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
  image,
  rotation,
  left,
  top,
  width,
  zIndex,
}: {
  label: string;
  image: string;
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
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover"
            sizes="275px"
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
          <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 scrollbar-none">
            <div className="flex w-max gap-4">
              {communityHeroPolaroids.map((polaroid) => (
                <div
                  key={polaroid.id}
                  className="w-36 shrink-0"
                  style={{ transform: `rotate(${polaroid.rotation}deg)` }}
                >
                  <div className="flex flex-col items-center bg-white px-1.5 py-1 shadow-[0_12px_16px_rgba(26,35,50,0.35)]">
                    <div className="relative aspect-[244/306] w-full overflow-hidden">
                      <Image
                        src={polaroid.image}
                        alt={polaroid.label}
                        fill
                        className="object-cover"
                        sizes="144px"
                      />
                    </div>
                    <p className="py-0.5 font-caveat text-xs text-[rgba(26,35,50,0.7)]">
                      {polaroid.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
