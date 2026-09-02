import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type AdaptiveVideoProps = Omit<
  ComponentPropsWithoutRef<"video">,
  "children"
> & {
  mp4Src: string;
  webmSrc?: string;
};

export const AdaptiveVideo = forwardRef<HTMLVideoElement, AdaptiveVideoProps>(
  function AdaptiveVideo({ mp4Src, webmSrc, ...props }, ref) {
    return (
      <video ref={ref} {...props}>
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>
    );
  },
);
