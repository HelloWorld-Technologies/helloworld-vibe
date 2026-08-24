import { cn } from "@/src/lib/cn";
import { getTextGradientClassName } from "@/src/tokens/gradients";

export type HomepageGradientId = "vibe" | "home" | "belonging" | "different";

const highlightFontClass: Record<HomepageGradientId, string> = {
  vibe: "font-satoshi font-bold italic",
  home: "font-satoshi font-bold italic",
  belonging: "font-satoshi font-bold italic",
  different: "font-satoshi font-bold italic",
};

export function HomepageSectionHeading({
  prefix,
  highlight,
  suffix = "",
  gradient = "home",
  className,
  size = "default",
  as: Tag = "h2",
}: {
  prefix: string;
  highlight: string;
  suffix?: string;
  gradient?: HomepageGradientId;
  className?: string;
  size?: "default" | "properties";
  as?: "h1" | "h2" | "h3";
}) {
  const gradientClass = getTextGradientClassName(gradient);
  const isProperties = size === "properties";

  return (
    <Tag
      className={cn(
        isProperties
          ? "text-[1.875rem] font-medium leading-[2.375rem] text-gray-900"
          : "text-display-xs font-medium tracking-tight text-gray-900 sm:text-display-sm md:text-display-md",
        className,
      )}
    >
      {prefix}{" "}
      <span
        className={cn(
          highlightFontClass[gradient],
          gradientClass,
          isProperties && "text-[2.25rem] leading-[2.375rem]",
        )}
      >
        {highlight}
      </span>
      {suffix}
    </Tag>
  );
}
