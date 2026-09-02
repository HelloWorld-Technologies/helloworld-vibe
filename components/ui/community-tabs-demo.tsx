"use client";

import { useId, useState } from "react";
import { AdaptiveImage } from "@/components/media/adaptive-image";
import {
  UnderlineTabPanel,
  UnderlineTabs,
} from "@/components/ui/underline-tabs";
import { cn } from "@/src/lib/cn";
import {
  communityIntroCopy,
  communityTabPanels,
  communityTabs,
  type CommunityTabId,
} from "@/src/tokens/community-tabs";

export function CommunityTabsDemo() {
  const baseId = useId();
  const [value, setValue] = useState<CommunityTabId>("social-mixers");
  const panel = communityTabPanels[value];

  return (
    <div className="max-w-4xl space-y-6">
      <p className="text-base text-gray-900 sm:text-lg">{communityIntroCopy}</p>

      <UnderlineTabs
        baseId={baseId}
        items={communityTabs}
        value={value}
        onChange={setValue}
        aria-label="Community categories"
      />

      <UnderlineTabPanel
        id={`${baseId}-${value}-panel`}
        labelledBy={`${baseId}-${value}`}
        active
        key={value}
        className="pt-6"
      >
        <p className="text-sm text-gray-600 sm:text-base">{panel.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {panel.images.map((image, index) => (
            <div
              key={image.src}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl bg-gray-100",
                "animate-tab-panel-in motion-reduce:animate-none",
              )}
              style={{ animationDelay: `${80 + index * 60}ms` }}
            >
              <AdaptiveImage
                src={image.src}
                webpSrc={image.webpSrc}
                alt=""
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 50vw, 200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </UnderlineTabPanel>
    </div>
  );
}
