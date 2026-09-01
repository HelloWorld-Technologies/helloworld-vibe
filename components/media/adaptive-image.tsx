import { cn } from "@/src/lib/cn";
import { Fragment, type ComponentPropsWithoutRef } from "react";

export type AdaptiveImageMediaSource = {
  media: string;
  src: string;
  webpSrc?: string;
};

export type AdaptiveImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "srcSet"
> & {
  src: string;
  webpSrc?: string;
  /** Larger-breakpoint sources; list most specific media queries first. */
  mediaSources?: readonly AdaptiveImageMediaSource[];
  fill?: boolean;
};

export function AdaptiveImage({
  src,
  webpSrc,
  mediaSources,
  fill,
  className,
  alt,
  ...props
}: AdaptiveImageProps) {
  return (
    <picture
      className={cn(fill && "absolute inset-0 block h-full w-full")}
    >
      {mediaSources?.map(({ media, src: mediaSrc, webpSrc: mediaWebpSrc }) => (
        <Fragment key={media}>
          {mediaWebpSrc ? (
            <source
              media={media}
              srcSet={mediaWebpSrc}
              type="image/webp"
            />
          ) : null}
          <source media={media} srcSet={mediaSrc} />
        </Fragment>
      ))}
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
