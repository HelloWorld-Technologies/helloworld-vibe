"use client";

import { useId, useState } from "react";
import { AdaptiveImage } from "@/components/media/adaptive-image";
import { CommunitySectionTitle } from "@/components/marketing/community-headings";
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
import { pageShell } from "@/src/tokens/layout";

export function CommunityEvents() {
  const baseId = useId();
  const [value, setValue] = useState<CommunityTabId>("sports-outdoor");
  const panel = communityTabPanels[value];

  return (
    <section className="bg-white">
      <div className={pageShell.community}>
        <div className={pageShell.communityIntro}>
          <CommunitySectionTitle>
            What&apos;s Happening Around Here
          </CommunitySectionTitle>
          <p className="mt-4 text-base leading-6 text-gray-800">
            {communityIntroCopy}
          </p>
        </div>

        <div className="mt-6 flex justify-center sm:mt-8">
          <UnderlineTabs
            baseId={baseId}
            items={communityTabs}
            value={value}
            onChange={setValue}
            layout="inline"
            aria-label="Community categories"
            className="max-w-full"
          />
        </div>

        <UnderlineTabPanel
          id={`${baseId}-${value}-panel`}
          labelledBy={`${baseId}-${value}`}
          active
          key={value}
          className="pt-8 sm:pt-10"
        >
          <p className="sr-only">{panel.description}</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {panel.images.map((image, index) => (
              <div
                key={image.src}
                className={cn(
                  "relative aspect-[302/236] overflow-hidden rounded-xl bg-gray-100",
                  "animate-tab-panel-in motion-reduce:animate-none",
                )}
                style={{ animationDelay: `${60 + index * 40}ms` }}
              >
                <AdaptiveImage
                  src={image.src}
                  webpSrc={image.webpSrc}
                  alt=""
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 302px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </UnderlineTabPanel>
      </div>
    </section>
  );
}
