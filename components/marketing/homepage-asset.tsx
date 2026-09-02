import Image from "next/image";
import type { Asset } from "@/src/tokens/assets";
import { cn } from "@/src/lib/cn";

export function HomepageAsset({
  asset,
  className,
  width,
  height,
  priority = false,
}: {
  asset: Asset;
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  if (asset.type === "svg") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset.file}
        alt={asset.name}
        width={width}
        height={height}
        className={cn("max-w-full object-contain", className)}
      />
    );
  }

  return (
    <Image
      src={asset.file}
      alt={asset.name}
      width={width}
      height={height}
      priority={priority}
      className={cn("max-w-full object-contain", className)}
    />
  );
}
