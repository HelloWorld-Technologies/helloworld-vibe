import type { ReactNode } from "react";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { cn } from "@/src/lib/cn";

const communityAccentClassName =
  "font-playfair font-semibold italic text-gradient-community-accent";

export function CommunityWeekendsHeading({
  className,
  size = "desktop",
}: {
  className?: string;
  size?: "desktop" | "mobile";
}) {
  const isDesktop = size === "desktop";

  return (
    <div className={cn("relative inline-block text-center", className)}>
      <h1
        className={cn(
          "font-playfair font-semibold tracking-[-0.047em] text-gray-800",
          isDesktop
            ? "text-[2.75rem] leading-[0.97] sm:text-[4rem] lg:text-[5.25rem]"
            : "text-[40px] leading-[1.15]",
        )}
      >
        <span className="block">Weekends hit</span>
        <span className={cn("block", isDesktop && "mt-0")}>
          <span
            className={cn(
              communityAccentClassName,
              isDesktop && "text-[5.25rem] leading-[0.97]",
            )}
          >
            Different
          </span>{" "}
          <span className="relative inline-block">
            here
            {!isDesktop ? (
              <span className="pointer-events-none absolute -bottom-5 right-0 rotate-[-5.2deg] whitespace-nowrap">
                <span className="font-caveat text-base text-[#3d4a3e]">
                  srsly though
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-0.5 w-12 bg-[#b8ff57]"
                />
              </span>
            ) : null}
          </span>
        </span>
      </h1>
      {isDesktop ? (
        <div className="pointer-events-none absolute -bottom-5 right-4 translate-x-[30%] rotate-[-5.2deg] whitespace-nowrap">
          <p className="font-caveat text-[2rem] leading-none text-[#3d4a3e]">
            srsly though
          </p>
          <span
            aria-hidden
            className="absolute -bottom-1 left-1/2 h-0.5 w-20 -translate-x-1/2 -rotate-6 bg-[#b8ff57]"
          />
        </div>
      ) : null}
    </div>
  );
}

export function CommunityBoringWeekendsHeading({
  className,
  size = "desktop",
}: {
  className?: string;
  size?: "desktop" | "mobile";
}) {
  const isDesktop = size === "desktop";

  return (
    <h2
      className={cn(
        "font-playfair font-semibold tracking-[-0.047em] text-gray-800",
        isDesktop
          ? "text-[40px] leading-[1.15] sm:text-[4rem] sm:leading-[0.97] lg:text-[4rem] lg:leading-[0.97]"
          : "text-[40px] leading-[1.15]",
        className,
      )}
    >
      <span className="block">No More</span>
      <span className="block whitespace-nowrap">
        <span className={communityAccentClassName}>Boring </span>
        Weekends.
      </span>
    </h2>
  );
}

export function CommunityFeedHeading({ className }: { className?: string }) {
  return (
    <HomepageSectionHeading
      prefix="Straight from the"
      highlight="Feed!"
      gradient="home"
      className={className}
    />
  );
}

export function CommunitySectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-center text-[1.875rem] font-medium leading-[2.375rem] tracking-tight text-gray-900",
        className,
      )}
    >
      {children}
    </h2>
  );
}
