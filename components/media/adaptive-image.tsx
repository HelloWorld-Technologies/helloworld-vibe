import { cn } from "@/src/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

export type AdaptiveImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "srcSet"
> & {
  src: string;
  webpSrc?: string;
  fill?: boolean;
};

export function AdaptiveImage({
  src,
  webpSrc,
  fill,
  className,
  alt,
  ...props
}: AdaptiveImageProps) {
  return (
    <picture
      className={cn(fill && "absolute inset-0 block h-full w-full")}
    >
      {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
      <img
        src={src}
        alt={alt}
        className={cn(fill && "h-full w-full", className)}
        {...props}
      />
    </picture>
  );
}
