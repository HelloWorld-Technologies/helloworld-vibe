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
  const sizeClass =
    size === "properties"
      ? "text-center font-satoshi text-lg font-medium leading-7 text-gray-900 md:text-left md:text-[1.875rem] md:leading-[2.375rem]"
      : "text-display-sm font-medium tracking-tight text-gray-900 md:text-display-md";

  return (
    <Tag className={cn(sizeClass, className)}>
      {prefix}{" "}
      <span
        className={cn(
          highlightFontClass[gradient],
          gradientClass,
          size === "properties" &&
            "text-lg leading-7 md:text-[2.25rem] md:leading-[2.375rem]",
        )}
      >
        {highlight}
      </span>
      {suffix}
    </Tag>
  );
}
