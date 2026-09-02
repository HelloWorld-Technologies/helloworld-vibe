import { cn } from "@/src/lib/cn";

/** Mobile: Satoshi Bold 20px / 30px. Desktop: restores prior section title scale. */
export const hdpSectionHeadingClassName =
  "font-satoshi text-xl font-bold leading-[1.875rem] tracking-normal text-gray-900 md:text-3xl md:font-medium md:leading-9";

/** Vibe Match desktop scale (original: text-lg → md:text-xl). */
export const hdpSectionHeadingCompactClassName =
  "font-satoshi text-xl font-bold leading-[1.875rem] tracking-normal text-gray-900 md:text-xl md:font-medium md:leading-7";

export function HdpSectionHeading({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2 id={id} className={cn(hdpSectionHeadingClassName, className)}>
      {children}
    </h2>
  );
}
